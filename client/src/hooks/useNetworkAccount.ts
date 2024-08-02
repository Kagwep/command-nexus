import { useAccount } from "@starknet-react/core";
import { useDojo } from "../dojo/useDojo";
import { useElementStore } from "../utils/nexus";
import { Account } from "starknet";
import { useMemo } from "react";

export default function useNetworkAccount() {
  const network = useElementStore((state) => state.network);

  console.log("This is the network", network)
  const {
    account: starknetAccount,
    status: starknetStatus,
    isConnected: starknetIsConnected,
  } = useAccount();

  console.log(" The starknet acoount", starknetAccount)

  const {
    account: { account: katanaAccount },
  } = useDojo();

  const account =
    network === "sepolia" || network === "mainnet"
      ? starknetAccount
      : (katanaAccount as Account);

  const address = account?.address;
  const status =
    network === "sepolia" || network === "mainnet"
      ? starknetStatus
      : "connected";
  const isConnected =
    network === "sepolia" || network === "mainnet" ? starknetIsConnected : true;

    console.log("This is the account seploia", account)

return useMemo(() => ({
    account,
    address,
    status,
    isConnected,
}), [account, address, status, isConnected]);

}
