import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { LEARNING_AREAS } from '../content/dinoIslandContent';
import { TriDino } from '../components/TriDino';

const AREA_TAGLINES: Record<string, string> = {
  math: 'Count eggs, solve puzzles, find patterns!',
  spelling: 'Build words, hear sounds, win letters!',
  speech: 'Sing along with Tri the Dino!',
  music: 'Tap the beat and make music!'
};

const AREA_COLORS: Record<string, { header: string; card: string; text: string }> = {
  math: { header: 'bg-emerald-500', card: 'bg-emerald-50', text: 'text-emerald-800' },
  spelling: { header: 'bg-sky-500', card: 'bg-sky-50', text: 'text-sky-800' },
  speech: { header: 'bg-rose-400', card: 'bg-rose-50', text: 'text-rose-700' },
  music: { header: 'bg-amber-500', card: 'bg-amber-50', text: 'text-amber-800' }
};

function Cloud({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative">
        <div className="absolute top-2 left-4 w-20 h-10 rounded-full bg-white/90" />
        <div className="absolute top-0 left-10 w-14 h-12 rounded-full bg-white/90" />
        <div className="w-32 h-10 rounded-full bg-white/90" />
      </div>
    </div>
  );
}

export function HomeScreen() {
  const { startLearningArea } = useGame();
  const playableAreas = LEARNING_AREAS.filter((area) => area.status === 'playable');

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* ── Hero Island Scene ─────────────────────────────────── */}
      <div className="relative flex-shrink-0 h-[38%] overflow-hidden">
        {/* Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100" />

        {/* Sun */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-5 right-10 w-14 h-14 rounded-full bg-yellow-300 shadow-lg shadow-yellow-200/60"
        />

        {/* Clouds */}
        <motion.div
          animate={{ x: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cloud className="top-4 left-4 opacity-90" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cloud className="top-8 right-20 opacity-70 scale-75" />
        </motion.div>

        {/* Back hill */}
        <div
          className="absolute bottom-[42%] left-0 right-0 h-32"
          style={{ background: '#86efac', clipPath: 'ellipse(65% 80% at 50% 100%)' }}
        />

        {/* Front hill */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{ background: '#4ade80', clipPath: 'ellipse(80% 90% at 50% 100%)' }}
        />

        {/* Darker hill edge */}
        <div
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{ background: '#22c55e' }}
        />

        {/* Palm tree left */}
        <div className="absolute bottom-6 left-6 flex flex-col items-center">
          <div className="text-3xl">🌴</div>
        </div>

        {/* Palm tree right */}
        <div className="absolute bottom-6 right-8 flex flex-col items-center">
          <div className="text-3xl">🌴</div>
        </div>

        {/* Tri dino walking across the bottom */}
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        >
          <TriDino className="h-20 w-20" />
        </motion.div>

        {/* Title overlay — sits below the floating TopBar buttons on narrow
            phones, where a top-3 pill used to slide under the Mute button. */}
        <div className="absolute top-20 sm:top-3 left-0 right-0 flex justify-center">
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md tracking-tight">
              🏝️ Dino Island
            </h1>
          </div>
        </div>
      </div>

      {/* ── Cards Section ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-emerald-100 to-amber-100 px-4 pb-6 pt-4">
        <p className="text-center text-base font-bold text-slate-600 mb-4">
          Where do you want to go?
        </p>

        <div className="mx-auto grid w-full max-w-lg grid-cols-2 gap-3">
          {/* Playable area cards */}
          {playableAreas.map((area) => {
            const colors = AREA_COLORS[area.id] ?? { header: 'bg-slate-500', card: 'bg-slate-50', text: 'text-slate-800' };
            const tagline = AREA_TAGLINES[area.id] ?? area.description;

            return (
              <motion.button
                key={area.id}
                data-testid={`button-learning-area-${area.id}`}
                whileTap={{ scale: 0.93 }}
                whileHover={{ y: -3 }}
                onClick={() => startLearningArea(area.id)}
                className={`flex flex-col overflow-hidden rounded-3xl shadow-lg border-2 border-white text-left`}
              >
                {/* Colour header */}
                <div className={`${colors.header} flex items-center justify-center py-5`}>
                  <span className="text-6xl drop-shadow">{area.icon}</span>
                </div>
                {/* Card body */}
                <div className={`${colors.card} flex flex-col gap-1 px-3 py-3`}>
                  <p className={`text-xl font-extrabold leading-tight ${colors.text}`}>
                    {area.shortLabel}
                  </p>
                  <p className="text-xs font-semibold leading-snug text-slate-500">
                    {tagline}
                  </p>
                </div>
              </motion.button>
            );
          })}

        </div>
      </div>
    </div>
  );
}
