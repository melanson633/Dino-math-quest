import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { playCorrect, playWrong, playUnlockBiome, playUnlockDino, setMuted, startBgMusic } from '../lib/audio';
import { BIOMES } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { generatePuzzle, Puzzle } from '../lib/puzzles';

type ScreenType = 'home' | 'puzzle' | 'dinoden' | 'biome-unlock' | 'settings';

interface GameState {
  currentBiome: 0 | 1 | 2 | 3;
  totalCorrect: number;
  unlockedDinos: string[];
  muteAudio: boolean;
  currentScreen: ScreenType;
}

const defaultState: GameState = {
  currentBiome: 0,
  totalCorrect: 0,
  unlockedDinos: [],
  muteAudio: false,
  currentScreen: 'home'
};

interface GameContextType {
  state: GameState;
  puzzle: Puzzle | null;
  startGame: () => void;
  goToScreen: (screen: ScreenType) => void;
  answerPuzzle: (isCorrect: boolean) => void;
  toggleMute: () => void;
  resetGame: () => void;
  newPuzzle: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('dino-math-quest-state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultState;
  });

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  useEffect(() => {
    localStorage.setItem('dino-math-quest-state', JSON.stringify(state));
    setMuted(state.muteAudio);
    if (state.currentScreen === 'puzzle' || state.currentScreen === 'home') {
      startBgMusic(state.currentBiome);
    }
  }, [state]);

  const newPuzzle = () => {
    setPuzzle(generatePuzzle());
  };

  const startGame = () => {
    newPuzzle();
    setState(s => ({ ...s, currentScreen: 'puzzle' }));
  };

  const goToScreen = (screen: ScreenType) => {
    setState(s => ({ ...s, currentScreen: screen }));
  };

  const toggleMute = () => {
    setState(s => ({ ...s, muteAudio: !s.muteAudio }));
  };

  const resetGame = () => {
    setState(defaultState);
  };

  const answerPuzzle = (isCorrect: boolean) => {
    if (!isCorrect) {
      playWrong();
      return;
    }
    playCorrect();
    
    setTimeout(() => {
      const newTotal = state.totalCorrect + 1;
      let newBiome = state.currentBiome;
      let newScreen = 'puzzle' as ScreenType;
      const newUnlocked = [...state.unlockedDinos];

      // Check unlocks
      const nextBiomeIndex = state.currentBiome + 1;
      if (nextBiomeIndex < BIOMES.length && newTotal >= BIOMES[nextBiomeIndex].threshold) {
        newBiome = nextBiomeIndex as any;
        newScreen = 'biome-unlock';
        playUnlockBiome();
      }

      const newDino = DINOS.find(d => d.unlockAt === newTotal);
      if (newDino && !newUnlocked.includes(newDino.id)) {
        newUnlocked.push(newDino.id);
        if (newScreen !== 'biome-unlock') playUnlockDino();
      }

      setState(s => ({
        ...s,
        totalCorrect: newTotal,
        currentBiome: newBiome,
        unlockedDinos: newUnlocked,
        currentScreen: newScreen
      }));

      if (newScreen === 'puzzle') {
        newPuzzle();
      }
    }, 1000);
  };

  return (
    <GameContext.Provider value={{ state, puzzle, startGame, goToScreen, answerPuzzle, toggleMute, resetGame, newPuzzle }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error('useGame must be used within a GameProvider');
  return context;
}
