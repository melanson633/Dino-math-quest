import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES, biomeBackground } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { DinoArt } from '../components/DinoArt';
import { publicAssetUrl } from '../lib/assets';
import { playTap } from '../lib/audio';
import type { Puzzle } from '../lib/puzzles';
import { TenFrame } from '../components/TenFrame';

/* ─── scene tokens ──────────────────────────────────────────── */

/**
 * Counting tokens are the authored dino portraits from public/dinos, paired
 * per biome: [main counting dino, second-group dino]. Real art reads far
 * better than the abstract CSS blobs it replaced.
 */
const SCENE_DINO_IDS: [string, string][] = [
  ['stego', 'ankylo'],  // jungle
  ['plesi', 'ptero'],   // beach
  ['trex', 'raptor'],   // volcano
  ['mammo', 'spino'],   // ice cave
];

function sceneDinoArt(id: string): string {
  return `/dinos/${id}.svg`;
}

function SceneToken({ art, gone = false }: { art: string; gone?: boolean }) {
  return (
    <span data-testid="math-scene-item" className="relative inline-flex h-14 w-14 items-center justify-center md:h-20 md:w-20">
      <img
        src={publicAssetUrl(art)}
        alt=""
        draggable={false}
        className={`h-full w-full ${gone ? 'opacity-40' : 'drop-shadow-sm'}`}
      />
      {/* "Gone" stays clearly visible — a bold cross over full-colour art,
          not the near-invisible grey wash it used to be. */}
      {gone && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-4xl font-black text-rose-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
          ✕
        </span>
      )}
    </span>
  );
}

function TokenRow({ count, art, goneFrom = count, label }: {
  count: number; art: string; goneFrom?: number; label: string;
}) {
  return (
    <div data-testid="math-token-row" aria-label={label} className="flex max-w-[420px] flex-wrap justify-center gap-2 md:max-w-[560px]">
      {Array.from({ length: count }).map((_, i) => (
        <SceneToken key={i} art={art} gone={i >= goneFrom} />
      ))}
    </div>
  );
}

/** Counting shown in groups of 5 for easier subitising */
function GroupedCounting({ count, art }: { count: number; art: string }) {
  const groups: number[] = [];
  let remaining = count;
  while (remaining > 0) { groups.push(Math.min(5, remaining)); remaining -= 5; }
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {groups.map((size, gi) => (
        <div key={gi} className="flex gap-1 rounded-2xl bg-white/40 px-2 py-1.5">
          {Array.from({ length: size }).map((_, i) => <SceneToken key={i} art={art} />)}
        </div>
      ))}
    </div>
  );
}

