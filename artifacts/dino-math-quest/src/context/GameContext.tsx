import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  currentBiome: number;
  totalCorrect: number;
  unlockedDinos: string[];
  muteAudio: boolean;
  currentScreen: ScreenType;
  selectedCompanionId: CompanionId;
  selectedLearningAreaId: LearningAreaId;
  lastUnlockedDinoId: string | null;
  /** A dino unlock that a same-answer biome unlock pushed to second place. */
  pendingDinoReward: boolean;
  /** Spelling's silent difficulty band. Persisted so an earned level survives restarts. */
  spellingBand: PuzzleDifficulty;
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
  pendingDinoReward: false,
  spellingBand: 'support',
  adultSettings: {
    mathPace: 'balanced',
    speechSupport: 'steady',
    musicCues: true
  }
};

export interface SessionStats {
  startTime: number;
  questionsAnswered: number;
  correct: number;
  difficultyBand: PuzzleDifficulty;
}

interface GameContextType {
  state: GameState;
  puzzle: Puzzle | null;
  settingsOpen: boolean;
  celebrationPending: boolean;
  sessionStats: SessionStats;
  openSettings: () => void;
  closeSettings: () => void;
  startGame: () => void;
  selectCompanion: (companionId: CompanionId) => void;
  startLearningArea: (learningAreaId: LearningAreaId) => void;
  goToScreen: (screen: ScreenType) => void;
  answerPuzzle: (isCorrect: boolean) => void;
  recordSpellingResult: (isCorrect: boolean) => void;
  toggleMute: () => void;
  updateAdultSettings: (settings: Partial<AdultSettings>) => void;
  resetGame: () => void;
  newPuzzle: () => void;
  clearCelebration: () => void;
  showPendingDinoReward: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/** Every value App's screen switch can render. Used to sanitize persisted state. */
const KNOWN_SCREENS: ScreenType[] = [
  'home', 'puzzle', 'spelling', 'speech', 'music',
  'adventure-preview', 'dinoden', 'biome-unlock', 'dino-reward',
];

const VALID_DINO_IDS = new Set(DINOS.map((d) => d.id));

const SPELLING_BANDS: PuzzleDifficulty[] = ['support', 'steady', 'stretch'];

function stepSpellingBand(current: PuzzleDifficulty, direction: -1 | 1): PuzzleDifficulty {
  const index = SPELLING_BANDS.indexOf(current);
  return SPELLING_BANDS[Math.min(SPELLING_BANDS.length - 1, Math.max(0, index + direction))];
}

/**
 * Persisted state is untrusted input: an older build, a hand edit, or a partial
 * write can leave any field out of range, and spreading it over the defaults
 * used to let every one of those values straight through.
 *
 * `currentBiome` is the dangerous one. `BIOMES[out-of-range]` is `undefined`,
 * and every screen that paints a background dereferences `biome.art`, so the
 * app throws during render, re-persists the bad value, and then crashes
 * identically on every reload — unrecoverable without devtools.
 */
function sanitizePersistedState(parsed: Partial<GameState>): GameState {
  const merged: GameState = {
    ...defaultState,
    ...parsed,
    adultSettings: { ...defaultState.adultSettings, ...parsed.adultSettings },
  };

  if (!KNOWN_SCREENS.includes(merged.currentScreen)) {
    merged.currentScreen = defaultState.currentScreen;
  }
  if (!Number.isInteger(merged.currentBiome) || merged.currentBiome < 0 || merged.currentBiome >= BIOMES.length) {
    merged.currentBiome = defaultState.currentBiome;
  }
  merged.unlockedDinos = Array.isArray(merged.unlockedDinos)
    ? merged.unlockedDinos.filter((id) => VALID_DINO_IDS.has(id))
    : [];
  if (!VALID_DINO_IDS.has(merged.lastUnlockedDinoId ?? '')) {
    merged.lastUnlockedDinoId = null;
  }
  if (!Number.isFinite(merged.totalCorrect) || merged.totalCorrect < 0) {
    merged.totalCorrect = 0;
  }
  merged.muteAudio = merged.muteAudio === true;
  if (!SPELLING_BANDS.includes(merged.spellingBand)) {
    merged.spellingBand = defaultState.spellingBand;
  }
  // Only the biome-unlock screen hands the queued reveal on, and reopening the
  // app never lands there, so a persisted flag would have no one to consume it.
  merged.pendingDinoReward = merged.pendingDinoReward === true && merged.currentScreen === 'biome-unlock';

  return merged;
}

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
        return sanitizePersistedState(parsed);
      } catch (e) {}
    }
    return defaultState;
  });

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [celebrationPending, setCelebrationPending] = useState(false);

  // Session stats (not persisted, reset on mount)
  const sessionStartTimeRef = useRef(Date.now());
  const sessionQuestionsRef = useRef(0);
  const sessionCorrectRef = useRef(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    startTime: sessionStartTimeRef.current,
    questionsAnswered: 0,
    correct: 0,
    difficultyBand: 'steady'
  });

  const correctStreakRef = useRef(0);
  const missStreakRef = useRef(0);
  const spellingStreakRef = useRef(0);
  const spellingMissRef = useRef(0);
  const pendingCelebrationRef = useRef(false);

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

  // Fire celebration when totalCorrect changes and we have a pending flag
  useEffect(() => {
    if (pendingCelebrationRef.current) {
      setCelebrationPending(true);
      pendingCelebrationRef.current = false;
    }
  }, [state.totalCorrect]);

  const getMathDifficulty = useCallback((): PuzzleDifficulty => {
    const pace = state.adultSettings?.mathPace ?? defaultState.adultSettings.mathPace;
    const missesForSupport = pace === 'gentle' ? 1 : 2;
    const correctForStretch = pace === 'stretch' ? 2 : pace === 'gentle' ? 6 : 4;

    if (missStreakRef.current >= missesForSupport) return 'support';
    if (correctStreakRef.current >= correctForStretch) return 'stretch';
    return 'steady';
  }, [state.adultSettings?.mathPace]);

  const newPuzzle = useCallback(() => {
    const band = getMathDifficulty();
    setPuzzle(generatePuzzle(band));
  }, [getMathDifficulty]);

  const startGame = () => {
    startLearningArea('math');
  };

  const selectCompanion = (companionId: CompanionId) => {
    setState(s => ({ ...s, selectedCompanionId: companionId }));
  };

  const startLearningArea = (learningAreaId: LearningAreaId) => {
    unlockAudioForGesture();
    // Reset session stats
    sessionStartTimeRef.current = Date.now();
    sessionQuestionsRef.current = 0;
    sessionCorrectRef.current = 0;
    setSessionStats({
      startTime: sessionStartTimeRef.current,
      questionsAnswered: 0,
      correct: 0,
      difficultyBand: getMathDifficulty()
    });

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

  const clearCelebration = useCallback(() => {
    setCelebrationPending(false);
  }, []);

  /** Show the dino reveal that a same-answer biome unlock queued behind it. */
  const showPendingDinoReward = useCallback(() => {
    playUnlockDino();
    setState(s => ({ ...s, pendingDinoReward: false, currentScreen: 'dino-reward' }));
  }, []);

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
    spellingStreakRef.current = 0;
    spellingMissRef.current = 0;
    // The session counters are what the adult panel reads. Leaving them set
    // carried the pre-reset tally into the fresh game.
    sessionStartTimeRef.current = Date.now();
    sessionQuestionsRef.current = 0;
    sessionCorrectRef.current = 0;
    setSessionStats({
      startTime: sessionStartTimeRef.current,
      questionsAnswered: 0,
      correct: 0,
      difficultyBand: 'steady'
    });
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

  /**
   * One correct answer's effect on the shared collection: total, biome and
   * dino unlocks, reveal-screen routing. Shared by math (origin 'puzzle') and
   * spelling (origin 'spelling') so every area's wins earn the same rewards.
   * The caller owns answer sounds, streaks and difficulty.
   */
  const applyCorrectProgress = (s: GameState, origin: 'puzzle' | 'spelling'): GameState => {
    const stayed = s.currentScreen === origin;
    const newTotal = s.totalCorrect + 1;
    let newBiome = s.currentBiome;
    let rewardScreen: ScreenType = origin;
    const newUnlocked = [...s.unlockedDinos];
    let lastUnlockedDinoId = s.lastUnlockedDinoId;
    let pendingDinoReward = false;

    // Check biome unlock
    const nextBiomeIndex = s.currentBiome + 1;
    if (nextBiomeIndex < BIOMES.length && newTotal >= BIOMES[nextBiomeIndex].threshold) {
      newBiome = nextBiomeIndex;
      rewardScreen = 'biome-unlock';
      if (stayed) playUnlockBiome();
    }

    // Check dino unlock
    const newDino = DINOS.find(d => d.unlockAt === newTotal);
    if (newDino && !newUnlocked.includes(newDino.id)) {
      newUnlocked.push(newDino.id);
      lastUnlockedDinoId = newDino.id;
      if (rewardScreen === 'biome-unlock') {
        // Both unlocks land on the same answer (totals 15, 30 and 45). The
        // biome screen goes first because it reframes where you are; the
        // dino reveal is queued so it still happens instead of being
        // dropped, which silently cost raptor, plesiosaurus and t-rex
        // their reveal screen and their unlock sound.
        pendingDinoReward = stayed;
      } else {
        rewardScreen = 'dino-reward';
        if (stayed) playUnlockDino();
      }
    }

    // Celebrate every 5 correct — but only when the player stays on the
    // puzzle screen to see it. The overlay used to be flagged here and
    // consumed by an effect on the next render, so a flag raised while
    // navigating to a reward screen survived and fired later over an
    // unrelated puzzle. An unlock reveal is the celebration for those
    // answers already.
    if (origin === 'puzzle' && newTotal % 5 === 0 && stayed && rewardScreen === 'puzzle') {
      pendingCelebrationRef.current = true;
    }

    return {
      ...s,
      totalCorrect: newTotal,
      currentBiome: newBiome,
      unlockedDinos: newUnlocked,
      currentScreen: stayed ? rewardScreen : s.currentScreen,
      lastUnlockedDinoId,
      pendingDinoReward
    };
  };

  const answerPuzzle = (isCorrect: boolean) => {
    // Update session stats immediately
    sessionQuestionsRef.current += 1;
    if (isCorrect) sessionCorrectRef.current += 1;

    if (!isCorrect) {
      correctStreakRef.current = 0;
      missStreakRef.current += 1;
      playWrong();
      setSessionStats(prev => ({
        ...prev,
        questionsAnswered: sessionQuestionsRef.current,
        correct: sessionCorrectRef.current,
        difficultyBand: getMathDifficulty()
      }));
      return;
    }
    correctStreakRef.current += 1;
    missStreakRef.current = 0;
    playCorrect();

    setTimeout(() => {
      setState(s => applyCorrectProgress(s, 'puzzle'));

      setSessionStats(prev => ({
        ...prev,
        questionsAnswered: sessionQuestionsRef.current,
        correct: sessionCorrectRef.current,
        difficultyBand: getMathDifficulty()
      }));

      // Always queue a fresh puzzle — it will show when they reach the puzzle screen
      newPuzzle();
    }, 900);
  };

  /**
   * Spelling's answer bookkeeping. Same silent, streak-triggered ramp shape as
   * math, but with its own counters so the two areas never bleed into each
   * other's difficulty: three straight wins step the band up, two straight
   * misses ease it down, and nothing on screen announces either. Wins also
   * bank collection progress, so Words play earns dinos and biomes too.
   */
  const recordSpellingResult = (isCorrect: boolean) => {
    sessionQuestionsRef.current += 1;
    if (isCorrect) sessionCorrectRef.current += 1;
    setSessionStats(prev => ({
      ...prev,
      questionsAnswered: sessionQuestionsRef.current,
      correct: sessionCorrectRef.current
    }));

    if (!isCorrect) {
      spellingStreakRef.current = 0;
      spellingMissRef.current += 1;
      playWrong();
      if (spellingMissRef.current >= 2) {
        spellingMissRef.current = 0;
        setState(s => ({ ...s, spellingBand: stepSpellingBand(s.spellingBand, -1) }));
      }
      return;
    }

    spellingStreakRef.current += 1;
    spellingMissRef.current = 0;
    const stepUp = spellingStreakRef.current >= 3;
    if (stepUp) spellingStreakRef.current = 0;

    setState(s => ({
      ...applyCorrectProgress(s, 'spelling'),
      spellingBand: stepUp ? stepSpellingBand(s.spellingBand, 1) : s.spellingBand
    }));
  };

  return (
    <GameContext.Provider value={{
      state, puzzle, settingsOpen,
      celebrationPending, sessionStats,
      openSettings, closeSettings,
      selectCompanion, startLearningArea,
      startGame, goToScreen, answerPuzzle, recordSpellingResult,
      toggleMute, updateAdultSettings, resetGame, newPuzzle,
      clearCelebration, showPendingDinoReward
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
