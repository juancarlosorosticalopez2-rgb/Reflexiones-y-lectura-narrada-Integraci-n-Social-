import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { ReflectionChapter } from '../data/reflections';
import { VoiceName } from '../utils/ttsEngine';

interface AudioPlayerProps {
  currentChapter: ReflectionChapter;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSkipRelative: (seconds: number) => void;
  currentTime: number;
  duration: number;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  voice: VoiceName;
  onOpenVoiceModal: () => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  ambientVolume: number;
  onChangeAmbientVolume: (vol: number) => void;
  currentEngine: 'gemini' | 'browser';
}

const formatTime = (secs: number): string => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentChapter,
  isPlaying,
  onTogglePlay,
  onSkipRelative,
  currentTime,
  duration,
  playbackRate,
  onChangePlaybackRate,
  voice,
  onOpenVoiceModal,
  isAmbientPlaying,
  onToggleAmbient,
  ambientVolume,
  onChangeAmbientVolume,
  currentEngine,
}) => {
  const [showAmbientControls, setShowAmbientControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 dark:bg-[#151413]/95 backdrop-blur-md border-t border-stone-200/90 dark:border-stone-800/90 shadow-lg transition-colors">
      {/* Progress Bar Top Edge Scrubber */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 relative cursor-pointer overflow-hidden group">
        <div
          className="h-full bg-[#9A3412] dark:bg-amber-600 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left Zone: Chapter Information & Live Waveform Indicator */}
        <div className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs">
          <div className="hidden sm:flex items-end gap-0.5 h-6 w-6 shrink-0 text-[#9A3412] dark:text-amber-500 py-1">
            <span
              className={`w-1 bg-current rounded-full transition-all duration-300 ${
                isPlaying ? 'h-5 animate-pulse' : 'h-1.5 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-current rounded-full transition-all duration-300 ${
                isPlaying ? 'h-3 animate-pulse delay-75' : 'h-2 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-current rounded-full transition-all duration-300 ${
                isPlaying ? 'h-6 animate-pulse delay-150' : 'h-1.5 opacity-40'
              }`}
            />
            <span
              className={`w-1 bg-current rounded-full transition-all duration-300 ${
                isPlaying ? 'h-4 animate-pulse delay-100' : 'h-2.5 opacity-40'
              }`}
            />
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium">
                Cap. {currentChapter.number}
              </span>
              <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
              <span className="text-xs font-sans text-stone-500 dark:text-stone-400 truncate">
                Voz: {voice}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate font-serif-reading">
              {currentChapter.title}
            </h4>
          </div>
        </div>

        {/* Center Zone: Main Audio Controls */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onSkipRelative(-10)}
              title="Retroceder 10 segundos"
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              title={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-transform active:scale-95 shadow-md"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => onSkipRelative(10)}
              title="Avanzar 10 segundos"
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono tabular-nums text-stone-500 dark:text-stone-400">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Zone: Secondary Controls (Speed, Ambient Sound, Voice Settings) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Playback speed toggle */}
          <div className="relative">
            <button
              onClick={() => {
                const speeds = [0.75, 1.0, 1.25, 1.5];
                const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
                onChangePlaybackRate(speeds[nextIdx]);
              }}
              title="Velocidad de reproducción"
              className="px-2 py-1 text-xs font-mono font-medium rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Ambient sound toggle */}
          <div className="relative">
            <button
              onClick={onToggleAmbient}
              title={isAmbientPlaying ? 'Silenciar música ambiental' : 'Activar música ambiental reflexiva'}
              className={`p-2 rounded-md transition-colors ${
                isAmbientPlaying
                  ? 'text-[#9A3412] dark:text-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-[#9A3412]/30'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
              }`}
            >
              <Music className="w-4 h-4" />
            </button>
          </div>

          {/* Voice Settings Modal Opener */}
          <button
            onClick={onOpenVoiceModal}
            title="Configurar voz y motor"
            className="p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 rounded-md transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>

        </div>

      </div>
    </footer>
  );
};
