import { getEntityIdFromKeys } from '@dojoengine/utils';
import useModel from './useModel';
import { Game } from '@/dojogen/models.gen';

// Maximum number of players we support
const MAX_PLAYERS = 4; // or whatever your max player count is

export const useGamePlayers = (game: Game) => {
  // Pre-define all possible player entity IDs
  const entityIds = Array.from(
    { length: MAX_PLAYERS }, 
    (_, index) => getEntityIdFromKeys([BigInt(game.game_id), BigInt(index)])
  );

  // Call hooks for all possible players (they'll be undefined if not in use)
  const player0 = useModel(entityIds[0], "command_nexus-Player");
  const player1 = useModel(entityIds[1], "command_nexus-Player");
  const player2 = useModel(entityIds[2], "command_nexus-Player");
  const player3 = useModel(entityIds[3], "command_nexus-Player");

  console.log([player0, player1, player2, player3])

  // Filter out players based on actual player count
  const players = [player0, player1, player2, player3]
    .slice(0, game.player_count);
  
  const playerEntityIds = entityIds.slice(0, game.player_count);

  return {
    players,
    playerEntityIds
  };
};
