import React from 'react';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../context/GameContext';

export function TopBar() {
  const { state, goToScreen, toggleMute, openSettings } = useGame();

  const totalDots = 5;
  const currentDotsFilled = state.totalCorrect % 5;

  return (
    <div className="w-full flex items-center justify-between px-4 py-3 z-10 relative flex-shrink-0">
      {/* Dino Den button — 64px touch target */}
      <button
        data-testid="button-dinoden"
        onClick={() => goToScreen('dinoden')}
        className="w-16 h-16 rounded-full bg-white/30 backdrop-blur border-2 border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label="Dino Den"
      >
        <span className="text-3xl">🦕</span>
      </button>

      {/* Progress dots — only on puzzle screen */}
      {state.currentScreen === 'puzzle' && (
        <div className="flex gap-2 bg-black/20 px-4 py-3 rounded-full backdrop-blur">
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 border-white transition-colors ${
                i < currentDotsFilled ? 'bg-yellow-400' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}

      {/* Mute + Settings — 64px each */}
      <div className="flex gap-2">
        <button
          data-testid="button-mute"
          onClick={toggleMute}
          className="w-16 h-16 rounded-full bg-white/30 backdrop-blur border-2 border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform text-white"
          aria-label={state.muteAudio ? 'Unmute' : 'Mute'}
        >
          {state.muteAudio ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
        <button
          data-testid="button-settings"
          onClick={openSettings}
          className="w-16 h-16 rounded-full bg-white/30 backdrop-blur border-2 border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform text-white"
          aria-label="Settings"
        >
          <Settings size={28} />
        </button>
      </div>
    </div>
  );
}
