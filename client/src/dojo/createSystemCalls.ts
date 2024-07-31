import { AccountInterface } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    _contractComponents: ContractComponents,
    { Player, Tile }: ClientComponents
) {
    const spawn = async (account: AccountInterface) => {
        try {
            const { transaction_hash } = await client.actions.spawn({
                account,
            });

            console.log(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e);
        }
    };

    const paint = async (account: AccountInterface, x: any, y: any, color: any) => {
        const entityId = getEntityIdFromKeys([
            BigInt(account.address),
        ]) as Entity;


        try {
            const { transaction_hash } = await client.actions.paint({
                account,
                x,
                y,
                color
            });

            await account.waitForTransaction(transaction_hash, {
                retryInterval: 100,
            });

            // console.log(
            //     await account.waitForTransaction(transaction_hash, {
            //         retryInterval: 100,
            //     })
            // );

            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
            console.log(e);
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }
    };

    return {
        spawn,
        paint,
    };
}
