import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, AlertTriangle, X } from 'lucide-react';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, toggleMute, resetGame } = useGame();
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
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          data-testid="button-settings-close"
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-200 transition-colors"
          aria-label="Close settings"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Settings ⚙️</h2>

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
