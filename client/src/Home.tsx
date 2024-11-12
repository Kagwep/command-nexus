import React,{ useState,useCallback,useEffect } from "react";
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import InitGame from "./InitGame";

function Home() {
  

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
