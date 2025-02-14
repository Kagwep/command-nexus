import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useUiSounds, soundSelector } from "../hooks/useUiSound";
import { useElementStore, Network } from "../utils/nexus";

interface IntroProps {
  onOnboardComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onOnboardComplete }) => {
  const {
    setLoginScreen,
    setScreen,
    handleOnboarded,
    setNetwork,
    setIsMuted,
    isMuted,
  } = useElementStore();

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { account, status } = useAccount();

  const cartridgeConnector = connectors[0];
  const { play: clickPlay } = useUiSounds(soundSelector.click);

  // Helper function to handle network selection with wallet check
  const handleNetworkSelect = (selectedNetwork: Network) => {
   
    if (selectedNetwork === "katana") {
      // For testnet, proceed without wallet
      setScreen("start");
      handleOnboarded();
      onOnboardComplete();
      setNetwork(selectedNetwork);
    } else {
      // For mainnet/sepolia, check wallet connection
      if (status === "connected") {
        setScreen("start");
        handleOnboarded();
        onOnboardComplete();
        setLoginScreen(true);
        setNetwork(selectedNetwork);
      } else {
        // Attempt to connect wallet
        connect({ connector: cartridgeConnector });
      }
    }
  };

  // Button text based on wallet status and network
  const getButtonContent = (network: Network) => {
    if (network === "katana") return "INITIATE";
    if (status === "connected") return `INITIATE`;
    return "CONNECT WALLET";
  };

  const NetworkBadge = ({ type, connected }: { type: string; connected?: boolean }) => (
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
      {(type === "mainnet" || type === "sepolia") && (
        <div className={`px-2 py-1 rounded-full text-xs font-mono ${
          connected ? "bg-green-900/50 text-green-300" : "bg-gray-800/50 text-gray-400"
        }`}>
          {connected ? "CONNECTED" : "WALLET REQUIRED"}
        </div>
      )}
    </div>
  );

  // Rest of your component remains the same until the buttons...

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900">
      {/* ... Previous background and sound button code ... */}

      <div className="relative z-10 flex flex-col items-center gap-8 py-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-green-400 tracking-[0.2em] font-mono">
          COMMAND NEXUS
        </h1>

        <div className={`grid grid-cols-1 ${
            import.meta.env.VITE_SEPOLIA === 'false' 
              ? 'md:grid-cols-3' 
              : 'md:grid-cols-2'
          } gap-6 w-full mt-8`}>
          {/* Mainnet Card */}
          <div className="flex flex-col rounded-lg overflow-hidden bg-gray-800/50 border border-green-900/30 backdrop-blur-sm
            transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20">
            {/* ... Card image remains the same ... */}
            <div className="p-6 flex flex-col gap-6 h-full">
              <NetworkBadge type="mainnet" connected={status === "connected"} />
              <p className="text-green-100/90 text-lg">
                Command real resources and establish strategic dominance.
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  disabled
                  className="w-full py-4 bg-gray-700 text-gray-300 font-mono tracking-wider 
                    border border-gray-600/50 rounded-lg cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  COMING SOON
                </button>
                <p className="text-xs text-green-400/70 text-center">Mainnet deployment in preparation</p>
              </div>
            </div>
          </div>

          {/* Sepolia Card */}
          <div className="flex flex-col rounded-lg overflow-hidden bg-gray-800/50 border border-green-900/30 backdrop-blur-sm
            transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20">
            {/* ... Card image remains the same ... */}
            <div className="p-6 flex flex-col gap-6 h-full">
              <NetworkBadge type="sepolia" connected={status === "connected"} />
              <p className="text-green-100/90 text-lg">
                Test strategies and prepare for mainnet operations.
              </p>
              <button
                onClick={() => handleNetworkSelect("sepolia" as Network)}
                className="mt-auto w-full py-4 bg-green-800 text-green-100 font-mono tracking-wider 
                  border border-green-700/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-700 hover:border-green-600/50
                  active:scale-95 disabled:bg-gray-700 disabled:cursor-not-allowed"
              >
                {getButtonContent("sepolia" as Network)}
              </button>
            </div>
          </div>

          {/* Testnet Card */}
          {import.meta.env.VITE_SEPOLIA === 'false' && (
          <div className="flex flex-col rounded-lg overflow-hidden bg-gray-800/50 border border-green-900/30 backdrop-blur-sm
          transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-900/20">
          {/* ... Card image remains the same ... */}
          <div className="p-6 flex flex-col gap-6 h-full">
            <NetworkBadge type="testnet" />
            <p className="text-green-100/90 text-lg">
              Perfect for training and strategy development.
            </p>
            <button
              onClick={() => handleNetworkSelect("katana" as Network)}
              className="mt-auto w-full py-4 bg-green-800 text-green-100 font-mono tracking-wider 
                border border-green-700/50 rounded-lg shadow-lg shadow-green-900/20
                transition-all duration-300 hover:bg-green-700 hover:border-green-600/50
                active:scale-95"
            >
              INITIATE
            </button>
          </div>
        </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Intro;