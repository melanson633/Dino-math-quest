import React, { useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import { dinoIslandContent, getCompanion, pickCompanionActionVariant } from '../content/dinoIslandContent';
import { playCorrect, playRhythmCue, playTap, playTinySong } from '../lib/audio';

export function MusicDenScreen() {
  const { state, goToScreen } = useGame();
  const patterns = dinoIslandContent.musicPatterns;
  const [patternIndex, setPatternIndex] = useState(0);
  const [played, setPlayed] = useState<number[]>([]);
  const [hint, setHint] = useState(() => `Find ${patterns[0]?.beats[0] ?? 'the first beat'}.`);
  const companion = getCompanion(state.selectedCompanionId);
  const variant = useMemo(() => pickCompanionActionVariant(companion, 'music'), [companion]);
  const pattern = patterns[patternIndex];
  const complete = played.length === pattern.beats.length;
  const nextBeatIndex = complete ? -1 : played.length;
  const nextBeat = nextBeatIndex >= 0 ? pattern.beats[nextBeatIndex] : '';

  const tapBeat = (index: number) => {
    if (complete) return;
    if (state.adultSettings.musicCues) {
      playRhythmCue();
    } else {
      playTap();
    }
    setPlayed(current => {
      const expectedIndex = current.length;
      if (index !== expectedIndex) {
        setHint(`Good try. Start with ${pattern.beats[0]}.`);
        return [];
      }

      const next = [...current, index];
      setHint(next.length === pattern.beats.length ? 'You played Dino\'s beat!' : `Find ${pattern.beats[next.length]}.`);
      if (next.length === pattern.beats.length) playCorrect();
      return next;
    });
  };

  const nextPattern = () => {
    playTap();
    const nextIndex = (patternIndex + 1) % patterns.length;
    const nextPatternValue = patterns[nextIndex];
    setPlayed([]);
    setHint(`Find ${nextPatternValue?.beats[0] ?? 'the first beat'}.`);
    setPatternIndex(nextIndex);
  };

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-amber-100 via-lime-50 to-sky-100 pt-24 px-5 pb-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <section className="rounded-[28px] border-4 border-white bg-white/85 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            {variant?.asset ? (
              <img src={variant.asset} alt={companion.name} className="h-24 w-24 rounded-3xl object-contain bg-white" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-200 text-5xl">🥁</div>
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Music Den</p>
              <h1 className="text-4xl font-black text-slate-800">{pattern.name}</h1>
              <p className="mt-1 text-lg font-semibold text-slate-600">Play a tiny pattern with Dino.</p>
              {variant && (
                <p className="mt-2 text-base font-black leading-tight text-amber-700">{variant.label}</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border-4 border-white bg-white/90 p-5 text-center shadow-xl">
          <div
            className="mb-4 rounded-3xl border-4 border-emerald-200 bg-emerald-50 px-4 py-3 shadow-inner"
            data-testid="music-next-beat-cue"
          >
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
              {complete ? 'Beat complete' : 'Next beat'}
            </p>
            <p className="text-4xl font-black leading-tight text-emerald-950">
              {complete ? 'Great beat!' : nextBeat}
            </p>
          </div>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {pattern.beats.map((beat, index) => {
              const isPlayed = played.includes(index);
              const isNext = index === nextBeatIndex;
              return (
                <button
                  key={`${beat}-${index}`}
                  type="button"
                  onClick={() => tapBeat(index)}
                  data-testid={`button-music-beat-${index}`}
                  data-next={isNext ? 'true' : 'false'}
                  aria-label={isNext ? `Next beat ${beat}` : `Beat ${beat}`}
                  aria-pressed={isPlayed}
                  className={`relative rounded-3xl border-4 px-3 py-8 text-2xl font-black shadow-lg active:scale-95 ${
                    isPlayed
                      ? 'border-emerald-400 bg-emerald-300 text-emerald-900'
                      : isNext
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-200'
                        : 'border-transparent bg-amber-200 text-amber-900'
                  }`}
                >
                  {isNext && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-black uppercase text-emerald-700">
                      next
                    </span>
                  )}
                  {beat}
                </button>
              );
            })}
          </div>
          <div className="mb-4 flex justify-center gap-2" aria-label="Beat progress">
            {pattern.beats.map((beat, index) => (
              <span
                key={`${beat}-dot-${index}`}
                className={`h-4 w-4 rounded-full ${played.length > index ? 'bg-emerald-500' : 'bg-slate-200'}`}
              />
            ))}
          </div>
          <p className="mb-4 text-lg font-black text-slate-600" data-testid="text-music-hint">{hint}</p>
          <button
            type="button"
            onClick={state.adultSettings.musicCues ? playTinySong : playTap}
            data-testid="button-music-song"
            className="rounded-3xl bg-sky-500 px-6 py-4 text-xl font-black text-white shadow-lg"
          >
            Play Song
          </button>
          {!state.adultSettings.musicCues && (
            <p className="mt-3 text-base font-black text-slate-500">Quiet music cues are off.</p>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => goToScreen('home')} className="rounded-3xl bg-white px-5 py-4 text-xl font-black text-slate-700 shadow-lg">
            Home
          </button>
          <button type="button" onClick={nextPattern} disabled={!complete} className="rounded-3xl bg-amber-500 px-5 py-4 text-xl font-black text-white shadow-lg disabled:bg-slate-300">
            Next Beat
          </button>
        </div>
      </div>
    </div>
  );
}
