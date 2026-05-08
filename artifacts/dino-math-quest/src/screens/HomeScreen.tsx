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
      className="absolute inset-0 flex flex-col items-center justify-between w-full p-6 pt-24 text-white"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      {/* Biome badge */}
      <div className="text-center">
        <span className="bg-black/20 px-4 py-1 rounded-full text-lg font-semibold backdrop-blur">
          {biome.name} Biome
        </span>
      </div>

      {/* Tri the Triceratops — centered in available space */}
      <div className="flex-1 flex items-center justify-center">
        <TriDino />
      </div>

      {/* Start button */}
      <motion.button
        data-testid="button-start-adventure"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={startGame}
        className="w-full max-w-sm h-24 rounded-full bg-white text-green-700 text-3xl font-bold shadow-2xl border-4 border-white/60 active:bg-green-50 mb-4"
      >
        {state.totalCorrect > 0 ? 'Keep Playing! 🦕' : 'Start Adventure! 🦕'}
      </motion.button>
    </div>
  );
}
