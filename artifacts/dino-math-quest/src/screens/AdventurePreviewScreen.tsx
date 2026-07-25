import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { publicAssetUrl } from '../lib/assets';
import { getCompanion, LEARNING_AREAS } from '../content/dinoIslandContent';

export function AdventurePreviewScreen() {
  const { state, startLearningArea, goToScreen } = useGame();
  const area = LEARNING_AREAS.find((item) => item.id === state.selectedLearningAreaId) ?? LEARNING_AREAS[0];
  const companion = getCompanion(state.selectedCompanionId);
  const variant = companion.homeVariants[0];

  return (
    <div className="absolute inset-0 flex flex-col px-5 pb-6 pt-24 text-slate-800 bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100">
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
        <div className="text-7xl drop-shadow-sm" aria-hidden="true">
          {area.icon}
        </div>
        <div>
          <p className="text-lg font-extrabold uppercase tracking-wide text-emerald-700">Coming to Dino Island</p>
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">{area.name}</h1>
        </div>

        {variant?.asset && (
          <img
            src={publicAssetUrl(variant.asset)}
            alt={`${companion.name} companion`}
            className="h-40 max-w-[75%] object-contain drop-shadow-xl"
          />
        )}

        <p className="max-w-sm text-2xl font-bold leading-tight text-slate-700">{area.description}</p>
        <p className="max-w-sm text-xl font-semibold text-slate-600">
          {companion.id === 'none' ? 'Charlotte can explore this soon.' : `${companion.shortLabel} will be able to tag along here soon.`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          data-testid="button-preview-back-home"
          whileTap={{ scale: 0.96 }}
          onClick={() => goToScreen('home')}
          className="min-h-[76px] rounded-3xl bg-white text-2xl font-extrabold text-slate-700 shadow-lg border-4 border-white"
        >
          Home
        </motion.button>
        <motion.button
          data-testid="button-preview-start-math"
          whileTap={{ scale: 0.96 }}
          onClick={() => startLearningArea('math')}
          className="min-h-[76px] rounded-3xl bg-emerald-500 text-2xl font-extrabold text-white shadow-lg border-4 border-emerald-300"
        >
          Math
        </motion.button>
      </div>
    </div>
  );
}
