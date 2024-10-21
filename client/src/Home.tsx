import React,{ useState,useCallback,useEffect } from "react";
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import { useGetPlayers } from './hooks/useGetPlayers';
import { useElementStore } from './utils/nexus';
import { useMe } from "./hooks/useMe";
import InitGame from "./InitGame";

function Home() {
  
  const { game_state, battleReport, setBattleReport } = useElementStore((state) => state);


  const { players } = useGetPlayers();
  const { me } = useMe();

  //console.log(" Lets see whats happening ",players, me)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<InitGame />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default Home
