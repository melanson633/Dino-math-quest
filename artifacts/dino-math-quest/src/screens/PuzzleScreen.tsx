import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { BIOMES } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { playTap, playWordRhythm } from '../lib/audio';
import { getCompanion, pickCompanionActionVariant } from '../content/dinoIslandContent';
import { TriDino } from '../components/TriDino';
import type { Puzzle } from '../lib/puzzles';

type SceneTokenKind = 'dino' | 'shell' | 'volcano' | 'snow' | 'egg' | 'wave' | 'flame' | 'crystal';

const TOKEN_KINDS: SceneTokenKind[] = ['dino', 'shell', 'volcano', 'snow'];
const SUBTRACT_KINDS: SceneTokenKind[] = ['egg', 'wave', 'flame', 'crystal'];

function CountBadge({ label }: { label?: string }) {
  if (!label) return null;

  return (
    <span
      data-testid="math-count-badge"
      className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-200 px-1 text-xs font-black leading-none text-amber-950 shadow-sm ring-2 ring-white"
    >
      {label}
    </span>
  );
}

function SceneToken({ kind, faded = false, countLabel }: { kind: SceneTokenKind; faded?: boolean; countLabel?: string }) {
  const baseClass = faded ? 'opacity-25 grayscale' : 'opacity-100';
  const wrapperClass = 'relative inline-flex h-12 w-14 items-center justify-center';

  if (kind === 'dino') {
    return (
      <span
        data-testid="math-scene-item"
        data-count-index={countLabel}
        className={wrapperClass}
      >
        <span className={`relative h-9 w-12 rounded-[55%_45%_48%_52%] bg-emerald-300 shadow-inner ring-2 ring-emerald-700/15 ${baseClass}`}>
          <span className="absolute -right-2 top-2 h-4 w-5 rounded-full bg-emerald-200" />
          <span className="absolute -left-2 top-5 h-2 w-5 rotate-[-18deg] rounded-full bg-emerald-400" />
          <span className="absolute left-3 top-1 h-2 w-2 rounded-full bg-emerald-700/70" />
        </span>
        <CountBadge label={countLabel} />
      </span>
    );
  }

  if (kind === 'egg') {
    return (
      <span
        data-testid="math-scene-item"
        data-count-index={countLabel}
        className={wrapperClass}
      >
        <span className={`h-10 w-8 rounded-[55%_55%_48%_48%] bg-stone-50 shadow-inner ring-2 ring-amber-200 ${baseClass}`} />
        <CountBadge label={countLabel} />
      </span>
    );
  }

  if (kind === 'shell') {
    return (
      <span
        data-testid="math-scene-item"
        data-count-index={countLabel}
        className={wrapperClass}
      >
        <span className={`relative h-8 w-10 rounded-b-full rounded-t-[999px] bg-rose-200 shadow-inner ring-2 ring-rose-500/20 ${baseClass}`}>
          <span className="absolute left-2 top-1 h-6 w-1 rounded-full bg-rose-400/45" />
          <span className="absolute left-5 top-1 h-6 w-1 rounded-full bg-rose-400/45" />
          <span className="absolute left-8 top-1 h-6 w-1 rounded-full bg-rose-400/45" />
        </span>
        <CountBadge label={countLabel} />
      </span>
    );
  }

  if (kind === 'volcano') {
    return (
      <span
        data-testid="math-scene-item"
        data-count-index={countLabel}
        className={wrapperClass}
      >
        <span className={`relative h-10 w-11 rounded-b-md bg-stone-500 shadow-inner ring-2 ring-stone-900/15 [clip-path:polygon(50%_0,100%_100%,0_100%)] ${baseClass}`}>
          <span className="absolute left-[39%] top-2 h-2 w-3 rounded-full bg-orange-300" />
        </span>
        <CountBadge label={countLabel} />
      </span>
    );
  }

  if (kind === 'wave') {
    return (
      <span
        data-testid="math-scene-item"
        data-count-index={countLabel}
        className={wrapperClass}
      >
        <span className={`h-7 w-12 rounded-[999px_999px_35%_35%] bg-sky-300 shadow-inner ring-2 ring-sky-600/15 ${baseClass}`} />
        <CountBadge label={countLabel} />
      </span>
    );
  }

  if (kind === 'flame') {
    return (
      <span
        data-testid="math-scene-item"
        data-count-index={countLabel}
        className={wrapperClass}
      >
        <span className={`h-10 w-8 rotate-45 rounded-[75%_15%_75%_15%] bg-orange-300 shadow-inner ring-2 ring-orange-700/15 ${baseClass}`} />
        <CountBadge label={countLabel} />
      </span>
    );
  }

  if (kind === 'crystal') {
    return (
      <span
        data-testid="math-scene-item"
        data-count-index={countLabel}
        className={wrapperClass}
      >
        <span className={`h-10 w-8 rotate-45 rounded-md bg-cyan-200 shadow-inner ring-2 ring-cyan-700/15 ${baseClass}`} />
        <CountBadge label={countLabel} />
      </span>
    );
  }

  return (
    <span
      data-testid="math-scene-item"
      data-count-index={countLabel}
      className={wrapperClass}
    >
      <span className={`h-8 w-8 rounded-full bg-white/85 shadow-inner ring-2 ring-sky-200 ${baseClass}`} />
      <CountBadge label={countLabel} />
    </span>
  );
}

