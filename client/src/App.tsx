import { useElementStore } from './utils/nexus';
import React from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import InitGame from "./InitGame";
import Intro from "./components/Intro";
import Navbar from './components/Navbar';
import About from './components/About';



function App() {


  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path="/" element={<InitGame />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
);
}

export default App;