import { useElementStore } from '../utils/nexus';
import { useMemo } from 'react';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import useModel from './useModel';

export const useGame = () => {

  const { game_id } = useElementStore((state) => state);

  if(!game_id) return;

  // Following the same pattern as useGetPlayersForGame
  const entityId = useMemo(
    () => getEntityIdFromKeys([BigInt(game_id)]),
    [game_id]
);

const game = useModel(entityId, "command_nexus-Game");


  return game;
};