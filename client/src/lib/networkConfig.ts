// src/lib/networkConfig.ts

import { createDojoConfig, KATANA_CLASS_HASH, KATANA_ETH_CONTRACT_ADDRESS } from '@dojoengine/core';
import manifest from "../../manifest.json";
import manifest_sepolia from "../../manifests/manifest.json";

export type Network = "mainnet" | "katana" | "sepolia" | "localKatana" | undefined;

export const networkConfig: Record<Network, {
  name: string;
  rpcUrl: string;
  toriiUrl?: string;
  dojoConfig: ReturnType<typeof createDojoConfig>;
}> = {
  mainnet: {
    name: "Mainnet",
    rpcUrl: "https://starknet-mainnet.public.blastapi.io",
    dojoConfig: createDojoConfig({
      manifest,
      rpcUrl: "https://starknet-mainnet.public.blastapi.io",
      // Add other mainnet-specific configurations here
    }),
  },
  katana: {
    name: "Katana",
    rpcUrl: "http://localhost:5050",
    toriiUrl: "http://localhost:8080",
    dojoConfig: createDojoConfig({
      manifest,
      rpcUrl: "http://localhost:5050",
      toriiUrl: "http://localhost:8080",
      masterAddress: "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
      masterPrivateKey: "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a",
      accountClassHash: KATANA_CLASS_HASH,
      feeTokenAddress: KATANA_ETH_CONTRACT_ADDRESS,
    }),
  },
  sepolia: {
    name: "Sepolia",
    rpcUrl: "https://starknet-sepolia.public.blastapi.io",
    toriiUrl: "https://api.cartridge.gg/x/command-nexus-demo-three/torii",
    dojoConfig: createDojoConfig({
      manifest: manifest_sepolia,
      rpcUrl: "https://starknet-sepolia.public.blastapi.io",
      toriiUrl: "https://api.cartridge.gg/x/command-nexus-demo-three/torii",
      masterAddress: "0x019c74893C2e763C379f440F5787bD1078d5a84F9D8eb8C365b0008adB89a8d8",
      masterPrivateKey: "0x073e13220f7edce5d75b230163356c2249bc79a97d288c86d112d05011df9adc",
      accountClassHash: "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f",
      feeTokenAddress: KATANA_ETH_CONTRACT_ADDRESS,
    }),
  },
  localKatana: {
    name: "Katana",
    rpcUrl: "http://localhost:5050",
    toriiUrl: "http://localhost:8080",
    dojoConfig: createDojoConfig({
      manifest,
      rpcUrl: "http://localhost:5050",
      toriiUrl: "http://localhost:8080",
      masterAddress: "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
      masterPrivateKey: "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a",
      accountClassHash: KATANA_CLASS_HASH,
      feeTokenAddress: KATANA_ETH_CONTRACT_ADDRESS,
    }),
  }
};