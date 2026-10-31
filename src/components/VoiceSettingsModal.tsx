import React from 'react';
import { X, Volume2, Music, Type, Check, Sparkles, Sliders } from 'lucide-react';
import { VoiceName } from '../utils/ttsEngine';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVoice: VoiceName;
  onSelectVoice: (voice: VoiceName) => void;
  ambientVolume: number;
  onChangeAmbientVolume: (vol: number) => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  fontSize: 'sm' | 'md' | 'lg';
  onChangeFontSize: (size: 'sm' | 'md' | 'lg') => void;
  currentEngine: 'gemini' | 'browser';
}

const VOICES: { id: VoiceName; name: string; description: string; timbre: string }[] = [
  {
    id: 'Kore',
    name: 'Kore',
    description: 'Serena, reflexiva y articulada',
    timbre: 'Tono equilibrado, ideal para ensayos filosóficos',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    description: 'Profunda, reposada y solemne',
    timbre: 'Bajo cálido con cadencia pausada',
  },
  {
    id: 'Puck',
    name: 'Puck',
    description: 'Cálida, cercana y conversacional',
    timbre: 'Tono ameno estilo tertulia humanística',
  },
  {
    id: 'Charon',
    name: 'Charon',
    description: 'Grave, sosegada y reflexiva',
    timbre: 'Registro maduro con gravedad serena',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    description: 'Diáfana, sutil y envolvente',
    timbre: 'Textura suave para lecturas contemplativas',
  },
];

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  currentVoice,
  onSelectVoice,
  ambientVolume,
  onChangeAmbientVolume,
  isAmbientPlaying,
  onToggleAmbient,
  fontSize,
  onChangeFontSize,
  currentEngine,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#FAF7F2] dark:bg-[#1A1816] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#9A3412] dark:text-amber-500" />
            <h3 className="font-serif-display text-lg font-medium text-stone-900 dark:text-stone-100">
              Ajustes de Lectura y Audio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Section 1: Voice Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 font-sans">
                Timbre de la Voz Narradora
              </label>
              <span className="text-xs text-stone-400 font-sans">
                {currentEngine === 'gemini' ? 'Gemini 3.8 Flash Lite TTS' : 'Motor Nativo Navegador'}
              </span>
            </div>

            <div className="space-y-2">
              {VOICES.map((v) => {
                const isSelected = v.id === currentVoice;
                return (
                  <button
                    key={v.id}
                    onClick={() => onSelectVoice(v.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#9A3412] bg-[#9A3412]/5 dark:bg-amber-950/20'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-white dark:bg-stone-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                          {v.name}
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          · {v.description}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">
                        {v.timbre}
                      </p>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#9A3412] dark:text-amber-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Ambient Soundscape */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 font-sans">
                  Ambientación Acústica (Pads Armónicos)
                </span>
              </div>
              <button
                onClick={onToggleAmbient}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  isAmbientPlaying
                    ? 'bg-[#9A3412] text-white'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                {isAmbientPlaying ? 'Activa' : 'Desactivada'}
              </button>
            </div>

            <div className="flex items-center gap-4 px-1">
              <span className="text-xs text-stone-400 font-mono">0%</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => onChangeAmbientVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#9A3412] dark:accent-amber-500"
              />
              <span className="text-xs text-stone-400 font-mono">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
          </div>

          {/* Section 3: Typography Size */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-stone-500 dark:text-stone-400" />
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-stone-400 font-sans">
                Tamaño del Texto de Lectura
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'sm', label: 'Estándar (16px)' },
                  { id: 'md', label: 'Cómodo (18px)' },
                  { id: 'lg', label: 'Amplio (20px)' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => onChangeFontSize(s.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all text-center ${
                    fontSize === s.id
                      ? 'border-[#9A3412] bg-[#9A3412]/10 text-[#9A3412] dark:text-amber-400'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-100/50 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-lg transition-colors"
          >
            Listo
          </button>
        </div>

      </div>
    </div>
  );
};
