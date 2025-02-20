import { useElementStore } from '../utils/nexus';
import { useEffect, useMemo } from 'react';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import { useSDK } from '../context/SDKContext';
import { useNetworkAccount } from '../context/WalletContex';

import { useEntityStore } from './useEntityStore';
import { useDojoSDK, useModel } from '@dojoengine/sdk/react';
import { Game } from '../dojogen/models.gen';

export const useGame = () => {

  const { game_id } = useElementStore((state) => state);
  
  const { useDojoStore, client: dojoClient, sdk } = useDojoSDK();

  const state = useDojoStore((state) => state);



  const { account } = useNetworkAccount();


  if(game_id < 0) return;

  if(!account) return;


      // Following the same pattern as useGetPlayersForGame
    const entityId = useMemo(
        () => getEntityIdFromKeys([BigInt(game_id),]),
        [game_id]
    );


  const game = useModel(entityId, "command_nexus-Game");





//   const infatry = useGameInfantry()

//   console.log(infatry)






  return game as unknown as Game;
};