function TokenRow({
  count,
  kind,
  fadedFrom = count,
  startAt = 1,
  label
}: {
  count: number;
  kind: SceneTokenKind;
  fadedFrom?: number;
  startAt?: number;
  label: string;
}) {
  return (
    <div data-testid="math-token-row" aria-label={label} className="flex max-w-[300px] flex-wrap justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <SceneToken key={i} kind={kind} faded={i >= fadedFrom} countLabel={i < fadedFrom ? String(startAt + i) : undefined} />
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
        className="rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        <TokenRow count={count} kind={tokenKind} label={`${count} countable Dino Island items`} />
      </div>
    );
  }

  if ((puzzle.type === 'addition' || puzzle.type === 'subtraction') && puzzle.operands) {
    const [a, b] = puzzle.operands;
    return (
      <div
        data-testid="math-visual-scene"
        aria-label={puzzle.type === 'addition' ? 'Dino Island two-group counting scene' : 'Dino Island taking-away scene'}
        className="flex flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-b from-lime-100/95 to-emerald-200/90 px-5 py-5 shadow-inner"
      >
        {puzzle.type === 'addition' ? (
          <>
            <TokenRow count={a} kind={tokenKind} label={`${a} items in the first group`} />
            <span className="rounded-full bg-white/85 px-3 py-1 text-2xl font-black text-emerald-800 shadow-sm">+</span>
            <TokenRow count={b} kind={subtractKind} startAt={a + 1} label={`${b} items in the second group`} />
          </>
        ) : (
          <TokenRow count={a} kind={tokenKind} fadedFrom={a - b} label={`${a - b} items left from ${a}`} />
        )}
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

  return (
    <div
      data-testid="math-visual-scene"
      aria-label="Dino Island shape cave"
      className="max-w-full rounded-[2rem] bg-gradient-to-b from-cyan-100/95 to-indigo-200/90 px-6 py-4 text-[2.5rem] font-bold leading-tight text-slate-800 shadow-inner sm:text-[3.5rem]"
    >
      <span data-testid="math-scene-item">{puzzle.display}</span>
    </div>
  );
}

function getNextDino(totalCorrect: number) {
  return DINOS.find((dino) => dino.unlockAt > totalCorrect) ?? DINOS[DINOS.length - 1];
}

function getCompanionLine({
  companionLabel,
  companionVariantLabel,
  puzzleType,
  isSolo,
  isCorrect,
  showEncouragement
}: {
  companionLabel: string;
  companionVariantLabel?: string;
  puzzleType: string;
  isSolo: boolean;
  isCorrect: boolean;
  showEncouragement: boolean;
}) {
  if (isCorrect) return isSolo ? 'Tri says: you found it!' : `${companionLabel} says: you found it!`;
  if (showEncouragement) return isSolo ? 'Tri says: one more try.' : `${companionLabel} says: one more try.`;
  if (companionVariantLabel && !isSolo) return companionVariantLabel;

  const promptByType: Record<string, string> = {
    addition: 'Count both groups.',
    subtraction: 'Look at what is left.',
    counting: 'Touch each one with your eyes.',
    'missing-number': 'Say the numbers in order.',
    compare: 'Find the bigger number.',
    shapes: 'Look for the pattern.'
  };

  const prompt = promptByType[puzzleType] ?? 'Take your time.';
  return isSolo ? `Tri says: ${prompt}` : `${companionLabel} says: ${prompt}`;
}

function getMathBeatCount(puzzleType: string, display: string, operands?: number[]): number {
  if (operands && operands.length > 0) {
    return Math.min(4, Math.max(1, operands.reduce((sum, value) => sum + Math.min(value, 4), 0)));
  }
  if (puzzleType === 'missing-number') return 3;
  if (puzzleType === 'shapes') return Math.min(4, Math.max(2, display.split(/\s+/).filter(Boolean).length));
  return 3;
}

export function PuzzleScreen() {
  const { state, puzzle, answerPuzzle, goToScreen } = useGame();
  const biome = BIOMES[state.currentBiome];
  const companion = getCompanion(state.selectedCompanionId);
  const companionVariant = useMemo(() => {
    return pickCompanionActionVariant(companion, 'math');
  }, [companion]);

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

  const handleSelect = useCallback((id: string, correct: boolean) => {
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
  }, [isCorrect, wrongIds, answerPuzzle]);

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
  const correctTowardNextDino = Math.min(state.totalCorrect, nextDino.unlockAt);
  const previousUnlockAt = [...DINOS].reverse().find((dino) => dino.unlockAt <= state.totalCorrect)?.unlockAt ?? 0;
  const progressSpan = Math.max(1, nextDino.unlockAt - previousUnlockAt);
  const progressValue = Math.min(100, Math.max(0, ((correctTowardNextDino - previousUnlockAt) / progressSpan) * 100));
  const companionLine = getCompanionLine({
    companionLabel: companion.shortLabel,
    companionVariantLabel: companionVariant?.label,
    puzzleType: puzzle.type,
    isSolo: companion.id === 'none',
    isCorrect,
    showEncouragement
  });
  const mission = puzzle.mission ?? { icon: '🦕', title: 'Math Quest', cue: 'Pick the answer.' };
  const playMathRhythm = () => {
    playWordRhythm(getMathBeatCount(puzzle.type, puzzle.display, puzzle.operands));
  };

  return (
    <div
      className="absolute inset-0 flex w-full flex-col overflow-y-auto pt-20 sm:pt-24"
      style={{ background: `linear-gradient(to bottom, ${biome.colors.bgFrom}, ${biome.colors.bgTo})` }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 px-4 pb-4">
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

        <div className="grid gap-3 sm:grid-cols-[minmax(170px,220px)_1fr]">
          <aside className="flex min-h-[104px] items-center gap-3 rounded-3xl bg-white/80 p-3 text-slate-800 shadow-lg sm:flex-col sm:justify-center">
            <motion.div
              animate={isCorrect ? { y: [0, -10, 0], scale: [1, 1.05, 1] } : showEncouragement ? { rotate: [-2, 2, -1, 1, 0] } : {}}
              transition={{ duration: 0.45 }}
              className="flex h-20 w-24 shrink-0 items-center justify-center sm:h-32 sm:w-full"
            >
              {companionVariant?.asset ? (
                <img src={companionVariant.asset} alt="" className="h-full w-full object-contain" />
              ) : (
                <TriDino className="h-20 w-20 sm:h-32 sm:w-32" />
              )}
            </motion.div>
            <div className="min-w-0 text-left sm:text-center">
              <p className="text-lg font-black leading-tight sm:text-2xl">{companion.shortLabel}</p>
              <p className="mt-1 text-base font-bold leading-tight text-slate-600">{companionLine}</p>
              <div className="mt-3 rounded-2xl bg-white/75 p-2">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Next friend</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-2xl">{nextDino.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-slate-700">{nextDino.name}</p>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressValue}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={playMathRhythm}
                data-testid="button-math-rhythm"
                className="mt-3 min-h-[48px] w-full rounded-2xl bg-emerald-100 px-3 py-2 text-base font-black text-emerald-800 shadow-inner active:scale-95"
              >
                Count Beat
              </button>
            </div>
          </aside>

          <div className="flex min-h-0 flex-col items-center justify-center rounded-3xl bg-black/10 p-3">
            <motion.div
              key={puzzle.prompt + puzzle.type}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
              className="flex w-full flex-col items-center gap-3 text-center text-white"
            >
              <div
                data-testid="math-mission"
                aria-label="Math mission"
                className="flex w-full max-w-lg items-center gap-3 rounded-2xl bg-white/90 px-3 py-2 text-left text-slate-800 shadow-sm"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-3xl"
                  aria-hidden="true"
                >
                  {mission.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-black leading-tight sm:text-lg">{mission.title}</p>
                  <p className="text-sm font-bold leading-tight text-slate-600 sm:text-base">{mission.cue}</p>
                </div>
              </div>

              {(puzzle.type === 'addition' || puzzle.type === 'subtraction') && (
                <>
                  <div className="text-[4.25rem] font-bold leading-none tracking-wide drop-shadow-lg sm:text-[5.5rem]">
                    {puzzle.display}
                  </div>
                  <MathVisualScene puzzle={puzzle} tokenKind={tokenKind} subtractKind={subtractKind} />
                </>
              )}

              {puzzle.type !== 'addition' && puzzle.type !== 'subtraction' && (
                <MathVisualScene puzzle={puzzle} tokenKind={tokenKind} subtractKind={subtractKind} />
              )}

              <div
                data-testid="math-context-cues"
                aria-label="Math clues"
                className="flex w-full max-w-lg flex-wrap justify-center gap-2 rounded-2xl bg-white/20 px-3 py-2"
              >
                {puzzle.childHints.slice(0, 3).map((hint) => (
                  <span
                    key={hint}
                    className="rounded-full bg-white/95 px-3 py-1 text-sm font-black leading-tight text-slate-700 shadow-sm sm:text-base"
                  >
                    {hint}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

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
                className={`flex min-h-[64px] w-full items-center justify-center rounded-3xl text-3xl font-black shadow-lg transition-all sm:min-h-[104px] sm:text-5xl ${btnClass}`}
              >
                {opt.label}
                {isThisCorrect && ' ✨'}
              </motion.button>
            );
          })}
        </div>
      </div>

      {isCorrect && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1] }}
            transition={{ duration: 0.4 }}
            className="rounded-full bg-white/20 px-8 py-4 text-[7rem] backdrop-blur"
          >
            🎉
          </motion.div>
        </div>
      )}
    </div>
  );
}
