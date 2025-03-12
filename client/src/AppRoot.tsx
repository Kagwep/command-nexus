import React, { useState } from 'react';
import { Network } from "./utils/nexus";
import { OnboardingProvider } from "./context/OnboardingContext";
import AppInitializer from "./components/AppInitializer";
import NetworkSelector from './components/NetworkSelector';
import LandingPage from './components/LandingPage';
import { client } from "./dojogen/contracts.gen";
import { StarknetProvider } from './providers';
import { NetworkProvider } from './context/NetworkContext';

const AppRoot: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  
  // If showing landing page
  if (showLanding) {
    return <LandingPage onStartGame={() => setShowLanding(false)} />;
  }
  
  // If no network selected yet, show the network selector
  if (!selectedNetwork) {
    return <NetworkSelector onNetworkSelected={(network) => setSelectedNetwork(network)} />;
  }
  
  // Once network is selected, render the app with all providers
  return (
    <NetworkProvider initialNetwork={selectedNetwork}>
      <StarknetProvider network={selectedNetwork}>
        <OnboardingProvider>
          <AppInitializer 
            clientFn={client} 
            skipNetworkSelection={true} // Skip network selection since we've already done it
          />
        </OnboardingProvider>
      </StarknetProvider>
    </NetworkProvider>
  );
};

export default AppRoot;