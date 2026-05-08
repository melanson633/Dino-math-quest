import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HomeScreen } from './screens/HomeScreen';
import { PuzzleScreen } from './screens/PuzzleScreen';
import { DinoDenScreen } from './screens/DinoDenScreen';
import { BiomeUnlockScreen } from './screens/BiomeUnlockScreen';
import { SettingsModal } from './components/SettingsModal';
import { TopBar } from './components/TopBar';

function GameContent() {
  const { state } = useGame();

  const renderScreen = () => {
    switch (state.currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'puzzle':
        return <PuzzleScreen />;
      case 'dinoden':
        return <DinoDenScreen />;
      case 'biome-unlock':
        return <BiomeUnlockScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="w-full h-[100dvh] flex flex-col mx-auto max-w-[430px] bg-white relative overflow-hidden font-sans shadow-2xl">
      {(state.currentScreen === 'home' || state.currentScreen === 'puzzle') && <TopBar />}
      {renderScreen()}
      {state.currentScreen === 'settings' && <SettingsModal onClose={() => {}} />} 
      {/* Settings modal logic needs to be handled via currentScreen or an overlay state. Since the spec says it's an overlay accessible via gear icon, let's fix that. */}
    </div>
  );
}

// Wrapping it with a state to show overlay
function AppRoot() {
  const { state, goToScreen } = useGame();
  
  return (
    <div className="bg-gray-100 min-h-[100dvh] w-full flex justify-center">
      <div className="w-full h-[100dvh] flex flex-col max-w-[430px] bg-white relative overflow-hidden shadow-2xl">
        {(state.currentScreen === 'home' || state.currentScreen === 'puzzle') && <TopBar />}
        
        {state.currentScreen === 'home' && <HomeScreen />}
        {state.currentScreen === 'puzzle' && <PuzzleScreen />}
        {state.currentScreen === 'dinoden' && <DinoDenScreen />}
        {state.currentScreen === 'biome-unlock' && <BiomeUnlockScreen />}
        
        {state.currentScreen === 'settings' && (
          <SettingsModal onClose={() => goToScreen('home')} />
        )}
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
