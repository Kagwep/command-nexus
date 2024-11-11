import manifest from "./manifest.json";
import manifest_sepolia from "./manifests/manifest.json"
import { KATANA_ETH_CONTRACT_ADDRESS, createDojoConfig, KATANA_CLASS_HASH } from '@dojoengine/core';

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: "http://localhost:5050",
    toriiUrl: "http://localhost:8080",
    masterAddress: "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
    masterPrivateKey: "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a",
    accountClassHash: KATANA_CLASS_HASH,
    feeTokenAddress: KATANA_ETH_CONTRACT_ADDRESS,
  });

//   rpc_url = "http://0.0.0.0:5050"
// # Default account for katana with seed = 0
// account_address = "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca"
// private_key = "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a"
// world_address = "0x6019ff874cb7cf5f8ac22d824f37dcece028bfc1e634fd0150e5bae5186e17e"  # Uncomment and update this line with your world address.


  export const dojoSepoliaConfig = createDojoConfig({
    manifest: manifest_sepolia,
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

