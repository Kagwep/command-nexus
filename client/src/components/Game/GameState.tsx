import { useCallback } from 'react';
import { useMe } from '../../hooks/useMe';
import { useTurn } from '../../hooks/useTurn';
import { useGame } from '../../hooks/useGame';
import { useGetPlayersForGame } from '../../hooks/useGetPlayersForGame';
import { useElementStore } from '../../utils/nexus';
import { Game, Player } from '../../dojogen/models.gen';
import { removeLeadingZeros } from '../../utils/sanitizer';
import { useNetworkAccount } from '../../context/WalletContex';
import { getGame } from '../../lib/utils';


export interface GameState {
  player: ReturnType<typeof useMe>['me'];
  isItMyTurn: ReturnType<typeof useMe>['isItMyTurn'];
  turn: ReturnType<typeof useTurn>['turn'];
  game: ReturnType<typeof useGame>;
  players: ReturnType<typeof useGetPlayersForGame>['players'];
}

export const useGameState = (nstate: any):{
  getGameState: () => GameState;
  gameState: {
      player: Player | null;
      turn: number;
      game: Game | undefined;
      players: Player[];
  };
} => {
  const { game_id } = useElementStore((state) => state);
  const { me: player,} = useMe();

  const game = getGame(game_id,nstate.games);
  const  players = nstate.players;
  const { account, address, status, isConnected } = useNetworkAccount();

  const turn  = game ? game.nonce  % game.player_count : -1;

  const isItMyTurn  = true ? player &&  turn === player.index : false

  const getGameState = useCallback((): GameState  => {
      

      return {
        player: player,
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