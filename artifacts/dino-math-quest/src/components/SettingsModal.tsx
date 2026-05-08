import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, AlertTriangle } from 'lucide-react';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { state, toggleMute, resetGame } = useGame();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = () => {
    resetGame();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl active:bg-gray-200"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Settings</h2>

        {!showConfirm ? (
          <div className="flex flex-col gap-4">
            <button 
              onClick={toggleMute}
              className="flex items-center justify-between w-full h-20 px-6 rounded-2xl bg-blue-50 text-blue-600 font-bold text-2xl active:bg-blue-100 transition-colors"
            >
              <span>Sound</span>
              {state.muteAudio ? <VolumeX size={32} /> : <Volume2 size={32} />}
            </button>

            <button 
              onClick={() => setShowConfirm(true)}
              className="flex items-center justify-center gap-3 w-full h-20 px-6 rounded-2xl bg-red-50 text-red-600 font-bold text-xl mt-8 active:bg-red-100 transition-colors border-2 border-red-100"
            >
              <AlertTriangle />
              Reset Adventure
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xl text-center text-gray-600 mb-4 font-bold">
              Are you sure? This will erase all your dinos and progress.
            </p>
            <button 
              onClick={handleReset}
              className="w-full h-20 rounded-2xl bg-red-500 text-white font-bold text-2xl active:bg-red-600 transition-colors shadow-lg"
            >
              Yes, Reset Everything
            </button>
            <button 
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
