import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES } from '../lib/biomes';
import { playTap } from '../lib/audio';

// Visual token emojis per biome
const TOKEN_EMOJIS = ['🦕', '🐚', '🌋', '❄️'];
const SUBTRACT_EMOJIS = ['🥚', '🌊', '🔥', '💎'];

function TokenRow({ count, emoji, crossed = false }: { count: number; emoji: string; crossed?: boolean }) {
  return (
    <div className="flex flex-wrap justify-center gap-1 max-w-[280px]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`text-3xl transition-all ${crossed ? 'opacity-30 line-through decoration-red-500' : ''}`}
          style={crossed ? { textDecoration: 'line-through', textDecorationColor: '#ef4444', textDecorationThickness: '3px' } : {}}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export function PuzzleScreen() {
  const { state, puzzle, answerPuzzle } = useGame();
  const biome = BIOMES[state.currentBiome];

  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Reset all local state every time a new puzzle arrives
  useEffect(() => {
    setWrongIds(new Set());
    setShakingId(null);
    setIsCorrect(false);
    setShowEncouragement(false);
  }, [puzzle]);

  const handleSelect = useCallback((id: string, correct: boolean) => {
    if (isCorrect || wrongIds.has(id)) return;
    playTap();
    if (correct) {
      setIsCorrect(true);
      answerPuzzle(true);
    } else {
      setWrongIds(prev => new Set([...prev, id]));
      setShakingId(id);
      setShowEncouragement(true);
      answerPuzzle(false);
      setTimeout(() => setShakingId(null), 500);
      setTimeout(() => setShowEncouragement(false), 1800);
    }
  }, [isCorrect, wrongIds, answerPuzzle]);

  if (!puzzle) return (
    <div
      className="flex-1 flex items-center justify-center"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      <span className="text-6xl animate-bounce">🦕</span>
    </div>
  );

  const tokenEmoji = TOKEN_EMOJIS[state.currentBiome] ?? '🦕';
  const subtractEmoji = SUBTRACT_EMOJIS[state.currentBiome] ?? '🥚';

  return (
    <div
      className="flex-1 flex flex-col w-full relative overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      <div className="flex-1 flex flex-col px-4 pb-4 gap-3">

        {/* Story Prompt */}
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold bg-black/25 px-4 py-3 rounded-2xl backdrop-blur inline-block">
            {puzzle.prompt}
          </h2>
        </div>

        {/* Puzzle Display Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <motion.div
            key={puzzle.prompt + puzzle.type}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
            className="text-white text-center flex flex-col items-center gap-3 w-full"
          >
            {/* Math equation — big numbers */}
            {(puzzle.type === 'addition' || puzzle.type === 'subtraction') && (
              <>
                <div className="text-[4.5rem] font-bold tracking-wide drop-shadow-lg leading-none">
                  {puzzle.display}
                </div>

                {/* Visual token rows */}
                {puzzle.type === 'addition' && puzzle.operands && (
                  <div className="flex flex-col items-center gap-2 bg-black/15 rounded-2xl px-4 py-3">
                    <TokenRow count={puzzle.operands[0]} emoji={tokenEmoji} />
                    <span className="text-3xl font-bold opacity-80">+</span>
                    <TokenRow count={puzzle.operands[1]} emoji={subtractEmoji} />
                  </div>
                )}

                {puzzle.type === 'subtraction' && puzzle.operands && (
                  <div className="flex flex-col items-center gap-2 bg-black/15 rounded-2xl px-4 py-3">
                    <div className="flex flex-wrap justify-center gap-1 max-w-[280px]">
                      {Array.from({ length: puzzle.operands[0] }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-3xl transition-all ${
                            i >= puzzle.operands![0] - puzzle.operands![1]
                              ? 'opacity-25'
                              : 'opacity-100'
                          }`}
                        >
                          {tokenEmoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Shapes puzzle display */}
            {puzzle.type === 'shapes' && (
              <div className="text-[3rem] font-bold drop-shadow-lg bg-black/15 rounded-2xl px-6 py-4">
                {puzzle.display}
              </div>
            )}
          </motion.div>
        </div>

        {/* Encouragement message */}
        <AnimatePresence>
          {showEncouragement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center pointer-events-none"
            >
              <span className="bg-yellow-400 text-yellow-900 px-5 py-2 rounded-full text-xl font-bold shadow-lg">
                Try again! ⭐
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Buttons — stacked, ≥80px each */}
        <div className="flex flex-col gap-3 w-full">
          {puzzle.options.map((opt) => {
            const isWrong = wrongIds.has(opt.id);
            const isThisCorrect = isCorrect && opt.isCorrect;

            let btnClass = 'bg-white text-gray-800 border-4 border-white/30';
            if (isWrong) btnClass = 'bg-gray-300 text-gray-400 border-4 border-gray-200 opacity-50 cursor-not-allowed';
            if (isThisCorrect) btnClass = 'bg-green-400 text-white border-4 border-green-300 shadow-green-200';

            return (
              <motion.button
                key={opt.id}
                data-testid={`button-answer-${opt.id}`}
                animate={shakingId === opt.id ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => handleSelect(opt.id, opt.isCorrect)}
                disabled={isWrong || isCorrect}
                className={`w-full min-h-[80px] rounded-2xl text-4xl font-bold shadow-lg flex items-center justify-center transition-all ${btnClass}`}
              >
                {opt.label}
                {isThisCorrect && ' ✨'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Correct answer celebration overlay */}
      {isCorrect && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.4 }}
            className="text-[7rem]"
          >
            🎉
          </motion.div>
        </div>
      )}
    </div>
  );
}
