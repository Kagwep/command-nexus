
import { useElementStore } from '../utils/nexus';
import { useMemo, useEffect, useState } from 'react';
import { useDojoStore } from '../lib/utils';
import { useSDK } from '../context/SDKContext';
import { AbilityState, Infantry, UnitState } from '@/dojogen/models.gen';
import { useGetPlayersForGame } from './useGetPlayersForGame';
import { useNetworkAccount } from '../context/WalletContex';
import { useEntityStore } from './useEntityStore';

export const useInfantryUnitState = () => {

 const { game_id } = useElementStore((state) => state);

 const infantryUnitState = useEntityStore(state => 
    (state.modelEntityIds["UnitState"] || [])
        .map(id => state.entities[id])
    )

  const infantryUnitStates = Object.values(infantryUnitState)
  .map(entity => entity.models.command_nexus.UnitState)
  .filter(ability => ability && ability.game_id === game_id)
  .map(ability => ability as unknown as UnitState);

  console.log(infantryUnitStates)

  return {
    infantryUnitStates,
    entitiesCount: infantryUnitStates.length
  };
};