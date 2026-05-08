import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { TriDino } from '../components/TriDino';

export function BiomeUnlockScreen() {
  const { state, goToScreen } = useGame();
  const biome = BIOMES[state.currentBiome];
  const bossDino = DINOS.find(d => d.id === biome.bossDinoId);

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center relative w-full h-full p-6 text-white overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      {/* Confetti / Sparkles background */}
      <div className="absolute inset-0 pointer-events-none flex flex-wrap gap-4 opacity-50 justify-center items-center">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: (Math.random() - 0.5) * 400, opacity: 0 }}
            animate={{ y: window.innerHeight, opacity: [0, 1, 1, 0], rotate: Math.random() * 360 }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            className="text-3xl"
          >
            ✨
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="text-center z-10"
      >
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">New World Unlocked! 🎉</h1>
        <h2 className="text-3xl font-bold text-yellow-300 drop-shadow-md mb-8">{biome.name}</h2>
        
        <div className="flex items-end justify-center gap-4 mb-12">
          <TriDino isJumping={true} />
          {bossDino && (
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[8rem] drop-shadow-2xl"
            >
              {bossDino.emoji}
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => goToScreen('puzzle')}
        className="w-full max-w-sm h-24 rounded-full bg-white text-green-600 text-3xl font-bold shadow-xl border-4 border-white/50 active:bg-green-50 z-10"
      >
        Let's Go!
      </motion.button>
    </div>
  );
}
