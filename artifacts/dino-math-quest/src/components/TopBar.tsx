import React from 'react';
import { Settings, Volume2, VolumeX, Menu } from 'lucide-react';
import { useGame } from '../context/GameContext';

export function TopBar() {
  const { state, goToScreen, toggleMute } = useGame();

  const totalDots = 5;
  const currentBiomeDots = state.totalCorrect % 5;

  return (
    <div className="w-full flex items-center justify-between p-4 z-10 relative">
      <button 
        onClick={() => goToScreen('dinoden')}
        className="w-12 h-12 rounded-full bg-white/30 backdrop-blur border-2 border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <span className="text-2xl">🦕</span>
      </button>

      {state.currentScreen === 'puzzle' && (
        <div className="flex gap-2 bg-black/20 p-3 rounded-full backdrop-blur">
          {Array.from({ length: totalDots }).map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 border-white ${
                i < currentBiomeDots ? 'bg-yellow-400' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button 
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-white/30 backdrop-blur border-2 border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform text-white"
        >
          {state.muteAudio ? <VolumeX /> : <Volume2 />}
        </button>
        <button 
          onClick={() => goToScreen('settings')}
          className="w-12 h-12 rounded-full bg-white/30 backdrop-blur border-2 border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform text-white"
        >
          <Settings />
        </button>
      </div>
    </div>
  );
}
