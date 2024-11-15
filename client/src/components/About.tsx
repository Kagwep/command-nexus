  // About.tsx
  import React from 'react';
  import { Link } from 'react-router-dom';
import { CombatOperation, TacticCard } from './Navbar';
  
  const About: React.FC = () => {
    const tactics: TacticCard[] = [
      {
        title: 'Stealth Operations',
        desc: 'Execute covert maneuvers to bypass enemy detection systems'
      },
      {
        title: 'Support Protocol',
        desc: 'Deploy medical and reconnaissance units for tactical advantage'
      },
      {
        title: 'Terrain Mastery',
        desc: 'Utilize environmental factors for strategic superiority'
      },
      {
        title: 'Resource Control',
        desc: 'Maintain efficient supply lines and resource allocation'
      }
    ];
  
    const combatOps: CombatOperation[] = [
      { name: 'Deploy', desc: 'Strategic unit placement' },
      { name: 'Patrol', desc: 'Area security operations' },
      { name: 'Attack', desc: 'Offensive maneuvers' },
      { name: 'Defend', desc: 'Tactical position fortification' },
      { name: 'Recon', desc: 'Intelligence gathering' }
    ];
  
    return (
      <div className="min-h-screen bg-gray-900 pt-16 relative">
        {/* Military grid overlay */}
        <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(0deg,rgba(0,255,0,0.03)1px,transparent_1px)] bg-[size:100%_4px]" />
        
        <div className="max-w-4xl mx-auto px-4 py-12 relative">
          <div className="relative bg-black/40 rounded-lg border border-green-500/20">
            {/* Terminal header */}
            <div className="h-8 bg-green-900/20 border-b border-green-500/30 flex items-center px-4">
              <span className="text-green-400 text-sm font-mono">TACTICAL BRIEFING</span>
              <span className="ml-auto text-green-400/50 text-sm font-mono">[CLASSIFIED]</span>
            </div>
            
            <div className="p-8 space-y-8">
              <h1 className="text-4xl font-mono text-green-400 flex items-center justify-center space-x-3">
                <span>⌘</span>
                <span>Command Nexus</span>
                <span>⌘</span>
              </h1>
  
              {/* Mission Briefing */}
              <section className="bg-black/30 border border-green-500/20 p-6 rounded-lg">
                <h2 className="text-2xl font-mono text-green-400 mb-4 pb-2 border-b border-green-500/30">
                  MISSION BRIEFING
                </h2>
                <p className="text-green-100/90 font-mono leading-relaxed">
                  Command Nexus is a next-generation warfare simulation system deployed on StarkNet's secure blockchain infrastructure. 
                  Utilizing advanced Dojo framework protocols, commanders engage in strategic warfare across multiple digital battlefields. 
                  Your mission: establish tactical superiority through strategic unit deployment, resource management, and battlefield control.
                </p>
              </section>
  
              {/* Combat Operations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-black/30 border border-green-500/20 p-6 rounded-lg">
                  <h3 className="text-xl font-mono text-green-400 mb-4 pb-2 border-b border-green-500/30">
                    COMBAT OPERATIONS
                  </h3>
                  <div className="space-y-4">
                    {combatOps.map((op, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="text-green-400 font-mono w-24">{op.name}</span>
                        <span className="text-green-100/80 text-sm">{op.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Advanced Tactics */}
                <div className="bg-black/30 border border-green-500/20 p-6 rounded-lg">
                  <h3 className="text-xl font-mono text-green-400 mb-4 pb-2 border-b border-green-500/30">
                    ADVANCED TACTICS
                  </h3>
                  <div className="space-y-4">
                    {tactics.map((tactic, index) => (
                      <div key={index} className="p-3 bg-green-900/10 border border-green-500/20 rounded">
                        <h4 className="text-green-400 font-mono mb-1">{tactic.title}</h4>
                        <p className="text-green-100/70 text-sm">{tactic.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
  
              {/* Call to Action */}
              <div className="flex justify-center pt-6">
                <Link 
                  to="/play" 
                  className="bg-green-900/30 border-2 border-green-500/30 text-green-400 font-mono 
                            px-8 py-3 rounded hover:bg-green-900/40 hover:border-green-500/40 
                            transition-all duration-300 flex items-center space-x-2"
                >
                  <span>⟨</span>
                  <span>ENTER BATTLEFIELD</span>
                  <span>⟩</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  export default About;