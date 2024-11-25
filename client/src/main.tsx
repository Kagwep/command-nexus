import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";
import { init } from "@dojoengine/sdk";
import { dojoConfig } from "../dojoConfig.ts";
import { DojoContextProvider } from "./dojo/DojoContext.tsx";
import { setupBurnerManager } from "@dojoengine/create-burner";
import { StarknetProvider } from "./providers.tsx";
import { SDKProvider } from './context/SDKContext.tsx';
import { CommandNexusSchemaType,schema } from "./dojogen/models.gen.ts";
import { OnboardingProvider } from "./context/OnboardingContext.tsx";
import AppInitializer from "./components/AppInitializer.tsx";
import { TORII_RPC_URL } from "./constants.ts";


/**
 * Initializes and bootstraps the Dojo application.
 * Sets up the SDK, burner manager, and renders the root component.
 *
 * @throws {Error} If initialization fails
 */
async function main() {

    console.log( dojoConfig)
    const sdk = await init<CommandNexusSchemaType>(
        {
            client: {
                rpcUrl: TORII_RPC_URL,
                toriiUrl: "http://localhost:8080",
                relayUrl: dojoConfig.relayUrl,
                worldAddress: dojoConfig.manifest.world.address,
            },
            domain: {
                name: "WORLD_NAME",
                version: "1.0",
                chainId: "KATANA",
                revision: "1",
            },
        },
        schema
    );

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <StarknetProvider>
                <OnboardingProvider>
                    <AppInitializer sdk={sdk} />
                </OnboardingProvider>
            </StarknetProvider>
        </StrictMode>
    );
}

main().catch((error) => {
    console.error("Failed to initialize the application:", error);
});
