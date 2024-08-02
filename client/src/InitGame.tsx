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
import useNetworkAccount from "./hooks/useNetworkAccount";
import { useAccount } from "@starknet-react/core";

export interface ServerJoinRoomResponse {

}


export interface InitGameProps {

    
}

const InitGame = () => {

  const { account, address, status, isConnected } = useNetworkAccount();
  
  const { game_state, battleReport, setBattleReport } = useElementStore((state) => state);

  return (

    <>

    {account ? (

    <div className="bg-black pb-4">
    {game_state === GameState.MainMenu && <MainMenu />}
    {game_state === GameState.Lobby && <Lobby />}

    </div>
    ):(

      <p> waiting for account </p>
    )}
    
    
    
    </>

  );
}

export default InitGame;