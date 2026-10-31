import { ReflectionChapter } from '../data/reflections';

export type VoiceName = 'Kore' | 'Fenrir' | 'Puck' | 'Charon' | 'Zephyr';

export interface TTSEngineCallbacks {
  onPlayStateChange: (isPlaying: boolean) => void;
  onParagraphChange: (paragraphIndex: number) => void;
  onProgress: (currentTime: number, duration: number) => void;
  onChapterComplete: () => void;
  onError: (message: string) => void;
  onEngineChange?: (engine: 'gemini' | 'browser') => void;
}

export class TTSEngine {
  private currentChapter: ReflectionChapter | null = null;
  private currentParagraphIndex: number = 0;
  private isPlaying: boolean = false;
  private playbackRate: number = 1.0;
  private volume: number = 1.0;
  private voice: VoiceName = 'Kore';
  private callbacks: TTSEngineCallbacks;

  // Active audio element for Gemini WAV playback
  private audioElement: HTMLAudioElement | null = null;
  // Browser SpeechSynthesis fallback
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentEngine: 'gemini' | 'browser' = 'gemini';

  // In-memory cache for synthesized audio URLs: chapterId_paragraphId_voice -> audioUrl
  private audioCache = new Map<string, string>();
  private progressInterval: number | null = null;

  constructor(callbacks: TTSEngineCallbacks) {
    this.callbacks = callbacks;
  }

