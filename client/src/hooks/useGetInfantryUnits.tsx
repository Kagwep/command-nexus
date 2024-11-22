
import { useElementStore } from '../utils/nexus';
import { useMemo, useEffect, useState } from 'react';
import { useDojoStore } from '../lib/utils';
import { useSDK } from '../context/SDKContext';
import { Infantry } from '@/dojogen/models.gen';
import { useGetPlayersForGame } from './useGetPlayersForGame';
import { useNetworkAccount } from '../context/WalletContex';

export const useInfantryUnits = () => {
  const { game_id } = useElementStore((state) => state);

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.getEntitiesByModel("command_nexus","Infantry"));

  const sdk = useSDK();

  const { account } = useNetworkAccount();

  if(game_id < 0) return;

  if(!account) return;

  const { players } = useGetPlayersForGame(game_id);


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



useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    const subscribe = async () => {
        const subscription = await sdk.subscribeEntityQuery(
            {
                command_nexus: {
                    Infantry: {
                        $: {
                            where: {
                                game_id: {
                                    $is:game_id,
                                },
                            },
                        },
                    },
                    AbilityState: {
                        $: {
                            where: {
                                game_id: {
                                    $is:game_id,
                                },
                            },
                        },
                    },
                },
            },
            (response) => {
                if (response.error) {
                    console.error(
                        "Error setting up entity sync:",
                        response.error
                    );
                } else if (
                    response.data &&
                    response.data[0].entityId !== "0x0"
                ) {
                    console.log("subscribed", response.data[0]);
                    state.updateEntity(response.data[0]);
                }
            },
            { logging: true }
        );
  
        unsubscribe = () => subscription.cancel();
    };
  
    subscribe();
  
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [sdk, account.address]);

  // Separate function for fetching entities
const fetchEntities = async () => {
    try {
        await sdk.getEntities(
            {
                command_nexus: {
                    Infantry: {
                        $: {
                            where: {
                                game_id: {
                                    $is:game_id,
                                },
                            },
                        },
                    },
                },
            },
            (response) => {
                if (response.error) {
                    console.error(
                        "Error setting up entity sync:",
                        response.error
                    );
                } else if (
                    response.data &&
                    response.data[0].entityId !== "0x0"
                ) {
                    console.log("polled", response.data[0]);
                    state.updateEntity(response.data[0]);
                }
            },
   
        );
    } catch (error) {
        console.error("Polling error:", error);
    }
  };
  
  
  
  // Use in useEffect
  useEffect(() => {
    fetchEntities();
  }, []); // Empty dependency array means this only runs once on mount
  

  new Promise<void>((resolve) => {
    sdk.getEntities(
      {
        command_nexus: {
            Infantry: {
                $: {
                    where: {
                        game_id: {
                            $is:game_id,
                        },
                    },
                },
            },
            AbilityState: {
                $: {
                    where: {
                        game_id: {
                            $is:game_id,
                        },
                    },
                },
            },
            UrbanBattlefield: {
                $: {
                    where: {
                        game_id: {
                            $is:game_id,
                        },
                    },
                },
            },
        },
      },
      (response) => {
        if (response.error) {
          console.error(
            "Error setting up entity sync:",
            response.error
          );
        } else if (
          response.data &&
          response.data[0].entityId !== "0x0"
        ) {
          console.log("polled", response.data[0]);
          state.updateEntity(response.data[0]);
        }
        resolve();
      }
    );
  });

  console.log(state.entities)

  const infantryUnits = Object.values(state.entities)
  .map(entity => entity.models.command_nexus.Infantry)
  .filter(infantry => infantry && infantry.game_id === game_id)
  .map(infantry => infantry as unknown as Infantry);



 console.log(infantryUnits)

  return {
    infantryUnits,
    entitiesCount: infantryUnits.length
  };
};