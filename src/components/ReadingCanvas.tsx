import React from 'react';
import { Play, Pause, BookmarkCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { ReflectionChapter } from '../data/reflections';

interface ReadingCanvasProps {
  chapter: ReflectionChapter;
  activeParagraphIndex: number;
  isPlaying: boolean;
  onParagraphClick: (index: number) => void;
  onNextChapter?: () => void;
  hasNextChapter: boolean;
  fontSize: 'sm' | 'md' | 'lg';
}

export const ReadingCanvas: React.FC<ReadingCanvasProps> = ({
  chapter,
  activeParagraphIndex,
  isPlaying,
  onParagraphClick,
  onNextChapter,
  hasNextChapter,
  fontSize,
}) => {
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base leading-relaxed';
      case 'lg':
        return 'text-xl leading-loose';
      case 'md':
      default:
        return 'text-lg leading-[1.85]';
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      {/* Editorial Chapter Header */}
      <header className="mb-14 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3 text-xs tracking-widest uppercase font-sans text-stone-500 dark:text-stone-400 mb-4">
          <span>Capítulo {chapter.number}</span>
          <span aria-hidden="true">·</span>
          <span>{chapter.readingTime}</span>
          <span aria-hidden="true">·</span>
          <span>Lectura Narrada</span>
        </div>

        <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-stone-900 dark:text-stone-100 mb-4 text-balance">
          {chapter.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl font-sans font-light">
          {chapter.subtitle}
        </p>

        {/* Epigraph */}
        {chapter.epigraph && (
          <div className="mt-8 pt-6 border-t border-stone-150 dark:border-stone-850">
            <blockquote className="font-serif-reading italic text-stone-700 dark:text-stone-300 text-sm md:text-base">
              "{chapter.epigraph.quote}"
            </blockquote>
            <cite className="block text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 mt-2 font-sans not-italic">
              — {chapter.epigraph.author}
            </cite>
          </div>
        )}
      </header>

      {/* Main Reading Flow with Margin Notes */}
      <div className="space-y-8 font-serif-reading">
        {chapter.paragraphs.map((para, idx) => {
          const isActive = idx === activeParagraphIndex;
          const isFirstPara = idx === 0;

          if (para.isPullQuote) {
            return (
              <aside
                key={para.id}
                onClick={() => onParagraphClick(idx)}
                className={`my-12 py-8 px-6 border-y transition-all cursor-pointer rounded-sm ${
                  isActive
                    ? 'border-[#9A3412]/40 bg-[#9A3412]/5 dark:bg-amber-950/20'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-[#9A3412] dark:text-amber-500 shrink-0">
                    {isActive && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current opacity-70" />
                    )}
                  </div>
                  <div>
                    <blockquote className="font-serif-display text-xl sm:text-2xl italic font-normal text-stone-800 dark:text-stone-200 leading-snug">
                      "{para.text}"
                    </blockquote>
                    <span className="block text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 mt-3 font-sans">
                      Fragmento destacado · Haz clic para escuchar
                    </span>
                  </div>
                </div>
              </aside>
            );
          }

          return (
            <div
              key={para.id}
              onClick={() => onParagraphClick(idx)}
              className={`group relative grid grid-cols-1 md:grid-cols-12 gap-6 p-4 -mx-4 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-100/40 dark:bg-stone-800/60 ring-1 ring-[#9A3412]/30 dark:ring-amber-500/30'
                  : 'hover:bg-stone-100/60 dark:hover:bg-stone-900/40'
              }`}
            >
              {/* Reading column */}
              <div className="md:col-span-9">
                <p
                  className={`text-stone-800 dark:text-stone-200 ${getFontSizeClass()} ${
                    isFirstPara
                      ? 'first-letter:text-5xl first-letter:font-serif-display first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412] dark:first-letter:text-amber-500'
                      : ''
                  }`}
                >
                  {para.text}
                </p>

                {/* Mobile Marginal Note */}
                {para.marginalNote && (
                  <span className="md:hidden block mt-2 text-xs font-sans text-stone-500 dark:text-stone-400 italic">
                    Nota: {para.marginalNote}
                  </span>
                )}
              </div>

              {/* Desktop Marginal Note & Play Cue */}
              <div className="hidden md:flex md:col-span-3 flex-col justify-start text-xs font-sans text-stone-400 dark:text-stone-500 border-l border-stone-200/60 dark:border-stone-800/60 pl-4 py-1">
                {para.marginalNote && (
                  <span className="italic leading-snug text-stone-500 dark:text-stone-400 mb-2">
                    {para.marginalNote}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-stone-600 dark:text-stone-300 font-medium">
                  {isActive && isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 fill-current text-[#9A3412]" />
                      <span>Reproduciendo</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>Escuchar párrafo</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discussion Prompts & Intellectual Workshop */}
      <section className="mt-16 pt-10 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9A3412] dark:text-amber-500 font-sans font-semibold mb-4">
          <MessageCircle className="w-4 h-4" />
          <span>Preguntas para la Reflexión y el Debate</span>
        </div>

        <div className="space-y-4">
          {chapter.discussionPrompts.map((prompt, qIdx) => (
            <div
              key={qIdx}
              className="p-5 rounded-lg bg-stone-50 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800"
            >
              <span className="block text-xs font-sans font-semibold text-stone-400 mb-1">
                Cuestión {qIdx + 1}
              </span>
              <p className="font-serif-reading text-stone-800 dark:text-stone-200 text-base leading-relaxed">
                {prompt}
              </p>
            </div>
          ))}
        </div>

        {/* Chapter Transition Action */}
        {hasNextChapter && (
          <div className="mt-10 flex justify-end">
            <button
              onClick={onNextChapter}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-lg transition-colors shadow-sm"
            >
              <span>Siguiente Capítulo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </article>
  );
};
