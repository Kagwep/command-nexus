import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useUiSounds, soundSelector } from "../hooks/useUiSound";
import { useElementStore } from "../utils/nexus";
import { useNetwork } from "../context/NetworkContext";

interface IntroProps {
  onOnboardComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onOnboardComplete }) => {
  const {
    setLoginScreen,
    setScreen,
    handleOnboarded,
    setIsMuted,
    isMuted,
  } = useElementStore();

  const { network } = useNetwork(); // Get the already selected network
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { account, status } = useAccount();

  const cartridgeConnector = connectors[0];
  const { play: clickPlay } = useUiSounds(soundSelector.bg);

  // Handle continue button click
  const handleContinue = () => {
    // For mainnet/sepolia, check wallet connection
    if ((network === "mainnet" || network === "sepolia") && status !== "connected") {
      // Attempt to connect wallet
      connect({ connector: cartridgeConnector });
    } else {
      // For testnet or already connected wallets, proceed
      setScreen("start");
      handleOnboarded();
      onOnboardComplete();
      if (network !== "katana") {
        setLoginScreen(true);
      }
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900">
      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            if (!isMuted) {
              //clickPlay(); // Only play sound if not muted
            }
            toggleSound();
          }}
          className="p-2 rounded-full bg-gray-800/50 border border-green-900/30 
                   text-green-400 hover:bg-gray-700/50 hover:border-green-700/30"
        >
          {isMuted ? (
            <span className="text-xl">🔇</span>
          ) : (
            <span className="text-xl">🔊</span>
          )}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 py-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-green-400 tracking-[0.2em] font-mono">
          COMMAND NEXUS
        </h1>
        
        <div className="w-full max-w-2xl bg-gray-800/50 border border-green-900/30 backdrop-blur-sm p-6 rounded-lg">
          <h2 className="text-2xl font-mono text-green-300 mb-4">MISSION BRIEFING</h2>
          <p className="text-green-100/90 mb-4">
            Welcome, Commander. You have been granted access to the Command Nexus strategic control system. 
            Your mission is to establish dominance through tactical deployment and resource management.
          </p>
          <p className="text-green-100/90 mb-6">
            Proceed with caution. The battlefield awaits your command.
          </p>
          
          <div className="w-full bg-black/30 rounded-lg p-2 mb-6">
            <div className="flex items-center justify-center">
              <img 
                src="/nec.jpg" 
                alt="Command Nexus Tactical Map" 
                className="rounded border border-green-700/30 max-w-full"
              />
            </div>
            <p className="text-xs text-center text-green-500/70 mt-2 font-mono">
              TACTICAL OVERVIEW: COMMAND NEXUS THEATER OF OPERATIONS
            </p>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/50 border border-green-700/30">
                <div className={`w-2 h-2 rounded-full ${
                  network === "mainnet" ? "bg-emerald-500" : 
                  network === "sepolia" ? "bg-blue-500" : "bg-amber-500"
                }`} />
                <span className="text-xs font-mono uppercase tracking-wider text-green-300">
                  {network}
                </span>
              </div>
              
              {(network === "mainnet" || network === "sepolia") && (
                <div className={`px-2 py-1 rounded-full text-xs font-mono ${
                  status === "connected" ? "bg-green-900/50 text-green-300" : "bg-gray-800/50 text-gray-400"
                }`}>
                  {status === "connected" ? "WALLET CONNECTED" : "WALLET REQUIRED"}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-green-800 text-green-100 font-mono tracking-wider 
                  border border-green-700/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-700 hover:border-green-600/50
                  active:scale-95"
          >
            {(network === "mainnet" || network === "sepolia") && status !== "connected" 
              ? "CONNECT WALLET" 
              : "CONTINUE TO COMMAND CENTER"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro;