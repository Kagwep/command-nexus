import { useEffect, useMemo } from 'react';
import { useElementStore } from '../utils/nexus';
import { useDojoStore } from '../lib/utils';
import { useSDK } from '../context/SDKContext';
import { useNetworkAccount } from '../context/WalletContex';
import { Player } from '../dojogen/models.gen';

export function useGetPlayersForGame(gameId: number | undefined): {players: Player[]} {
    const { game_id } = useElementStore((state) => state);

    const state = useDojoStore((state) => state);
    const entities = useDojoStore((state) => state.entities);

    const sdk = useSDK();

    const { account } = useNetworkAccount();

    if(game_id < 0) return {players: []} ;

    if(!account) return {players: []} ;


// Separate function for fetching entities
const fetchEntities = async () => {
    try {
        await sdk.getEntities(
            {
                command_nexus: {
                    Player: {
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
  

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    const subscribe = async () => {
        const subscription = await sdk.subscribeEntityQuery(
            {
                command_nexus: {
                    Game: {
                        $: {
                          where: {
                            game_id: {
                                $is:game_id,
                            },
                        },
                        },
                    },
                    Player: {
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
                    // console.error(
                    //     "Error setting up entity sync:",
                    //     response.error
                    // );
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

  new Promise<void>((resolve) => {
    sdk.getEntities(
      {
        command_nexus: {
          Player: {
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
      (response) => {
        if (response.error) {
          // console.error(
          //   "Error setting up entity sync:",
          //   response.error
          // );
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

  const players = Object.values(state.entities)
  .map(entity => entity.models.command_nexus.Player)
  .filter(player => player && player.game_id === game_id)
  .map(player => player as Player);

  return {
    players
  };
}
