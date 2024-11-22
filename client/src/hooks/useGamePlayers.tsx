import { getEntityIdFromKeys } from '@dojoengine/utils';
import useModel from './useModel';
import { Game } from '@/dojogen/models.gen';

// Maximum number of players we support
const MAX_PLAYERS = 4; // or whatever your max player count is

export const useGamePlayers = (game: Game) => {
  // Pre-define maximum possible slots
  const slots = Array.from({ length: MAX_PLAYERS }, (_, i) => i);
  
  // Create all possible models but only return what's needed
  const players = slots.map(index => {
    const entityId = getEntityIdFromKeys([BigInt(game.game_id), BigInt(index)]);
    return useModel(entityId, "command_nexus-Player");
  });

  const playerEntityIds = slots
    .slice(0, game.player_count)
    .map(index => getEntityIdFromKeys([BigInt(game.game_id), BigInt(index)]));

  return {
    players: players.slice(0, game.player_count),
    playerEntityIds
  };
};
