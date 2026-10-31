import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { ReadingCanvas } from './components/ReadingCanvas';
import { AudioPlayer } from './components/AudioPlayer';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { REFLECTION_CHAPTERS, ReflectionChapter } from './data/reflections';
import { TTSEngine, VoiceName } from './utils/ttsEngine';
import { ambientSound } from './utils/ambientSound';
import { Play, Sparkles, Compass, BookOpen, Users, Globe2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(160);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [voice, setVoice] = useState<VoiceName>('Kore');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [ambientVolume, setAmbientVolume] = useState<number>(0.35);
  const [currentEngine, setCurrentEngine] = useState<'gemini' | 'browser'>('gemini');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [continuousPlay, setContinuousPlay] = useState<boolean>(true);

  const ttsEngineRef = useRef<TTSEngine | null>(null);

  // Initialize theme from system or preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Initialize TTS Engine
  useEffect(() => {
    const engine = new TTSEngine({
      onPlayStateChange: (playing) => setIsPlaying(playing),
      onParagraphChange: (paraIndex) => setActiveParagraphIndex(paraIndex),
      onProgress: (cur, dur) => {
        setCurrentTime(cur);
        setDuration(dur);
      },
      onChapterComplete: () => {
        if (continuousPlay && activeChapterIndex < REFLECTION_CHAPTERS.length - 1) {
          const nextIdx = activeChapterIndex + 1;
          setActiveChapterIndex(nextIdx);
          engine.setChapter(REFLECTION_CHAPTERS[nextIdx], true);
        } else {
          setIsPlaying(false);
        }
      },
      onError: (msg) => {
        console.warn('TTS Notification:', msg);
      },
      onEngineChange: (eng) => setCurrentEngine(eng),
    });

    ttsEngineRef.current = engine;
    engine.setVoice(voice);
    engine.setPlaybackRate(playbackRate);
    engine.setChapter(REFLECTION_CHAPTERS[0], false);

    return () => {
      engine.stop();
      ambientSound.stop();
    };
  }, []);

  const currentChapter = REFLECTION_CHAPTERS[activeChapterIndex];

  const handleSelectChapter = (id: string, autoPlay: boolean = false) => {
    const idx = REFLECTION_CHAPTERS.findIndex(c => c.id === id);
    if (idx !== -1) {
      setActiveChapterIndex(idx);
      setActiveParagraphIndex(0);
      setCurrentTime(0);
      setDuration(REFLECTION_CHAPTERS[idx].durationSecondsEstimate);
      ttsEngineRef.current?.setChapter(REFLECTION_CHAPTERS[idx], autoPlay);
    }
  };

  const handleTogglePlay = () => {
    ttsEngineRef.current?.togglePlay();
  };

  const handleParagraphClick = (idx: number) => {
    ttsEngineRef.current?.jumpToParagraph(idx);
  };

  const handleSkipRelative = (seconds: number) => {
    ttsEngineRef.current?.skipRelative(seconds);
  };

  const handleChangePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    ttsEngineRef.current?.setPlaybackRate(rate);
  };

  const handleSelectVoice = (newVoice: VoiceName) => {
    setVoice(newVoice);
    ttsEngineRef.current?.setVoice(newVoice);
  };

  const handleToggleAmbient = () => {
    const running = ambientSound.toggle();
    setIsAmbientPlaying(running);
  };

  const handleChangeAmbientVolume = (vol: number) => {
    setAmbientVolume(vol);
    ambientSound.setVolume(vol);
  };

  const handleNextChapter = () => {
    if (activeChapterIndex < REFLECTION_CHAPTERS.length - 1) {
      handleSelectChapter(REFLECTION_CHAPTERS[activeChapterIndex + 1].id, isPlaying);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121110] text-stone-900 dark:text-stone-100 transition-colors flex flex-col selection:bg-[#9A3412]/20 dark:selection:bg-amber-500/30">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        activeChapterId={currentChapter.id}
        onSelectChapter={(id) => handleSelectChapter(id, isPlaying)}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        isDark={isDark}
        onToggleDark={toggleTheme}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-32">
        
        {/* Curatorial Hero Preamble */}
        <section id="inicio" className="max-w-4xl mx-auto px-6 pt-12 pb-8 border-b border-stone-200/70 dark:border-stone-800/70">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-sans font-medium text-[#9A3412] dark:text-amber-500 block mb-3">
              Lectura Filosófica Narrada
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-stone-950 dark:text-stone-50 leading-[1.15] text-balance mb-4">
              Reflexiones breves sobre integración, pensamiento crítico, colaboración y sociedad
            </h2>
            <p className="text-stone-600 dark:text-stone-400 font-sans text-base sm:text-lg max-w-2xl font-light leading-relaxed mb-6">
              Cuatro ensayos breves para pausar el vértigo contemporáneo, interrogar nuestras convicciones y celebrar la trama de lo colectivo.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (!isPlaying) {
                    ttsEngineRef.current?.jumpToParagraph(0);
                  } else {
                    ttsEngineRef.current?.pause();
                  }
                }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#9A3412] hover:bg-[#832c10] dark:bg-amber-600 dark:hover:bg-amber-700 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isPlaying ? 'Pausar Narración' : 'Iniciar Lectura Completa'}</span>
              </button>

              <button
                onClick={handleToggleAmbient}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 whitespace-nowrap ${
                  isAmbientPlaying
                    ? 'border-[#9A3412] text-[#9A3412] bg-[#9A3412]/5 dark:text-amber-400 dark:border-amber-500 dark:bg-amber-950/20'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                }`}
              >
                <span>{isAmbientPlaying ? 'Música Ambiental Activa' : 'Añadir Fondo Sonoro'}</span>
              </button>
            </div>
          </div>

          {/* Chapter Quick Selector Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {REFLECTION_CHAPTERS.map((chap, idx) => {
              const isCurrent = idx === activeChapterIndex;
              return (
                <button
                  key={chap.id}
                  onClick={() => handleSelectChapter(chap.id, false)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-[#9A3412] bg-white dark:bg-stone-900 shadow-sm'
                      : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <span className="block text-xs font-mono font-medium text-stone-400 mb-1">
                    {chap.number}
                  </span>
                  <span className="block text-sm font-serif-reading font-medium text-stone-900 dark:text-stone-100 line-clamp-1">
                    {chap.id === 'integracion' && 'Integración'}
                    {chap.id === 'pensamiento-critico' && 'Pensamiento Crítico'}
                    {chap.id === 'colaboracion' && 'Colaboración'}
                    {chap.id === 'sociedad' && 'Sociedad'}
                  </span>
                  <span className="block text-xs font-sans text-stone-500 dark:text-stone-400 mt-1">
                    {chap.readingTime}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Editorial Reading Canvas */}
        <ReadingCanvas
          chapter={currentChapter}
          activeParagraphIndex={activeParagraphIndex}
          isPlaying={isPlaying}
          onParagraphClick={handleParagraphClick}
          onNextChapter={handleNextChapter}
          hasNextChapter={activeChapterIndex < REFLECTION_CHAPTERS.length - 1}
          fontSize={fontSize}
        />
      </main>

      {/* Sticky Bottom Audio Player */}
      <AudioPlayer
        currentChapter={currentChapter}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSkipRelative={handleSkipRelative}
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        onChangePlaybackRate={handleChangePlaybackRate}
        voice={voice}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        ambientVolume={ambientVolume}
        onChangeAmbientVolume={handleChangeAmbientVolume}
        currentEngine={currentEngine}
      />

      {/* Voice & Reading Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentVoice={voice}
        onSelectVoice={handleSelectVoice}
        ambientVolume={ambientVolume}
        onChangeAmbientVolume={handleChangeAmbientVolume}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        currentEngine={currentEngine}
      />
    </div>
  );
}
