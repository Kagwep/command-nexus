import { createContext, ReactNode, useContext, useMemo } from "react";
import {
    BurnerAccount,
    BurnerManager,
    useBurnerManager,
} from "@dojoengine/create-burner";
import { Account } from "starknet";
import { DojoProvider } from "@dojoengine/core";
import { client } from "../dojogen/contracts.gen";
import { contractComponents } from "./setup";
import { createClientComponents } from "./createClientComponents";
/**
 * Interface defining the shape of the Dojo context.
 */
interface DojoContextType {
    /** The master account used for administrative operations */
    masterAccount: Account;
    /** The Dojo client instance */
    client: ReturnType<typeof client>;
    clientComponents: any;
    contractComponents: any;
    /** The current burner account information */
    account: BurnerAccount;
}

/**
 * React context for sharing Dojo-related data throughout the application.
 */
export const DojoContext = createContext<DojoContextType | null>(null);

/**
 * Provider component that makes Dojo context available to child components.
 *
 * @param props.children - Child components that will have access to the Dojo context
 * @param props.burnerManager - Instance of BurnerManager for handling burner accounts
 * @throws {Error} If DojoProvider is used more than once in the component tree
 */
export const DojoContextProvider = ({
    children,
    burnerManager,
    dojoConfig
}: {
    children: ReactNode;
    burnerManager: BurnerManager;
    dojoConfig: any
}) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) {
        throw new Error("DojoProvider can only be used once");
    }

    console.log(dojoConfig)

    const dojoProvider = new DojoProvider(
        dojoConfig.manifest,
        dojoConfig.rpcUrl
    );

    const masterAccount = useMemo(
        () =>
            new Account(
                dojoProvider.provider as any,
                dojoConfig.masterAddress,
                dojoConfig.masterPrivateKey,
                "1"
            ),
        []
    );

    const clientComponents = createClientComponents({ contractComponents });

    const burnerManagerData = useBurnerManager({ burnerManager });

    return (
        <DojoContext.Provider
            value={{
                masterAccount,
                client: client(dojoProvider),
                clientComponents,
                contractComponents: contractComponents,
                account: {
                    ...burnerManagerData,
                    account: burnerManagerData.account || masterAccount,
                },
            }}
        >
            {children}
        </DojoContext.Provider>
    );
};
