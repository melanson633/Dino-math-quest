import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HomeScreen } from './screens/HomeScreen';
import { PuzzleScreen } from './screens/PuzzleScreen';
import { DinoDenScreen } from './screens/DinoDenScreen';
import { BiomeUnlockScreen } from './screens/BiomeUnlockScreen';
import { SettingsModal } from './components/SettingsModal';
import { TopBar } from './components/TopBar';

function AppRoot() {
  const { state, settingsOpen, closeSettings } = useGame();

  const showTopBar = state.currentScreen === 'home' || state.currentScreen === 'puzzle';

  return (
    <div className="bg-gray-800 min-h-[100dvh] w-full flex justify-center items-center">
      {/* Game frame — no bg color so screens fill it end-to-end */}
      <div className="w-full h-[100dvh] max-w-[430px] relative overflow-hidden shadow-2xl">

        {/* Screens fill the full frame */}
        {state.currentScreen === 'home' && <HomeScreen />}
        {state.currentScreen === 'puzzle' && <PuzzleScreen />}
        {state.currentScreen === 'dinoden' && <DinoDenScreen />}
        {state.currentScreen === 'biome-unlock' && <BiomeUnlockScreen />}

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
