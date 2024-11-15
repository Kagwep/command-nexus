import { useDojo } from '../dojo/useDojo';
import { sanitizePlayer } from '../utils/sanitizer';
import { useElementStore } from '../utils/nexus';
import { Player } from '../utils/types';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useEffect, useMemo, useState } from 'react';
import { useDojoStore } from '../lib/utils';
import { useNetworkAccount } from '../context/WalletContex';
import { useSDK } from '../context/SDKContext';

export function useGetPlayers(): { players: Player[]; playerNames: string[] } {
  
  const { game_id } = useElementStore((state) => state);
  const { account } = useNetworkAccount();

  if(game_id < 0) return {players:[],playerNames:[]};

  if(!account) return {players:[],playerNames:[]};

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);

  const sdk = useSDK();

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
}, [sdk, account.address]);



const players = Object.values(entities)
.map(entity => entity.models.command_nexus.Player)
.filter(player => player && player.game_id === game_id);  // Add gameId filter


  const playerNames = useMemo(() => {
    return players.map((player) => player.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  return {
    players,
    playerNames,
  };
}
