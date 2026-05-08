import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { DINOS } from '../lib/dinos';
import { ArrowLeft } from 'lucide-react';

export function DinoDenScreen() {
  const { state, goToScreen } = useGame();

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-amber-50 text-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center bg-amber-500 text-white shadow-md flex-shrink-0 gap-3">
        <button
          data-testid="button-back-dinoden"
          onClick={() => goToScreen('home')}
          className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
          aria-label="Back to Home"
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-3xl font-bold">Dino Den 🦕</h1>
      </div>

      <p className="text-center text-amber-700 font-semibold text-lg py-2 px-4 flex-shrink-0">
        {state.unlockedDinos.length} / {DINOS.length} found!
      </p>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        <div className="grid grid-cols-2 gap-4">
          {DINOS.map((dino, idx) => {
            const isUnlocked = state.unlockedDinos.includes(dino.id);
            return (
              <motion.div
                key={dino.id}
                data-testid={`card-dino-${dino.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-md border-4 ${
                  isUnlocked
                    ? 'bg-white border-amber-200'
                    : 'bg-gray-100 border-gray-200'
                }`}
                style={{ minHeight: '160px' }}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-6xl mb-2">{dino.emoji}</span>
                    <h3 className="font-bold text-base leading-tight text-amber-700">{dino.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{dino.fact}</p>
                  </>
                ) : (
                  <>
                    <span className="text-5xl mb-2 opacity-20">🦕</span>
                    <h3 className="font-bold text-base text-gray-400">???</h3>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
