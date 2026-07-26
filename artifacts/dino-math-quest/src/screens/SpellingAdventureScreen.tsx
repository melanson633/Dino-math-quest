import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { dinoIslandContent, SpellingWordContent, WORD_FAMILIES, WordFamilyContent } from '../content/dinoIslandContent';
import { playCorrect, playTap } from '../lib/audio';
import { shuffle } from '../lib/puzzles';

/* ─── types & constants ─────────────────────────────────────── */

type SpellingMode = 'letter-build' | 'word-family' | 'first-sound';

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
/** Letters offered per round. Grows if a word has more distinct letters. */
const TRAY_SIZE = 12;
const MODES: SpellingMode[] = ['letter-build', 'word-family', 'first-sound'];

/* ─── letter button ─────────────────────────────────────────── */

function LetterButton({
  letter,
  onClick,
  disabled = false,
  size = 'normal',
  correct = false,
  wrong = false
}: {
  letter: string;
  onClick: () => void;
  disabled?: boolean;
  size?: 'normal' | 'large';
  correct?: boolean;
  wrong?: boolean;
}) {
  // Every key looks the same on purpose. Vowels used to be amber, and a tray
  // with a single vowel read as "this one is the answer" (or a stuck-selected
  // key) instead of a colour scheme.
  let base = 'bg-white text-slate-800 border-slate-200 shadow-[0_4px_0_0_#cbd5e1]';

  if (correct) base = 'bg-green-400 text-white border-green-300 shadow-[0_4px_0_0_#16a34a] scale-110';
  if (wrong)   base = 'bg-red-300 text-white border-red-200 opacity-60 shadow-none';
  if (disabled && !correct && !wrong) base += ' opacity-40 cursor-not-allowed shadow-none';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      data-testid={`button-spelling-letter-${letter}`}
      className={`flex items-center justify-center rounded-3xl border-2 font-black transition-all active:shadow-none active:translate-y-1 ${
        size === 'large' ? 'text-5xl py-5 px-4 min-h-[88px]' : 'aspect-square text-2xl'
      } ${base}`}
    >
      {letter}
    </button>
  );
}

/* ─── phonics badge ─────────────────────────────────────────── */

function PhonicsBadge({ sound, pulse }: { sound: string; pulse: boolean }) {
  // Text-only: the speaker glyph promised audio the app does not play.
  return (
    <motion.div
      animate={pulse ? { scale: [1, 1.25, 1] } : {}}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center rounded-full bg-violet-100 px-6 py-2.5 text-2xl font-black text-violet-700 shadow-inner"
    >
      {sound}
    </motion.div>
  );
}

/* ─── letter build mode (original) ─────────────────────────── */

