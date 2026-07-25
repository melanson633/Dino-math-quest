import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES, biomeBackground } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { TriDino } from '../components/TriDino';
import { DinoArt } from '../components/DinoArt';
import { publicAssetUrl } from '../lib/assets';

export function BiomeUnlockScreen() {
  const { state, goToScreen, newPuzzle, showPendingDinoReward } = useGame();
  const biome = BIOMES[state.currentBiome];
  const bossDino = DINOS.find(d => d.id === biome.bossDinoId);

  const handleLetsGo = () => {
    // A dino unlocked on the same answer as this biome waits behind it.
    if (state.pendingDinoReward) {
      showPendingDinoReward();
      return;
    }
    newPuzzle();
    goToScreen('puzzle');
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-between relative w-full p-6 text-white overflow-hidden"
      style={biomeBackground(biome, publicAssetUrl)}
    >
      {/* Falling sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -60, x: (i / 18) * 400 - 20, opacity: 0 }}
            animate={{ y: 900, opacity: [0, 1, 1, 0], rotate: 360 * (i % 3 === 0 ? 1 : -1) }}
            transition={{
              duration: 2.5 + (i % 4) * 0.5,
              repeat: Infinity,
              delay: (i % 6) * 0.4,
              ease: 'linear'
            }}
            className="absolute text-2xl"
          >
            {['✨', '⭐', '🌟', '💫'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.div
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.55, duration: 0.7 }}
        className="text-center z-10 mt-4"
      >
        <h1 className="text-4xl font-bold drop-shadow-lg mb-2">New World Unlocked!</h1>
        <h2 className="text-5xl font-bold text-yellow-300 drop-shadow-lg">{biome.name}! 🎉</h2>
      </motion.div>

      {/* Dinos celebrating */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-end justify-center gap-6 z-10"
      >
        <TriDino isJumping={true} />
        {bossDino && (
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', bounce: 0.4 }}
            className="flex flex-col items-center"
          >
            <DinoArt dino={bossDino} decorative className="h-24 w-24 drop-shadow-2xl" />
            <span className="text-xl font-bold bg-black/20 px-3 py-1 rounded-full">{bossDino.name}!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Let's Go button */}
      <motion.button
        data-testid="button-lets-go"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, type: 'spring', bounce: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLetsGo}
        className="w-full max-w-sm h-24 rounded-full bg-white text-green-700 text-3xl font-bold shadow-2xl border-4 border-white/60 active:bg-green-50 z-10 mb-4"
      >
        Let's Go! 🚀
      </motion.button>
    </div>
  );
}
