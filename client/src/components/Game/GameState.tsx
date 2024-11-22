import { useCallback } from 'react';
import { useMe } from '../../hooks/useMe';
import { useTurn } from '../../hooks/useTurn';
import { useGame } from '../../hooks/useGame';
import { useGetPlayersForGame } from '../../hooks/useGetPlayersForGame';
import { useElementStore } from '../../utils/nexus';
import { Game, Player } from '../../dojogen/models.gen';
import { removeLeadingZeros } from '../../utils/sanitizer';
import { useNetworkAccount } from '../../context/WalletContex';


export interface GameState {
  player: ReturnType<typeof useMe>['me'];
  isItMyTurn: ReturnType<typeof useMe>['isItMyTurn'];
  turn: ReturnType<typeof useTurn>['turn'];
  game: ReturnType<typeof useGame>;
  players: ReturnType<typeof useGetPlayersForGame>['players'];
}

export const useGameState = ():{
  getGameState: () => GameState;
  gameState: {
      player: Player | null;
      turn: number;
      game: Game | undefined;
      players: Player[];
  };
} => {
  const { me: player, isItMyTurn } = useMe();
  const { turn } = useTurn();
  const game = useGame();
  const { game_id } = useElementStore((state) => state);
  const { players } = useGetPlayersForGame(game_id);
  const { account, address, status, isConnected } = useNetworkAccount();



  const getGameState = useCallback((): GameState  => {
      const me = players.find((p) => removeLeadingZeros(p.address) === account?.address);

      return {
        player: me ? me : null,
        isItMyTurn,
        turn,
        game,
        players
      };

  }, [player, isItMyTurn, turn, game, players]);

  return { getGameState ,gameState: {
    player,
    turn,
    game,
    players
  }};
};