function LetterBuildRound({
  word,
  sound,
  onComplete,
  onError
}: {
  word: SpellingWordContent;
  sound: string;
  onComplete: () => void;
  onError: () => void;
}) {
  const [letters, setLetters] = useState<string[]>([]);
  const [message, setMessage] = useState('Tap the letters in order.');
  const [phonicsPulse, setPhoncisPulse] = useState(false);
  const [stampComplete, setStampComplete] = useState(false);

  const choices = useMemo(() => {
    // Reserve the answer's letters FIRST, then fill the remaining slots with
    // distractors. Slicing a shuffled pool of all 26 letters — as this did
    // before — dropped required letters past index 12, leaving a tray the word
    // could not be spelled from. For a four-distinct-letter word only about 4%
    // of trays were solvable.
    const required = Array.from(new Set(word.word.split('')));
    const distractors = shuffle(ALL_LETTERS.filter((l) => !required.includes(l)));
    const traySize = Math.max(TRAY_SIZE, required.length);
    return shuffle([...required, ...distractors.slice(0, traySize - required.length)]);
  }, [word.word]);

  const built = letters.join('');
  const complete = built === word.word;
  const wordColumns = Math.min(word.word.length, 6);

  const tapLetter = (letter: string) => {
    playTap();
    const next = [...letters, letter].slice(0, word.word.length);
    setLetters(next);
    const nextBuilt = next.join('');

    if (word.word.startsWith(nextBuilt)) {
      if (nextBuilt === word.word) {
        playCorrect();
        setMessage(`${word.sayPrompt}!`);
        // Trigger stamp animation
        setStampComplete(true);
        // Pulse phonics badge on correct letter
        setPhoncisPulse(true);
        setTimeout(() => setPhoncisPulse(false), 500);
      } else {
        setMessage('Keep going!');
        // Pulse on correct letter tap
        const nextLetterIdx = nextBuilt.length - 1;
        const expectedLetter = word.word[nextLetterIdx];
        if (letter === expectedLetter) {
          setPhoncisPulse(true);
          setTimeout(() => setPhoncisPulse(false), 500);
        }
      }
      return;
    }

    setMessage('Good try. The boxes will clear.');
    setTimeout(() => {
      setLetters([]);
      setStampComplete(false);
      setMessage('Tap the letters in order.');
      onError();
    }, 650);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Phonics badge */}
      <div className="flex justify-center">
        <PhonicsBadge sound={sound} pulse={phonicsPulse} />
      </div>

      {/* Letter build boxes */}
      <div className="rounded-[28px] border-4 border-white bg-white/90 p-3 shadow-xl sm:p-4">
        <div
          className="mb-3 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${wordColumns}, minmax(0, 1fr))` }}
        >
          {word.word.split('').map((_, index) => (
            <motion.div
              key={index}
              animate={stampComplete ? {
                scale: [1, 1.4, 1],
                rotate: [0, -8, 8, 0]
              } : {}}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className={`flex aspect-square items-center justify-center rounded-3xl text-3xl font-black shadow-inner sm:text-[2.25rem] ${
                stampComplete
                  ? 'bg-emerald-400 text-white'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {letters[index] ?? ''}
            </motion.div>
          ))}
        </div>
        <p className="min-h-7 text-center text-lg font-black text-slate-700 sm:text-xl">{message}</p>
      </div>

      {/* Letter keyboard — 6 columns on tablet keeps 12 letters in two even rows */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5">
        {choices.map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            onClick={() => !complete && tapLetter(letter)}
            disabled={complete}
          />
        ))}
      </div>

      {/* Next button pops in only once the word is built — a permanent greyed
          bar just read as something broken. Reserve its height so the layout
          doesn't jump. */}
      <div className="min-h-[64px]">
        {complete && (
          <motion.button
            type="button"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
            onClick={onComplete}
            data-testid="button-spelling-next"
            className="w-full rounded-3xl bg-emerald-500 px-5 py-4 text-2xl font-black text-white shadow-lg active:scale-95"
          >
            Next Word 🌟
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ─── word-family mode ──────────────────────────────────────── */

function WordFamilyRound({
  family,
  onComplete,
  onError
}: {
  family: WordFamilyContent;
  onComplete: () => void;
  onError: () => void;
}) {
  // Pick one word from the family as the target
  const { targetWord, options } = useMemo(() => {
    const shuffledWords = shuffle(family.words);
    const target = shuffledWords[0];

    // Distractors: other families' words
    const otherFamilies = WORD_FAMILIES.filter((f) => f.id !== family.id);
    const distractors = shuffle(otherFamilies.flatMap((f) => f.words)).slice(0, 2);

    const opts = shuffle([
      { label: target.word, isCorrect: true },
      ...distractors.map((d) => ({ label: d.word, isCorrect: false }))
    ]);

    return { targetWord: target, options: opts };
  }, [family]);

  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('Tap the right spelling!');

  const handlePick = (label: string, isCorrect: boolean) => {
    if (selected) return;
    playTap();
    setSelected(label);
    if (isCorrect) {
      playCorrect();
      setTimeout(onComplete, 900);
    } else {
      // Stay on this word: record the miss, then invite another try in place.
      setTimeout(() => {
        setSelected(null);
        setMessage('Good try. Pick one more! ⭐');
        onError();
      }, 900);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Rime header */}
      <div className="rounded-3xl bg-sky-100 border-4 border-sky-200 p-3 text-center shadow">
        <p className="text-sm font-black uppercase tracking-wide text-sky-600 mb-1">Word Family</p>
        <p className="text-3xl font-black text-sky-800">— {family.rime} —</p>
        <p className="text-xs font-semibold text-sky-500 mt-1">rhyming words!</p>
      </div>

      {/* Target word clue */}
      <div className="rounded-[28px] border-4 border-white bg-white/85 p-5 shadow-xl text-center">
        <span className="text-7xl leading-none" aria-hidden="true">{targetWord.icon}</span>
        <p className="mt-2 text-xl font-black text-slate-800">{targetWord.clue}</p>
        <p className="mt-1 text-sm font-bold text-slate-500">{message}</p>
      </div>

      {/* 3 tile choices */}
      <div className="grid grid-cols-3 gap-3">
        {options.map(({ label, isCorrect }) => {
          const state = !selected
            ? 'idle'
            : label === selected
            ? isCorrect ? 'correct' : 'wrong'
            : 'idle';

          return (
            <motion.button
              key={label}
              whileTap={{ scale: 0.93 }}
              onClick={() => handlePick(label, isCorrect)}
              disabled={!!selected}
              className={`flex min-h-[80px] flex-col items-center justify-center rounded-3xl border-4 text-xl font-black shadow-lg transition-all ${
                state === 'correct' ? 'border-green-300 bg-green-400 text-white shadow-[0_4px_0_0_#16a34a]' :
                state === 'wrong'   ? 'border-red-200 bg-red-300 text-white opacity-70' :
                'border-white bg-white text-slate-800 shadow-[0_4px_0_0_#e2e8f0]'
              }`}
            >
              {label}
              {state === 'correct' && <span className="text-base mt-1">✅</span>}
              {state === 'wrong'   && <span className="text-base mt-1">❌</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── first-sound mode ──────────────────────────────────────── */

function FirstSoundRound({
  word,
  onComplete,
  onError
}: {
  word: SpellingWordContent;
  onComplete: () => void;
  onError: () => void;
}) {
  const correctLetter = word.word[0];

  const options = useMemo(() => {
    const distractors = shuffle(ALL_LETTERS.filter((l) => l !== correctLetter)).slice(0, 2);
    return shuffle([correctLetter, ...distractors]);
  }, [correctLetter, word.word]);

  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('Which letter starts this word?');

  const handlePick = (letter: string) => {
    if (selected) return;
    playTap();
    setSelected(letter);
    const isCorrect = letter === correctLetter;
    if (isCorrect) {
      playCorrect();
      setTimeout(onComplete, 900);
    } else {
      // Stay on this word: record the miss, then invite another try in place.
      setTimeout(() => {
        setSelected(null);
        setMessage('Good try. Pick one more! ⭐');
        onError();
      }, 900);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mode header */}
      <div className="rounded-3xl bg-amber-100 border-4 border-amber-200 p-3 text-center shadow">
        <p className="text-sm font-black uppercase tracking-wide text-amber-600">First Sound</p>
      </div>

      {/* Word picture */}
      <div className="rounded-[28px] border-4 border-white bg-white/85 p-6 shadow-xl text-center">
        <span className="text-8xl leading-none" aria-hidden="true">{word.icon}</span>
        <p className="mt-3 text-xl font-black text-slate-800">{word.clue}</p>
        <p className="mt-1 text-base font-bold text-sky-600">{message}</p>
      </div>

      {/* 3 large letter choices */}
      <div className="grid grid-cols-3 gap-3">
        {options.map((letter) => {
          const state = !selected
            ? 'idle'
            : letter === selected
            ? letter === correctLetter ? 'correct' : 'wrong'
            : letter === correctLetter && !!selected ? 'reveal' : 'idle';

          return (
            <motion.button
              key={letter}
              whileTap={{ scale: 0.93 }}
              onClick={() => handlePick(letter)}
              disabled={!!selected}
              className={`flex min-h-[100px] items-center justify-center rounded-3xl border-4 text-5xl font-black shadow-lg transition-all ${
                state === 'correct' ? 'border-green-300 bg-green-400 text-white shadow-[0_6px_0_0_#16a34a] scale-105' :
                state === 'wrong'   ? 'border-red-200 bg-red-300 text-white opacity-60' :
                state === 'reveal'  ? 'border-green-200 bg-green-100 text-green-700' :
                'border-slate-200 bg-white text-slate-800 shadow-[0_6px_0_0_#cbd5e1]'
              }`}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── main screen ───────────────────────────────────────────── */

export function SpellingAdventureScreen() {
  const { state, goToScreen, recordSpellingResult } = useGame();
  const words = dinoIslandContent.spellingWords;

  // The silent difficulty ramp lives in GameContext (state.spellingBand) so it
  // survives reward-screen detours and app restarts. Starting at a random word
  // keeps re-entry fresh instead of always opening on the same word.
  const [wordIndex, setWordIndex] = useState(() => Math.floor(Math.random() * Math.max(1, words.length)));
  const [roundNumber, setRoundNumber] = useState(0);

  // Family index for word-family mode
  const [familyIndex, setFamilyIndex] = useState(() => Math.floor(Math.random() * Math.max(1, WORD_FAMILIES.length)));

  const currentMode: SpellingMode = MODES[roundNumber % MODES.length];

  const currentWords = useMemo(() => {
    const exact = words.filter((w) => w.difficulty === state.spellingBand);
    return exact.length > 0 ? exact : words;
  }, [state.spellingBand, words]);

  const currentWord = currentWords[wordIndex % currentWords.length];
  const currentFamily = WORD_FAMILIES[familyIndex % Math.max(1, WORD_FAMILIES.length)];

  const advanceToNextRound = useCallback(() => {
    playTap();
    setRoundNumber((r) => r + 1);
    setFamilyIndex((fi) => (fi + 1) % Math.max(1, WORD_FAMILIES.length));
  }, []);

  const handleComplete = useCallback(() => {
    recordSpellingResult(true);
    setWordIndex((i) => i + 1);
    advanceToNextRound();
  }, [recordSpellingResult, advanceToNextRound]);

  // A miss eases the band quietly (in GameContext) but never yanks the child
  // to a different mode or word — the round invites another try in place.
  const handleError = useCallback(() => {
    recordSpellingResult(false);
  }, [recordSpellingResult]);

  const effectiveMode: SpellingMode = WORD_FAMILIES.length === 0 && currentMode === 'word-family'
    ? 'letter-build'
    : currentMode;

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 px-4 pb-4 pt-20 sm:px-5 sm:pb-5 sm:pt-24">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:gap-4">

        {/* Clue card */}
        <section className="rounded-[28px] border-4 border-white bg-white/85 p-4 shadow-xl sm:p-5">
          <div className="flex flex-col items-center gap-2 text-center">
            {effectiveMode === 'letter-build' && (
              <>
                <span className="text-6xl leading-none sm:text-7xl" aria-hidden="true">{currentWord.icon}</span>
                <h1 className="text-xl font-black leading-tight text-slate-800 sm:text-2xl">{currentWord.clue}</h1>
              </>
            )}
            {effectiveMode !== 'letter-build' && (
              <p className="text-lg font-black text-slate-700">
                {effectiveMode === 'word-family' ? '🏠 Word Family Challenge' : '🔤 First Sound Challenge'}
              </p>
            )}
          </div>
        </section>

        {/* Mode-specific round. No exit animation on purpose: with
            AnimatePresence mode="wait" a single dropped animation frame left
            the finished round stuck on screen with the next one never
            mounting. Instant swap + slide-in cannot strand the child. */}
        <section>
          <motion.div
              key={`${effectiveMode}-${roundNumber}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              {effectiveMode === 'letter-build' && (
                <LetterBuildRound
                  word={currentWord}
                  sound={currentWord.sound}
                  onComplete={handleComplete}
                  onError={handleError}
                />
              )}
              {effectiveMode === 'word-family' && currentFamily && (
                <WordFamilyRound
                  family={currentFamily}
                  onComplete={handleComplete}
                  onError={handleError}
                />
              )}
              {effectiveMode === 'first-sound' && (
                <FirstSoundRound
                  word={currentWord}
                  onComplete={handleComplete}
                  onError={handleError}
                />
              )}
          </motion.div>
        </section>

        {/* Home button */}
        <button
          type="button"
          onClick={() => goToScreen('home')}
          data-testid="button-spelling-home"
          className="w-full rounded-3xl bg-white px-5 py-3.5 text-xl font-black text-slate-700 shadow-lg sm:py-4"
        >
          Home
        </button>

      </div>
    </div>
  );
}
