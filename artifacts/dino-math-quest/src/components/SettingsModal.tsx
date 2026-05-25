import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathPace, SpeechSupport, useGame } from '../context/GameContext';
import { Volume2, VolumeX, AlertTriangle, X, Music2 } from 'lucide-react';

const mathPaceOptions: { id: MathPace; label: string; hint: string }[] = [
  { id: 'balanced', label: 'Ready', hint: 'Normal challenge' },
  { id: 'gentle', label: 'Gentle', hint: 'Back off sooner' },
  { id: 'stretch', label: 'Stretch', hint: 'Move faster' }
];

const speechSupportOptions: { id: SpeechSupport; label: string; hint: string }[] = [
  { id: 'steady', label: 'Steady', hint: 'Regular say-it moments' },
  { id: 'light', label: 'Light', hint: 'Fewer prompts' }
];

function OptionButton({
  label,
  hint,
  selected,
  onClick,
  testId
}: {
  label: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-[64px] rounded-2xl border-2 px-3 py-2 text-left transition active:scale-95 ${
        selected ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <span className="block text-lg font-black leading-tight">{label}</span>
      <span className="block text-xs font-bold leading-tight opacity-75">{hint}</span>
    </button>
  );
}

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, toggleMute, updateAdultSettings, resetGame } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetGame();
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          data-testid="button-settings-close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors active:bg-gray-200"
          aria-label="Close settings"
        >
          <X size={24} />
        </button>

        <h2 className="mb-5 text-center text-3xl font-black text-gray-800">Grown-up Controls</h2>

        {!showConfirm ? (
          <div className="flex flex-col gap-4">
            {/* Sound toggle */}
            <button
              data-testid="button-sound-toggle"
              onClick={toggleMute}
              className={`flex items-center justify-between w-full h-20 px-6 rounded-2xl font-bold text-2xl active:scale-95 transition-all ${
                state.muteAudio
                  ? 'bg-gray-100 text-gray-500'
                  : 'bg-blue-50 text-blue-600'
              }`}
            >
              <span>Sound {state.muteAudio ? 'Off' : 'On'}</span>
              {state.muteAudio ? <VolumeX size={36} /> : <Volume2 size={36} />}
            </button>

            <section className="rounded-3xl bg-slate-50 p-4">
              <div className="mb-3">
                <h3 className="text-xl font-black text-slate-800">Learning setup</h3>
                <p className="text-sm font-bold leading-tight text-slate-500">
                  Small parent controls. Charlotte's home screen stays simple.
                </p>
              </div>

              <p className="mb-2 text-sm font-black uppercase tracking-wide text-slate-500">Math pace</p>
              <div className="grid grid-cols-3 gap-2">
                {mathPaceOptions.map((option) => (
                  <OptionButton
                    key={option.id}
                    testId={`button-math-pace-${option.id}`}
                    label={option.label}
                    hint={option.hint}
                    selected={state.adultSettings.mathPace === option.id}
                    onClick={() => updateAdultSettings({ mathPace: option.id })}
                  />
                ))}
              </div>

              <p className="mb-2 mt-4 text-sm font-black uppercase tracking-wide text-slate-500">Speech support</p>
              <div className="grid grid-cols-2 gap-2">
                {speechSupportOptions.map((option) => (
                  <OptionButton
                    key={option.id}
                    testId={`button-speech-support-${option.id}`}
                    label={option.label}
                    hint={option.hint}
                    selected={state.adultSettings.speechSupport === option.id}
                    onClick={() => updateAdultSettings({ speechSupport: option.id })}
                  />
                ))}
              </div>

              <button
                type="button"
                data-testid="button-music-cues-toggle"
                onClick={() => updateAdultSettings({ musicCues: !state.adultSettings.musicCues })}
                className={`mt-4 flex min-h-[64px] w-full items-center justify-between rounded-2xl border-2 px-4 text-left font-black transition active:scale-95 ${
                  state.adultSettings.musicCues
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
                aria-pressed={state.adultSettings.musicCues}
              >
                <span>
                  <span className="block text-lg">Music cues</span>
                  <span className="block text-xs font-bold opacity-75">{state.adultSettings.musicCues ? 'On for playful rhythm' : 'Off for quieter play'}</span>
                </span>
                <Music2 size={30} />
              </button>
            </section>

            {/* Reset button */}
            <button
              data-testid="button-reset-adventure"
              onClick={() => setShowConfirm(true)}
              className="flex items-center justify-center gap-3 w-full h-20 px-6 rounded-2xl bg-red-50 text-red-500 font-bold text-xl mt-4 active:bg-red-100 transition-colors border-2 border-red-100"
            >
              <AlertTriangle size={28} />
              Reset Adventure
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xl text-center text-gray-600 font-bold mb-2">
              Erase all dinos and progress?
            </p>
            <button
              data-testid="button-confirm-reset"
              onClick={handleReset}
              className="w-full h-20 rounded-2xl bg-red-500 text-white font-bold text-2xl active:bg-red-600 transition-colors shadow-md"
            >
              Yes, Reset!
            </button>
            <button
              data-testid="button-cancel-reset"
              onClick={() => setShowConfirm(false)}
              className="w-full h-16 rounded-2xl bg-gray-100 text-gray-700 font-bold text-xl active:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
