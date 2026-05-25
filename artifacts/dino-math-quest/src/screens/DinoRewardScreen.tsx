import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { DINOS } from '../lib/dinos';
import { TriDino } from '../components/TriDino';

export function DinoRewardScreen() {
  const { state, goToScreen, newPuzzle } = useGame();
  const dino = DINOS.find((item) => item.id === state.lastUnlockedDinoId);

  const handleContinue = () => {
    newPuzzle();
    goToScreen('puzzle');
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-amber-200 via-emerald-200 to-sky-200 px-5 py-8 text-slate-800">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.35 }}
        className="mt-8 text-center"
      >
        <p className="text-xl font-black text-emerald-800">New Dino Friend</p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
          {dino ? dino.name : 'Dino Friend'}!
        </h1>
      </motion.div>

      <div className="relative flex w-full flex-1 items-center justify-center">
        <motion.div
          initial={{ scale: 0.2, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.55, delay: 0.1 }}
          className="absolute rounded-full bg-white/45 p-12 shadow-2xl"
        >
          <span className="block text-[8rem] leading-none drop-shadow-sm sm:text-[10rem]">
            {dino?.emoji ?? '🦕'}
          </span>
        </motion.div>

        <motion.div
          initial={{ x: -90, y: 90, opacity: 0 }}
          animate={{ x: -132, y: 130, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.45, delay: 0.35 }}
          className="hidden sm:block"
        >
          <TriDino isJumping className="h-28 w-28" />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="w-full max-w-md text-center"
      >
        <p className="min-h-[56px] rounded-3xl bg-white/80 px-5 py-4 text-lg font-bold leading-tight text-slate-700 shadow-lg">
          {dino?.fact ?? 'A new friend is waiting in the Dino Den.'}
        </p>

        <button
          type="button"
          data-testid="button-continue-math"
          onClick={handleContinue}
          className="mt-5 h-20 w-full rounded-3xl bg-emerald-600 text-3xl font-black text-white shadow-xl active:scale-95"
        >
          More Math
        </button>

        <button
          type="button"
          data-testid="button-view-dino-den"
          onClick={() => goToScreen('dinoden')}
          className="mt-3 h-16 w-full rounded-3xl bg-white/90 text-xl font-black text-emerald-800 shadow-lg active:scale-95"
        >
          Dino Den
        </button>
      </motion.div>
    </div>
  );
}
