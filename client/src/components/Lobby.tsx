import GameState from '../utils/gamestate';
import { useElementStore } from '../utils/nexus';
import { Button } from './UI/button';
import { useEffect } from 'react';
import { removeLeadingZeros } from '../utils/sanitizer';
import { useDojo } from '../dojo/useDojo';
import { toast, useToast } from './UI/use-toast';
import { useGetPlayersForGame } from '../hooks/useGetPlayersForGame';
import { useGame } from '../hooks/useGame';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './UI/table';
import { useMe } from '../hooks/useMe';
import { FaClock, FaCoins, FaFire, FaTrophy, FaUsers  } from 'react-icons/fa';
import { Player } from '../utils/types';
import { useState } from 'react';
import WalletButton from './WalletButton';
import Loading from './Loading';
import { useNetworkAccount } from '../contexts/WalletContex';


const Lobby: React.FC = () => {
  const {
    setup: {
      client: { arena }
    },
  } = useDojo();

  const { account, address, status, isConnected } = useNetworkAccount();

  const { set_game_state, set_game_id, game_id, round_limit } = useElementStore((state) => state);


  const game = useGame();

  console.log(game_id)

  const { players } = useGetPlayersForGame(game_id);

  let me: Player;
  
  if (players.length > 0 && account.address) {
      
    me = players.find((p) => p.address === account.address)

  }

  const [leaveLoading, setLeaveLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [kickLoading, setKickLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    if (me) {
      if (players.findIndex((player) => player.address === me.address) === -1) {
        set_game_state(GameState.MainMenu);
      }
    }
  }, [players]);


  console.log("51456454464",game)
  console.log("51456454464",game_id)
  console.log("51456454464",players)
  console.log("51456454464",me)

  useEffect(() => {
    // console.log(game)
    if (game && Number(game.seed?.toString(16)) !== 0) {
      // Game has started
      set_game_state(GameState.Game);
    }
  }, [game?.seed]);

  const isHost = (arena: string, address: string) => {
    return arena === removeLeadingZeros(address);
  };

  const startGame = async () => {
    if (game_id === undefined) {
      console.error('Game id not defined');
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Game id not defined'}</code>,
      });
      return;
    }
    try {
      setStartLoading(true);
      await arena.start(account, game_id, round_limit);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    } finally {
      setStartLoading(false);
    }
  };

  const leaveGame = async (game_id: number) => {
    try {
      setLeaveLoading(true);
      if (isHost(game.arena, account.address)) {
        await arena.delete_game(account, game.id);
      } else {
        await arena.leave(account, game_id);
      }

      set_game_id(0);
      set_game_state(GameState.MainMenu);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    } finally {
      setLeaveLoading(false);
    }
  };

  const kickPlayer = async (player_index: number, game_id: number) => {
    try {
      setKickLoading(true);
      await arena.kick(account, game_id, player_index);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    } finally {
      setKickLoading(false);
    }
  };

  const transferHost = async (player_index: number, game_id: number) => {
    try {
      setTransferLoading(true);
      await arena.transfer(account, game_id, player_index);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    } finally {
      setTransferLoading(false);
    }
  };

  if (!game || !me || !players) {
    return;
  }

  // console.log(account.address)

  return (
    <div className="font-vt323 min-h-screen bg-cover bg-center bg-no-repeat text-green-100" 
         style={{backgroundImage: "url('')"}}>
      <div className="flex flex-col justify-center items-center gap-6 p-4">
        <header className="w-full flex justify-between items-center bg-green-950 bg-opacity-80 p-4 rounded-lg">
          <Button
            isLoading={leaveLoading}
            isDisabled={leaveLoading}
            variant="tertiary"
            onClick={() => leaveGame(game.game_id)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Leave
          </Button>
          <h1 className="text-4xl font-bold text-center text-green-300">Command Nexus</h1>
          <WalletButton />
        </header>

        <main className="w-full max-w-6xl bg-green-950 bg-opacity-80 p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Game #{game.game_id}</h2>
            <div className="flex items-center space-x-4">
              <span className="flex items-center"><FaUsers className="mr-2" />{players.length}/4 Players</span>
              <span className="flex items-center"><FaClock className="mr-2" />Turn: {game.clock}</span>
              <span className="flex items-center"><FaTrophy className="mr-2" />Limit: {game.limit}</span>
              <span className="flex items-center"><FaCoins className="mr-2" />Price: {game.price.toString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-900 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Game Info</h3>
              <p>Minimum Moves: {game.minimum_moves}</p>
              <p>Next to Move: Player {game.next_to_move.toString()}</p>
              <p>Penalty: {game.penalty.toString()}</p>
              <p>Seed: {game.seed.toString()}</p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Available Home Bases</h3>
              {Object.entries(game.available_home_bases).map(([base, status]) => (
                <p key={base}>{base}: {status.toString() === '0' ? 'Occupied' : 'Available'}</p>
              ))}
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-green-800">
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.address} className="hover:bg-green-800">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isHost(game.arena, player.address) && <FaFire className="text-red-500" />}
                      {player.name}
                    </div>
                  </TableCell>
                  <TableCell>{player.address}</TableCell>
                  <TableCell>
                    {isHost(game.arena, me.address) && player.address !== me.address && (
                      <Button
                        isLoading={kickLoading}
                        isDisabled={kickLoading}
                        size="sm"
                        variant="tertiary"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => kickPlayer(player.index, game.game_id)}
                      >
                        Kick
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {isHost(game.arena, account.address) ? (
            <div className="mt-6 flex justify-end">
              <Button
                isLoading={startLoading}
                isDisabled={startLoading || players.length < 2}
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={startGame}
              >
                Start the Game
              </Button>
            </div>
          ) : (
            <Loading text="Waiting for the game to start" />
          )}
        </main>
      </div>
    </div>
  );
};

export default Lobby;
