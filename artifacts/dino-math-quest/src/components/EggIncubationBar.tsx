import React from 'react';
import type { Dino } from '../lib/dinos';

interface EggIncubationBarProps {
  nextDino: Dino | null;
  answersRemaining: number;
  totalToUnlock: number;
}

/**
 * A persistent strip pinned above the answer buttons that shows a warming
 * dino egg as the player closes in on their next dino unlock.
 *
 * The egg warms from grey → amber → glowing gold as progress increases.
 * Below the egg: the next dino name and exact remaining count.
 */
export function EggIncubationBar({ nextDino, answersRemaining, totalToUnlock }: EggIncubationBarProps) {
  if (!nextDino) {
    // All dinos found — show a celebration bar instead
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/30 px-4 py-2 backdrop-blur">
        <span className="text-2xl">🏆</span>
        <p className="text-sm font-black text-white drop-shadow">All {'\u2014'} dino friends found!</p>
      </div>
    );
  }

  const progress = Math.min(1, Math.max(0, 1 - answersRemaining / Math.max(1, totalToUnlock)));

  // Egg color warms: grey (0%) → amber (50%) → gold (100%)
  const eggFill = progress < 0.5
    ? interpolateColor('#d1d5db', '#fcd34d', progress * 2)
    : interpolateColor('#fcd34d', '#fbbf24', (progress - 0.5) * 2);

  const glowOpacity = Math.min(1, progress * 1.4);
  const glowSize = 28 + progress * 20; // 28px → 48px glow radius

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/20 px-4 py-2 backdrop-blur">
      {/* Egg with warmth glow */}
      <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 56, height: 56 }}>
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(251,191,36,${glowOpacity * 0.6}) 0%, rgba(251,191,36,0) 70%)`,
            width: glowSize,
            height: glowSize,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {/* Egg SVG */}
        <svg width="40" height="48" viewBox="0 0 40 48" aria-hidden="true">
          <ellipse
            cx="20" cy="26"
            rx="16" ry="20"
            fill={eggFill}
            stroke={progress > 0.7 ? '#d97706' : '#9ca3af'}
            strokeWidth="2.5"
          />
          {/* Crack lines appear near full warmth */}
          {progress > 0.75 && (
            <>
              <path d="M18 16 L20 20 L17 24" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M22 18 L21 22" fill="none" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round"/>
            </>
          )}
          {/* Warm glow shine */}
          {progress > 0.3 && (
            <ellipse cx="14" cy="18" rx="5" ry="3" fill="white" opacity={Math.min(0.4, progress * 0.5)} transform="rotate(-20 14 18)"/>
          )}
        </svg>
      </div>

      {/* Text info */}
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-black leading-tight text-white drop-shadow truncate">
          {nextDino.name} is almost here!
        </p>
        <p className="text-[11px] font-bold text-white/80 drop-shadow">
          {answersRemaining <= 0
            ? 'Ready to hatch! 🥚'
            : `${answersRemaining} more correct`}
        </p>
        {/* Progress bar */}
        <div className="mt-1 h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.round(progress * 100)}%`,
              background: progress > 0.6
                ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(90deg, #6ee7b7, #34d399)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** Linearly interpolate between two hex colors. t ∈ [0, 1]. */
function interpolateColor(from: string, to: string, t: number): string {
  const f = hexToRgb(from);
  const tC = hexToRgb(to);
  if (!f || !tC) return from;
  const r = Math.round(f.r + (tC.r - f.r) * t);
  const g = Math.round(f.g + (tC.g - f.g) * t);
  const b = Math.round(f.b + (tC.b - f.b) * t);
  return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  return {
    r: parseInt(m[1].slice(0, 2), 16),
    g: parseInt(m[1].slice(2, 4), 16),
    b: parseInt(m[1].slice(4, 6), 16),
  };
}
