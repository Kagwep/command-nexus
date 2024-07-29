import { BurnerManager } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";
import { dojoConfig } from "../../dojoConfig";

export const createBurner = async () => {
    const rpcProvider = new RpcProvider({
        nodeUrl: dojoConfig.rpcUrl!,
    });

    console.log("ddddddddddddddddddddd",dojoConfig.rpcUrl)

    const masterAccount = new Account(
        rpcProvider,
        dojoConfig.masterAddress!,
        dojoConfig.masterPrivateKey!
    );

    const burnerManager = new BurnerManager({
        masterAccount,
        accountClassHash: dojoConfig.accountClassHash!,
        rpcProvider,
        feeTokenAddress: dojoConfig.feeTokenAddress,
    });

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
            
        }
    } catch (e) {
        console.log(e);
    }

    burnerManager.init();

    return {
        account: burnerManager.account as Account,
        burnerManager,
    };
};