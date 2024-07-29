import { createBurner } from "./createBurner";
import { Account } from "starknet";
import { BurnerAccount, useBurnerManager } from "@dojoengine/create-burner";


export const  initializecreateBurner = async () => {


    const { burnerManager } = await createBurner();



    return {
        burnerManager
    };
}