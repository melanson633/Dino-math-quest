import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES, biomeBackground } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import type { Dino } from '../lib/dinos';
import { DinoArt } from '../components/DinoArt';
import { EggIncubationBar } from '../components/EggIncubationBar';
import { CheckpointBanner } from '../components/CheckpointBanner';
import { publicAssetUrl } from '../lib/assets';
import { playTap } from '../lib/audio';
import type { Puzzle } from '../lib/puzzles';
import { TenFrame } from '../components/TenFrame';

/* ─── scene token types ─────────────────────────────────────── */

type SceneTokenKind = 'dino' | 'shell' | 'volcano' | 'snow' | 'egg' | 'wave' | 'flame' | 'crystal';

const TOKEN_KINDS: SceneTokenKind[] = ['dino', 'shell', 'volcano', 'snow'];
const SUBTRACT_KINDS: SceneTokenKind[] = ['egg', 'wave', 'flame', 'crystal'];

type TokenDino = Pick<Dino, 'name' | 'emoji' | 'art'>;

function SceneToken({ kind, faded = false, tokenDino }: { kind: SceneTokenKind; faded?: boolean; tokenDino?: TokenDino }) {
  const baseClass = faded ? 'opacity-25 grayscale' : 'opacity-100';
  const wrapperClass = 'relative inline-flex h-12 w-14 items-center justify-center';

  if (kind === 'dino') {
    if (tokenDino) {
      return (
        <span data-testid="math-scene-item" className={`${wrapperClass} ${baseClass}`}>
          <DinoArt dino={tokenDino} decorative className="h-10 w-10 object-contain" />
        </span>
      );
    }
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

function TokenRow({ count, kind, fadedFrom = count, label, tokenDino }: {
  count: number; kind: SceneTokenKind; fadedFrom?: number; label: string; tokenDino?: TokenDino;
}) {
  return (
    <div data-testid="math-token-row" aria-label={label} className="flex max-w-[340px] flex-wrap justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SceneToken key={i} kind={kind} faded={i >= fadedFrom} tokenDino={tokenDino} />
      ))}
    </div>
  );
}

/** Counting shown in groups of 5 for easier subitising */
function GroupedCounting({ count, kind, tokenDino }: { count: number; kind: SceneTokenKind; tokenDino?: TokenDino }) {
  const groups: number[] = [];
  let remaining = count;
  while (remaining > 0) { groups.push(Math.min(5, remaining)); remaining -= 5; }
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {groups.map((size, gi) => (
        <div key={gi} className="flex gap-1 rounded-2xl bg-white/40 px-2 py-1.5">
          {Array.from({ length: size }).map((_, i) => <SceneToken key={i} kind={kind} tokenDino={tokenDino} />)}
        </div>
      ))}
    </div>
  );
}

