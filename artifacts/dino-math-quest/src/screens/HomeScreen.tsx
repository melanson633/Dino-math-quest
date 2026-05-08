import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES } from '../lib/biomes';
import { TriDino } from '../components/TriDino';

export function HomeScreen() {
  const { state, startGame } = useGame();
  const biome = BIOMES[state.currentBiome];

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center relative w-full h-full p-6 text-white"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      <div className="absolute top-1/4 text-center">
        {state.totalCorrect > 0 ? (
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
        ) : (
          <h2 className="text-3xl font-bold mb-2">Let's Play!</h2>
        )}
        <p className="text-xl opacity-90">{biome.name} Biome</p>
      </div>

      <div className="mt-8 mb-16">
        <TriDino />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        className="w-full max-w-sm h-24 rounded-full bg-white text-green-600 text-3xl font-bold shadow-xl border-4 border-white/50 active:bg-green-50"
      >
        Start Adventure!
      </motion.button>
    </div>
  );
}
