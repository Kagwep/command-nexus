import { getSyncEntities } from "@dojoengine/state";
import { DojoConfig, DojoProvider } from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { setupWorld } from "../systems";
import { Account, WeierstrassSignatureType, TypedData,RpcProvider } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {

    console.log(config.rpcUrl)
    console.log(config.manifest.world.address)
    console.log(config.toriiUrl)

    // torii client
    const toriiClient = await torii.createClient({
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        relayUrl: "",
        worldAddress: config.manifest.world.address || "",
    });

    console.log(toriiClient)

    // create contract components
    const contractComponents = defineContractComponents(world);

    // create client components
    const clientComponents = createClientComponents({ contractComponents });

    // fetch all existing entities from torii
    const sync = await getSyncEntities(
        toriiClient,
        contractComponents as any,
        undefined
    );

 
    // create dojo provider
    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

    console.log(dojoProvider)

    // setup world
    const client = await setupWorld(dojoProvider);

    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl!,
    });

    const masterAccount = new Account(
        rpcProvider,
        config.masterAddress!,
        config.masterPrivateKey!
    );

    // create burner manager
    const burnerManager = new BurnerManager({
        masterAccount,
        accountClassHash: config.accountClassHash,
        rpcProvider: dojoProvider.provider,
        feeTokenAddress: config.feeTokenAddress,
    });


    

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
            console.log("called")
            
        }
    } catch (e) {
        console.error(e);
    }

    return {
        client,
        clientComponents,
        contractComponents,
        systemCalls: createSystemCalls(
            { client },
            contractComponents,
            clientComponents
        ),
        publish: (typedData: string, signature: WeierstrassSignatureType) => {
            toriiClient.publishMessage(typedData, {
                r: signature.r.toString(),
                s: signature.s.toString(),
            });
        },
        config,
        dojoProvider,
        burnerManager,
        toriiClient,
        sync,
    };
}