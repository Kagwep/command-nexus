import manifest from "./manifest.json";
import { KATANA_ETH_CONTRACT_ADDRESS, createDojoConfig, KATANA_CLASS_HASH } from '@dojoengine/core';

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: "https://api.cartridge.gg/x/command-nexus-demo/katana",
    toriiUrl: "https://api.cartridge.gg/x/command-nexus-demo/torii",
    masterAddress: "0x6d11a859bf7ab9d729a78944077dc2badee829567c53e79190ac92dba07a5c8",
    masterPrivateKey: "0xb4079627ebab1cd3cf9fd075dda1ad2454a7a448bf659591f259efa2519b18",
    accountClassHash: KATANA_CLASS_HASH,
    feeTokenAddress: KATANA_ETH_CONTRACT_ADDRESS,
  });


  export const dojoSepoliaConfig = createDojoConfig({
    manifest,
    rpcUrl: "https://starknet-sepolia.public.blastapi.io",
    toriiUrl: "https://api.cartridge.gg/x/command-nexus-demo-one/torii",
    masterAddress: "0x019c74893C2e763C379f440F5787bD1078d5a84F9D8eb8C365b0008adB89a8d8",
    masterPrivateKey: "0x073e13220f7edce5d75b230163356c2249bc79a97d288c86d112d05011df9adc",
    accountClassHash: "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f",
    feeTokenAddress: KATANA_ETH_CONTRACT_ADDRESS,
  });


  // export const dojoConfig = createDojoConfig({
  //   manifest
  // });