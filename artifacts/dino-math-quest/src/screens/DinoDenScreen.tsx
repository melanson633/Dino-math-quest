import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { DINOS } from '../lib/dinos';
import { DinoArt } from '../components/DinoArt';
import { playRhythmCue, playTap, playTinySong } from '../lib/audio';
import { ArrowLeft, Footprints, Music, Sparkles, Volume2 } from 'lucide-react';

type PracticeMode = 'syllables' | 'chant' | 'count' | 'move';

export function DinoDenScreen() {
  const { state, goToScreen, startLearningArea } = useGame();
  const firstUnlockedDino = useMemo(
    () => DINOS.find((dino) => state.unlockedDinos.includes(dino.id)) ?? null,
    [state.unlockedDinos],
  );
  const [selectedDinoId, setSelectedDinoId] = useState<string | null>(firstUnlockedDino?.id ?? null);
  const [practiceMessage, setPracticeMessage] = useState('Pick a dino friend.');
  const [practiceStep, setPracticeStep] = useState(0);
  const [lastMode, setLastMode] = useState<PracticeMode | null>(null);
  const selectedDino = DINOS.find((dino) => dino.id === selectedDinoId && state.unlockedDinos.includes(dino.id)) ?? firstUnlockedDino;

  useEffect(() => {
    if (!selectedDinoId || !state.unlockedDinos.includes(selectedDinoId)) {
      setSelectedDinoId(firstUnlockedDino?.id ?? null);
    }
  }, [firstUnlockedDino?.id, selectedDinoId, state.unlockedDinos]);

  function chooseDino(dinoId: string) {
    setSelectedDinoId(dinoId);
    setPracticeMessage('Ready for a dino moment.');
    setPracticeStep(0);
    setLastMode(null);
    playTap();
  }

  function advancePractice(mode: PracticeMode, message: string, usesSong = false) {
    if (!selectedDino) return;
    if (state.adultSettings.musicCues) {
      if (usesSong) {
        playTinySong();
      } else {
        playRhythmCue();
      }
    } else {
      playTap();
    }
    setLastMode(mode);
    setPracticeStep((current) => Math.min(current + 1, 3));
    setPracticeMessage(message);
  }

  function practiceRhythm() {
    if (!selectedDino) return;
    advancePractice('syllables', `${selectedDino.practice.syllables.join(' - ')}. Nice dino beats.`);
  }

  function practiceChant() {
    if (!selectedDino) return;
    advancePractice('chant', selectedDino.practice.chant, true);
  }

  function practiceCount() {
    if (!selectedDino) return;
    advancePractice('count', selectedDino.practice.countPrompt);
  }

  function practiceMove() {
    if (!selectedDino) return;
    advancePractice('move', selectedDino.practice.movePrompt);
  }

  return (
    <div className="flex-1 flex flex-col w-full h-full bg-amber-50 text-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 flex items-center bg-amber-500 text-white shadow-md flex-shrink-0 gap-3">
        <button
          data-testid="button-back-dinoden"
          onClick={() => goToScreen('home')}
          className="w-16 h-16 rounded-full bg-white/25 flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
          aria-label="Back to Home"
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-3xl font-bold">Dino Den 🦕</h1>
      </div>

      <div className="text-center text-amber-700 font-semibold text-lg py-2 px-4 flex-shrink-0">
        {state.unlockedDinos.length} / {DINOS.length} found
      </div>

      {/* Scrollable grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {selectedDino ? (
          <section className="mb-5 rounded-3xl border-4 border-emerald-100 bg-white p-4 shadow-md">
            <div className="flex items-center gap-3">
              <DinoArt dino={selectedDino} decorative className="h-16 w-16" />
              <div>
                <h2 className="text-2xl font-extrabold text-emerald-800">{selectedDino.name}</h2>
                <p className="text-emerald-700 font-semibold">{selectedDino.practice.wordPrompt}</p>
              </div>
            </div>

            <div
              data-testid="dino-practice-trail"
              className="mt-4 rounded-3xl bg-emerald-50 border-4 border-emerald-100 p-3"
              aria-label="Dino practice trail"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-emerald-600">Friend practice</p>
                  <p className="text-lg font-extrabold text-emerald-900">
                    {practiceStep >= 3 ? selectedDino.practice.cheer : 'Try three tiny moments.'}
                  </p>
                </div>
                <div className="flex gap-2" aria-hidden="true">
                  {[0, 1, 2].map((step) => (
                    <span
                      key={step}
                      className={`grid h-11 w-11 place-items-center rounded-full border-4 text-xl ${
                        practiceStep > step
                          ? 'border-emerald-400 bg-emerald-300 text-emerald-950'
                          : 'border-white bg-white text-emerald-200'
                      }`}
                    >
                      <Footprints size={22} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Dino practice choices">
              <button
                data-testid="button-dino-syllables"
                type="button"
                onClick={practiceRhythm}
                className={`min-h-24 rounded-2xl border-4 font-extrabold flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform ${
                  lastMode === 'syllables'
                    ? 'bg-amber-200 border-amber-400 text-amber-950'
                    : 'bg-amber-100 border-amber-200 text-amber-900'
                }`}
              >
                <Volume2 size={28} />
                Clap Name
              </button>
              <button
                data-testid="button-dino-chant"
                type="button"
                onClick={practiceChant}
                className={`min-h-24 rounded-2xl border-4 font-extrabold flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform ${
                  lastMode === 'chant'
                    ? 'bg-sky-200 border-sky-400 text-sky-950'
                    : 'bg-sky-100 border-sky-200 text-sky-900'
                }`}
              >
                <Music size={28} />
                Dino Song
              </button>
              <button
                data-testid="button-dino-count"
                type="button"
                onClick={practiceCount}
                className={`min-h-24 rounded-2xl border-4 font-extrabold flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform ${
                  lastMode === 'count'
                    ? 'bg-lime-200 border-lime-400 text-lime-950'
                    : 'bg-lime-100 border-lime-200 text-lime-900'
                }`}
              >
                <Sparkles size={28} />
                Count
              </button>
              <button
                data-testid="button-dino-move"
                type="button"
                onClick={practiceMove}
                className={`min-h-24 rounded-2xl border-4 font-extrabold flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform ${
                  lastMode === 'move'
                    ? 'bg-rose-200 border-rose-400 text-rose-950'
                    : 'bg-rose-100 border-rose-200 text-rose-900'
                }`}
              >
                <Footprints size={28} />
                Move
              </button>
            </div>

            <p
              data-testid="dino-practice-feedback"
              className="mt-4 rounded-2xl bg-white px-4 py-3 text-center text-xl font-extrabold text-emerald-800 border-4 border-emerald-100"
            >
              {practiceMessage}
            </p>
          </section>
        ) : (
          <section className="mb-4 rounded-3xl border-4 border-amber-100 bg-white p-4 shadow-md text-center">
            <div className="text-6xl mb-3" aria-hidden="true">🦕</div>
            <h2 className="text-2xl font-extrabold text-amber-800">Find your first dino friend.</h2>
            <p className="mt-2 text-lg font-semibold text-amber-700">Play Math Quest, then come back for dino practice.</p>
            <button
              data-testid="button-dinoden-start-math"
              type="button"
              onClick={() => startLearningArea('math')}
              className="mt-4 min-h-16 rounded-3xl bg-emerald-500 px-6 py-4 text-xl font-black text-white shadow-md active:scale-95 transition-transform"
            >
              <span className="mr-2" aria-hidden="true">🔢</span>
              Play Math
            </button>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          {DINOS.map((dino, idx) => {
            const isUnlocked = state.unlockedDinos.includes(dino.id);
            const isSelected = selectedDino?.id === dino.id;
            return (
              <motion.button
                key={dino.id}
                data-testid={`card-dino-${dino.id}`}
                type="button"
                disabled={!isUnlocked}
                onClick={() => chooseDino(dino.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`rounded-3xl p-4 flex flex-col items-center justify-center text-center shadow-md border-4 active:scale-95 transition-transform ${
                  isUnlocked
                    ? isSelected
                      ? 'bg-white border-emerald-400'
                      : 'bg-white border-amber-200'
                    : 'bg-gray-100 border-gray-200'
                }`}
                style={{ minHeight: '160px' }}
              >
                {isUnlocked ? (
                  <>
                    <DinoArt dino={dino} decorative className="mb-2 h-16 w-16" />
                    <h3 className="font-bold text-base leading-tight text-amber-700">{dino.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-snug">{dino.fact}</p>
                  </>
                ) : (
                  <>
                    <span className="text-5xl mb-2 opacity-20">🦕</span>
                    <h3 className="font-bold text-base text-gray-400">???</h3>
                    <p className="text-xs text-gray-400 mt-1">Find at {dino.unlockAt}</p>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
