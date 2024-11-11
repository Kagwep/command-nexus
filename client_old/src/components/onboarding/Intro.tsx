import { Button } from "../buttons/Button";
import { useUiSounds, soundSelector } from "../../hooks/useUiSound"
import { useElementStore, Network } from "../../utils/nexus";
import { FaVolumeUp, FaVolumeOff } from "react-icons/fa";

interface IntroProps {
  onOnboardComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({onOnboardComplete}) => {
  const {
    setLoginScreen,
    setScreen,
    handleOnboarded,
    setNetwork,
    setIsMuted,
    isMuted,
  } = useElementStore();

  const { play: clickPlay } = useUiSounds(soundSelector.click);

  const network = import.meta.env.VITE_PUBLIC_NETWORK === "development" ? "sepolia" : import.meta.env.VITE_PUBLIC_NETWORK!;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-green-900 to-green-950" style={{
      backgroundImage: 'url("")',
      backgroundSize: 'cover',
      backgroundBlendMode: 'overlay',
    }}>
      <Button
        variant={"outline"}
        onClick={() => {
          setIsMuted(!isMuted);
          clickPlay();
        }}
        className="fixed top-1 left-1 sm:top-20 sm:left-20 xl:px-5 bg-green-800 hover:bg-green-700 text-white border-green-600"
      >
        {isMuted ? (
          <FaVolumeOff className="w-10 h-10 justify-center fill-current" />
        ) : (
          <FaVolumeUp className="w-10 h-10 justify-center fill-current" />
        )}
      </Button>
      <div className="flex flex-col items-center gap-8 py-20 sm:p-0 my-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-6xl font-bold text-green-300 mb-10 tracking-wider">Command Nexus</h1>
        <div className="flex flex-col sm:flex-row sm:mt-20 gap-8 justify-center items-stretch w-full">
          <div className="flex flex-col items-center justify-between rounded-lg overflow-hidden bg-green-800 bg-opacity-80 text-green-100 shadow-lg border border-green-600 w-full sm:w-1/2">
            <div className="w-full p-4 flex justify-center items-center bg-green-900">
              <img 
                src="https://res.cloudinary.com/dydj8hnhz/image/upload/v1722520527/skvkbgqsetkwstif4ss8.webp" 
                alt="Strategic Command Center" 
                className="w-full h-48 object-contain rounded"
              />
            </div>
            <div className="p-6 sm:p-8 text-center flex flex-col gap-6 flex-grow">
              {network === "mainnet" ? (
                <p className="sm:text-xl">
                  Experience the full version of Command Nexus on Starknet {network.toUpperCase()}. Engage in strategic missions, manage resources, and establish dominance in a global theater!
                </p>
              ) : (
                <p className="sm:text-xl">
                  Explore Command Nexus on Starknet {network.toUpperCase()}. Engage in strategic missions, manage resources, and prepare for full-scale deployment!
                </p>
              )}
              <Button
                size={"lg"}
                onClick={() => {
                  setLoginScreen(true);
                  setNetwork(network as Network);
                }}
                disabled={network !== "sepolia"}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-md shadow-md transition-colors duration-300 mt-auto"
              >
                Play on {network}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between rounded-lg overflow-hidden bg-green-800 bg-opacity-80 text-green-100 shadow-lg border border-green-600 w-full sm:w-1/2">
            <div className="w-full p-4 flex justify-center items-center bg-green-900">
              <img 
                src="https://res.cloudinary.com/dydj8hnhz/image/upload/v1727441967/wfswefxwmos8hc3e0360.webp" 
                alt="Virtual Warfare Simulation" 
                className="w-full h-48 object-contain rounded"
              />
            </div>
            <div className="p-6 sm:p-8 text-center flex flex-col gap-6 flex-grow">
              <p className="sm:text-xl">
                Engage with Command Nexus on Testnet, enjoying quick strategic simulations without any real funds or stakes involved.
              </p>
              <Button
                size={"lg"}
                onClick={() => {
                  setScreen("start");
                  handleOnboarded();
                  onOnboardComplete();
                  setNetwork("katana" as Network);
                }}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-md shadow-md transition-colors duration-300 mt-auto"
              >
                Play on Testnet
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;