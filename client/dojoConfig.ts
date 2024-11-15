import { createDojoConfig } from "@dojoengine/core";

import manifest from "../command_nexus/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