function CompareGroup({ count, art, label }: { count: number; art: string; label: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-3xl bg-white/25 px-3 py-3 shadow-inner">
      <p className="text-4xl font-black leading-none text-white drop-shadow sm:text-5xl">{label}</p>
      <TokenRow count={count} art={art} label={`${count} island items`} />
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

function MathVisualScene({ puzzle, primaryArt, secondaryArt }: {
  puzzle: Puzzle; primaryArt: string; secondaryArt: string;
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
        <GroupedCounting count={count} art={primaryArt} />
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
        <p className="mb-3 text-center text-xl font-black uppercase tracking-wide text-emerald-700">
          Fill to 10 🌟
        </p>
        <TenFrame filled={puzzle.filledCount} theme="green" className="mx-auto w-full max-w-[300px] md:max-w-[380px]" />
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
          <p className="text-xl font-black uppercase tracking-wide text-emerald-800">
            <span className="text-emerald-500">●</span> {a} &nbsp;+&nbsp; <span className="text-sky-500">●</span> {b}
          </p>
          <TenFrame filled={a} secondaryFilled={b} theme="green" className="mx-auto w-full max-w-[300px] md:max-w-[380px]" />
        </div>
      );
    }
    return (
      <div
        data-testid="math-visual-scene"
        aria-label="Dino Island two-group counting scene"
        className="flex w-full max-w-lg flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-3xl font-black text-emerald-800 shadow-sm">{a}</span>
          <TokenRow count={a} art={primaryArt} label={`${a} items in the first group`} />
        </div>
        <span className="rounded-full bg-white/90 px-4 py-1 text-3xl font-black text-emerald-800 shadow-sm">+</span>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-3xl font-black text-sky-700 shadow-sm">{b}</span>
          <TokenRow count={b} art={secondaryArt} label={`${b} items in the second group`} />
        </div>
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
          <p className="text-xl font-black uppercase tracking-wide text-rose-600">
            {a} started — {b} went away
          </p>
          <TenFrame filled={remaining} crossed={b} theme="rose" className="mx-auto w-full max-w-[300px] md:max-w-[380px]" />
        </div>
      );
    }
    // One group of `a` with the last `b` crossed out. Showing "started" and
    // "gone" as two separate rows put a + b dinos on screen for an a − b
    // question — the child had more to count than the story contained.
    return (
      <div
        data-testid="math-visual-scene"
        aria-label="Dino Island taking-away scene"
        className="flex w-full max-w-lg flex-col items-center gap-4 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-lg font-black uppercase tracking-wide text-emerald-800 shadow-sm">{a} started</span>
          <span className="rounded-full bg-rose-200/90 px-4 py-1.5 text-lg font-black uppercase tracking-wide text-rose-700 shadow-sm">{b} went away ✕</span>
        </div>
        <TokenRow count={a} art={primaryArt} goneFrom={a - b} label={`${a} items, ${b} crossed out`} />
      </div>
    );
  }

  if (puzzle.type === 'compare' && puzzle.operands) {
    return (
      <div data-testid="math-visual-scene" aria-label="Dino Island compare scene" className="w-full max-w-lg">
        <div className="mb-2 flex justify-center">
          <span className="rounded-full bg-slate-900/35 px-5 py-2 text-2xl font-black text-white backdrop-blur-sm sm:text-3xl">Which pile has more?</span>
        </div>
        <div className="flex w-full items-stretch justify-center gap-3">
          <CompareGroup count={puzzle.operands[0]} art={primaryArt} label={puzzle.operands[0].toString()} />
          <CompareGroup count={puzzle.operands[1]} art={secondaryArt} label={puzzle.operands[1].toString()} />
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

const BUTTON_PASTEL_BASE = [
  'bg-blue-100  text-blue-900  border-blue-300  shadow-[0_5px_0_0_#93c5fd]  active:shadow-none active:translate-y-[5px]',
  'bg-amber-100 text-amber-900 border-amber-300 shadow-[0_5px_0_0_#fcd34d] active:shadow-none active:translate-y-[5px]',
  'bg-rose-100  text-rose-900  border-rose-300  shadow-[0_5px_0_0_#fca5a5] active:shadow-none active:translate-y-[5px]'
];

/* ─── main component ─────────────────────────────────────────── */

export function PuzzleScreen() {
  const { state, puzzle, answerPuzzle, goToScreen, celebrationPending, clearCelebration, newPuzzle } = useGame();
  // The scenery tours every world: after each 6 correct answers the backdrop
  // moves on, so a long session keeps changing view instead of sitting in the
  // jungle. Collection unlocks still key off state.currentBiome.
  const sceneBiomeIndex = Math.floor(state.totalCorrect / 6) % BIOMES.length;
  const biome = BIOMES[sceneBiomeIndex];
  const [primaryDinoId, secondaryDinoId] = SCENE_DINO_IDS[sceneBiomeIndex] ?? SCENE_DINO_IDS[0];
  const speakerDino = DINOS.find((d) => d.id === primaryDinoId);

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

  const nextDino = getNextDino(state.totalCorrect);
  const previousUnlockAt = [...DINOS].reverse().find((dino) => dino.unlockAt <= state.totalCorrect)?.unlockAt ?? 0;
  // Past the last unlock there is nothing left to fill toward, so the bar reads
  // full. It used to point at the final dino and sit at 0% forever.
  const progressSpan = Math.max(1, (nextDino?.unlockAt ?? 0) - previousUnlockAt);
  const correctTowardNextDino = Math.min(state.totalCorrect, nextDino?.unlockAt ?? state.totalCorrect);
  const progressValue = nextDino
    ? Math.min(100, Math.max(0, ((correctTowardNextDino - previousUnlockAt) / progressSpan) * 100))
    : 100;

  const isWordProblem = puzzle.type === 'word-problem';

  return (
    <div
      className="absolute inset-0 flex w-full flex-col overflow-y-auto pt-20 sm:pt-24"
      style={biomeBackground(biome, publicAssetUrl)}
    >
      {/* Confetti & celebration overlays */}
      {showConfetti && <ConfettiBurst count={20} />}
      {showCelebration && <CelebrationOverlay onDone={handleCelebrationDone} />}

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pb-4 sm:px-5">

        {/* Speech bubble prompt + home button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 items-start gap-3">
            {/* The scene's dino asks the question — real art, not an emoji */}
            <DinoArt dino={speakerDino} decorative className="mt-1 h-14 w-14 flex-shrink-0 drop-shadow-md" />
            {/* Bubble */}
            <div className="relative flex-1 rounded-3xl rounded-tl-sm bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              {/* Triangle pointer */}
              <div
                className="absolute -left-3 top-4 h-0 w-0"
                style={{ borderTop: '8px solid transparent', borderRight: '14px solid rgba(255,255,255,0.95)', borderBottom: '8px solid transparent' }}
              />
              <p className={`font-black leading-snug text-slate-800 ${isWordProblem ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
                {puzzle.prompt}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => goToScreen('home')}
            data-testid="button-math-home"
            className="flex-shrink-0 min-h-[56px] rounded-3xl bg-white/95 px-4 py-3 text-base font-black text-slate-700 shadow-lg active:scale-95"
          >
            Home
          </button>
        </div>

        {/* Scene + answers: stacked on phones, side by side on iPad so the
            whole puzzle fits without scrolling. */}
        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-6">

          {/* Visual scene */}
          <motion.div
            key={puzzle.prompt + puzzle.type}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.35, duration: 0.45 }}
            className="flex flex-col items-center gap-3 text-white md:flex-1"
          >
            {/* Equation display for non-word-problem math — on a dark chip so
                it stays readable over the light beach and ice backdrops */}
            {(puzzle.type === 'addition' || puzzle.type === 'subtraction' || puzzle.type === 'fill-to-ten') && (
              <div className="rounded-[2rem] bg-slate-900/30 px-8 py-2 text-[3.5rem] font-bold leading-none tracking-wide backdrop-blur-sm sm:text-[4.5rem]">
                {puzzle.display}
              </div>
            )}
            <MathVisualScene puzzle={puzzle} primaryArt={sceneDinoArt(primaryDinoId)} secondaryArt={sceneDinoArt(secondaryDinoId)} />
          </motion.div>

          <div className="flex flex-col gap-2 md:w-60 md:flex-shrink-0">
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

            {/* Answer buttons — pill shapes, pastel tints */}
            <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 md:grid-cols-1">
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
                    className={`flex min-h-[80px] w-full items-center justify-center rounded-full text-3xl font-black sm:min-h-[96px] sm:text-5xl ${btnClass}`}
                  >
                    {opt.label}
                    {isThisCorrect && ' ✨'}
                  </motion.button>
                );
              })}
            </div>
          </div>
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
              {nextDino ? (
                <>
                  <DinoArt dino={nextDino} decorative className="h-8 w-8" />
                  <p className="text-base font-black">{nextDino.name}</p>
                </>
              ) : (
                <p className="text-base font-black">All {DINOS.length} friends found!</p>
              )}
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
