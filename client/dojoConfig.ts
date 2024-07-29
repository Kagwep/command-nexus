import manifest from "./manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
    rpcUrl: "https://api.cartridge.gg/x/color-grid/katana",
    toriiUrl: "https://api.cartridge.gg/x/color-grid/torii",
    masterAddress: "0x533b215450561286d21c8ad5e74a0f0f664cf4c88b7cd41a08abbbd24c4ab40",
    masterPrivateKey: "0x372dae105d27273bbfccdcbaa50485d92e13e5e8031520f1e864c1a5981f4bc",
    accountClassHash: "0x22f3e55b61d86c2ac5239fa3b3b8761f26b9a5c0b5f61ddbd5d756ced498b46",

  });


  // export const dojoConfig = createDojoConfig({
  //   manifest
  // });