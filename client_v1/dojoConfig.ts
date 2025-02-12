import { createDojoConfig } from "@dojoengine/core";

import manifest_dev from "../contracts/command_nexus/manifest_dev.json";
import manifest_sepolia from "../contracts/command_nexus/manifest_sepolia.json";

const manifest = import.meta.env.VITE_SEPOLIA === 'true' ? manifest_sepolia : manifest_dev;

export const dojoConfig = createDojoConfig({
    manifest,
});
