import { init, SDK } from "@dojoengine/sdk";
import { DojoContextProvider } from "../dojo/DojoContext";
import { BurnerManager, setupBurnerManager } from "@dojoengine/create-burner";
import App from "../App";
import Intro from "./Intro";
import { useOnboarding } from "../context/OnboardingContext";
import { CommandNexusSchemaType } from "../dojogen/models.gen";
import { useEffect, useState } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import { NetworkAccountProvider } from "../context/WalletContex";
import { useElementStore } from "../utils/nexus";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import LandingPage from './LandingPage';
import { getNetworkConstants } from "@/constants";
import { createDojoConfig } from "@dojoengine/core";
import { useNetwork } from "@/context/NetworkContext";
import NetworkSelector from "./NetworkSelector";

interface AppInitializerProps {
    clientFn:any,
    skipNetworkSelection?: boolean,
}


interface InitializationError {
    code: 'BURNER_SETUP_FAILED' | 'NETWORK_ERROR' | 'AUTHENTICATION_FAILED' | 'UNKNOWN';
    message: string;
    details?: string;
}

const ErrorScreen: React.FC<{ error: InitializationError }> = ({ error }) => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-lg border border-red-500/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <Shield className="w-8 h-8 text-red-500/50" />
            </div>
            <h2 className="text-red-500 font-mono text-lg mb-2">
                SYSTEM INITIALIZATION FAILURE
            </h2>
            <div className="space-y-4">
                <p className="text-red-400/80 font-mono text-sm">
                    Error Code: {error.code}
                </p>
                <p className="text-red-400/60 font-mono text-sm">
                    {error.message}
                </p>
                {error.details && (
                    <div className="bg-black/30 rounded p-3 font-mono text-xs">
                        <p className="text-red-500/60">$ {error.details}</p>
                    </div>
                )}
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 
                             font-mono text-sm py-2 rounded transition-colors"
                >
                    RETRY INITIALIZATION
                </button>
            </div>
        </div>
    </div>
);

