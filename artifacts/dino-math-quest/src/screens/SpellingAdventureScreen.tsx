import React, { useMemo, useState } from 'react';
import { Hand, Volume2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { dinoIslandContent, getCompanion, pickCompanionActionVariant, SpellingWordContent } from '../content/dinoIslandContent';
import { playCorrect, playPhonicsCue, playTap, playWordRhythm } from '../lib/audio';

type SpellingDifficulty = SpellingWordContent['difficulty'];

const SPELLING_DIFFICULTY_ORDER: SpellingDifficulty[] = ['support', 'steady', 'stretch'];

function moveDifficulty(current: SpellingDifficulty, direction: -1 | 1): SpellingDifficulty {
  const currentIndex = SPELLING_DIFFICULTY_ORDER.indexOf(current);
  const nextIndex = Math.min(SPELLING_DIFFICULTY_ORDER.length - 1, Math.max(0, currentIndex + direction));
  return SPELLING_DIFFICULTY_ORDER[nextIndex];
}

export function SpellingAdventureScreen() {
  const { state, goToScreen } = useGame();
  const words = dinoIslandContent.spellingWords;
  const [wordIndex, setWordIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [message, setMessage] = useState('Tap the letters in order.');
  const [difficulty, setDifficulty] = useState<SpellingDifficulty>('support');
  const [correctStreak, setCorrectStreak] = useState(0);

  const companion = getCompanion(state.selectedCompanionId);
  const variant = useMemo(() => pickCompanionActionVariant(companion, 'spelling'), [companion]);
  const currentWords = useMemo(() => {
    const exact = words.filter((word) => word.difficulty === difficulty);
    if (exact.length > 0) return exact;
    return words;
  }, [difficulty, words]);
  const current = currentWords[wordIndex % currentWords.length];
  const choices = useMemo(() => {
    const extras = ['A', 'D', 'E', 'I', 'L', 'M', 'N', 'O', 'R', 'S', 'T', 'W', 'X'];
    const maxChoicesByDifficulty: Record<SpellingDifficulty, number> = {
      support: 6,
      steady: 8,
      stretch: 10,
    };
    return Array.from(new Set([...current.word.split(''), ...extras])).slice(0, maxChoicesByDifficulty[difficulty]);
  }, [current.word, difficulty]);

  const built = letters.join('');
  const complete = built === current.word;
  const nextLetter = current.word[letters.length] ?? '';
  const wordColumns = Math.min(current.word.length, 5);

  const tapLetter = (letter: string) => {
    playTap();
    const next = [...letters, letter].slice(0, current.word.length);
    setLetters(next);
    const nextBuilt = next.join('');

    if (current.word.startsWith(nextBuilt)) {
      const followingLetter = current.word[next.length] ?? '';
      setMessage(nextBuilt === current.word ? `${current.sayPrompt}!` : `Find ${followingLetter}.`);
      if (nextBuilt === current.word) playCorrect();
      return;
    }

    setCorrectStreak(0);
    setMessage('Good try. The boxes will clear.');
    setTimeout(() => {
      setLetters([]);
      setDifficulty(currentDifficulty => moveDifficulty(currentDifficulty, -1));
      setWordIndex(0);
      setMessage('Tap the letters in order.');
    }, 650);
  };

  const nextWord = () => {
    playTap();
    setLetters([]);
    setMessage('Tap the letters in order.');
    setCorrectStreak(streak => {
      const nextStreak = streak + 1;
      const nextDifficulty = moveDifficulty(difficulty, 1);
      const isLastWordInBand = wordIndex >= currentWords.length - 1;

      if (nextStreak >= 2 && nextDifficulty !== difficulty && isLastWordInBand) {
        setDifficulty(nextDifficulty);
        setWordIndex(0);
        return 0;
      }

      setWordIndex(index => (index + 1) % currentWords.length);
      return nextStreak >= 2 && isLastWordInBand ? 0 : nextStreak;
    });
  };

  const playSoundCue = () => {
    playPhonicsCue();
    setMessage(current.sound);
  };

  const playWordClap = () => {
    playWordRhythm(current.rhythm.length);
    setMessage(current.rhythm.join('  -  '));
  };

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-sky-100 via-emerald-50 to-amber-100 px-4 pb-4 pt-20 sm:px-5 sm:pb-5 sm:pt-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-2.5 sm:gap-3">
        <section className="rounded-[28px] border-4 border-white bg-white/80 p-3 shadow-xl sm:p-4">
          <div className="flex items-center gap-3">
            {variant?.asset ? (
              <img src={variant.asset} alt={companion.name} className="h-14 w-14 rounded-3xl bg-white object-contain sm:h-20 sm:w-20" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-200 text-4xl sm:h-20 sm:w-20 sm:text-5xl">🦕</div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-sky-700 sm:text-sm">Spelling Adventure</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <span aria-hidden="true" className="text-4xl leading-none sm:text-5xl">{current.icon}</span>
                <h1 className="text-xl font-black leading-tight text-slate-800 sm:text-2xl">{current.clue}</h1>
              </div>
            <p className="mt-1 text-sm font-semibold leading-tight text-slate-600 sm:text-base">{current.sound}</p>
            <div data-testid="spelling-context-cues" className="mt-2 flex flex-wrap gap-1.5 sm:gap-2" aria-label="Word clues">
              {current.contextHints.map((hint) => (
                <span key={hint} className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-900 shadow-inner sm:px-3 sm:text-sm">
                  {hint}
                </span>
              ))}
            </div>
            {variant && (
              <p className="mt-1 line-clamp-1 text-sm font-black leading-tight text-sky-700 sm:text-base">{variant.label}</p>
            )}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border-4 border-white bg-white/90 p-3 shadow-xl sm:p-4">
          <div className="mb-2 rounded-3xl bg-sky-50 px-3 py-2 text-center shadow-inner sm:mb-3 sm:px-4">
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">Build this word</p>
            <p className="mt-1 break-words text-[2rem] font-black leading-none tracking-normal text-slate-900 sm:text-[3rem]">
              {current.word}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-1.5 sm:gap-2" aria-label="Word rhythm">
              {current.rhythm.map((beat, index) => (
                <span key={`${beat}-${index}`} className="rounded-full bg-white px-3 py-1 text-sm font-black text-sky-800 shadow-sm sm:px-4 sm:text-base">
                  {beat}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-2 grid gap-2 sm:mb-3" style={{ gridTemplateColumns: `repeat(${wordColumns}, minmax(0, 1fr))` }}>
            {current.word.split('').map((letter, index) => (
              <div key={`${letter}-${index}`} className="flex aspect-square items-center justify-center rounded-3xl bg-emerald-100 text-3xl font-black text-emerald-800 shadow-inner sm:text-[2.25rem]">
                {letters[index] ?? ''}
              </div>
            ))}
          </div>
          <p className="min-h-7 text-center text-lg font-black text-slate-700 sm:text-xl">
            {message === 'Tap the letters in order.' ? `Find ${nextLetter}.` : message}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:gap-3">
            <button
              type="button"
              onClick={playSoundCue}
              data-testid="button-spelling-sound"
              className="flex items-center justify-center gap-2 rounded-3xl bg-sky-100 px-3 py-2.5 text-base font-black text-sky-800 shadow-inner active:scale-95 sm:px-4 sm:py-3 sm:text-lg"
            >
              <Volume2 size={24} strokeWidth={3} />
              Letter Sound
            </button>
            <button
              type="button"
              onClick={playWordClap}
              data-testid="button-spelling-rhythm"
              className="flex items-center justify-center gap-2 rounded-3xl bg-amber-100 px-3 py-2.5 text-base font-black text-amber-800 shadow-inner active:scale-95 sm:px-4 sm:py-3 sm:text-lg"
            >
              <Hand size={24} strokeWidth={3} />
              Clap Word
            </button>
          </div>
        </section>

        <section className="grid grid-cols-5 gap-2 sm:grid-cols-6 sm:gap-3">
          {choices.map(letter => (
            <button
              key={letter}
              type="button"
              onClick={() => tapLetter(letter)}
              data-testid={`button-spelling-letter-${letter}`}
              className={`aspect-square rounded-3xl text-3xl font-black shadow-lg active:scale-95 ${
                letter === nextLetter
                  ? 'border-4 border-emerald-400 bg-emerald-100 text-emerald-900'
                  : 'bg-white text-slate-800'
              }`}
            >
              {letter}
            </button>
          ))}
        </section>

        <div className="sticky bottom-0 z-10 grid grid-cols-2 gap-3 rounded-[2rem] bg-white/70 py-2 backdrop-blur-sm">
          <button type="button" onClick={() => goToScreen('home')} data-testid="button-spelling-home" className="rounded-3xl bg-white px-5 py-3.5 text-xl font-black text-slate-700 shadow-lg sm:py-4">
            Home
          </button>
          <button type="button" onClick={nextWord} disabled={!complete} data-testid="button-spelling-next" className="rounded-3xl bg-emerald-500 px-5 py-3.5 text-xl font-black text-white shadow-lg disabled:bg-slate-300 sm:py-4">
            Next Word
          </button>
        </div>
      </div>
    </div>
  );
}
