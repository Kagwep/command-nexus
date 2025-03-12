import React from 'react';
import { Network } from "../utils/nexus";

interface NetworkSelectorProps {
  onNetworkSelected: (network: Network) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ onNetworkSelected }) => {
  // Handle network selection
  const handleNetworkSelect = (selectedNetwork: Network) => {
    onNetworkSelected(selectedNetwork);
  };

  const NetworkBadge = ({ type }: { type: string }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/50 border border-green-700/30">
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          type === "mainnet" ? "bg-emerald-500" : 
          type === "sepolia" ? "bg-blue-500" : "bg-amber-500"
        }`} />
        <span className="text-xs font-mono uppercase tracking-wider text-green-300">
          {type}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900">
      <div className="relative z-10 flex flex-col items-center gap-8 py-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-green-400 tracking-[0.2em] font-mono">
          COMMAND NEXUS
        </h1>
        <h2 className="text-xl text-green-300 font-mono tracking-wide">
          SELECT NETWORK
        </h2>

        <div className={`grid grid-cols-1 ${
            import.meta.env.VITE_SEPOLIA === 'false' 
              ? 'md:grid-cols-3' 
              : 'md:grid-cols-2'
          } gap-6 w-full mt-8`}>
          {/* Mainnet Card */}
          <div className="flex flex-col rounded-lg overflow-hidden bg-gray-800/50 border border-green-900/30 backdrop-blur-sm
            transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20">
            <div className="p-6 flex flex-col gap-6 h-full">
              <NetworkBadge type="mainnet" />
              <p className="text-green-100/90 text-lg">
                Command real resources and establish strategic dominance.
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={() => handleNetworkSelect("mainnet")}
                  className="mt-auto w-full py-4 bg-green-800 text-green-100 font-mono tracking-wider 
                  border border-green-700/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-700 hover:border-green-600/50
                  active:scale-95"
                >
                  SELECT MAINNET
                </button>
                <p className="text-xs text-green-400/70 text-center">available on Mainnet</p>
              </div>
            </div>
          </div>

          {/* Sepolia Card */}
          <div className="flex flex-col rounded-lg overflow-hidden bg-gray-800/50 border border-green-900/30 backdrop-blur-sm
            transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20">
            <div className="p-6 flex flex-col gap-6 h-full">
              <NetworkBadge type="sepolia" />
              <p className="text-green-100/90 text-lg">
                Test strategies and prepare for mainnet operations.
              </p>
              <button
                onClick={() => handleNetworkSelect("sepolia")}
                className="mt-auto w-full py-4 bg-green-800 text-green-100 font-mono tracking-wider 
                  border border-green-700/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-700 hover:border-green-600/50
                  active:scale-95"
              >
                SELECT SEPOLIA
              </button>
            </div>
          </div>

          {/* Testnet Card */}
          {import.meta.env.VITE_SEPOLIA === 'false' && (
          <div className="flex flex-col rounded-lg overflow-hidden bg-gray-800/50 border border-green-900/30 backdrop-blur-sm
          transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20">
          <div className="p-6 flex flex-col gap-6 h-full">
            <NetworkBadge type="testnet" />
            <p className="text-green-100/90 text-lg">
              Perfect for training and strategy development.
            </p>
            <button
              onClick={() => handleNetworkSelect("katana")}
              className="mt-auto w-full py-4 bg-green-800 text-green-100 font-mono tracking-wider 
                border border-green-700/50 rounded-lg shadow-lg shadow-green-900/20
                transition-all duration-300 hover:bg-green-700 hover:border-green-600/50
                active:scale-95"
            >
              SELECT TESTNET
            </button>
          </div>
        </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkSelector;