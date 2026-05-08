import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES } from '../lib/biomes';
import { playTap } from '../lib/audio';

export function PuzzleScreen() {
  const { state, puzzle, answerPuzzle } = useGame();
  const biome = BIOMES[state.currentBiome];
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!puzzle) return null;

  const handleSelect = (id: string, correct: boolean) => {
    if (isCorrect) return; // Prevent multi-clicks
    playTap();
    setSelectedId(id);
    if (correct) {
      setIsCorrect(true);
      answerPuzzle(true);
    } else {
      setIsWrong(true);
      answerPuzzle(false);
      setTimeout(() => setIsWrong(false), 600);
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col w-full h-full relative"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      <div className="flex-1 flex flex-col p-6 items-center justify-between">
        
        {/* Story Prompt */}
        <div className="text-center text-white mt-12 mb-8">
          <h2 className="text-4xl font-bold bg-black/20 p-4 rounded-3xl backdrop-blur">
            {puzzle.prompt}
          </h2>
        </div>

        {/* Puzzle Area */}
        <div className="flex-1 flex items-center justify-center w-full">
          <motion.div 
            key={puzzle.prompt}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-white text-center"
          >
            <div className="text-[5rem] font-bold tracking-wider mb-4 drop-shadow-lg">
              {puzzle.display}
            </div>
            
            {/* Visual tokens could go here based on puzzle type */}
          </motion.div>
        </div>

        {/* Answer Buttons */}
        <div className="w-full flex flex-col gap-4 mb-6">
          {puzzle.options.map((opt) => {
            const isThisSelected = selectedId === opt.id;
            const btnBg = isThisSelected && isWrong && !opt.isCorrect 
              ? 'bg-gray-400 opacity-50' 
              : isThisSelected && isCorrect && opt.isCorrect 
                ? 'bg-green-400 text-white' 
                : 'bg-white text-gray-800';

            return (
              <motion.button
                key={opt.id}
                whileTap={{ scale: 0.95 }}
                animate={isThisSelected && isWrong ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => handleSelect(opt.id, opt.isCorrect)}
                className={`w-full h-24 rounded-2xl text-4xl font-bold shadow-lg border-4 border-black/10 flex items-center justify-center transition-colors ${btnBg}`}
                disabled={isThisSelected && isWrong && !opt.isCorrect}
              >
                {opt.label}
                {isThisSelected && isCorrect && opt.isCorrect && ' ✨'}
              </motion.button>
            );
          })}
        </div>

      </div>

      {isWrong && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-[40%] w-full text-center pointer-events-none"
        >
          <span className="bg-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold shadow-xl">
            Try again! ⭐
          </span>
        </motion.div>
      )}

      {isCorrect && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="text-[8rem]">🎉</div>
        </div>
      )}
    </div>
  );
}
