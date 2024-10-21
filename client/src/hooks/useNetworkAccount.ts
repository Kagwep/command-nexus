import { useAccount } from "@starknet-react/core";
import { useDojo } from "../dojo/useDojo";
import { useElementStore } from "../utils/nexus";
import { Account } from "starknet";
import { useMemo, useCallback, useEffect, useRef } from "react";

export default function useNetworkAccount() {
  const network = useElementStore((state) => state.network);
  const { account: starknetAccount, status: starknetStatus, isConnected: starknetIsConnected } = useAccount();
  const { account: { account: katanaAccount } } = useDojo();

  const prevNetworkRef = useRef(network);

  const getAccountInfo = useCallback(() => {
    if (network === "sepolia" || network === "mainnet") {
      return {
        account: starknetAccount,
        status: starknetStatus,
        isConnected: starknetIsConnected,
      };
    } else {
      return {
        account: katanaAccount as Account,
        status: "connected" as const,
        isConnected: true,
      };
    }
  }, [network, starknetAccount, starknetStatus, starknetIsConnected, katanaAccount]);

  const accountInfo = useMemo(() => {
    const info = getAccountInfo();
    return {
      ...info,
      address: info.account?.address || null,
    };
  }, [getAccountInfo]);


  useEffect(() => {
    if (network !== prevNetworkRef.current) {
      console.log("Network changed:", network);
      prevNetworkRef.current = network;
    }
  }, [network]);

  useEffect(() => {
    //console.log("Account info updated:", accountInfo);
  }, [accountInfo]);

  return accountInfo;
}