const AppInitializer: React.FC<AppInitializerProps> = ({clientFn,skipNetworkSelection = false}) => {
    const { isOnboarded, completeOnboarding } = useOnboarding();
    const [burnerManager, setBurnerManager] = useState<BurnerManager | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Start as false initially
    const [error, setError] = useState<InitializationError | null>(null);
    const [initializationStep, setInitializationStep] = useState(0);
    const [showLanding, setShowLanding] = useState(true);  // New state for landing page
    const [networkSelected, setNetworkSelected] = useState(skipNetworkSelection);
    //const { dojoConfig } = useElementStore(state => state);

    const { network,dojoConfig } = useNetwork();

    const [sdk, setSdk] = useState<SDK<CommandNexusSchemaType>|null>(null);



    useEffect(() => {
        // Sync dojoConfig with ElementStore if needed
        if (dojoConfig) {
            useElementStore.getState().setDojoConfig(dojoConfig);
        }
        
        // Sync network with ElementStore if needed
        if (network) {
            useElementStore.getState().setNetwork(network);
        }
    }, [dojoConfig, network]);
  

    useEffect(() => {
        // Only start initialization after network is set and user is onboarded
        if (!isOnboarded || !network || !dojoConfig) {
            return;
        }


        const networkConstants = getNetworkConstants(network);

        if (network === "sepolia" && import.meta.env.VITE_SEPOLIA !== 'true') {
            console.error("Network mismatch: Selected Sepolia but VITE_SEPOLIA is not set to true");
            throw new Error("Environment configuration mismatch for Sepolia network");
        }
        
        if (network === "mainnet" && import.meta.env.VITE_MAINNET !== 'true') {
            console.error("Network mismatch: Selected Mainnet but VITE_MAINET is not set to true");
            throw new Error("Environment configuration mismatch for Mainnet network");
        }

        const initializeSDK = async () => {
            const sdk = await init<CommandNexusSchemaType>(
                {
                    client: {
                        // rpcUrl: import.meta.env.VITE_SEPOLIA === 'true' ? TORII_RPC_URL : dojoConfig.rpcUrl,
                        toriiUrl: networkConstants.TORII_URL,
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
            );
            
        setSdk(sdk);
        }

        const initializeGame = async () => {
            try {
                setIsLoading(true);
                
                if (network === 'katana') {
                    // Step 1: Setup burner wallet
                    setInitializationStep(1);
                    const manager = await setupBurnerManager(dojoConfig);
                    if (!manager) {
                        throw {
                            code: 'BURNER_SETUP_FAILED',
                            message: 'Failed to initialize secure credentials'
                        };
                    }
                    setBurnerManager(manager);

                    // Step 2: Verify network connection
                    setInitializationStep(2);
                    const networkStatus = await checkNetworkConnection();
                    if (!networkStatus.connected) {
                        throw {
                            code: 'NETWORK_ERROR',
                            message: 'Network connection unstable',
                            details: networkStatus.error
                        };
                    }

                    // Step 3: Authentication
                    setInitializationStep(3);
                    if (!manager.account) {
                        throw {
                            code: 'AUTHENTICATION_FAILED',
                            message: 'Failed to authenticate command access'
                        };
                    }
                }

                setIsLoading(false);
            } catch (err) {
                console.error("Initialization error:", err);
                setError(err as InitializationError || {
                    code: 'UNKNOWN',
                    message: 'Critical system failure',
                    details: err instanceof Error ? err.message : 'Unknown error occurred'
                });
                setIsLoading(false);
            }
        };

        initializeSDK();
        initializeGame();
    }, [isOnboarded, network,dojoConfig?.manifest?.world.address]); // Add dependencies

    const getLoadingMessage = () => {
        switch (initializationStep) {
            case 1:
                return "Establishing secure credentials...";
            case 2:
                return "Verifying network protocols...";
            case 3:
                return "Authenticating command access...";
            default:
                return "Initializing Command Nexus...";
        }
    };

  
    //  (skipNetworkSelection=true), we skip these screens
    if (!skipNetworkSelection) {
        // If showing landing page
        if (showLanding) {
            return <LandingPage onStartGame={() => setShowLanding(false)} />;
        }
        
        // Next, select network if not selected yet
        if (!networkSelected) {
            return <NetworkSelector onNetworkSelected={(selectedNetwork) => {
                useNetwork().setNetwork(selectedNetwork);
                setNetworkSelected(true);
            }} />;
        }
    }
    
    
    // First, show Intro if not onboarded
    if (!isOnboarded) {
        return <Intro onOnboardComplete={completeOnboarding} />;
    }

    // Then, wait for network to be set
    if (!network) {
        return <LoadingScreen message="Waiting for network selection..." />;
    }

    // Then show other states
    if (isLoading) {
        return <LoadingScreen message={getLoadingMessage()} />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }

    if (!burnerManager && network === 'katana') {
        return <ErrorScreen 
            error={{
                code: 'UNKNOWN',
                message: 'Critical initialization failure',
                details: 'Secure credentials not established'
            }}
        />;
    }

    return (
        <DojoSdkProvider
        sdk={sdk}
        dojoConfig={dojoConfig}
        clientFn={clientFn}
    >
            <DojoContextProvider dojoConfig={dojoConfig} burnerManager={burnerManager}>
                <NetworkAccountProvider>
                    <App />
                </NetworkAccountProvider>
            </DojoContextProvider>
        </DojoSdkProvider>
    );
};

// Utility function to check network connection
const checkNetworkConnection = async () => {
    try {
        // Add your network checking logic here
        // For example, checking if you can reach the RPC endpoint
        return { connected: true };
    } catch (error) {
        return { 
            connected: false, 
            error: error instanceof Error ? error.message : 'Unknown network error' 
        };
    }
};

export default AppInitializer;