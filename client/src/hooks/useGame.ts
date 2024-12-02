import { useElementStore } from '../utils/nexus';
import { useEffect, useMemo } from 'react';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import useModel from './useModel';
import { useSDK } from '../context/SDKContext';
import { useNetworkAccount } from '../context/WalletContex';
import { useDojoStore } from '../lib/utils';
import { useGamePlayers } from './useGamePlayers';
import useModels from './useModels';
import { useGetPlayers } from './useGetPlayers';
import { useGameInfantry } from './useGameInfantry';
import { useEntityStore } from './useEntityStore';

export const useGame = () => {

  const { game_id } = useElementStore((state) => state);


  const state = useDojoStore((state) => state);

  const sdk = useSDK();

  const { account } = useNetworkAccount();



 

  if(game_id < 0) return;

  if(!account) return;


      // Following the same pattern as useGetPlayersForGame
    const entityId = useMemo(
        () => getEntityIdFromKeys([BigInt(game_id),]),
        [game_id]
    );


    const entityId1 = useMemo(
      () => getEntityIdFromKeys([BigInt(game_id),BigInt(1),BigInt(0)]),
      [game_id,1,0]
  );




    console.log(",,,,,,,,,,,,,,,,,",entityId);

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
                                      $is: game_id,
                                  },
                              },
                          },
                      },
                      Player: {
                          $: {
                              where: {
                                  game_id: {
                                      $is: game_id,
                                  },
                              },
                          },
                      },
                      UnitState: {
                          $: {
                            where: {
                              game_id: {
                                  $is: game_id,
                              },
                          },
                          },
                      },
                      AbilityState: {
                          $: {
                            where: {
                              game_id: {
                                  $is: game_id,
                              },
                          },
                          },
                      },
                      AirUnit: {
                          $: {
                            where: {
                              game_id: {
                                  $is: game_id,
                              },
                          },
                          },
                      },
                      UrbanBattlefield: {
                        $: {
                          where: {
                            game_id: {
                                $is: game_id,
                            },
                        },
                        },
                    },
                    Armored: {
                      $: {
                        where: {
                          game_id: {
                              $is: game_id,
                          },
                      },
                      },
                  },
                    Infantry: {
                      $: {
                        where: {
                          game_id: {
                              $is: game_id,
                          },
                      },
                      },
                  },Ship: {
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
                    //   console.error(
                    //       "Error setting up entity sync:",
                    //       response.error
                    //   );
                  } else if (
                      response.data &&
                      response.data[0].entityId !== "0x0"
                  ) {
                    console.log(response)
                      console.log("subscribed", response.data[0]);
                      state.updateEntity(response.data[0]);
                      useEntityStore.getState().addEntity(response.data[0]);
                      console.log(state.entities)
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

  const game = useModel(entityId, "command_nexus-Game");





//   const infatry = useGameInfantry()

//   console.log(infatry)






  return game;
};