
import { useElementStore } from '../utils/nexus';
import { useMemo, useEffect, useState } from 'react';
import { useSDK } from '../context/SDKContext';
import { Infantry } from '@/dojogen/models.gen';
import { useGetPlayersForGame } from './useGetPlayersForGame';
import { useNetworkAccount } from '../context/WalletContex';
import { useEntityStore } from './useEntityStore';

export const useInfantryUnits = () => {

    const { game_id } = useElementStore((state) => state);

 const infantryEntities = useEntityStore(state => 
    (state.modelEntityIds["Infantry"] || [])
        .map(id => state.entities[id])
    )

  const infantryUnits = Object.values(infantryEntities)
  .map(entity => entity.models.command_nexus.Infantry)
  .filter(infantry => infantry && infantry.game_id === game_id)
  .map(infantry => infantry as unknown as Infantry);

  console.log(infantryUnits)

  return {
    infantryUnits,
    entitiesCount: infantryUnits.length
  };
};