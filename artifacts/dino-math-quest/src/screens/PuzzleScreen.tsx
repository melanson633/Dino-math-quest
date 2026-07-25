import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { playTap } from '../lib/audio';
import type { Puzzle } from '../lib/puzzles';

type SceneTokenKind = 'dino' | 'shell' | 'volcano' | 'snow' | 'egg' | 'wave' | 'flame' | 'crystal';

const TOKEN_KINDS: SceneTokenKind[] = ['dino', 'shell', 'volcano', 'snow'];
const SUBTRACT_KINDS: SceneTokenKind[] = ['egg', 'wave', 'flame', 'crystal'];

function SceneToken({ kind, faded = false }: { kind: SceneTokenKind; faded?: boolean }) {
  const baseClass = faded ? 'opacity-25 grayscale' : 'opacity-100';
  const wrapperClass = 'relative inline-flex h-12 w-14 items-center justify-center';

  if (kind === 'dino') {
    return (
      <span data-testid="math-scene-item" className={wrapperClass}>
        <span className={`relative h-9 w-12 rounded-[55%_45%_48%_52%] bg-emerald-300 shadow-inner ring-2 ring-emerald-700/15 ${baseClass}`}>
          <span className="absolute -right-2 top-2 h-4 w-5 rounded-full bg-emerald-200" />
          <span className="absolute -left-2 top-5 h-2 w-5 rotate-[-18deg] rounded-full bg-emerald-400" />
          <span className="absolute left-3 top-1 h-2 w-2 rounded-full bg-emerald-700/70" />
        </span>
      </span>
    );
  }

  if (kind === 'egg') {
    return (
      <span data-testid="math-scene-item" className={wrapperClass}>
        <span className={`h-10 w-8 rounded-[55%_55%_48%_48%] bg-stone-50 shadow-inner ring-2 ring-amber-200 ${baseClass}`} />
      </span>
    );
  }

  if (kind === 'shell') {
    return (
      <span data-testid="math-scene-item" className={wrapperClass}>
        <span className={`relative h-8 w-10 rounded-b-full rounded-t-[999px] bg-rose-200 shadow-inner ring-2 ring-rose-500/20 ${baseClass}`}>
          <span className="absolute left-2 top-1 h-6 w-1 rounded-full bg-rose-400/45" />
          <span className="absolute left-5 top-1 h-6 w-1 rounded-full bg-rose-400/45" />
          <span className="absolute left-8 top-1 h-6 w-1 rounded-full bg-rose-400/45" />
        </span>
      </span>
    );
  }

  if (kind === 'volcano') {
    return (
      <span data-testid="math-scene-item" className={wrapperClass}>
        <span className={`relative h-10 w-11 rounded-b-md bg-stone-500 shadow-inner ring-2 ring-stone-900/15 [clip-path:polygon(50%_0,100%_100%,0_100%)] ${baseClass}`}>
          <span className="absolute left-[39%] top-2 h-2 w-3 rounded-full bg-orange-300" />
        </span>
      </span>
    );
  }

  if (kind === 'wave') {
    return (
      <span data-testid="math-scene-item" className={wrapperClass}>
        <span className={`h-7 w-12 rounded-[999px_999px_35%_35%] bg-sky-300 shadow-inner ring-2 ring-sky-600/15 ${baseClass}`} />
      </span>
    );
  }

  if (kind === 'flame') {
    return (
      <span data-testid="math-scene-item" className={wrapperClass}>
        <span className={`h-10 w-8 rotate-45 rounded-[75%_15%_75%_15%] bg-orange-300 shadow-inner ring-2 ring-orange-700/15 ${baseClass}`} />
      </span>
    );
  }

  if (kind === 'crystal') {
    return (
      <span data-testid="math-scene-item" className={wrapperClass}>
        <span className={`h-10 w-8 rotate-45 rounded-md bg-cyan-200 shadow-inner ring-2 ring-cyan-700/15 ${baseClass}`} />
      </span>
    );
  }

  return (
    <span data-testid="math-scene-item" className={wrapperClass}>
      <span className={`h-8 w-8 rounded-full bg-white/85 shadow-inner ring-2 ring-sky-200 ${baseClass}`} />
    </span>
  );
}

function TokenRow({
  count,
  kind,
  fadedFrom = count,
  label
}: {
  count: number;
  kind: SceneTokenKind;
  fadedFrom?: number;
  label: string;
}) {
  return (
    <div data-testid="math-token-row" aria-label={label} className="flex max-w-[340px] flex-wrap justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SceneToken key={i} kind={kind} faded={i >= fadedFrom} />
      ))}
    </div>
  );
}

