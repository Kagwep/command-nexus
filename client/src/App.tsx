import { useElementStore } from './utils/nexus';
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import InitGame from "./InitGame";

import About from './components/About';
import { useNetworkAccount } from './context/WalletContex';
import { useSDK } from './context/SDKContext';
import { useDojoStore } from './lib/utils';



function App() {

 
  return (
    <BrowserRouter>
       
        <Routes>
            <Route path="/" element={<InitGame />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);
}

export default App;