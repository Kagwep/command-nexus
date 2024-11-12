import { useElementStore } from './utils/nexus';
import React from "react";
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import './App.css';
import InitGame from "./InitGame";
import Intro from "./components/Intro";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/90 border-b border-green-900/30 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-green-400 font-mono text-xl tracking-wider hover:text-green-300 transition-colors">
              COMMAND NEXUS
            </Link>
          </div>
          <Link
            to="/about"
            className="text-green-400/80 font-mono tracking-wide hover:text-green-300 transition-colors"
          >
            ABOUT
          </Link>
        </div>
      </div>
    </nav>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-mono text-green-400 mb-6">About Command Nexus</h1>
        <div className="prose prose-invert prose-green">
          <p className="text-green-100/90">
            Command Nexus is a modern warfare strategy game built on StarkNet. 
            Command your forces, manage resources, and establish strategic dominance 
            across multiple networks.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const network = useElementStore((state) => state.network);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={network ? <InitGame /> : <Intro onOnboardComplete={() => {}} />} 
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;