import { useDojo } from '../dojo/useDojo';
import { sanitizeGame } from '../utils/sanitizer';
import { useElementStore } from '../utils/nexus';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { useMemo } from 'react';

export const useGame = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const gameEntitity = useEntityQuery([HasValue(Game, { game_id: game_id })]);
  const gameEntity = gameEntitity.length > 0 ? gameEntitity[0] : undefined;
  
  const gameComponentValue = useComponentValue(Game, gameEntity);

  const sanitizedGame = useMemo(
    () => (gameComponentValue === undefined ? undefined : sanitizeGame(gameComponentValue)),
    [gameComponentValue]
  );

  const current_turn = sanitizedGame ? Math.floor(sanitizedGame.nonce / (3 * sanitizedGame.player_count) + 1) : 0;
  const number_max_turns = sanitizedGame ? Math.floor(sanitizedGame.limit / (3 * sanitizedGame.player_count)) : 0;

  return {
    ...sanitizedGame,
    current_turn: Math.min(current_turn, number_max_turns),
    number_max_turns: number_max_turns,
  };
};
