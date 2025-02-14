import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Target, Map, Award } from 'lucide-react';

const About: React.FC = () => {
  // Your existing tactics and combatOps arrays...

  const unitTypes = [
    {
      title: 'Infantry',
      desc: 'Versatile ground forces with high adaptability',
      icon: Users
    },
    {
      title: 'Armored',
      desc: 'Heavy combat units with superior firepower',
      icon: Shield
    },
    {
      title: 'Air',
      desc: 'Aerial units providing tactical mobility and strikes',
      icon: Target
    },
    {
      title: 'Naval',
      desc: 'Maritime forces controlling water territories',
      icon: Map
    },
    {
      title: 'Cyber',
      desc: 'Electronic warfare specialists',
      icon: Award
    }
  ];

  const battlefieldInfo = [
    {
      terrain: 'Urban Environment',
      features: [
        'Multi-level engagement zones',
        'Cover system (0-100 rating)',
        'Building and street warfare'
      ]
    },
    {
      terrain: 'Combat Conditions',
      features: [
        'Dynamic weather effects',
        'Visibility impacts',
        'Terrain advantages'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 pt-16 relative">
      {/* Your existing overlay and header... */}
      
      <div className="max-w-6xl mx-auto px-4 py-12 relative">
        <div className="relative bg-black/40 rounded-lg border border-green-500/20">
          {/* Existing terminal header... */}
          
          <div className="p-8 space-y-8">
            {/* Existing title and mission briefing... */}

            {/* New Unit Types Section */}
            <section className="bg-black/30 border border-green-500/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-400 mb-4 pb-2 border-b border-green-500/30">
                COMBAT UNITS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unitTypes.map((unit, index) => (
                  <div key={index} className="p-4 bg-green-900/10 border border-green-500/20 rounded flex items-start space-x-3">
                    <unit.icon className="w-6 h-6 text-green-400 mt-1" />
                    <div>
                      <h4 className="text-green-400 font-mono mb-1">{unit.title}</h4>
                      <p className="text-green-100/70 text-sm">{unit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Your existing combat ops and tactics sections... */}

            {/* New Battlefield Section */}
            <section className="bg-black/30 border border-green-500/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-400 mb-4 pb-2 border-b border-green-500/30">
                BATTLEFIELD DYNAMICS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {battlefieldInfo.map((info, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-xl font-mono text-green-400">{info.terrain}</h3>
                    <ul className="space-y-2">
                      {info.features.map((feature, fIndex) => (
                        <li key={fIndex} className="text-green-100/70 flex items-center">
                          <span className="text-green-500 mr-2">›</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Victory Conditions Section */}
            <section className="bg-black/30 border border-green-500/20 p-6 rounded-lg">
              <h2 className="text-2xl font-mono text-green-400 mb-4 pb-2 border-b border-green-500/30">
                VICTORY PROTOCOLS
              </h2>
              <div className="space-y-4">
                <div className="bg-green-900/10 border border-green-500/20 p-4 rounded">
                  <h4 className="text-green-400 font-mono mb-2">Primary Objective</h4>
                  <p className="text-green-100/70">Achieve 5 confirmed enemy unit eliminations to secure battlefield dominance</p>
                </div>
                <div className="bg-green-900/10 border border-green-500/20 p-4 rounded">
                  <h4 className="text-green-400 font-mono mb-2">Scoring Matrix</h4>
                  <ul className="space-y-2">
                    <li className="text-green-100/70">• Unit-specific elimination rewards</li>
                    <li className="text-green-100/70">• Tactical position control bonuses</li>
                    <li className="text-green-100/70">• Resource management efficiency</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;