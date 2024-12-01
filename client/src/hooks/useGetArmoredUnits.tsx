import { useElementStore } from '../utils/nexus';
import { useEffect, useMemo } from 'react';
import { useDojoStore } from '../lib/utils';
import { useSDK } from '../context/SDKContext';
import { useNetworkAccount } from '../context/WalletContex';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import { Armored } from '@/dojogen/models.gen';

export const useArmoredUnits = () => {

  const { game_id } = useElementStore((state) => state);

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);




  const sdk = useSDK();

  const { account } = useNetworkAccount();

  if(game_id  < 0) return;

  if(!account) return;


  useEffect(() => {
    const fetchEntities = async () => {
        try {
            await sdk.getEntities(
                {
                    command_nexus: {
                        Armored: {
                            $: {
                                where: {
                                    game_id: {
                                        $is: game_id,
                                    },
                                },
                            },
                        },
                    },
                },
                (resp) => {
                    if (resp.error) {
                        console.error(
                            "resp.error.message:",
                            resp.error.message
                        );
                        return;
                    }
                    if (resp.data) {
                        state.setEntities(resp.data);
                    }
                }
            );
        } catch (error) {
            console.error("Error querying entities:", error);
        }
    };

    fetchEntities();
}, [sdk, account.address]);




  const armoredUnits = Object.values(state.entities)
  .map(entity => entity.models.command_nexus.Armored)
  .filter(armored => armored && armored.game_id === game_id)
  .map(armored => armored as unknown as Armored);

console.log(armoredUnits);

  return {
    armoredUnits,
    entitiesCount: armoredUnits.length
  };
};