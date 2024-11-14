import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAccount, AccountStatus } from "@starknet-react/core";
import { Account, AccountInterface } from "starknet";
import { useDojo } from "../dojo/useDojo";
import { useElementStore } from "../utils/nexus";

// Define the type for your context value
interface NetworkAccountContextType {
    account: Account | AccountInterface | undefined;
    address: string | undefined;
    status: AccountStatus;
    isConnected: boolean | undefined;
}

// Create context with proper typing
const NetworkAccountContext = createContext<NetworkAccountContextType | undefined>(undefined);

// Type-safe custom hook
export const useNetworkAccount = () => {
    const context = useContext(NetworkAccountContext);
    if (context === undefined) {
        throw new Error('useNetworkAccount must be used within a NetworkAccountProvider');
    }
    return context;
};

export const NetworkAccountProvider = ({ children }: { children: React.ReactNode }) => {
    const network = useElementStore((state) => state.network);
    const {
        account: starknetAccount,
        status: starknetStatus,
        isConnected: starknetIsConnected,
    } = useAccount();

    const {
        account: { account: katanaAccount },
    } = useDojo();

    const accountData: NetworkAccountContextType = useMemo(() => ({
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