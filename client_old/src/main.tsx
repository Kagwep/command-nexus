// src/index.tsx
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { setup } from './dojo/generated/setup';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AudioSettingsProvider } from './contexts/AudioContext';
import Loading from './components/Loading';
import { useElementStore } from './utils/nexus';
import { BurnerManager } from "@dojoengine/create-burner";
import { RpcProvider } from "starknet";
import { networkConfig } from "./lib/networkConfig";
import OnboardingScreen from './components/Pages/Onboarding';
import { DojoProvider } from './dojo/DojoContext';
import { StarknetProvider } from './providers/AppProvider';
import { SetupResult } from './dojo/generated/setup';
import LoginIntro from "./components/onboarding/Intro";
import Intro from './components/intro/Intro';
import Onboarding from './components/Pages/Onboarding';
import { useConnect, useProvider } from '@starknet-react/core';
import useNetworkAccount from './hooks/useNetworkAccount';
import Home from './Home';
import Login from './components/onboarding/Login';
import { NetworkAccountProvider } from './contexts/WalletContex';

function App() {
  const network = useElementStore((state) => state.network);
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
  const [createBurner, setCreateBurner] = useState(false);
  const [onboardComplete, setOnBoardComplete] = useState(false);

  const { loginScreen } = useElementStore();

  const handleIntroComplete = () => {
    setOnBoardComplete(true);
  };


  useEffect(() => {
    async function initializeSetup() {
      if (network) {
        const configProps = networkConfig[network].dojoConfig;
        const result = await setup({
          network,
          setCreateBurner,
          ...configProps
        });
        setSetupResult(result);
      }
    }
    initializeSetup();
  }, [network]);

  useEffect(() => {
    console.log("Login screen status changed to:", loginScreen);
    console.log(network)
    console.log(!onboardComplete && loginScreen)
  }, [loginScreen]);

  if (!network &&  !onboardComplete) {
    console.log("called", !network)
    return (
      <>
           <Onboarding onOnboardComplete={handleIntroComplete}/>
      </>
    );
  }

  
  return (
    <React.StrictMode>
      <StarknetProvider network={network}>
        <TooltipProvider>
          <AudioSettingsProvider>
            {(loginScreen) ? (
                <Login
                  onOnboardComplete ={handleIntroComplete}
                />
            ) : (!setupResult) ? (
              <div className="font-vt323 w-full relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://res.cloudinary.com/dydj8hnhz/image/upload/v1722350662/p1qgfdio6sv1khctclnq.webp')" }}>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-8 w-96 rounded-lg uppercase text-white text-4xl bg-stone-500 bg-opacity-80 text-center py-2">
                  Command Nexus
                </div>
                <div className="h-full flex pt-16 justify-center items-center backdrop-blur-sm bg-black bg-opacity-30">
                  <Loading text="Preparing the battlefield" />
                </div>
              </div>
            ) : (
              <DojoProvider value={setupResult}>
                <NetworkAccountProvider>
                    <Home />
                </NetworkAccountProvider>
              </DojoProvider>
            )}
          </AudioSettingsProvider>
        </TooltipProvider>
      </StarknetProvider>
    </React.StrictMode>
  );
}

function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(<App />);
}

init();