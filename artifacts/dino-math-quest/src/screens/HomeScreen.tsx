import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { LEARNING_AREAS } from '../content/dinoIslandContent';

export function HomeScreen() {
  const { startLearningArea } = useGame();
  const playableAreas = LEARNING_AREAS.filter((area) => area.status === 'playable');

  return (
    <div className="absolute inset-0 flex flex-col gap-5 overflow-y-auto bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 px-5 pb-5 pt-20 text-slate-800 sm:gap-7 sm:px-6 sm:pb-6 sm:pt-28">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="text-[2.2rem] font-extrabold leading-none text-slate-900 sm:text-5xl">Dino Island</h1>
        <p className="mt-2 text-base font-bold text-slate-500 sm:text-xl">What do you want to do?</p>
      </section>

      <section
        className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 sm:gap-5"
        aria-label="Choose a learning adventure"
      >
        {playableAreas.map((area) => (
          <motion.button
            key={area.id}
            data-testid={`button-learning-area-${area.id}`}
            whileTap={{ scale: 0.96 }}
            onClick={() => startLearningArea(area.id)}
            className="flex min-h-[140px] flex-col gap-3 rounded-[1.6rem] border-4 border-white bg-white p-3 text-left shadow-lg sm:min-h-[180px] sm:gap-4 sm:rounded-3xl sm:p-5"
          >
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-4xl sm:h-18 sm:w-18 sm:text-5xl"
              style={{ backgroundColor: area.accent }}
            >
              {area.icon}
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-extrabold leading-none text-slate-900 sm:text-3xl">{area.shortLabel}</p>
              <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-500 sm:text-base">{area.description}</p>
            </div>
          </motion.button>
        ))}
      </section>
    </div>
  );
}
