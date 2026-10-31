/**
 * Generative Ambient Soundscape Engine (Web Audio API)
 * Creates a soothing, organic, warm analog drone/pad
 * for contemplative reading and listening.
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private lfo: OscillatorNode | null = null;
  private isRunning: boolean = false;
  private currentVolume: number = 0.35;

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(380, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

      // Low frequency oscillator for organic breathing movement
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.06, this.ctx.currentTime); // ~16s cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(60, this.ctx.currentTime);
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filter.frequency);
      this.lfo.start();

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain || !this.filter || this.isRunning) return;

    // Harmonic chord: D2, A2, D3, F#3, A3 (Warm, contemplative, spacious)
    const baseFrequencies = [73.42, 110.0, 146.83, 185.0, 220.0];

    this.oscillators = baseFrequencies.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      // Subtle organic detuning
      const detune = (idx - 2) * 3.5;
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      osc.detune.setValueAtTime(detune, this.ctx!.currentTime);

      const amp = 0.22 / (idx + 1);
      oscGain.gain.setValueAtTime(amp, this.ctx!.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      osc.start();
      return osc;
    });

    // Smooth fade in
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(
      Math.max(0.01, this.currentVolume * 0.3),
      this.ctx.currentTime + 3.0
    );

    this.isRunning = true;
  }

  public stop() {
    if (!this.ctx || !this.masterGain || !this.isRunning) return;

    // Smooth fade out
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(
      Math.max(0.001, this.masterGain.gain.value),
      this.ctx.currentTime
    );
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);

    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      this.oscillators = [];
      this.isRunning = false;
    }, 1600);
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.min(1, Math.max(0, vol));
    if (this.ctx && this.masterGain && this.isRunning) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        this.currentVolume * 0.3,
        this.ctx.currentTime + 0.3
      );
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }
}

export const ambientSound = new AmbientSoundEngine();
