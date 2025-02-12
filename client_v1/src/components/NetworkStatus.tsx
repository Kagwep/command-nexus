import React from 'react';
import { Activity, Shield, Wifi, WifiOff } from 'lucide-react';

const NetworkStatus = ({ network = 'local' }) => {
  const getNetworkColor = (net: string) => {
    switch (net.toLowerCase()) {
      case 'mainnet':
        return 'bg-emerald-500';
      case 'sepolia':
        return 'bg-blue-500';
      case 'local':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        bg-gray-900/90 border border-green-900/50
        backdrop-blur-sm shadow-lg
        text-green-50 font-mono text-sm
      `}>
        <div className={`w-2 h-2 rounded-full animate-pulse ${getNetworkColor(network)}`} />
        <span className="uppercase tracking-wider">{network}</span>
        <Activity className="w-4 h-4 text-green-400" />
      </div>
    </div>
  );
};

export default NetworkStatus;