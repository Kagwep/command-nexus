import React from 'react';
import { TableRow, TableCell } from './UI/table';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { feltToStr } from '../utils/unpack';
import { useElementStore } from '../utils/nexus';
import GameState from '../utils/gamestate';
import { useDojo } from '../dojo/useDojo';
import { toast } from './UI/use-toast';
import { DialogCreateJoin } from './DialogCreateJoin';
import { useGetPlayersForGame } from '../hooks/useGetPlayersForGame';
import { useNetworkAccount } from '../contexts/WalletContex';

interface GameRowProps {
  game: {
    game_id: number;
    arena: any;
    player_count: number;
    slots: number;
  };
  setPlayerName: (name: string) => void;
}

const GameRow: React.FC<GameRowProps> = ({ game, setPlayerName }) => {
  const {
    setup: {
      client: { arena },
      clientComponents: { Player },
    }
  } = useDojo();

  const { account, address, status, isConnected } = useNetworkAccount();

  const { set_game_state, set_game_id, player_name } = useElementStore((state) => state);

  const playerId = useEntityQuery([HasValue(Player, { game_id: game.game_id, index: 0 })], { updateOnValueChange: true });
  const player = useComponentValue(Player, playerId[0]);
  const { players } = useGetPlayersForGame(game.game_id);

  const joinGame = async (gameid: number) => {
    if (!player_name) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Please enter a pseudo'}</code>,
      });
      return;
    }
    try {
      await arena.join(account, gameid, player_name);
      set_game_id(gameid);
      set_game_state(GameState.Lobby);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  return (
    <TableRow key={game.game_id}>
      <TableCell>{player ? feltToStr(player.name) : ''}</TableCell>
      <TableCell>{game.game_id}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center">
          <div className="px-2 rounded-full bg-green-950">{`${players.length}/4`}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <DialogCreateJoin
            onClick={() => joinGame(game.game_id)}
            playerName={player_name}
            setPlayerName={setPlayerName}
            dialogTitle={`Join Game ${game.game_id}`}
            buttonText="Join Game"
            buttonTextDisplayed="Join Game"
            isCreating={false}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
