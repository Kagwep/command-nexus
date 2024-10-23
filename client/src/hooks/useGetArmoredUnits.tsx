import { useDojo } from '../dojo/useDojo';
import { sanitizeArmored } from '../utils/sanitizer';
import { useElementStore } from '../utils/nexus';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useMemo, useEffect, useState } from 'react';
import { getSyncEntities } from '@dojoengine/state';

export const useArmoredUnits = () => {
  const {
    setup: {
      clientComponents: { Armored, Game },
      contractComponents,
      toriiClient,
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncEntities = async () => {
    if (game_id === undefined || game_id === null || isSyncing) return;
    
    setIsSyncing(true);
    try {
      await getSyncEntities(
        toriiClient,
        contractComponents as any,
        undefined
      );
      
      setLastSyncTime(new Date());
      console.log('Synced entities with chain');
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (game_id === undefined || game_id === null) return;

    console.log('Starting sync for game:', game_id);
    
    syncEntities();
    const interval = setInterval(syncEntities, 1000);
    
    return () => clearInterval(interval);
  }, []); // Empty since game_id is static

  const armoredEntities = useEntityQuery(
    [Has(Armored), HasValue(Armored, { game_id })],
    {
      updateOnValueChange: true
    }
  );

  const armoredUnits = useMemo(() => {
    console.log('Processing armored units after sync:', lastSyncTime);
    
    return armoredEntities
      .map((id) => getComponentValue(Armored, id))
      .filter(Boolean)
      .sort((a, b) => a.unit_id - b.unit_id)
      .map(sanitizeArmored)
      .filter((armored) => armored.armored_health.hull_integrity !== 0);
  }, [armoredEntities, Armored, lastSyncTime]);

  return {
    armoredUnits,
    isSyncing,
    lastSyncTime,
    syncNow: syncEntities,
    entitiesCount: armoredEntities.length
  };
};