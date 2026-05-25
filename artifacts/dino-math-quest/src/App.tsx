import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HomeScreen } from './screens/HomeScreen';
import { PuzzleScreen } from './screens/PuzzleScreen';
import { AdventurePreviewScreen } from './screens/AdventurePreviewScreen';
import { SpellingAdventureScreen } from './screens/SpellingAdventureScreen';
import { SpeechAdventureScreen } from './screens/SpeechAdventureScreen';
import { MusicDenScreen } from './screens/MusicDenScreen';
import { DinoDenScreen } from './screens/DinoDenScreen';
import { BiomeUnlockScreen } from './screens/BiomeUnlockScreen';
import { DinoRewardScreen } from './screens/DinoRewardScreen';
import { SettingsModal } from './components/SettingsModal';
import { TopBar } from './components/TopBar';

function AppRoot() {
  const { state, settingsOpen, closeSettings } = useGame();

  const showTopBar = state.currentScreen === 'home' || state.currentScreen === 'puzzle' || state.currentScreen === 'spelling' || state.currentScreen === 'speech' || state.currentScreen === 'music' || state.currentScreen === 'adventure-preview';

  return (
    <div className="bg-gray-800 min-h-[100dvh] w-full flex justify-center items-center">
      {/* Game frame — no bg color so screens fill it end-to-end */}
      <div className="w-full h-[100dvh] max-w-[820px] relative overflow-hidden shadow-2xl">

        {/* Screens fill the full frame */}
        {state.currentScreen === 'home' && <HomeScreen />}
        {state.currentScreen === 'puzzle' && <PuzzleScreen />}
        {state.currentScreen === 'spelling' && <SpellingAdventureScreen />}
        {state.currentScreen === 'speech' && <SpeechAdventureScreen />}
        {state.currentScreen === 'music' && <MusicDenScreen />}
        {state.currentScreen === 'adventure-preview' && <AdventurePreviewScreen />}
        {state.currentScreen === 'dinoden' && <DinoDenScreen />}
        {state.currentScreen === 'biome-unlock' && <BiomeUnlockScreen />}
        {state.currentScreen === 'dino-reward' && <DinoRewardScreen />}

        {/* TopBar floats above the screen content */}
        {showTopBar && (
          <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
            <div className="pointer-events-auto">
              <TopBar />
            </div>
          </div>
        )}

        {/* Settings overlay sits above everything */}
        {settingsOpen && <SettingsModal onClose={closeSettings} />}
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <AppRoot />
    </GameProvider>
  );
}

export default App;
