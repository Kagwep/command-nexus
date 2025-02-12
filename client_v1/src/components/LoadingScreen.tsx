import React, { useEffect, useState } from 'react';
import { Loader2, Shield, Signal, Radio, Wifi } from 'lucide-react';

const LoadingScreen = ({ message = "Initializing Command Nexus..." }) => {
  const [dots, setDots] = useState('');
  const [statusMessage, setStatusMessage] = useState('Establishing secure connection');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const messageInterval = setInterval(() => {
      setStatusMessage(prev => {
        const messages = [
          'Establishing secure connection',
          'Verifying credentials',
          'Loading tactical interface',
          'Synchronizing network protocols',
          'Initializing command systems'
        ];
        const currentIndex = messages.indexOf(prev);
        return messages[(currentIndex + 1) % messages.length];
      });
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev + 1) % 100);
    }, 50);

    return () => {
      clearInterval(dotInterval);
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      {/* Main container */}
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-lg border border-green-500/20 p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-500" />
            <h1 className="text-green-500 font-mono text-xl">COMMAND NEXUS</h1>
          </div>
          <div className="flex space-x-3">
            <Signal className="w-5 h-5 text-green-500/80 animate-pulse" />
            <Radio className="w-5 h-5 text-green-500/60 animate-pulse" />
            <Wifi className="w-5 h-5 text-green-500/40 animate-pulse" />
          </div>
        </div>

        {/* Loading animation */}
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          <div className="text-green-400/90 font-mono text-sm">
            {statusMessage}{dots}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500/50 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-mono text-green-500/60">
            <span>SECURITY LEVEL: ALPHA</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* System messages */}
        <div className="bg-black/30 rounded p-3 font-mono text-xs space-y-1">
          <p className="text-green-500/80">$ System initialization in progress...</p>
          <p className="text-green-500/60">$ Authenticating command protocols...</p>
          <p className="text-green-500/40">$ Standing by for tactical deployment...</p>
        </div>
      </div>

      {/* Footer status */}
      <div className="mt-4 text-green-500/40 text-xs font-mono">
        CLASSIFICATION LEVEL: RESTRICTED
      </div>
    </div>
  );
};

export default LoadingScreen;