function CompareGroup({ count, kind, label }: { count: number; kind: SceneTokenKind; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-3xl bg-white/25 px-3 py-3 shadow-inner">
      <p className="text-4xl font-black leading-none text-white drop-shadow sm:text-5xl">{label}</p>
      <TokenRow count={count} kind={kind} label={`${count} island items`} />
    </div>
  );
}

function getCorrectNumberOption(options: { label: string; isCorrect: boolean }[]): number | null {
  const correct = options.find((option) => option.isCorrect);
  if (!correct) return null;
  const value = Number.parseInt(correct.label, 10);
  return Number.isFinite(value) ? value : null;
}

function NumberPath({ display }: { display: string }) {
  const stones = display.split(/\s+/).filter(Boolean);
  return (
    <div
      data-testid="math-visual-scene"
      aria-label="Dino Island number path"
      className="flex w-full max-w-lg flex-wrap items-center justify-center gap-2 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-4 py-5 text-slate-800 shadow-inner"
    >
      {stones.map((stone, index) => (
        <span
          key={`${stone}-${index}`}
          data-testid="math-scene-item"
          className={`flex h-16 w-16 items-center justify-center rounded-[45%_55%_52%_48%] text-2xl font-black shadow-sm ${
            stone === '?' ? 'bg-amber-200 text-amber-950 ring-4 ring-amber-400' : 'bg-stone-100 text-slate-700 ring-2 ring-white/70'
          }`}
        >
          {stone}
        </span>
      ))}
    </div>
  );
}

function MathVisualScene({
  puzzle,
  tokenKind,
  subtractKind
}: {
  puzzle: Puzzle;
  tokenKind: SceneTokenKind;
  subtractKind: SceneTokenKind;
}) {
  if (puzzle.type === 'missing-number') return <NumberPath display={puzzle.display} />;

  if (puzzle.type === 'counting') {
    const count = getCorrectNumberOption(puzzle.options);
    if (count === null) return null;
    return (
      <div
        data-testid="math-visual-scene"
        aria-label={`Dino Island counting scene with ${count} items`}
        className="w-full max-w-lg rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <TokenRow count={count} kind={tokenKind} label={`${count} countable Dino Island items`} />
      </div>
    );
  }

  if (puzzle.type === 'addition' && puzzle.operands) {
    const [a, b] = puzzle.operands;
    return (
      <div
        data-testid="math-visual-scene"
        aria-label="Dino Island two-group counting scene"
        className="flex w-full max-w-lg flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <TokenRow count={a} kind={tokenKind} label={`${a} items in the first group`} />
        <span className="rounded-full bg-white/85 px-3 py-1 text-2xl font-black text-emerald-800 shadow-sm">+</span>
        <TokenRow count={b} kind={subtractKind} label={`${b} items in the second group`} />
      </div>
    );
  }

  if (puzzle.type === 'subtraction' && puzzle.operands) {
    const [a, b] = puzzle.operands;
    return (
      <div
        data-testid="math-visual-scene"
        aria-label="Dino Island taking-away scene"
        className="flex w-full max-w-lg flex-col items-center gap-4 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wide text-emerald-700">started with</span>
          <TokenRow count={a} kind={tokenKind} label={`${a} items to start`} />
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-rose-100/70 px-5 py-3">
          <span className="text-xs font-black uppercase tracking-wide text-rose-600">gone 🌫️</span>
          <TokenRow count={b} kind={subtractKind} fadedFrom={0} label={`${b} items taken away`} />
        </div>
      </div>
    );
  }

  if (puzzle.type === 'compare' && puzzle.operands) {
    return (
      <div data-testid="math-visual-scene" aria-label="Dino Island compare scene" className="w-full max-w-lg">
        <div className="mb-2 text-2xl font-black text-white/95 drop-shadow sm:text-3xl">Which pile has more?</div>
        <div className="flex w-full items-stretch justify-center gap-3">
          <CompareGroup count={puzzle.operands[0]} kind={tokenKind} label={puzzle.operands[0].toString()} />
          <CompareGroup count={puzzle.operands[1]} kind={subtractKind} label={puzzle.operands[1].toString()} />
        </div>
      </div>
    );
  }

  // shapes / pattern
  return (
    <div
      data-testid="math-visual-scene"
      aria-label="Dino Island shape cave"
      className="w-full max-w-lg rounded-[2rem] bg-gradient-to-b from-cyan-100/95 to-indigo-200/90 px-6 py-8 text-center text-[3rem] font-bold leading-tight text-slate-800 shadow-inner sm:text-[4rem]"
    >
      <span data-testid="math-scene-item">{puzzle.display}</span>
    </div>
  );
}

