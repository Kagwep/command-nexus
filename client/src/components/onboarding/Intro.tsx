import { Button } from "../buttons/Button";
import { useUiSounds, soundSelector } from "../../hooks/useUiSound"
import { useElementStore, Network } from "../../utils/nexus";
import { FaUser } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeOff } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";

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

  let network = "";

  if (import.meta.env.VITE_PUBLIC_NETWORK === "development") {
    network = "sepolia";
  } else {
    network = import.meta.env.VITE_PUBLIC_NETWORK!;
  }

  return (
    <div className="min-h-screen  flex flex-col items-center  " style={{
      backgroundImage: 'url("https://res.cloudinary.com/dydj8hnhz/image/upload/v1722520527/skvkbgqsetkwstif4ss8.webp")',
      backgroundSize: 'cover',
     
    }}>
      <Button
        variant={"outline"}
        onClick={() => {
          setIsMuted(!isMuted);
          clickPlay();
        }}
        className="fixed top-1 left-1 sm:top-20 sm:left-20 xl:px-5"
      >
        {isMuted ? (
          <FaVolumeOff className="w-10 h-10 justify-center fill-white" />
        ) : (
          <FaVolumeUp className="w-10 h-10 justify-center fill-white" />
        )}
      </Button>
      <div className="flex flex-col items-center gap-5 py-20 sm:p-0  my-20">
        <div className="flex flex-col sm:flex-row sm:mt-20 gap-2 sm:gap-10 px-2 sm:p-0 justify-center items-center ">
          <div className="flex flex-col items-center justify-between rounded p-2 sm:p-5 text-center gap-2 sm:gap-10 z-1 h-[250px] sm:h-[425px] 2xl:h-[500px] w-full sm:w-1/3 bg-green-900 text-slate-100">
            <FaUser className="sm:hidden 2xl:block fill-current h-12 sm:h-32" />
            {network === "mainnet" ? (
              <p className="sm:text-xl">
                  Experience the full version of Command Nexus on Starknet {network?.toUpperCase()}. Engage in strategic missions, manage resources, and establish dominance in a global theater!
                </p>
              ) : (
                <p className="sm:text-xl">
                  Explore  Command Nexus on Starknet {network?.toUpperCase()}. Engage in strategic missions, manage resources, and prepare for full-scale deployment!
                </p>
              )}

            <div className="flex flex-col gap-2">
              <Button
                size={"lg"}
                onClick={() => {
                  setLoginScreen(true);
                  setNetwork(network! as Network);
                }}
                disabled={network == "sepolia" ? false : true}
              >
                Play on {network}
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between rounded p-2 sm:p-5 text-center gap-2 sm:gap-10 z-1 h-[250px] sm:h-[425px] 2xl:h-[500px] w-full sm:w-1/3 bg-green-900 text-slate-100">
            <FaQuestion className="sm:hidden 2xl:block fill-current h-12 sm:h-32" />
            <p className="sm:text-xl">
               Engage with Command Nexus on Testnet, enjoying quick strategic simulations without any real funds or stakes involved.
            </p>

            <div className="flex flex-col gap-5">
              <Button
                size={"lg"}
                onClick={() => {
                  setScreen("start");
                  handleOnboarded();
                  onOnboardComplete();
                  setNetwork("katana" as Network);
                }}
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
