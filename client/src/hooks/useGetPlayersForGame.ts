import { useEffect, useMemo } from 'react';
import { useElementStore } from '../utils/nexus';
import { useNetworkAccount } from '../context/WalletContex';
import { Player } from '../dojogen/models.gen';

export function useGetPlayersForGame(gameId: number | undefined): {players: Player[]} {
    const { game_id } = useElementStore((state) => state);




  const players = [];

  return {
    players
  };
}