function getNextDino(totalCorrect: number) {
  return DINOS.find((dino) => dino.unlockAt > totalCorrect) ?? DINOS[DINOS.length - 1];
}

export function PuzzleScreen() {
  const { state, puzzle, answerPuzzle, goToScreen } = useGame();
  const biome = BIOMES[state.currentBiome];

  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  useEffect(() => {
    setWrongIds(new Set());
    setShakingId(null);
    setIsCorrect(false);
    setShowEncouragement(false);
  }, [puzzle]);

  const handleSelect = useCallback(
    (id: string, correct: boolean) => {
      if (isCorrect || wrongIds.has(id)) return;
      playTap();

      if (correct) {
        setIsCorrect(true);
        answerPuzzle(true);
        return;
      }

      setWrongIds((prev) => new Set([...prev, id]));
      setShakingId(id);
      setShowEncouragement(true);
      answerPuzzle(false);
      setTimeout(() => setShakingId(null), 500);
      setTimeout(() => setShowEncouragement(false), 1800);
    },
    [isCorrect, wrongIds, answerPuzzle]
  );

  if (!puzzle) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center pt-24"
        style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
      >
        <span className="animate-bounce text-6xl">🦕</span>
      </div>
    );
  }

  const tokenKind = TOKEN_KINDS[state.currentBiome] ?? 'dino';
  const subtractKind = SUBTRACT_KINDS[state.currentBiome] ?? 'egg';
  const nextDino = getNextDino(state.totalCorrect);
  const previousUnlockAt = [...DINOS].reverse().find((dino) => dino.unlockAt <= state.totalCorrect)?.unlockAt ?? 0;
  const progressSpan = Math.max(1, nextDino.unlockAt - previousUnlockAt);
  const correctTowardNextDino = Math.min(state.totalCorrect, nextDino.unlockAt);
  const progressValue = Math.min(100, Math.max(0, ((correctTowardNextDino - previousUnlockAt) / progressSpan) * 100));

  return (
    <div
      className="absolute inset-0 flex w-full flex-col overflow-y-auto pt-20 sm:pt-24"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 pb-4 sm:px-5">
        {/* Prompt + home */}
        <div className="flex items-start justify-between gap-3 text-white">
          <h2 className="flex min-h-[64px] flex-1 items-center justify-center rounded-3xl bg-black/25 px-4 py-3 text-center text-2xl font-black leading-tight backdrop-blur sm:text-3xl">
            {puzzle.prompt}
          </h2>
          <button
            type="button"
            onClick={() => goToScreen('home')}
            data-testid="button-math-home"
            className="min-h-[64px] rounded-3xl bg-white/95 px-5 py-3 text-base font-black text-slate-700 shadow-lg active:scale-95"
          >
            Home
          </button>
        </div>

        {/* Visual scene — full width */}
        <motion.div
          key={puzzle.prompt + puzzle.type}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.45 }}
          className="flex flex-col items-center gap-3 text-white"
        >
          {(puzzle.type === 'addition' || puzzle.type === 'subtraction') && (
            <div className="text-[4.25rem] font-bold leading-none tracking-wide drop-shadow-lg sm:text-[5.5rem]">
              {puzzle.display}
            </div>
          )}
          <MathVisualScene puzzle={puzzle} tokenKind={tokenKind} subtractKind={subtractKind} />
        </motion.div>

        {/* Encouragement toast */}
        <div className="min-h-[44px]">
          <AnimatePresence>
            {showEncouragement && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="pointer-events-none text-center"
              >
                <span className="inline-block rounded-full bg-yellow-300 px-5 py-2 text-xl font-black text-yellow-950 shadow-lg">
                  Good try. Pick one more! ⭐
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answer buttons */}
        <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
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
                className={`flex min-h-[72px] w-full items-center justify-center rounded-3xl text-3xl font-black shadow-lg transition-all sm:min-h-[104px] sm:text-5xl ${btnClass}`}
              >
                {opt.label}
                {isThisCorrect && ' ✨'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Correct overlay — shows dino progress */}
      {isCorrect && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3 rounded-[2rem] bg-white/20 px-10 py-6 backdrop-blur"
          >
            <span className="text-[6rem] leading-none">🎉</span>
            <div className="flex flex-col items-center gap-1 text-white">
              <span className="text-3xl">{nextDino.emoji}</span>
              <p className="text-base font-black">{nextDino.name}</p>
              <div className="mt-1 h-3 w-32 overflow-hidden rounded-full bg-white/30">
                <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progressValue}%` }} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
