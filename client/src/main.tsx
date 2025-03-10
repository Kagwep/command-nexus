import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";
import { init } from "@dojoengine/sdk";
import { DojoContextProvider } from "./dojo/DojoContext.tsx";
import { setupBurnerManager } from "@dojoengine/create-burner";
import { StarknetProvider } from "./providers.tsx";
import { SDKProvider } from './context/SDKContext.tsx';
import { CommandNexusSchemaType,schema } from "./dojogen/models.gen.ts";
import { OnboardingProvider } from "./context/OnboardingContext.tsx";
import AppInitializer from "./components/AppInitializer.tsx";
import { client } from "./dojogen/contracts.gen.ts";
import { ApollClient } from "./utils/apollo/client.ts";
import { ApolloProvider } from '@apollo/client';


/**
 * Initializes and bootstraps the Dojo application.
 * Sets up the SDK, burner manager, and renders the root component.
 *
 * @throws {Error} If initialization fails
 */
async function main() {


    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <ApolloProvider client={ApollClient}>
            <StarknetProvider>
                <OnboardingProvider>
                <AppInitializer
                     clientFn={client}
                     />
                </OnboardingProvider>
            </StarknetProvider>
            </ApolloProvider>
        </StrictMode>
    );
}

main().catch((error) => {
    console.error("Failed to initialize the application:", error);
});
