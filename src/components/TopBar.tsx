import React from 'react';
import { Volume2, Moon, Sun, Settings } from 'lucide-react';
import { REFLECTION_CHAPTERS } from '../data/reflections';

interface TopBarProps {
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenVoiceSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeChapterId,
  onSelectChapter,
  isPlaying,
  onTogglePlay,
  isDark,
  onToggleDark,
  onOpenVoiceSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#FAF7F2]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-serif-display text-xl tracking-tight text-stone-900 dark:text-stone-100 hover:text-amber-900 dark:hover:text-amber-200 transition-colors whitespace-nowrap"
          >
            Reflexiones
          </a>
        </div>

        {/* Zone 2: 4 concise single-line nav links with hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-400">
          {REFLECTION_CHAPTERS.map((chap) => {
            const isActive = chap.id === activeChapterId;
            return (
              <button
                key={chap.id}
                onClick={() => onSelectChapter(chap.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-stone-950 dark:text-white font-semibold'
                    : 'hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {chap.id === 'integracion' && 'Integración'}
                {chap.id === 'pensamiento-critico' && 'Pensamiento Crítico'}
                {chap.id === 'colaboracion' && 'Colaboración'}
                {chap.id === 'sociedad' && 'Sociedad'}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9A3412] dark:bg-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action & utility controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenVoiceSettings}
            title="Ajustes de voz y motor de narración"
            aria-label="Ajustes de voz"
            className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleDark}
            title={isDark ? 'Cambiar a modo lectura diurna' : 'Cambiar a modo lectura nocturna'}
            aria-label="Alternar tema"
            className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onTogglePlay}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlaying ? 'Pausar Lectura' : 'Escuchar Ensayo'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
