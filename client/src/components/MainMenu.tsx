import { useElementStore } from '../utils/nexus';
import GameState from '../utils/gamestate';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDojo } from '../dojo/useDojo';
import { useToast } from './UI/use-toast';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './UI/table';
import GameRow from './GameRow';
import { DialogCreateJoin } from './DialogCreateJoin';
import WalletButton from './WalletButton';
import { useNetworkAccount } from '../context/WalletContex';
import { useSDK } from '../context/SDKContext';
import { useDojoStore } from '../lib/utils';
import { Account, addAddressPadding } from 'starknet';
import { bigIntAddressToString } from '../utils/sanitizer';
import { Game } from '../dojogen/models.gen';

const MainMenu: React.FC = () => {
  const { toast } = useToast();
  const { set_game_state, set_game_id, player_name, setPlayerName, round_limit, setRoundLimit } = useElementStore(
    (state) => state
  );

  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState(null);

  const {
    setup: {
      client
    },
  } = useDojo();

  const sdk = useSDK();

  const { account, address, status, isConnected } = useNetworkAccount();

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);

  useEffect(() => {
    const fetchEntities = async () => {

      if(!account) return;
        try {
            await sdk.getEntities(
                {
                    command_nexus: {
                        Game: {
                            $: { },
                        },
                    },
                },
                (resp) => {
                    if (resp.error) {
                        console.error(
                            "resp.error.message:",
                            resp.error.message
                        );
                        return;
                    }
                    if (resp.data) {
                        state.setEntities(resp.data);
                    }
                }
            );
        } catch (error) {
            console.error("Error querying entities:", error);
        }
    };

    fetchEntities();
}, [sdk, account?.address]);
  
  const prevGameRef = useRef(game);
  const prevPlayerRef = useRef(player);

  const updateGameState = useCallback((currentPlayer: any, currentGame: any) => {
    console.log("Inside updateGameState callback with params:", currentPlayer);
  
    // If either player or game exists, set the game state to Lobby
    const newGameState = (currentPlayer || currentGame) ? GameState.Lobby : null;

    console.log(currentPlayer?.game_id)
  
    if (currentPlayer?.game_id >= 0) {
      console.log("setting game state");
      set_game_id(currentPlayer.game_id);
    }
  
    if (newGameState !== null) {
      set_game_state(newGameState);
    }
    console.log("executed")
  }, [set_game_id, set_game_state]);
  


  const [hours, setHours] = useState<number | null>(null);
  const [minutes, setMinutes] = useState(5);
  useEffect(() => {
    if (game) {
     // setIsLoading(false);
      console.log('Game updated:', game);

      set_game_id(game.game_id);

    }
  }, [game]);
// In useEffect, pass the current player and game explicitly
useEffect(() => {
  const gameChanged = game !== prevGameRef.current;
  const playerChanged = player !== prevPlayerRef.current;

  if (gameChanged || playerChanged) {
    console.log('Changes detected:', { gameChanged, playerChanged }, player,game);
    
    // Pass the player and game to updateGameState explicitly
    updateGameState(player, game);

    prevGameRef.current = game;
    prevPlayerRef.current = player;
  }
}, [game, player, updateGameState]);

  const createNewGame = async () => {
    if (!player_name) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Please enter a pseudo'}</code>,
      });
      return;
    }

    try {
      const totalSeconds = hours ? hours * 3600 + minutes * 60 : minutes * 60;
      let result = await (await client).arena.create(account as Account, player_name, /* price */ 0, /* penalty*/ totalSeconds);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  return (
    <div className="font-vt323 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center gap-8">
          <header className="w-full flex justify-between items-center mb-6">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-green">
              Command Nexus
            </h1>
            <div className="flex items-center gap-4">
              <WalletButton />
            </div>
          </header>

          { Object.keys(entities).length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
              <h2 className="text-3xl mb-6">No active games. Start your adventure!</h2>
              <DialogCreateJoin
                onClick={createNewGame}
                playerName={player_name}
                setPlayerName={setPlayerName}
                dialogTitle="Create a new game"
                buttonText="Create"
                buttonTextDisplayed="Create a New Game"
                hours={hours}
                setHours={(value: number | null) => setHours(value)}
                minutes={minutes}
                setMinutes={setMinutes}
                limit={round_limit}
                setLimit={(value: number) => setRoundLimit(value)}
                isCreating={true}
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
              <div className="p-6 bg-cover bg-center" style={{backgroundImage: "url('https://res.cloudinary.com/dydj8hnhz/image/upload/v1722350662/p1qgfdio6sv1khctclnq.webp')"}}>
                <h2 className="text-3xl font-bold mb-4">Active Games</h2>
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-700 bg-opacity-60">
                      <TableHead className="py-3 text-left">Host</TableHead>
                      <TableHead className="py-3 text-center">ID</TableHead>
                      <TableHead className="py-3 text-center">Players</TableHead>
                      <TableHead className="py-3"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(entities).map(([entityId,entity])=> {
                      const game = entity.models.command_nexus.Game;
                      bigIntAddressToString(entity.models.command_nexus.Game.arena_host) === account?.address ? setGame(game): setGame(null);
                      const player = bigIntAddressToString(entity.models.command_nexus.Player.address) === account?.address ? entity.models.command_nexus.Player : null;
                      setPlayer(player)
                      return <GameRow key={entityId} game={game} setPlayerName={setPlayerName} />
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="bg-gray-900 p-4 flex justify-end">
                <DialogCreateJoin
                  onClick={createNewGame}
                  playerName={player_name}
                  setPlayerName={setPlayerName}
                  dialogTitle="Create a new game"
                  buttonText="Create"
                  buttonTextDisplayed="Create a New Game"
                  hours={hours}
                  setHours={setHours}
                  minutes={minutes}
                  setMinutes={setMinutes}
                  limit={round_limit}
                  setLimit={(value: number) => setRoundLimit(value)}
                  isCreating={true}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default MainMenu;
