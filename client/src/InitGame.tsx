import React,{ useState,useCallback,useEffect } from "react";
import { TextField } from "@mui/material";
import Canvas from "./components/Game/Logic/CommandNexus";
import socket from './socket';
import CustomDialog from "./components/Customs/CustomDialog";
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



export interface ServerJoinRoomResponse {

}


export interface InitGameProps {

    
}

const InitGame = () => {
  const { game_state, battleReport, setBattleReport } = useElementStore((state) => state);


  const { players } = useGetPlayers();
  const { me } = useMe();

  console.log(" Lets see whats happening ",players, me)


  return (
    <>
    {game_state === GameState.MainMenu && <MainMenu />}
    {game_state === GameState.Lobby && <Lobby />}
    
    </>
  );
}

export default InitGame;