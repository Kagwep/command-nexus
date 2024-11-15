import { useEffect, useState } from 'react';
import { useGetPlayers } from './useGetPlayers';
import { useDojo } from '../dojo/useDojo';
import { useTurn } from './useTurn';
import { Player } from '../dojogen/models.gen';
import useNetworkAccount from './useNetworkAccount';
import { removeLeadingZeros } from '../utils/sanitizer';

export function useMe(): { me: Player | null; isItMyTurn: boolean } {
  
  const { account, address, status, isConnected } = useNetworkAccount();

  if (!account) return {me: null, isItMyTurn: false};

  const { turn } = useTurn();

  const [me, setMe] = useState<Player | null>(null);


  const { players } = useGetPlayers();


  useEffect(() => {

    if (players.length > 0 && account.address) {
      const me = players.find((p) => removeLeadingZeros(p.address) === account.address);
      setMe(me as unknown as Player);
    }
  }, [account, players.length]);

  return {
    me,
    isItMyTurn: me?.index === turn,
  };
}
