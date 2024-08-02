import { Button } from "../../buttons/Button";
import { getWalletConnectors } from "../../../lib/connectors";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useElementStore } from "../../../utils/nexus";
import React, { useEffect } from "react";

interface WalletSectionProps {
  onOnboardComplete: () => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({onOnboardComplete}) => {

  const { connectors, connect, } = useConnect();
  const { disconnect } = useDisconnect();
  const walletConnectors = getWalletConnectors(connectors);
  const username = useElementStore((state) => state.username);
  const { address, isConnected, account } = useAccount();

  const {
    setLoginScreen,
    setScreen,
    handleOnboarded,
    setNetwork,
    setIsMuted,
    isMuted,
  } = useElementStore();

  useEffect(() => {
    if (isConnected && address) {
      console.log(" We have fount that this is already connected",address, account);

      onOnboardComplete();
      setLoginScreen(false);
    }
  }, [isConnected, address, onOnboardComplete]);
  return (
    <>
      <div className="flex flex-col items-center justify-between border border-terminal-green p-5 text-center gap-10 z-1 h-[400px] sm:h-[425px] 2xl:h-[500px] bg-green-800 text-slate-100" >
      <h4 className="text-4xl font-bold text-terminal-green mb-6 uppercase text-center">Login</h4>
        <p className="text-terminal-green mb-8 text-center">
          Login with your Starknet account to play
        </p>
        <div className="hidden sm:flex flex-col">
          {walletConnectors.map((connector, index) => (
            <Button
              className="text-orange-600"
              onClick={() => {
                disconnect();
                connect({ connector });
              }}
              key={index}
            >
              {connector.id === "braavos" || connector.id === "argentX"
                ? `Login With ${connector.id}`
                : connector.id === "argentWebWallet"
                ? "Login With Email"
                : "Login with Cartridge Controller"}
            </Button>
          ))}
        </div>
        <div className="sm:hidden flex flex-col gap-2">
          {walletConnectors.map((connector, index) => (
            <Button
              size={"lg"}
      
              onClick={() => {
                disconnect();
                connect({ connector });
              }}
              key={index}
            >
              {connector.id === "braavos" || connector.id === "argentX"
                ? `Login With ${connector.id}`
                : connector.id === "argentWebWallet"
                ? "Login With Email"
                : "Login with Cartridge Controller"}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default WalletSection;
