import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { playCorrect, playWrong, playUnlockBiome, playUnlockDino, setMuted, startBgMusic, unlockAudioForGesture } from '../lib/audio';
import { BIOMES } from '../lib/biomes';
import { DINOS } from '../lib/dinos';
import { generatePuzzle, Puzzle, PuzzleDifficulty } from '../lib/puzzles';
import { CompanionId, LearningAreaId } from '../content/dinoIslandContent';

export type ScreenType = 'home' | 'puzzle' | 'spelling' | 'speech' | 'music' | 'adventure-preview' | 'dinoden' | 'biome-unlock' | 'dino-reward';
export type MathPace = 'gentle' | 'balanced' | 'stretch';
export type SpeechSupport = 'light' | 'steady';

export interface AdultSettings {
  mathPace: MathPace;
  speechSupport: SpeechSupport;
  musicCues: boolean;
}

interface GameState {
  currentBiome: 0 | 1 | 2 | 3;
  totalCorrect: number;
  unlockedDinos: string[];
  muteAudio: boolean;
  currentScreen: ScreenType;
  selectedCompanionId: CompanionId;
  selectedLearningAreaId: LearningAreaId;
  lastUnlockedDinoId: string | null;
  adultSettings: AdultSettings;
}

const defaultState: GameState = {
  currentBiome: 0,
  totalCorrect: 0,
  unlockedDinos: [],
  muteAudio: false,
  currentScreen: 'home',
  selectedCompanionId: 'none',
  selectedLearningAreaId: 'math',
  lastUnlockedDinoId: null,
  adultSettings: {
    mathPace: 'balanced',
    speechSupport: 'steady',
    musicCues: true
  }
};

interface GameContextType {
  state: GameState;
  puzzle: Puzzle | null;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  startGame: () => void;
  selectCompanion: (companionId: CompanionId) => void;
  startLearningArea: (learningAreaId: LearningAreaId) => void;
  goToScreen: (screen: ScreenType) => void;
  answerPuzzle: (isCorrect: boolean) => void;
  toggleMute: () => void;
  updateAdultSettings: (settings: Partial<AdultSettings>) => void;
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
        if (parsed.currentScreen === 'biome-unlock' || parsed.currentScreen === 'dino-reward') {
          parsed.currentScreen = 'puzzle';
        }
        return {
          ...defaultState,
          ...parsed,
          adultSettings: {
            ...defaultState.adultSettings,
            ...parsed.adultSettings
          }
        };
      } catch (e) {}
    }
    return defaultState;
  });

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const correctStreakRef = useRef(0);
  const missStreakRef = useRef(0);

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
    const isGameScreen = ['home', 'puzzle', 'spelling', 'speech', 'music', 'adventure-preview', 'biome-unlock', 'dino-reward'].includes(state.currentScreen);
    const biomeChanged = prevBiomeRef.current !== state.currentBiome;
    const screenChangedToGame = isGameScreen && prevScreenRef.current !== state.currentScreen;

    if (isGameScreen && (biomeChanged || screenChangedToGame || prevBiomeRef.current === -1)) {
      startBgMusic(state.currentBiome);
    }
    prevBiomeRef.current = state.currentBiome;
    prevScreenRef.current = state.currentScreen;
  }, [state.currentBiome, state.currentScreen]);

  const getMathDifficulty = (): PuzzleDifficulty => {
    const pace = state.adultSettings?.mathPace ?? defaultState.adultSettings.mathPace;
    const missesForSupport = pace === 'gentle' ? 1 : 2;
    const correctForStretch = pace === 'stretch' ? 2 : pace === 'gentle' ? 6 : 4;

    if (missStreakRef.current >= missesForSupport) return 'support';
    if (correctStreakRef.current >= correctForStretch) return 'stretch';
    return 'steady';
  };

  const newPuzzle = () => {
    setPuzzle(generatePuzzle(getMathDifficulty()));
  };

  const startGame = () => {
    startLearningArea('math');
  };

  const selectCompanion = (companionId: CompanionId) => {
    setState(s => ({ ...s, selectedCompanionId: companionId }));
  };

  const startLearningArea = (learningAreaId: LearningAreaId) => {
    unlockAudioForGesture();

    if (learningAreaId === 'math') {
      newPuzzle();
      setState(s => ({ ...s, selectedLearningAreaId: learningAreaId, currentScreen: 'puzzle' }));
      return;
    }

    const nextScreenByArea: Partial<Record<LearningAreaId, ScreenType>> = {
      spelling: 'spelling',
      speech: 'speech',
      music: 'music'
    };

    setState(s => ({
      ...s,
      selectedLearningAreaId: learningAreaId,
      currentScreen: nextScreenByArea[learningAreaId] ?? 'adventure-preview'
    }));
  };

  const goToScreen = (screen: ScreenType) => {
    setState(s => ({ ...s, currentScreen: screen }));
  };

  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const toggleMute = () => {
    setState(s => ({ ...s, muteAudio: !s.muteAudio }));
  };

  const updateAdultSettings = (settings: Partial<AdultSettings>) => {
    setState(s => ({
      ...s,
      adultSettings: {
        ...defaultState.adultSettings,
        ...s.adultSettings,
        ...settings
      }
    }));
  };

  const resetGame = () => {
    correctStreakRef.current = 0;
    missStreakRef.current = 0;
    setState(s => ({
      ...defaultState,
      muteAudio: s.muteAudio,
      adultSettings: {
        ...defaultState.adultSettings,
        ...s.adultSettings
      }
    }));
    setPuzzle(null);
  };

  const answerPuzzle = (isCorrect: boolean) => {
    if (!isCorrect) {
      correctStreakRef.current = 0;
      missStreakRef.current += 1;
      playWrong();
      return;
    }
    correctStreakRef.current += 1;
    missStreakRef.current = 0;
    playCorrect();

    setTimeout(() => {
      setState(s => {
        const stayedInPuzzle = s.currentScreen === 'puzzle';
        const newTotal = s.totalCorrect + 1;
        let newBiome = s.currentBiome;
        let rewardScreen: ScreenType = 'puzzle';
        const newUnlocked = [...s.unlockedDinos];
        let lastUnlockedDinoId = s.lastUnlockedDinoId;

        // Check biome unlock
        const nextBiomeIndex = (s.currentBiome + 1) as 0 | 1 | 2 | 3;
        if (nextBiomeIndex < BIOMES.length && newTotal >= BIOMES[nextBiomeIndex].threshold) {
          newBiome = nextBiomeIndex;
          rewardScreen = 'biome-unlock';
          if (stayedInPuzzle) playUnlockBiome();
        }

        // Check dino unlock
        const newDino = DINOS.find(d => d.unlockAt === newTotal);
        if (newDino && !newUnlocked.includes(newDino.id)) {
          newUnlocked.push(newDino.id);
          lastUnlockedDinoId = newDino.id;
          if (rewardScreen !== 'biome-unlock') {
            rewardScreen = 'dino-reward';
            if (stayedInPuzzle) playUnlockDino();
          }
        }

        return {
          ...s,
          totalCorrect: newTotal,
          currentBiome: newBiome,
          unlockedDinos: newUnlocked,
          currentScreen: stayedInPuzzle ? rewardScreen : s.currentScreen,
          lastUnlockedDinoId
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
      selectCompanion, startLearningArea,
      startGame, goToScreen, answerPuzzle,
      toggleMute, updateAdultSettings, resetGame, newPuzzle
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
