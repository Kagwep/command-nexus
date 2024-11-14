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

    if(!game_id) return {players: []} ;

    if(!account) return {players: []} ;


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

  return {
    players,
  };
}
