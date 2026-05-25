import React, { useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import { dinoIslandContent, getCompanion, pickCompanionActionVariant } from '../content/dinoIslandContent';
import { playCorrect, playRhythmCue, playTap } from '../lib/audio';
import { detectVoiceAttempt } from '../lib/voiceParticipation';

export function SpeechAdventureScreen() {
  const { state, goToScreen } = useGame();
  const prompts = dinoIslandContent.speechMoments.starterPrompts;
  const [promptIndex, setPromptIndex] = useState(0);
  const [retryUsed, setRetryUsed] = useState(false);
  const [readyForNext, setReadyForNext] = useState(false);
  const [beatTapped, setBeatTapped] = useState(false);
  const [message, setMessage] = useState('Tap the beats, then say it with Dino.');
  const [listening, setListening] = useState(false);

  const prompt = prompts[promptIndex];
  const companion = getCompanion(state.selectedCompanionId);
  const variant = useMemo(() => pickCompanionActionVariant(companion, 'speech'), [companion]);
  const voiceParticipationEnabled = dinoIslandContent.featureFlags.liveVoiceParticipation;
  const retryLimit = state.adultSettings.speechSupport === 'light' ? 0 : dinoIslandContent.speechMoments.retryLimit;
  const activeTurn = readyForNext ? 'next' : beatTapped ? 'charlotte' : 'dino';
  const turnSteps = [
    { id: 'dino', label: 'Dino says', detail: 'tap beats', active: activeTurn === 'dino' },
    { id: 'charlotte', label: 'Charlotte says', detail: 'your brave try', active: activeTurn === 'charlotte' },
    { id: 'next', label: 'Next dino word', detail: 'keep playing', active: activeTurn === 'next' },
  ];

  const playBeats = () => {
    if (state.adultSettings.musicCues) {
      playRhythmCue();
    } else {
      playTap();
    }
    setBeatTapped(true);
    setMessage(prompt.rhythm.join('  •  '));
  };

  const markTry = () => {
    playCorrect();
    setRetryUsed(true);
    setReadyForNext(true);
    setMessage(retryLimit > 0 ? 'Great try! Tap Next when you are ready.' : 'Dino heard your brave try!');
  };

  const listenForTry = async () => {
    if (listening) return;
    playTap();
    setListening(true);
    setMessage('Dino is listening for your try.');
    const result = await detectVoiceAttempt();
    setListening(false);

    if (result === 'attempt') {
      playCorrect();
      setRetryUsed(true);
      setReadyForNext(true);
      setMessage('Dino heard your brave try!');
      return;
    }

    if (result === 'quiet' && !retryUsed && retryLimit > 0) {
      setRetryUsed(true);
      setMessage('Good listening. One more dino try!');
      return;
    }

    setMessage('Tap I Tried when you say it with Dino.');
  };

  const nextPrompt = () => {
    if (!readyForNext) {
      setMessage('Tap I Said It when you say it with Dino.');
      return;
    }
    playTap();
    setPromptIndex(index => (index + 1) % prompts.length);
    setRetryUsed(false);
    setReadyForNext(false);
    setBeatTapped(false);
    setMessage('Tap the beats, then say it with Dino.');
  };

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-pink-100 via-violet-50 to-sky-100 pt-24 px-5 pb-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <section className="rounded-[28px] border-4 border-white bg-white/85 p-5 shadow-xl">
          <div className="flex items-center gap-4">
            {variant?.asset ? (
              <img src={variant.asset} alt={companion.name} className="h-24 w-24 rounded-3xl object-contain bg-white" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-pink-200 text-5xl">🦖</div>
            )}
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-pink-700">Say It With Dino</p>
              <h1 className="text-4xl font-black text-slate-800">{prompt.text}</h1>
              <p className="mt-1 text-lg font-semibold text-slate-600">Focus sound: {prompt.focusSound}</p>
              {variant && (
                <p className="mt-2 text-base font-black leading-tight text-pink-700">{variant.label}</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border-4 border-white bg-white/90 p-5 text-center shadow-xl">
          <div data-testid="speech-turn-cue" className="mb-4 grid grid-cols-3 gap-2">
            {turnSteps.map(step => (
              <div
                key={step.id}
                data-testid="speech-turn-step"
                data-turn={step.id}
                data-active={step.active ? 'true' : 'false'}
                className={`rounded-3xl px-3 py-3 text-center shadow-inner ${
                  step.active ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <p className="text-base font-black leading-tight">{step.label}</p>
                <p className="mt-1 text-sm font-bold leading-tight opacity-90">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="mb-5 grid grid-cols-3 gap-3">
            {prompt.rhythm.map((beat, index) => (
              <button
                key={`${beat}-${index}`}
                type="button"
                onClick={playBeats}
                data-testid={`button-speech-beat-${index}`}
                className="rounded-3xl bg-pink-100 px-3 py-6 text-3xl font-black text-pink-800 shadow-inner active:scale-95"
              >
                {beat}
              </button>
            ))}
          </div>
          <p className="min-h-10 text-2xl font-black text-slate-700">{message}</p>
        </section>

        <div className="grid grid-cols-3 gap-3">
          <button type="button" onClick={() => goToScreen('home')} className="rounded-3xl bg-white px-4 py-4 text-lg font-black text-slate-700 shadow-lg">
            Home
          </button>
          <button type="button" onClick={markTry} data-testid="button-speech-i-tried" className="rounded-3xl bg-pink-500 px-4 py-4 text-lg font-black text-white shadow-lg">
            I Said It
          </button>
          <button
            type="button"
            onClick={nextPrompt}
            disabled={!readyForNext}
            data-testid="button-speech-next"
            className="rounded-3xl bg-violet-500 px-4 py-4 text-lg font-black text-white shadow-lg disabled:bg-slate-300"
          >
            Next
          </button>
        </div>

        {voiceParticipationEnabled && (
          <button
            type="button"
            onClick={listenForTry}
            disabled={listening}
            data-testid="button-speech-listen"
            className="rounded-3xl bg-white px-5 py-4 text-xl font-black text-pink-700 shadow-lg disabled:text-slate-400"
          >
            {listening ? 'Listening...' : 'Dino Listen'}
          </button>
        )}
      </div>
    </div>
  );
}
