import React, { createContext, useContext, useState, useEffect } from "react";
import { Network } from "../utils/nexus";
import { createDojoConfig } from "@dojoengine/core";
import { getNetworkConstants } from "@/constants";

export type NetworkContextType = {
  network: Network | null;
  setNetwork: (network: Network) => void;
  dojoConfig: any | null;
};

// Create the context with a default value
export const NetworkContext = createContext<NetworkContextType>({
  network: null,
  setNetwork: () => {},
  dojoConfig: null
});

// Custom hook for accessing network context
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  return context;
};

// The provider component
export const NetworkProvider: React.FC<{ 
  children: React.ReactNode;
  initialNetwork?: Network | null; 
}> = ({ children, initialNetwork = null }) => {
  const [network, setNetworkState] = useState<Network | null>(initialNetwork);
  const [dojoConfig, setDojoConfig] = useState<any | null>(() => {
    if (initialNetwork) {
      const networkConstants = getNetworkConstants(initialNetwork);
      const manifest = networkConstants.MANIFEST;
      return createDojoConfig({ manifest });
    }
    return null;
  });

  // When network changes, update dojoConfig
  const setNetwork = (selectedNetwork: Network) => {
    setNetworkState(selectedNetwork);
    
    // Create dojoConfig based on selected network
    const networkConstants = getNetworkConstants(selectedNetwork);
    const manifest = networkConstants.MANIFEST;
    
    const newDojoConfig = createDojoConfig({
      manifest,
    });
    
    setDojoConfig(newDojoConfig);
  };

  const value = {
    network,
    setNetwork,
    dojoConfig
  };

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
};