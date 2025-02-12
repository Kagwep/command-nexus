import { useEffect, useMemo, useState } from 'react';
import { useDojo } from '../dojo/useDojo';
import { useTurn } from './useTurn';
import { Player } from '../dojogen/models.gen';
import { removeLeadingZeros } from '../utils/sanitizer';
import { useNetworkAccount } from '../context/WalletContex';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import { useElementStore } from '../utils/nexus';
import { useModel } from '@dojoengine/sdk/react';
import { useAllEntities } from '../utils/command';

export function useMe(): { me: Player | null; isItMyTurn: boolean } {
  
  const { account, address, status, isConnected } = useNetworkAccount();

  if (!account) return {me: null, isItMyTurn: false};

  const { game_id } = useElementStore((state) => state);

  const { turn } = useTurn();

  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(game_id),]),
    [game_id]
);


  const [me, setMe] = useState<Player | null>(null);
  const game = useModel(entityId, "silent_strike-Game");

  const { state: nstate, refetch } = useAllEntities();


  useEffect(() => {
    if (Object.keys(nstate.players).length > 0 && account?.address) {
      const me = (() => {
        console.log("Finding player with these details:");
        console.log("Account address:", account.address);
        console.log("All players:", nstate.players);
        
        const found = Object.values(nstate.players).find((p) => {
          const cleanAddress = removeLeadingZeros(p.address);
          console.log("Comparing:", {
            playerAddress: p.address,
            cleanAddress: cleanAddress,
            accountAddress: account.address,
            isMatch: cleanAddress === account.address
          });
          return cleanAddress === account.address;
        });
    
        console.log("Found player:", found);
        return found;
      })();
      
      setMe(me as Player);
    }
  }, [account, Object.keys(nstate.players).length]);


  return {
    me,
    isItMyTurn: me?.index === turn,
  };
}
