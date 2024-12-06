
import { useElementStore } from '../utils/nexus';
import { useMemo, useEffect, useState } from 'react';
import { useDojoStore } from '../lib/utils';
import { useSDK } from '../context/SDKContext';
import { AbilityState, Infantry } from '@/dojogen/models.gen';
import { useGetPlayersForGame } from './useGetPlayersForGame';
import { useNetworkAccount } from '../context/WalletContex';
import { useEntityStore } from './useEntityStore';

export const useInfantryAbilityModes = () => {

    const { game_id } = useElementStore((state) => state);

 const infantryAbilityEntities = useEntityStore(state => 
    (state.modelEntityIds["AbilityState"] || [])
        .map(id => state.entities[id])
    )

  const infantryAbilityModes = Object.values(infantryAbilityEntities)
  .map(entity => entity.models.command_nexus.AbilityState)
  .filter(ability => ability && ability.game_id === game_id)
  .map(ability => ability as unknown as AbilityState);

  console.log(infantryAbilityModes)

  return {
    infantryAbilityModes,
    entitiesCount: infantryAbilityModes.length
  };
};