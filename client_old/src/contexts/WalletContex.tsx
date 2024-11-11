import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAccount } from "@starknet-react/core";
import { useDojo } from "../dojo/useDojo";
import { useElementStore } from "../utils/nexus";

const NetworkAccountContext = createContext(null);

export const useNetworkAccount = () => useContext(NetworkAccountContext);

export const NetworkAccountProvider = ({ children }) => {
    const network = useElementStore((state) => state.network);
    const {
        account: starknetAccount,
        status: starknetStatus,
        isConnected: starknetIsConnected,
    } = useAccount();

    const {
        account: { account: katanaAccount },
    } = useDojo();

    const accountData = useMemo(() => ({
        account: network === "sepolia" || network === "mainnet" ? starknetAccount : katanaAccount,
        address: starknetAccount?.address,
        status: network === "sepolia" || network === "mainnet" ? starknetStatus : "connected",
        isConnected: network === "sepolia" || network === "mainnet" ? starknetIsConnected : true,
    }), [network, starknetAccount, starknetStatus, starknetIsConnected, katanaAccount]);

    return (
        <NetworkAccountContext.Provider value={accountData}>
            {children}
        </NetworkAccountContext.Provider>
    );
};
