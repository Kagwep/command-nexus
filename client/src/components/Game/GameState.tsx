import { useCallback } from 'react';
import { useMe } from '../../hooks/useMe';
import { useTurn } from '../../hooks/useTurn';
import { usePhase } from '../../hooks/usePhase';
import { useGame } from '../../hooks/useGame';
import { useGetPlayersForGame } from '../../hooks/useGetPlayersForGame';
import { useElementStore } from '../../utils/nexus';
import useNetworkAccount from '../../hooks/useNetworkAccount';


export interface GameState {
  player: ReturnType<typeof useMe>['me'];
  isItMyTurn: ReturnType<typeof useMe>['isItMyTurn'];
  turn: ReturnType<typeof useTurn>['turn'];
  phase: ReturnType<typeof usePhase>['phase'];
  game: ReturnType<typeof useGame>;
  players: ReturnType<typeof useGetPlayersForGame>['players'];
}

export const useGameState = () => {
  const { me: player, isItMyTurn } = useMe();
  const { turn } = useTurn();
  const { phase } = usePhase();
  const game = useGame();
  const { game_id } = useElementStore((state) => state);
  const { players } = useGetPlayersForGame(game_id);
  const { account, address, status, isConnected } = useNetworkAccount();


  const getGameState = useCallback((): GameState  => {
      const me = players.find((p) => p.address === account.address);

      return {
        player: me,
        isItMyTurn,
        turn,
        phase,
        game,
        players
      };

  }, [player, isItMyTurn, turn, phase, game, players]);

  return { getGameState ,gameState: {
    player,
    turn,
    phase,
    game,
    players
  }};
};