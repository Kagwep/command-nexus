import { useDojo } from '@/dojo/useDojo';
import { sanitizeGame } from '@/utils/sanitizer';
import { useElementStore } from '@/utils/nexus';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useEntityQuery } from '@dojoengine/react';
import { useMemo } from 'react';

export const useGame = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  // Following the same pattern as useGetPlayersForGame
  const gameEntities = useEntityQuery([
    Has(Game), 
    HasValue(Game, { game_id: game_id })
  ]);

  // Use useMemo for efficient processing
  const gameData = useMemo(() => {
    const gameComponent = gameEntities
      .map(entity => getComponentValue(Game, entity))
      .find(game => game); // Get first valid game

    if (!gameComponent) return undefined;

    const sanitizedGame = sanitizeGame(gameComponent);
    
    const current_turn = Math.floor(sanitizedGame.nonce / (3 * sanitizedGame.player_count) + 1);
    const number_max_turns = Math.floor(sanitizedGame.limit / (3 * sanitizedGame.player_count));

    return {
      ...sanitizedGame,
      current_turn: Math.min(current_turn, number_max_turns),
      number_max_turns: number_max_turns,
    };
  }, [gameEntities, Game]);

  return gameData;
};