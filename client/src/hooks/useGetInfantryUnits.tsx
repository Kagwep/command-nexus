import { useDojo } from '../dojo/useDojo';
import { sanitizeInfantry } from '../utils/sanitizer';
import { useElementStore } from '../utils/nexus';
import { Infantry } from '../utils/types';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useMemo, useEffect, useRef } from 'react';


export const useInfantryUnits = () => {
  const {
    setup: {
      clientComponents: { Infantry,Game },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const gameEntities = useEntityQuery([HasValue(Game, { game_id })]);
  const gameEntity = useMemo(() => gameEntities.length > 0 ? gameEntities[0] : undefined, [gameEntities]);

  const gameComponentValue = useComponentValue(Game, gameEntity);

  const infantryEntities = useEntityQuery([Has(Infantry), HasValue(Infantry, { game_id })]);

  const infantryUnits = useMemo(() => 
    infantryEntities
      .map((id) => getComponentValue(Infantry, id))
      .filter(Boolean)
      .sort((a, b) => a.unit_id - b.unit_id)
      .map(sanitizeInfantry)
      .filter((infantry) => infantry.health.current !== 0),
    [infantryEntities, Infantry]
  );

  // Debugging
  const prevGameIdRef = useRef(game_id);
  const prevInfantryEntitiesRef = useRef(infantryEntities);

  useEffect(() => {
    if (game_id !== prevGameIdRef.current) {
      console.log('Game ID changed:', game_id);
      prevGameIdRef.current = game_id;
    }
  }, [game_id]);

  useEffect(() => {
    if (infantryEntities !== prevInfantryEntitiesRef.current) {
      console.log('Infantry entities changed:', infantryEntities);
      prevInfantryEntitiesRef.current = infantryEntities;
    }
  }, [infantryEntities,gameComponentValue]);

  return { infantryUnits };
};