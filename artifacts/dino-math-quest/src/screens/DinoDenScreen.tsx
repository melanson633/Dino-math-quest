import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { DINOS } from '../lib/dinos';
import { ArrowLeft } from 'lucide-react';

export function DinoDenScreen() {
  const { state, goToScreen } = useGame();

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-orange-50 text-gray-800">
      <div className="p-4 flex items-center bg-orange-400 text-white shadow-md relative z-10">
        <button 
          onClick={() => goToScreen('home')}
          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center active:scale-95"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-3xl font-bold ml-4">Dino Den</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-12">
        <div className="grid grid-cols-2 gap-4">
          {DINOS.map((dino, idx) => {
            const isUnlocked = state.unlockedDinos.includes(dino.id);
            return (
              <motion.div
                key={dino.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-lg border-4 ${
                  isUnlocked ? 'bg-white border-orange-200' : 'bg-gray-200 border-gray-300'
                }`}
                style={{ minHeight: '160px' }}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-6xl mb-2 drop-shadow-md">{dino.emoji}</span>
                    <h3 className="font-bold text-lg leading-tight text-orange-600">{dino.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{dino.fact}</p>
                  </>
                ) : (
                  <>
                    <span className="text-6xl mb-2 opacity-20 grayscale brightness-0">❓</span>
                    <h3 className="font-bold text-lg text-gray-400">Locked</h3>
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
