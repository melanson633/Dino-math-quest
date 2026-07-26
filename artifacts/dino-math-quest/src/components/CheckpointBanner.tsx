import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dino } from '../lib/dinos';
import type { Biome } from '../lib/biomes';
import { DinoArt } from './DinoArt';

interface CheckpointBannerProps {
  nextDino: Dino | null;
  nextBiome: Biome | null;
  answersRemaining: number;
  /** Called when the banner auto-dismisses or the player answers correctly */
  onDismiss: () => void;
  visible: boolean;
}

const CHEER_COPY = ["You've got this!", 'Almost there!', 'Keep going!', 'So close!'];

/**
 * A slide-up banner that fires from the bottom of PuzzleScreen whenever the
 * player's next milestone is ≤ 5 answers away. Auto-dismisses after 3 s.
 */
export function CheckpointBanner({ nextDino, nextBiome, answersRemaining, onDismiss, visible }: CheckpointBannerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setTimeout(onDismiss, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, onDismiss]);

  const cheerLine = CHEER_COPY[Math.min(5 - answersRemaining, CHEER_COPY.length - 1)] ?? 'Almost there!';

  return (
    <AnimatePresence>
      {visible && nextDino && (
        <motion.div
          key="checkpoint-banner"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.45 }}
          className="absolute bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl px-4 pb-4"
          onClick={onDismiss}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-4 rounded-[1.5rem] bg-white/95 px-5 py-4 shadow-2xl backdrop-blur border-4 border-amber-200">
            {/* Dino portrait */}
            <DinoArt
              dino={nextDino}
              decorative
              className="flex-shrink-0 h-[72px] w-[72px] object-contain drop-shadow-lg"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-amber-600">{cheerLine}</p>
              <p className="text-xl font-black leading-tight text-slate-800 truncate">
                Just {answersRemaining} more!
              </p>
              <p className="text-sm font-bold text-slate-500 truncate">
                Find <span className="text-amber-700">{nextDino.name}</span>
                {nextBiome && (
                  <> &amp; enter <span className="font-black" style={{ color: nextBiome.colors.primary }}>{nextBiome.name}</span></>
                )}
              </p>
            </div>

            {/* Biome color chip (only when a biome also unlocks) */}
            {nextBiome && (
              <div
                className="flex-shrink-0 h-10 w-10 rounded-xl border-2 border-white shadow-md"
                style={{ background: `linear-gradient(135deg, ${nextBiome.colors.bgFrom}, ${nextBiome.colors.bgTo})` }}
                title={nextBiome.name}
                aria-hidden="true"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
