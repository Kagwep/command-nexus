import { useDojo } from '../dojo/useDojo';
import { sanitizeGame } from '../utils/sanitizer';
import { useElementStore } from '../utils/nexus';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { useMemo, useEffect, useRef } from 'react';

export const useGame = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  console.log(game_id)

  const gameEntities = useEntityQuery([HasValue(Game, { game_id })]);
  const gameEntity = useMemo(() => gameEntities.length > 0 ? gameEntities[0] : undefined, [gameEntities]);

  const gameComponentValue = useComponentValue(Game, gameEntity);

  console.log(gameComponentValue)

  const sanitizedGame = useMemo(
    () => (gameComponentValue === undefined ? undefined : sanitizeGame(gameComponentValue)),
    [gameComponentValue]
  );

  //console.log(sanitizeGame)

  const result = useMemo(() => {
    
    if (!sanitizedGame) {
      return {
        current_turn: 0,
        number_max_turns: 0,
      };
    }

    const current_turn = Math.floor(sanitizedGame.nonce / (3 * sanitizedGame.player_count) + 1);
    const number_max_turns = Math.floor(sanitizedGame.limit / (3 * sanitizedGame.player_count));

    return {
      ...sanitizedGame,
      current_turn: Math.min(current_turn, number_max_turns),
      number_max_turns,
    };
  }, [sanitizedGame]);

  // Debugging
  const prevGameIdRef = useRef(game_id);
  const prevGameEntityRef = useRef(gameEntity);
  const prevGameComponentValueRef = useRef(gameComponentValue);

  useEffect(() => {
    if (game_id !== prevGameIdRef.current) {
      console.log('Game ID changed:', game_id);
      prevGameIdRef.current = game_id;
    }
  }, [game_id]);

  useEffect(() => {
    if (gameEntity !== prevGameEntityRef.current) {
      console.log('Game entity changed:', gameEntity);
      prevGameEntityRef.current = gameEntity;
    }
  }, [gameEntity]);

  useEffect(() => {
    if (gameComponentValue !== prevGameComponentValueRef.current) {
      console.log('Game component value changed:', gameComponentValue);
      prevGameComponentValueRef.current = gameComponentValue;
    }
  }, [gameComponentValue]);

  return result;
};