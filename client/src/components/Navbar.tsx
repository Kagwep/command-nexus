// types.ts
export interface TacticCard {
    title: string;
    desc: string;
  }
  
  export interface CombatOperation {
    name: string;
    desc: string;
  }
  
  // Navbar.tsx
  import React from 'react';
  import { Link } from 'react-router-dom';
  
  const Navbar: React.FC = () => {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/90 border-b border-green-500/30 backdrop-blur-sm z-50">
        <div className="relative">
          {/* Scanline effect using Tailwind only */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-green-500/5 to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link 
                  to="/" 
                  className="text-green-400 font-mono text-xl tracking-wider hover:text-green-300 transition-colors flex items-center space-x-2"
                >
                  <span>◈</span>
                  <span>COMMAND NEXUS</span>
                  <span>◈</span>
                </Link>
              </div>
              <Link
                to="/about"
                className="text-green-400/80 font-mono tracking-wide hover:text-green-300 transition-colors flex items-center space-x-2"
              >
                <span>〔</span>
                <span>ABOUT</span>
                <span>〕</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  

  
  export default Navbar;