function CompareGroup({ count, kind, label, tokenDino }: { count: number; kind: SceneTokenKind; label: string; tokenDino?: TokenDino }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-3xl bg-white/25 px-3 py-3 shadow-inner">
      <p className="text-4xl font-black leading-none text-white drop-shadow sm:text-5xl">{label}</p>
      <TokenRow count={count} kind={kind} label={`${count} island items`} tokenDino={tokenDino} />
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

function MathVisualScene({ puzzle, tokenKind, subtractKind, tokenDino }: {
  puzzle: Puzzle; tokenKind: SceneTokenKind; subtractKind: SceneTokenKind; tokenDino?: TokenDino;
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
        <GroupedCounting count={count} kind={tokenKind} tokenDino={tokenDino} />
      </div>
    );
  }

  if (puzzle.type === 'fill-to-ten' && puzzle.filledCount !== undefined) {
    return (
      <div
        data-testid="math-visual-scene"
        aria-label={`Ten frame showing ${puzzle.filledCount} filled cells`}
        className="w-full max-w-lg rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-6 py-6 shadow-inner"
      >
        <p className="mb-3 text-center text-sm font-black uppercase tracking-wide text-emerald-700">
          Fill to 10 🪣
        </p>
        <TenFrame filled={puzzle.filledCount} theme="green" className="mx-auto max-w-[240px]" />
      </div>
    );
  }

  if ((puzzle.type === 'addition' || puzzle.type === 'word-problem') && puzzle.operands && puzzle.display.includes('+')) {
    const [a, b] = puzzle.operands;
    const total = a + b;
    if (total <= 10) {
      return (
        <div
          data-testid="math-visual-scene"
          aria-label="Dino Island ten-frame addition scene"
          className="flex w-full max-w-lg flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
        >
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">
            <span className="text-emerald-600">●</span> {a} &nbsp;+&nbsp; <span className="text-sky-500">●</span> {b}
          </p>
          <TenFrame filled={a} secondaryFilled={b} theme="green" className="mx-auto max-w-[260px]" />
        </div>
      );
    }
    return (
      <div
        data-testid="math-visual-scene"
        aria-label="Dino Island two-group counting scene"
        className="flex w-full max-w-lg flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <TokenRow count={a} kind={tokenKind} label={`${a} items in the first group`} tokenDino={tokenDino} />
        <span className="rounded-full bg-white/85 px-3 py-1 text-2xl font-black text-emerald-800 shadow-sm">+</span>
        <TokenRow count={b} kind={subtractKind} label={`${b} items in the second group`} />
      </div>
    );
  }

  if ((puzzle.type === 'subtraction' || puzzle.type === 'word-problem') && puzzle.operands && puzzle.display.includes('−')) {
    const [a, b] = puzzle.operands;
    if (a <= 10) {
      const remaining = a - b;
      return (
        <div
          data-testid="math-visual-scene"
          aria-label="Dino Island ten-frame subtraction scene"
          className="flex w-full max-w-lg flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
        >
          <p className="text-sm font-black uppercase tracking-wide text-rose-600">
            {a} started — {b} went away
          </p>
          <TenFrame filled={remaining} crossed={b} theme="rose" className="mx-auto max-w-[260px]" />
        </div>
      );
    }
    return (
      <div
        data-testid="math-visual-scene"
        aria-label="Dino Island taking-away scene"
        className="flex w-full max-w-lg flex-col items-center gap-4 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wide text-emerald-700">started with</span>
          <TokenRow count={a} kind={tokenKind} label={`${a} items to start`} tokenDino={tokenDino} />
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
          <CompareGroup count={puzzle.operands[0]} kind={tokenKind} label={puzzle.operands[0].toString()} tokenDino={tokenDino} />
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

/* ─── confetti ────────────────────────────────────────────────── */

const CONFETTI_EMOJIS = ['⭐', '🌟', '✨', '🥚', '🦕', '🌿', '🌸', '💛', '🎉'];

interface ConfettiParticle {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
}

function generateParticles(count: number): ConfettiParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
    left: 5 + Math.random() * 88,
    delay: Math.random() * 0.6,
    duration: 1.2 + Math.random() * 0.8
  }));
}

