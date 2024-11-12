// import { useDojo } from '../dojo/useDojo';
// import { sanitizeInfantry } from '../utils/sanitizer';
// import { useElementStore } from '../utils/nexus';
// import { Infantry } from '../utils/types';
// import { useComponentValue, useEntityQuery } from '@dojoengine/react';
// import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
// import { useMemo, useEffect, useRef } from 'react';


// export const useInfantryUnits = () => {
//   const {
//     setup: {
//       clientComponents: { Infantry,Game },
//     },
//   } = useDojo();

//   const { game_id } = useElementStore((state) => state);

//   const gameEntities = useEntityQuery([HasValue(Game, { game_id })]);
//   const gameEntity = useMemo(() => gameEntities.length > 0 ? gameEntities[0] : undefined, [gameEntities]);

//   const gameComponentValue = useComponentValue(Game, gameEntity);

//   const infantryEntities = useEntityQuery([Has(Infantry), HasValue(Infantry, { game_id })]);

//   const infantryUnits = useMemo(() => 
//     infantryEntities
//       .map((id) => getComponentValue(Infantry, id))
//       .filter(Boolean)
//       .sort((a, b) => a.unit_id - b.unit_id)
//       .map(sanitizeInfantry)
//       .filter((infantry) => infantry.health.current !== 0),
//     [infantryEntities, Infantry]
//   );

//   console.log(infantryUnits)

//   // Debugging
//   const prevGameIdRef = useRef(game_id);
//   const prevInfantryEntitiesRef = useRef(infantryEntities);

//   useEffect(() => {
//     if (game_id !== prevGameIdRef.current) {
//       console.log('Game ID changed:', game_id);
//       prevGameIdRef.current = game_id;
//     }
//   }, [game_id]);

//   useEffect(() => {
//     if (infantryEntities !== prevInfantryEntitiesRef.current) {
//       console.log('Infantry entities changed:', infantryEntities);
//       prevInfantryEntitiesRef.current = infantryEntities;
//     }
//   }, [infantryEntities,gameComponentValue]);

//   return { infantryUnits };
// };

import { useDojo } from '../dojo/useDojo';
import { sanitizeInfantry } from '../utils/sanitizer';
import { useElementStore } from '../utils/nexus';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useMemo, useEffect, useState } from 'react';
import { getSyncEntities } from '@dojoengine/state';

export const useInfantryUnits = () => {
  const {
    setup: {
      clientComponents: { Infantry, Game },
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

  const infantryEntities = useEntityQuery(
    [Has(Infantry), HasValue(Infantry, { game_id })],
    {
      updateOnValueChange: true
    }
  );

  const infantryUnits = useMemo(() => {
    console.log('Processing infantry units after sync:', lastSyncTime);
    
    return infantryEntities
      .map((id) => getComponentValue(Infantry, id))
      .filter(Boolean)
      .sort((a, b) => a.unit_id - b.unit_id)
      .map(sanitizeInfantry)
      .filter((infantry) => infantry.health.current !== 0);
  }, [infantryEntities, Infantry, lastSyncTime]);

  return {
    infantryUnits,
    isSyncing,
    lastSyncTime,
    syncNow: syncEntities,
    entitiesCount: infantryEntities.length
  };
};