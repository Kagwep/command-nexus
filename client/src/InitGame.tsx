import React, { useState, useCallback, useEffect } from "react";
import { useElementStore } from './utils/nexus';
import MainMenu from "./components/MainMenu";
import GameState from './utils/gamestate';
import Lobby from './components/Lobby';
import useNetworkAccount from "./hooks/useNetworkAccount";
import CommandNexus from "./components/Game/CommandNexus";


const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("ESTABLISHING CONNECTION");
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText((prev) => {
        const texts = [
          "ESTABLISHING CONNECTION",
          "AUTHENTICATING CREDENTIALS",
          "ACCESSING SECURE CHANNEL",
          "INITIALIZING PROTOCOLS",
          "VERIFYING CLEARANCE"
        ];
        const currentIndex = texts.indexOf(prev);
        return texts[(currentIndex + 1) % texts.length];
      });
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 500);

    return () => {
      clearInterval(textInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      {/* Tactical Grid Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0f0 1px, transparent 1px),
            linear-gradient(to bottom, #0f0 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      <div className="relative z-10 w-full max-w-md p-6">
        {/* Terminal Window */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-900/30 rounded-lg overflow-hidden shadow-lg">
          {/* Terminal Header */}
          <div className="bg-gray-800/50 px-4 py-2 border-b border-green-900/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
          </div>
          
          {/* Terminal Content */}
          <div className="p-4 font-mono text-sm">
            <div className="space-y-2">
              <p className="text-green-500">
                - COMMAND_NEXUS v1.0.0
              </p>
              <p className="text-green-400/70">
                - INITIALIZING SECURE BOOT SEQUENCE...
              </p>
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 animate-pulse"></div>
                <span>{loadingText}{'.'.repeat(dots)}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4 h-1 bg-green-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-500/50 animate-pulse" 
                  style={{width: '60%'}}></div>
              </div>
              
              {/* Status Messages */}
              <div className="mt-4 space-y-1 text-xs text-green-400/50">
                <p>{">"} SECURE CHANNEL: PENDING</p>
                <p>{">"} ACCOUNT VERIFICATION: IN PROGRESS</p>
                <p>{">"} NETWORK STATUS: ACTIVE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InitGame = () => {
  const { account } = useNetworkAccount();
  const { game_state } = useElementStore((state) => state);

  

  return (
    <>
      {account ? (
        <div className="bg-black pb-4 py-12">
          {game_state === GameState.MainMenu && <MainMenu />}
          {game_state === GameState.Lobby && <Lobby />}
          {game_state === GameState.Game && <CommandNexus />}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default InitGame;