function ConfettiBurst({ count = 20 }: { count?: number }) {
  const particles = useMemo(() => generateParticles(count), [count]);
  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 text-2xl"
          style={{
            left: `${p.left}%`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s linear forwards`
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function CelebrationOverlay({ onDone }: { onDone: () => void }) {
  const particles = useMemo(() => generateParticles(30), []);

  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {/* Frosted flash */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-white"
      />
      {/* Bouncing centre badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="rounded-[2rem] bg-white/90 px-10 py-6 shadow-2xl text-center">
          <p className="text-[5rem] leading-none">🎉</p>
          <p className="mt-2 text-2xl font-black text-emerald-700">Amazing!</p>
          <p className="text-base font-bold text-slate-500">5 in a row!</p>
        </div>
      </motion.div>
      {/* Emoji rain */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 text-3xl"
          style={{
            left: `${p.left}%`,
            animation: `confetti-fall ${p.duration + 0.5}s ${p.delay}s linear forwards`
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

/* ─── helpers ─────────────────────────────────────────────────── */

/** The dino still to be found, or null once every one of them is unlocked. */
function getNextDino(totalCorrect: number) {
  return DINOS.find((dino) => dino.unlockAt > totalCorrect) ?? null;
}

/** Stable numeric hash of a string, suitable for picking a list index. */
function stableHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const BUTTON_PASTEL_BASE = [
  'bg-blue-100  text-blue-900  border-blue-300  shadow-[0_5px_0_0_#93c5fd]  active:shadow-none active:translate-y-[5px]',
  'bg-amber-100 text-amber-900 border-amber-300 shadow-[0_5px_0_0_#fcd34d] active:shadow-none active:translate-y-[5px]',
  'bg-rose-100  text-rose-900  border-rose-300  shadow-[0_5px_0_0_#fca5a5] active:shadow-none active:translate-y-[5px]'
];

/* ─── main component ─────────────────────────────────────────── */

export function PuzzleScreen() {
  const { state, puzzle, answerPuzzle, goToScreen, celebrationPending, clearCelebration, newPuzzle } = useGame();
  const biome = BIOMES[state.currentBiome];

  // Puzzles are generated on navigation, not persisted. Reopening the app on
  // this screen therefore arrived with none, and the loading dino below bounced
  // forever with no way to answer anything.
  useEffect(() => {
    if (!puzzle) newPuzzle();
  }, [puzzle, newPuzzle]);

  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCheckpoint, setShowCheckpoint] = useState(false);

  useEffect(() => {
    setWrongIds(new Set());
    setShakingId(null);
    setIsCorrect(false);
    setShowEncouragement(false);
    setShowConfetti(false);
  }, [puzzle]);

  // Small confetti burst on every correct answer
  useEffect(() => {
    if (!isCorrect) return;
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(t);
  }, [isCorrect]);

  // Big celebration every 5 correct
  const handleCelebrationDone = useCallback(() => {
    setShowCelebration(false);
  }, []);

  useEffect(() => {
    if (celebrationPending) {
      setShowCelebration(true);
      clearCelebration();
    }
  }, [celebrationPending, clearCelebration]);

  const handleSelect = useCallback(
    (id: string, correct: boolean) => {
      if (isCorrect || wrongIds.has(id)) return;
      playTap();

      if (correct) {
        setIsCorrect(true);
        setShowCheckpoint(false);
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
        style={biomeBackground(biome, publicAssetUrl)}
      >
        <span className="animate-bounce text-6xl">🦕</span>
      </div>
    );
  }

  const tokenKind = TOKEN_KINDS[state.currentBiome] ?? 'dino';
  const subtractKind = SUBTRACT_KINDS[state.currentBiome] ?? 'egg';
  const nextDino = getNextDino(state.totalCorrect);

  // Biome companion dino — changes per biome, not based on unlock progress.
  const companionDino = DINOS.find((d) => d.id === biome.companionDinoId) ?? null;

  // Unlocked dinos for counting tokens — stable set.
  const unlockedDinos = DINOS.filter((d) => d.unlockAt <= state.totalCorrect);

  // Stable per-puzzle dino for counting tokens — rotates through unlocked collection.
  const puzzleKey = puzzle.prompt + puzzle.type;
  const tokenDino: TokenDino | undefined =
    unlockedDinos.length > 0
      ? unlockedDinos[stableHash(puzzleKey) % unlockedDinos.length]
      : undefined;

  const previousUnlockAt = [...DINOS].reverse().find((dino) => dino.unlockAt <= state.totalCorrect)?.unlockAt ?? 0;
  // Past the last unlock there is nothing left to fill toward, so the bar reads full.
  const progressSpan = Math.max(1, (nextDino?.unlockAt ?? 0) - previousUnlockAt);
  const answersRemaining = nextDino ? Math.max(0, nextDino.unlockAt - state.totalCorrect) : 0;

  // Next biome to unlock — shown alongside the dino in CheckpointBanner when they coincide.
  const nextBiome = nextDino
    ? (BIOMES.find((b) => b.threshold === nextDino.unlockAt) ?? null)
    : null;

  // Show checkpoint banner when player is close (≤5) to the next milestone.
  useEffect(() => {
    if (nextDino && answersRemaining > 0 && answersRemaining <= 5) {
      setShowCheckpoint(true);
    } else {
      setShowCheckpoint(false);
    }
  }, [nextDino, answersRemaining]);

  const isWordProblem = puzzle.type === 'word-problem';

  return (
    <div
      className="absolute inset-0 flex w-full flex-col overflow-y-auto pt-20 sm:pt-24"
      style={biomeBackground(biome, publicAssetUrl)}
    >
      {/* Confetti & celebration overlays */}
      {showConfetti && <ConfettiBurst count={20} />}
      {showCelebration && <CelebrationOverlay onDone={handleCelebrationDone} />}

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 pb-4 sm:px-5">

        {/* Speech bubble prompt + companion + home button */}
        <div className="flex items-start gap-2">
          {/* Bubble */}
          <div className="relative flex-1 min-w-0 rounded-3xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
            <p className={`font-black leading-snug text-slate-800 ${isWordProblem ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
              {puzzle.prompt}
            </p>
          </div>
          {/* Per-biome companion dino — sits between bubble and Home */}
          {companionDino ? (
            <motion.div
              className="flex-shrink-0 mt-1"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <DinoArt dino={companionDino} decorative className="h-12 w-12 object-contain drop-shadow-md" />
            </motion.div>
          ) : (
            <span className="flex-shrink-0 text-3xl leading-none mt-1" aria-hidden="true">🦕</span>
          )}
          <button
            type="button"
            onClick={() => goToScreen('home')}
            data-testid="button-math-home"
            className="flex-shrink-0 min-h-[56px] rounded-3xl bg-white/95 px-4 py-3 text-base font-black text-slate-700 shadow-lg active:scale-95"
          >
            Home
          </button>
        </div>

        {/* Visual scene */}
        <motion.div
          key={puzzle.prompt + puzzle.type}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.45 }}
          className="flex flex-col items-center gap-3 text-white"
        >
          {/* Equation display for non-word-problem math */}
          {(puzzle.type === 'addition' || puzzle.type === 'subtraction' || puzzle.type === 'fill-to-ten') && (
            <div className="text-[3.5rem] font-bold leading-none tracking-wide drop-shadow-lg sm:text-[4.5rem]">
              {puzzle.display}
            </div>
          )}
          <MathVisualScene puzzle={puzzle} tokenKind={tokenKind} subtractKind={subtractKind} tokenDino={tokenDino} />
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

        {/* Egg incubation bar — always visible above answers */}
        <EggIncubationBar
          nextDino={nextDino}
          answersRemaining={answersRemaining}
          totalToUnlock={progressSpan}
        />

        {/* Answer buttons — pill shapes, pastel tints */}
        <div className="grid w-full grid-cols-3 gap-2 sm:gap-3">
          {puzzle.options.map((opt, idx) => {
            const isWrong = wrongIds.has(opt.id);
            const isThisCorrect = isCorrect && opt.isCorrect;

            let btnClass = `${BUTTON_PASTEL_BASE[idx % 3]} border-4 transition-all`;
            if (isWrong) btnClass = 'bg-slate-200 text-slate-400 border-4 border-slate-200 opacity-50 cursor-not-allowed shadow-none';
            if (isThisCorrect) btnClass = 'bg-green-400 text-white border-4 border-green-300 shadow-[0_5px_0_0_#16a34a] scale-105';

            return (
              <motion.button
                key={opt.id}
                data-testid={`button-answer-${opt.id}`}
                animate={shakingId === opt.id ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                onClick={() => handleSelect(opt.id, opt.isCorrect)}
                disabled={isWrong || isCorrect}
                className={`flex min-h-[80px] w-full items-center justify-center rounded-full text-3xl font-black sm:min-h-[108px] sm:text-5xl ${btnClass}`}
              >
                {opt.label}
                {isThisCorrect && ' ✨'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Correct answer flash */}
      {isCorrect && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-2 rounded-[2rem] bg-white/20 px-10 py-6 backdrop-blur"
          >
            <span className="text-[6rem] leading-none">🎉</span>
            <p className="text-xl font-black text-white drop-shadow">
              {nextDino ? 'Keep going!' : `All ${DINOS.length} friends found! 🏆`}
            </p>
          </motion.div>
        </div>
      )}

      {/* Dual-milestone checkpoint banner */}
      <CheckpointBanner
        nextDino={nextDino}
        nextBiome={nextBiome}
        answersRemaining={answersRemaining}
        onDismiss={() => setShowCheckpoint(false)}
        visible={showCheckpoint && !isCorrect}
      />
    </div>
  );
}
