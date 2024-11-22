import { useEffect, useState } from 'react';
import { useGetPlayers } from './useGetPlayers';
import { useDojo } from '../dojo/useDojo';
import { useTurn } from './useTurn';
import { Player } from '../dojogen/models.gen';
import { removeLeadingZeros } from '../utils/sanitizer';
import { useNetworkAccount } from '../context/WalletContex';

export function useMe(): { me: Player | null; isItMyTurn: boolean } {
  
  const { account, address, status, isConnected } = useNetworkAccount();

  if (!account) return {me: null, isItMyTurn: false};

  const { turn } = useTurn();

  const [me, setMe] = useState<Player | null>(null);


  const { players } = useGetPlayers();


  useEffect(() => {

    if (players.length > 0 && account.address) {
      const me = (() => {
        console.log("Finding player with these details:");
        console.log("Account address:", account.address);
        console.log("All players:", players);
        
        const found = players.find((p) => {
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
      setMe(me as unknown as Player);
    }
  }, [account, players.length]);


  return {
    me,
    isItMyTurn: me?.index === turn,
  };
}
