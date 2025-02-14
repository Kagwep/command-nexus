import React, { useState } from 'react';
import { ChevronRight, Monitor, X, Shield, Users, Target, Map, Award } from 'lucide-react';
import About from './About';  // Import your About component

const LandingPage = ({ onStartGame }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const TutorialModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/90 border border-green-500/20 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-green-500 text-xl font-mono">Command Training Protocol</h3>
          <button 
            onClick={() => setShowTutorial(false)}
            className="text-green-500 hover:text-green-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 text-green-400/80 font-mono">
          <p>// Training modules initializing...</p>
          <div className="bg-black/30 rounded p-4">
            <p className="text-green-500/60">Tutorial content will be deployed here.</p>
            <p className="text-green-500/40 text-sm mt-2">Status: In Development</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AboutModal = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto">
      <div className="relative w-full  max-w-6xl mx-4 bg-black/40">
        {/* Close button */}
        <button 
          onClick={() => setShowAbout(false)}
          className="absolute right-4  text-green-500 hover:text-green-400 z-10 bg-black/40 p-1 rounded-lg"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Scrollable container */}
        <div className="h-full  overflow-y-auto scrollbar-thin scrollbar-track-green-900/20 scrollbar-thumb-green-500/20 hover:scrollbar-thumb-green-500/30">
          <div className="bg-black/40 border border-green-500/20 rounded-lg">
            <About />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Matrix-like canvas background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-950/20 via-gray-900 to-gray-900" />

      {/* Main content */}
      <div className="relative flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <Monitor className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-green-400 text-sm font-mono">Command System v1.0</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-mono">
              Command Nexus
              <span className="block text-green-500 text-3xl md:text-4xl mt-2">
                Strategic Warfare Evolved
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-mono">
              Master the battlefield in a revolutionary tactical combat game where position, strategy, and unit synergy determine victory.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button 
                onClick={onStartGame}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-mono font-semibold flex items-center justify-center group"
              >
                Initialize Command
                <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={() => setShowAbout(true)}
                className="border border-green-500 hover:bg-green-900/30 text-green-400 px-8 py-3 rounded-lg font-mono font-semibold"
              >
                Command Overview
              </button>
              <button 
                onClick={() => setShowTutorial(true)}
                className="border border-green-500 hover:bg-green-900/30 text-green-400 px-8 py-3 rounded-lg font-mono font-semibold"
              >
                Training
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid overlay effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      {showTutorial && <TutorialModal />}
      {showAbout && <AboutModal />}
    </div>
  );
};

export default LandingPage;