import { formatCurrency } from "../../../lib/utils";
import { Button } from "../../buttons/Button";
import { Section } from "../../Pages/Onboarding";
import { networkConfig } from "../../../lib/networkConfig";
import { Network } from "../../../utils/nexus";
import { FaCheckCircle, FaInfo } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";


interface EthSectionProps {
  step: number;
  eth: number;
  onMainnet: boolean;
  network: Network;
  setSection: (section: Section) => void;
}

const EthSection = ({
  step,
  eth,
  onMainnet,
  network,
  setSection,
}: EthSectionProps) => {
  return (
    <>
      {step !== 2 && (
        <>
          <div className="absolute top-0 left-0 right-0 bottom-0 h-full w-full bg-black opacity-50 z-10" />
          {step > 2 ? (
            <div className="absolute flex flex-col w-1/2 top-1/4 right-1/4 z-20 items-center">
              <span className="flex flex-row text-center text-xl">
                You have {formatCurrency(eth)} ETH
              </span>
              <FaCheckCircle />
            </div>
          ) : (
            <div className="absolute w-1/2 top-1/4 right-1/4 z-20 text-center text-2xl uppercase">
              Complete {step}
            </div>
          )}
        </>
      )}
      <div className="flex flex-col items-center justify-between sm:border sm:border-terminal-green p-5 text-center gap-5 h-[400px] sm:h-[425px] 2xl:h-[500px]">
        <h4 className="m-0 uppercase text-3xl">Get ETH</h4>
        <FaEthereum className="sm:hidden 2xl:block h-16" />
        <p className="text-xl sm:text-base">
          Balance: {formatCurrency(eth)} ETH
        </p>
        <p className="text-xl">
          ETH is required to play Loot Survivor on{" "}
          <span className="uppercase">{network}</span> to pay for transactions
          and verifiable randomness.
        </p>
        <span
          className="flex items-center justify-center border border-terminal-green w-1/2 p-2 cursor-pointer"
          onClick={() => setSection("eth")}
        >
          <span className="flex flex-row items-center gap-2">
            <p className="uppercase">More Info</p>
            <span className="w-8">
              <FaInfo />
            </span>
          </span>
        </span>
        <span className="w-3/4 h-10">
          <Button
            size={"fill"}
            onClick={() =>
              onMainnet
                ? window.open("https://starkgate.starknet.io//", "_blank")
                : window.open("https://starknet-faucet.vercel.app/", "_blank")
            }
          >
            {onMainnet ? "Bridge Eth" : "Get ETH"}
          </Button>
        </span>
      </div>
    </>
  );
};

export default EthSection;
