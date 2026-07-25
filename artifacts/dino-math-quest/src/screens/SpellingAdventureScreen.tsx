import React, { useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import { dinoIslandContent, SpellingWordContent } from '../content/dinoIslandContent';
import { playCorrect, playTap } from '../lib/audio';

type SpellingDifficulty = SpellingWordContent['difficulty'];

const SPELLING_DIFFICULTY_ORDER: SpellingDifficulty[] = ['support', 'steady', 'stretch'];

function moveDifficulty(current: SpellingDifficulty, direction: -1 | 1): SpellingDifficulty {
  const currentIndex = SPELLING_DIFFICULTY_ORDER.indexOf(current);
  const nextIndex = Math.min(SPELLING_DIFFICULTY_ORDER.length - 1, Math.max(0, currentIndex + direction));
  return SPELLING_DIFFICULTY_ORDER[nextIndex];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SpellingAdventureScreen() {
  const { state, goToScreen } = useGame();
  const words = dinoIslandContent.spellingWords;
  const [wordIndex, setWordIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [message, setMessage] = useState('Tap the letters in order.');
  const [difficulty, setDifficulty] = useState<SpellingDifficulty>('support');
  const [correctStreak, setCorrectStreak] = useState(0);

  const currentWords = useMemo(() => {
    const exact = words.filter((word) => word.difficulty === difficulty);
    if (exact.length > 0) return exact;
    return words;
  }, [difficulty, words]);

  const current = currentWords[wordIndex % currentWords.length];

  const choices = useMemo(() => {
    const maxChoicesByDifficulty: Record<SpellingDifficulty, number> = {
      support: 8,
      steady: 12,
      stretch: 16,
    };
    const wordLetters = new Set(current.word.split(''));
    const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const extras = allLetters.filter((l) => !wordLetters.has(l));
    const pool = Array.from(new Set([...current.word.split(''), ...extras]));
    return shuffle(pool).slice(0, maxChoicesByDifficulty[difficulty]);
  }, [current.word, difficulty]);

  const built = letters.join('');
  const complete = built === current.word;
  const wordColumns = Math.min(current.word.length, 6);

  const tapLetter = (letter: string) => {
    playTap();
    const next = [...letters, letter].slice(0, current.word.length);
    setLetters(next);
    const nextBuilt = next.join('');

    if (current.word.startsWith(nextBuilt)) {
      setMessage(nextBuilt === current.word ? `${current.sayPrompt}!` : 'Keep going!');
      if (nextBuilt === current.word) playCorrect();
      return;
    }

    setCorrectStreak(0);
    setMessage('Good try. The boxes will clear.');
    setTimeout(() => {
      setLetters([]);
      setDifficulty((currentDifficulty) => moveDifficulty(currentDifficulty, -1));
      setWordIndex(0);
      setMessage('Tap the letters in order.');
    }, 650);
  };

  const nextWord = () => {
    playTap();
    setLetters([]);
    setMessage('Tap the letters in order.');
    setCorrectStreak((streak) => {
      const nextStreak = streak + 1;
      const nextDifficulty = moveDifficulty(difficulty, 1);
      const isLastWordInBand = wordIndex >= currentWords.length - 1;

      if (nextStreak >= 2 && nextDifficulty !== difficulty && isLastWordInBand) {
        setDifficulty(nextDifficulty);
        setWordIndex(0);
        return 0;
      }

      setWordIndex((index) => (index + 1) % currentWords.length);
      return nextStreak >= 2 && isLastWordInBand ? 0 : nextStreak;
    });
  };

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 px-4 pb-4 pt-20 sm:px-5 sm:pb-5 sm:pt-24">
      <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:gap-4">

        {/* Clue card */}
        <section className="rounded-[28px] border-4 border-white bg-white/85 p-4 shadow-xl sm:p-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-6xl leading-none sm:text-7xl" aria-hidden="true">{current.icon}</span>
            <h1 className="text-xl font-black leading-tight text-slate-800 sm:text-2xl">{current.clue}</h1>
            <div data-testid="spelling-context-cues" className="flex flex-wrap justify-center gap-1.5 sm:gap-2" aria-label="Word clues">
              {current.contextHints.map((hint) => (
                <span key={hint} className="rounded-full bg-sky-100 px-3 py-1 text-sm font-black text-sky-900 shadow-inner">
                  {hint}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Build section */}
        <section className="rounded-[28px] border-4 border-white bg-white/90 p-3 shadow-xl sm:p-4">
          <div
            className="mb-3 grid gap-2"
            style={{ gridTemplateColumns: `repeat(${wordColumns}, minmax(0, 1fr))` }}
          >
            {current.word.split('').map((_, index) => (
              <div
                key={index}
                className="flex aspect-square items-center justify-center rounded-3xl bg-emerald-100 text-3xl font-black text-emerald-800 shadow-inner sm:text-[2.25rem]"
              >
                {letters[index] ?? ''}
              </div>
            ))}
          </div>
          <p className="min-h-7 text-center text-lg font-black text-slate-700 sm:text-xl">{message}</p>
        </section>

        {/* Letter grid */}
        <section className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
          {choices.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => tapLetter(letter)}
              data-testid={`button-spelling-letter-${letter}`}
              className="aspect-square rounded-3xl bg-white text-3xl font-black text-slate-800 shadow-lg active:scale-95"
            >
              {letter}
            </button>
          ))}
        </section>

        {/* Nav bar */}
        <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-3 rounded-[2rem] bg-white/70 py-2 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => goToScreen('home')}
            data-testid="button-spelling-home"
            className="rounded-3xl bg-white px-5 py-3.5 text-xl font-black text-slate-700 shadow-lg sm:py-4"
          >
            Home
          </button>
          <button
            type="button"
            onClick={nextWord}
            disabled={!complete}
            data-testid="button-spelling-next"
            className="rounded-3xl bg-emerald-500 px-5 py-3.5 text-xl font-black text-white shadow-lg disabled:bg-slate-300 sm:py-4"
          >
            Next Word
          </button>
        </div>
      </div>
    </div>
  );
}
