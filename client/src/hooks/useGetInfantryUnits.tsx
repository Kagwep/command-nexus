
import { useElementStore } from '../utils/nexus';
import { useMemo, useEffect, useState } from 'react';
import { useDojoStore } from '../lib/utils';
import { useSDK } from '../context/SDKContext';
import useNetworkAccount from './useNetworkAccount';

export const useInfantryUnits = () => {
  const { game_id } = useElementStore((state) => state);

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);

  const sdk = useSDK();

  const { account } = useNetworkAccount();

  if(!game_id) return;

  if(!account) return;


  useEffect(() => {
    const fetchEntities = async () => {
        try {
            await sdk.getEntities(
                {
                    command_nexus: {
                        Infantry: {
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



  const infantryUnits =  Object.values(entities)
  .map(entity => entity.models.command_nexus.Infantry)
  .filter(Boolean); 

  return {
    infantryUnits,
    entitiesCount: infantryUnits.length
  };
};