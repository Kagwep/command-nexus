import { useDojo } from '../dojo/useDojo';
import { sanitizePlayer } from '../utils/sanitizer';
import { useElementStore } from '../utils/nexus';
import { Player } from '../utils/types';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchAllEntitiesPlayer, useDojoStore } from '../lib/utils';
import { useNetworkAccount } from '../context/WalletContex';
import { useSDK } from '../context/SDKContext';
import useModels from './useModels';
import { getSyncEntities } from '@dojoengine/state';


export function useGetPlayers(): { players: Player[]; playerNames: string[] } {
  
  const { game_id } = useElementStore((state) => state);
  const { account } = useNetworkAccount();


  if(game_id < 0) return {players:[],playerNames:[]};

  if(!account) return {players:[],playerNames:[]};

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);
  const subscription = useRef<any>()
  const sdk = useSDK();

  const client = sdk.client

  const DEBOUNCE_DELAY = 100; // 100ms debounce delay
  let timeoutId: number;  // Changed from NodeJS.Timeout to number
  
  const debouncedUpdate = () => {
      if (timeoutId) {
          clearTimeout(timeoutId);
      }
  
      timeoutId = window.setTimeout(async () => {
          try {
              const entities = await client.getEntities({
                  clause: {
                      Member: {
                          member: 'address',
                          model: "command_nexus-Player",
                          operator: 'Neq',
                          value: {
                              Primitive: {
                                  ContractAddress: '0x0',
                              },
                          },
                      },
                  },
                  limit: 4,
                  dont_include_hashed_keys: true,
                  offset: 0
              });
  
              if (entities) {
                //   state.setEntities(entities);
                console.log(entities)
                  setUpdateTrigger(prev => prev + 1);
              }
          } catch (error) {
              console.error("Error in debouncedUpdate:", error);
          }
      }, DEBOUNCE_DELAY);
  };

  
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleEntityUpdate = useCallback(async (hashed_keys: string, entity: any) => {
    if (entity["command_nexus-Player"]) {
        console.log(entity["command_nexus-Player"])
        const size = 4

        let hasMore = true
    
        while (hasMore) {
          const entities = await client.getEntities({
            clause: {
              Member: {
                member: 'address',
                model: "command_nexus-Player",
                operator: 'Neq',
                value: {
                  Primitive: {
                    ContractAddress: '0x0',
                  },
                },
              },
            },
            limit: size,
            dont_include_hashed_keys: true,
            offset: 0
          })

          console.log(entities)
        
        }

          
    }
  }, [])

  useEffect(() => {
    if (!client) return



    client
      .onEntityUpdated(
        [
          {
            Keys: {
              keys: [],
              pattern_matching: 'VariableLen',
              models: ["command_nexus-Player", 'command_nexus-Game'],
            },
          },
        ],
        handleEntityUpdate,
      )
      .then((sub) => {
        subscription.current = sub
      })

    const intervalId = setInterval(debouncedUpdate, 100)

    return () => {
      subscription.current?.cancel()
      clearInterval(intervalId)
    }
  }, [client, handleEntityUpdate])

  useEffect(() => {
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
}, []);



const players = Object.values(entities)
.map(entity => entity.models.command_nexus.Player)
.filter(player => player && player.game_id === game_id);  // Add gameId filter


  const playerNames = useMemo(() => {
    return players.map((player) => player.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);


  console.log(entities)

  const models  = useModels();

  console.log(models)

  return {
    players,
    playerNames,
  };
}
