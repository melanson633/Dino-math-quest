import React from 'react';

interface TenFrameProps {
  /** Number of primary-color filled cells */
  filled: number;
  /** Number of secondary-color filled cells (for addition, placed after primary) */
  secondaryFilled?: number;
  /** Number of cells to show with an X (for subtraction, placed after primary) */
  crossed?: number;
  /** Colour theme */
  theme?: 'green' | 'amber' | 'rose';
  className?: string;
}

const THEMES = {
  green:  { primary: 'bg-emerald-400 border-emerald-600', secondary: 'bg-sky-400 border-sky-600', empty: 'bg-white/60 border-slate-300' },
  amber:  { primary: 'bg-amber-400 border-amber-600',     secondary: 'bg-rose-400 border-rose-600',   empty: 'bg-white/60 border-slate-300' },
  rose:   { primary: 'bg-rose-400 border-rose-600',       secondary: 'bg-violet-400 border-violet-600', empty: 'bg-white/60 border-slate-300' },
};

/**
 * A 2-row × 5-column ten-frame grid.
 * Cells are filled left-to-right, top-to-bottom.
 *
 * Usage for addition (a + b):  filled=a secondaryFilled=b
 * Usage for subtraction (a − b): filled=a−b, crossed=b
 * Usage for fill-to-ten (n + ?): filled=n
 */
export function TenFrame({ filled = 0, secondaryFilled = 0, crossed = 0, theme = 'green', className = '' }: TenFrameProps) {
  const t = THEMES[theme];
  const cells = Array.from({ length: 10 }, (_, i) => {
    if (i < filled) return 'primary';
    if (i < filled + crossed) return 'crossed';
    if (i < filled + crossed + secondaryFilled) return 'secondary';
    return 'empty';
  });

  return (
    <div
      data-testid="ten-frame"
      aria-label={`Ten frame with ${filled} filled`}
      className={`grid grid-cols-5 gap-1.5 rounded-2xl bg-emerald-900/20 p-2 ${className}`}
    >
      {cells.map((state, i) => (
        <div
          key={i}
          data-testid={`ten-frame-cell-${state}`}
          className={`relative flex aspect-square items-center justify-center rounded-xl border-2 text-lg font-black ${
            state === 'primary'   ? t.primary :
            state === 'secondary' ? t.secondary :
            state === 'crossed'   ? `${t.primary} opacity-40` :
            t.empty
          }`}
        >
          {state === 'crossed' && (
            <span className="absolute inset-0 flex items-center justify-center text-slate-700 text-xl font-black">✕</span>
          )}
          {state === 'primary' && <span className="text-white text-xs">●</span>}
          {state === 'secondary' && <span className="text-white text-xs">●</span>}
        </div>
      ))}
    </div>
  );
}
