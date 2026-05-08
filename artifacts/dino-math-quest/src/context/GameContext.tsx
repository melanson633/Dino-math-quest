import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { playCorrect, playWrong, playUnlockBiome, playUnlockDino, setMuted, startBgMusic } from '../lib/audio';
import { BIOMES } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { generatePuzzle, Puzzle } from '../lib/puzzles';

export type ScreenType = 'home' | 'puzzle' | 'dinoden' | 'biome-unlock';

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
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
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
      try {
        const parsed = JSON.parse(saved);
        // Always land on home or puzzle when reopening — never on a transition screen
        if (parsed.currentScreen === 'biome-unlock') {
          parsed.currentScreen = 'puzzle';
        }
        return parsed;
      } catch (e) {}
    }
    return defaultState;
  });

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Track previous biome/screen to avoid restarting music on every state change
  const prevBiomeRef = useRef<number>(-1);
  const prevScreenRef = useRef<string>('');

  // Persist state
  useEffect(() => {
    localStorage.setItem('dino-math-quest-state', JSON.stringify(state));
  }, [state]);

  // Sync mute
  useEffect(() => {
    setMuted(state.muteAudio);
  }, [state.muteAudio]);

  // Only restart background music when biome or relevant screen changes
  useEffect(() => {
    const isGameScreen = state.currentScreen === 'home' || state.currentScreen === 'puzzle' || state.currentScreen === 'biome-unlock';
    const biomeChanged = prevBiomeRef.current !== state.currentBiome;
    const screenChangedToGame = isGameScreen && prevScreenRef.current !== state.currentScreen;

    if (isGameScreen && (biomeChanged || screenChangedToGame || prevBiomeRef.current === -1)) {
      startBgMusic(state.currentBiome);
    }
    prevBiomeRef.current = state.currentBiome;
    prevScreenRef.current = state.currentScreen;
  }, [state.currentBiome, state.currentScreen]);

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

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const toggleMute = () => {
    setState(s => ({ ...s, muteAudio: !s.muteAudio }));
  };

  const resetGame = () => {
    setState(defaultState);
    setPuzzle(null);
  };

  const answerPuzzle = (isCorrect: boolean) => {
    if (!isCorrect) {
      playWrong();
      return;
    }
    playCorrect();

    setTimeout(() => {
      setState(s => {
        const newTotal = s.totalCorrect + 1;
        let newBiome = s.currentBiome;
        let newScreen: ScreenType = 'puzzle';
        const newUnlocked = [...s.unlockedDinos];

        // Check biome unlock
        const nextBiomeIndex = (s.currentBiome + 1) as 0 | 1 | 2 | 3;
        if (nextBiomeIndex < BIOMES.length && newTotal >= BIOMES[nextBiomeIndex].threshold) {
          newBiome = nextBiomeIndex;
          newScreen = 'biome-unlock';
          playUnlockBiome();
        }

        // Check dino unlock
        const newDino = DINOS.find(d => d.unlockAt === newTotal);
        if (newDino && !newUnlocked.includes(newDino.id)) {
          newUnlocked.push(newDino.id);
          if (newScreen !== 'biome-unlock') playUnlockDino();
        }

        return {
          ...s,
          totalCorrect: newTotal,
          currentBiome: newBiome,
          unlockedDinos: newUnlocked,
          currentScreen: newScreen
        };
      });

      // Always queue a fresh puzzle — it will show when they reach the puzzle screen
      newPuzzle();
    }, 900);
  };

  return (
    <GameContext.Provider value={{
      state, puzzle, settingsOpen,
      openSettings, closeSettings,
      startGame, goToScreen, answerPuzzle,
      toggleMute, resetGame, newPuzzle
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error('useGame must be used within a GameProvider');
  return context;
}