  public setChapter(chapter: ReflectionChapter, autoPlay: boolean = false) {
    this.stop();
    this.currentChapter = chapter;
    this.currentParagraphIndex = 0;
    this.callbacks.onParagraphChange(0);
    this.callbacks.onProgress(0, chapter.durationSecondsEstimate);

    if (autoPlay) {
      this.playParagraph(0);
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public setVoice(voice: VoiceName) {
    this.voice = voice;
  }

  public getVoice(): VoiceName {
    return this.voice;
  }

  public getPlaybackRate(): number {
    return this.playbackRate;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentParagraph(): number {
    return this.currentParagraphIndex;
  }

  public getCurrentEngine(): 'gemini' | 'browser' {
    return this.currentEngine;
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public pause() {
    this.isPlaying = false;
    this.callbacks.onPlayStateChange(false);
    this.stopProgressTicker();

    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (!this.currentChapter) return;

    if (this.audioElement && this.audioElement.paused && this.audioElement.src) {
      this.audioElement.play().then(() => {
        this.isPlaying = true;
        this.callbacks.onPlayStateChange(true);
        this.startProgressTicker();
      }).catch(() => {
        this.playParagraph(this.currentParagraphIndex);
      });
      return;
    }

    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.isPlaying = true;
      this.callbacks.onPlayStateChange(true);
      this.startProgressTicker();
      return;
    }

    this.playParagraph(this.currentParagraphIndex);
  }

  public jumpToParagraph(index: number) {
    if (!this.currentChapter) return;
    if (index < 0 || index >= this.currentChapter.paragraphs.length) return;
    this.playParagraph(index);
  }

  public skipRelative(seconds: number) {
    if (this.audioElement && this.isPlaying) {
      this.audioElement.currentTime = Math.max(0, this.audioElement.currentTime + seconds);
    } else {
      // Shift paragraph
      if (seconds > 0) {
        const next = Math.min(
          (this.currentChapter?.paragraphs.length || 1) - 1,
          this.currentParagraphIndex + 1
        );
        this.playParagraph(next);
      } else {
        const prev = Math.max(0, this.currentParagraphIndex - 1);
        this.playParagraph(prev);
      }
    }
  }

  public stop() {
    this.isPlaying = false;
    this.callbacks.onPlayStateChange(false);
    this.stopProgressTicker();

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  private startProgressTicker() {
    this.stopProgressTicker();
    this.progressInterval = window.setInterval(() => {
      if (!this.currentChapter) return;
      const totalParas = this.currentChapter.paragraphs.length;
      let paraProgress = 0;

      if (this.audioElement && this.audioElement.duration) {
        paraProgress = this.audioElement.currentTime / this.audioElement.duration;
      }

      const overallProgress = (this.currentParagraphIndex + Math.min(0.99, paraProgress)) / totalParas;
      const simulatedTime = overallProgress * this.currentChapter.durationSecondsEstimate;
      this.callbacks.onProgress(simulatedTime, this.currentChapter.durationSecondsEstimate);
    }, 200);
  }

  private stopProgressTicker() {
    if (this.progressInterval !== null) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private async playParagraph(index: number) {
    if (!this.currentChapter) return;
    const paragraphs = this.currentChapter.paragraphs;
    if (index >= paragraphs.length) {
      this.isPlaying = false;
      this.callbacks.onPlayStateChange(false);
      this.stopProgressTicker();
      this.callbacks.onChapterComplete();
      return;
    }

    this.currentParagraphIndex = index;
    this.callbacks.onParagraphChange(index);
    this.isPlaying = true;
    this.callbacks.onPlayStateChange(true);

    const paragraph = paragraphs[index];
    const cacheKey = `${this.currentChapter.id}_${index}_${this.voice}`;

    // Try Gemini TTS first
    try {
      let audioUrl = this.audioCache.get(cacheKey);

      if (!audioUrl) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: paragraph.text,
            voice: this.voice,
            style: 'Voz reflexiva, reposada, tono ensayístico'
          })
        });

        if (!res.ok) {
          throw new Error(`TTS server responded with ${res.status}`);
        }

        const data = await res.json();
        if (data.audioUrl && typeof data.audioUrl === 'string') {
          audioUrl = data.audioUrl;
          this.audioCache.set(cacheKey, data.audioUrl);
        } else {
          throw new Error('No audio URL returned');
        }
      }

      if (!audioUrl) {
        throw new Error('No valid audio URL available');
      }

      this.currentEngine = 'gemini';
      if (this.callbacks.onEngineChange) this.callbacks.onEngineChange('gemini');
      this.playWavAudio(audioUrl, index);

      // Prefetch next paragraph in the background for gapless continuity
      if (index + 1 < paragraphs.length) {
        const nextKey = `${this.currentChapter.id}_${index + 1}_${this.voice}`;
        if (!this.audioCache.has(nextKey)) {
          fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: paragraphs[index + 1].text,
              voice: this.voice
            })
          })
            .then(r => r.json())
            .then(d => {
              if (d.audioUrl) this.audioCache.set(nextKey, d.audioUrl);
            })
            .catch(() => {});
        }
      }

    } catch (err: any) {
      console.warn('Falling back to browser speech synthesis:', err?.message || err);
      this.currentEngine = 'browser';
      if (this.callbacks.onEngineChange) this.callbacks.onEngineChange('browser');
      this.playWithSpeechSynthesis(paragraph.text, index);
    }
  }

  private playWavAudio(audioUrl: string, index: number) {
    if (this.audioElement) {
      this.audioElement.pause();
    }

    const audio = new Audio(audioUrl);
    audio.playbackRate = this.playbackRate;
    audio.volume = this.volume;
    this.audioElement = audio;

    audio.onended = () => {
      if (this.isPlaying && this.currentParagraphIndex === index) {
        this.playParagraph(index + 1);
      }
    };

    audio.onerror = () => {
      console.warn('Audio playback error, falling back to speech synthesis');
      this.currentEngine = 'browser';
      if (this.callbacks.onEngineChange) this.callbacks.onEngineChange('browser');
      if (this.currentChapter) {
        this.playWithSpeechSynthesis(this.currentChapter.paragraphs[index].text, index);
      }
    };

    audio.play().then(() => {
      this.startProgressTicker();
    }).catch(e => {
      console.warn('Audio play failed:', e);
      if (this.currentChapter) {
        this.playWithSpeechSynthesis(this.currentChapter.paragraphs[index].text, index);
      }
    });
  }

  private playWithSpeechSynthesis(text: string, index: number) {
    if (!('speechSynthesis' in window)) {
      this.callbacks.onError('La síntesis de voz no está soportada en este navegador.');
      this.isPlaying = false;
      this.callbacks.onPlayStateChange(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = this.playbackRate * 0.95; // Slightly calmer tempo for essays
    utterance.volume = this.volume;

    // Pick Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith('es')) || null;
    if (esVoice) {
      utterance.voice = esVoice;
    }

    utterance.onend = () => {
      if (this.isPlaying && this.currentParagraphIndex === index) {
        this.playParagraph(index + 1);
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        console.warn('Speech synthesis error:', e);
      }
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    this.startProgressTicker();
  }
}
