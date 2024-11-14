import { SDK } from "@dojoengine/sdk";
import { StarknetProvider } from "../providers";
import { DojoContextProvider } from "../dojo/DojoContext";
import { SDKProvider } from "../context/SDKContext";
import { BurnerManager, setupBurnerManager } from "@dojoengine/create-burner";
import { dojoConfig } from "../../dojoConfig";
import App from "../App";
import Intro from "./Intro";
import { useOnboarding } from "../context/OnboardingContext";
import { CommandNexusSchemaType } from "../dojogen/models.gen";
import { useEffect, useState } from "react";
import { AlertTriangle, Shield } from "lucide-react";
import LoadingScreen from "./LoadingScreen";
import { NetworkAccountProvider } from "../context/WalletContex";


interface AppInitializerProps {
    sdk: SDK<CommandNexusSchemaType>
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

const AppInitializer: React.FC<AppInitializerProps> = ({ sdk }) => {
    const { isOnboarded, completeOnboarding } = useOnboarding();
    const [burnerManager, setBurnerManager] = useState<BurnerManager | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<InitializationError | null>(null);
    const [initializationStep, setInitializationStep] = useState(0);

    useEffect(() => {
        const initializeGame = async () => {
            try {
                setIsLoading(true);
                
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

        initializeGame();
    }, []);

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

    if (!isOnboarded) {
        return <Intro onOnboardComplete={completeOnboarding} />;
    }

    if (isLoading) {
        return <LoadingScreen message={getLoadingMessage()} />;
    }

    if (error) {
        return <ErrorScreen error={error} />;
    }


    if (!burnerManager) {
        return <ErrorScreen 
            error={{
                code: 'UNKNOWN',
                message: 'Critical initialization failure',
                details: 'Secure credentials not established'
            }}
        />;
    }

    return (
        <StarknetProvider>
            <SDKProvider sdk={sdk}>
                <DojoContextProvider 
                    burnerManager={burnerManager}
                >
                    <NetworkAccountProvider>
                    <App />
                    </NetworkAccountProvider>
                </DojoContextProvider>
            </SDKProvider>
        </StarknetProvider>
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
