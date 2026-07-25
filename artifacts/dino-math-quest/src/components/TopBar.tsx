import React, { useRef, useState } from 'react';
import { Settings, Volume2, VolumeX, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { PuzzleDifficulty } from '../lib/puzzles';

const DIFFICULTY_LABELS: Record<PuzzleDifficulty, string> = {
  support: 'Explorer (Support)',
  steady: 'Adventurer (Steady)',
  stretch: 'Champion (Stretch)'
};

const DIFFICULTY_TIPS: Record<PuzzleDifficulty, string> = {
  support: 'Try counting objects together with your finger before picking an answer.',
  steady: 'Ask "what comes after __?" to practise the number path.',
  stretch: 'Challenge: skip-count by 2s together — 2, 4, 6, 8…!'
};

function formatElapsed(startTime: number): string {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

function ParentOverlay({ onClose }: { onClose: () => void }) {
  const { sessionStats } = useGame();
  const pct = sessionStats.questionsAnswered > 0
    ? Math.round((sessionStats.correct / sessionStats.questionsAnswered) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="mb-1 text-xl font-black text-slate-900">📊 Session Summary</h2>
        <p className="mb-5 text-sm font-semibold text-slate-500">For parents — read only</p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="rounded-2xl bg-emerald-50 p-3 text-center">
            <p className="text-3xl font-black text-emerald-700">{sessionStats.questionsAnswered}</p>
            <p className="text-xs font-bold text-emerald-600 mt-1">Questions</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-3 text-center">
            <p className="text-3xl font-black text-sky-700">{pct}%</p>
            <p className="text-xs font-bold text-sky-600 mt-1">Correct</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 text-center col-span-2">
            <p className="text-base font-black text-amber-700">
              {DIFFICULTY_LABELS[sessionStats.difficultyBand]}
            </p>
            <p className="text-xs font-bold text-amber-600 mt-1">Current Level</p>
          </div>
        </div>

        <div className="rounded-2xl bg-violet-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-violet-500 mb-1">💡 Parent Tip</p>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            {DIFFICULTY_TIPS[sessionStats.difficultyBand]}
          </p>
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Session time: {formatElapsed(sessionStats.startTime)}
        </p>
      </div>
    </div>
  );
}

export function TopBar() {
  const { state, goToScreen, toggleMute, openSettings } = useGame();
  const [parentOverlayOpen, setParentOverlayOpen] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalDots = 5;
  const currentDotsFilled = state.totalCorrect % 5;

  const handleScorePointerDown = () => {
    longPressTimerRef.current = setTimeout(() => {
      setParentOverlayOpen(true);
    }, 500);
  };

  const handleScorePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <>
      {parentOverlayOpen && <ParentOverlay onClose={() => setParentOverlayOpen(false)} />}

      <div className="w-full flex items-center justify-between px-4 py-3 z-10 relative flex-shrink-0">
        {/* Dino Den button */}
        <button
          data-testid="button-dinoden"
          onClick={() => goToScreen('dinoden')}
          className="w-16 h-16 rounded-full bg-white/30 backdrop-blur border-2 border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Dino Den"
        >
          <span className="text-3xl">🦕</span>
        </button>

        {/* Score chip — long press opens parent overlay */}
        {state.currentScreen === 'puzzle' && (
          <div
            role="button"
            tabIndex={0}
            data-testid="score-chip"
            className="flex gap-2 bg-black/20 px-4 py-3 rounded-full backdrop-blur cursor-pointer select-none"
            onPointerDown={handleScorePointerDown}
            onPointerUp={handleScorePointerUp}
            onPointerLeave={handleScorePointerUp}
            aria-label="Score progress — hold for session summary"
          >
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

        {/* Mute + Settings */}
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
    </>
  );
}
