import React,{ useState,useCallback,useEffect } from "react";
import { TextField } from "@mui/material";
import Canvas from "./components/Game/Logic/CommandNexus";
import socket from './socket';
import CustomDialog from "./components/Customs/CustomDialog";
import InitGame from "./InitGame";
import { useGetPlayers } from './hooks/useGetPlayers';
import { useElementStore } from './utils/nexus';
import MainMenu from "./components/MainMenu";
import { useMe } from "./hooks/useMe";
import { SpeedInsights } from '@vercel/speed-insights/react';
import GameState from './utils/gamestate';
import Lobby from './components/Lobby';
import { dojoConfig } from '../dojoConfig';
import { setup, SetupResult } from './dojo/generated/setup';
import { DojoProvider } from './dojo/DojoContext';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { AudioSettingsProvider } from './contexts/AudioContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';



function Game() {

  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const result = await setup(dojoConfig);
        console.log("This is the result",result)
        setSetupResult(result);
      } catch (error) {
        console.error('Setup failed', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  if (isLoading) {
    return (
      <div 
        className="font-vt323 w-full relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dydj8hnhz/image/upload/v1722350662/p1qgfdio6sv1khctclnq.webp')" }}
      >
        <div className="absolute left-1/2 transform -translate-x-1/2 top-8 w-96 rounded-lg uppercase text-white text-4xl bg-stone-500 bg-opacity-80 text-center py-2">
          Command Nexus
        </div>
        <div className="h-full flex pt-16 justify-center items-center backdrop-blur-sm bg-black bg-opacity-30">
          <Loading text="Preparing the battlefield" />
        </div>
      </div>
    );
  }  
    return  (
        <>
       <DojoProvider value={setupResult}>
          <TooltipProvider>
            <AudioSettingsProvider>
                <InitGame />
            </AudioSettingsProvider>
          </TooltipProvider>
        </DojoProvider>
        </>
      );
}

export default Game;