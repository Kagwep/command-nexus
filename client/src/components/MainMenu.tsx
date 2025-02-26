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
import { Account, AccountInterface, addAddressPadding } from 'starknet';
import { bigIntAddressToString, removeLeadingZeros } from '../utils/sanitizer';
import { CommandNexusSchemaType, Game, ModelsMapping } from '../dojogen/models.gen';
import Navbar from './Navbar';
import { useGameStore, usePlayerStore } from '../utils/entitityStore';
import { useGamePolling, usePlayerPolling } from '../hooks/useEntityPolling ';
import { useEntityStore } from '../hooks/useEntityStore';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useAllEntities } from '../utils/command';
import { ClauseBuilder, KeysClause, ParsedEntity,  QueryBuilder,  ToriiQueryBuilder } from '@dojoengine/sdk';


const MainMenu: React.FC = () => {
  const { toast } = useToast();
  const { set_game_state, set_game_id, player_name,game_id, setPlayerName, round_limit, setRoundLimit } = useElementStore(
    (state) => state
  );

  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState(null);


  const {
    setup: {
      client
    },
  } = useDojo();

  const { useDojoStore, client: dojoClient, sdk } = useDojoSDK();

  const { account, address, status, isConnected } = useNetworkAccount();

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);

  const playerpol = usePlayerPolling(sdk.client)
  const gamepol = useGamePolling(sdk.client)

 

  const { state: nstate, refetch } = useAllEntities();

  console.log(nstate.games,nstate.players,nstate.abilityState,nstate.infantry);

  const { entities: playerent, isLoading } = usePlayerStore()

  const { entities: gameEntities, isLoading: gameIsLoading } = useGameStore()


  useEffect(() => {
    async function fetchToriiClause() {
      const res = await sdk.client.getEntities(
        new ToriiQueryBuilder()
          .withClause(
            new ClauseBuilder()
              .keys([], [undefined], "VariableLen")
              .build()
          )
          .build()
      );
      return res;
    }
    fetchToriiClause().then(console.log);
  });


useEffect(() => {
  let unsubscribe: (() => void) | undefined;

  const keys = game_id >= 0 ? [String(game_id)] : []

  const subscribe = async (account: AccountInterface) => {
      const [initialData, subscription] = await sdk.subscribeEntityQuery({
          query: new ToriiQueryBuilder()
              .withClause(
                  // Querying Moves and Position models that has at least [account.address] as key
                  KeysClause(
                      [ModelsMapping.Game, ModelsMapping.Player, ModelsMapping.AbilityState, ModelsMapping.Infantry, ModelsMapping.UnitState],
                      keys,
                      "VariableLen"
                  ).build()
              )
              .includeHashedKeys(),
          callback: ({ error, data }) => {
              if (error) {
                  console.error("Error setting up entity sync:", error);
              } else if (data && data[0].entityId !== "0x0") {
                  state.updateEntity(data[0]);
              }
          },
      });

      state.setEntities(initialData);

      unsubscribe = () => subscription.cancel();
  };

  if (account) {
      subscribe(account);
  }

  return () => {
      if (unsubscribe) {
          unsubscribe();
      }
  };
}, [sdk, account,game_id]);




const [messageIndex, setMessageIndex] = useState(0);
const messages = [
  'NO ACTIVE OPERATIONS DETECTED',
  'AWAITING MISSION INITIALIZATION',
  'COMMAND CENTER READY',
  'TACTICAL SYSTEMS ONLINE'
];



useEffect(() => {
  const interval = setInterval(() => {
    setMessageIndex((prev) => (prev + 1) % messages.length);
  }, 2000);

  return () => clearInterval(interval);
}, []);


const prevGameRef = useRef(game);
const prevPlayerRef = useRef(player);

// const updateGameState = useCallback((currentPlayer: any, currentGame: any) => {
//   console.log("Inside updateGameState callback with params:", currentPlayer);

//   // If either player or game exists, set the game state to Lobby
//   const newGameState = (currentPlayer || currentGame) ? GameState.Lobby : null;

//   console.log(currentPlayer?.game_id)

//   if ((currentPlayer?.game_id >= 0) && !currentGame?.over) {
//     console.log("setting game state");
//     set_game_id(currentPlayer.game_id);
//   }

//   if ((newGameState !== null) &&  !currentGame?.over) {
//     set_game_state(newGameState);
//   }
//   console.log("executed")
// }, [set_game_id, set_game_state]);



const [hours, setHours] = useState<number | null>(null);
const [minutes, setMinutes] = useState(5);

const setStates = () => {

  const gamesById = {};

  // Assuming games and players are Records
Object.entries(nstate.games).forEach(([gameId, currentGame]) => {
  //console.log(removeLeadingZeros(currentGame.arena_host) === account?.address)
  gamesById[Number(currentGame.game_id)] = currentGame;
  if (removeLeadingZeros(currentGame.arena_host) === account?.address) {
    
    if ((currentGame.game_id as number >= 0) && (!currentGame.over)) {
      setGame(currentGame);
      set_game_id(Number(currentGame.game_id));
    }
  }
});

Object.entries(nstate.players).forEach(([playerId, currentPlayer]) => {
  if (removeLeadingZeros(currentPlayer.address) === account?.address) {
    
    const playerGame = gamesById[Number(currentPlayer.game_id)];
    if ((currentPlayer.game_id as number >= 0)&& playerGame && !playerGame.over) {
      setPlayer(currentPlayer);
      set_game_id(Number(currentPlayer.game_id));
      console.log(".......................", currentPlayer.game_id);
      set_game_state(GameState.Lobby);
    }
  }
});



}

useEffect(() => {
setStates();
}, [nstate, account?.address]);

useEffect(() => {
if (game) {
// setIsLoading(false);
console.log('Game updated:', game);

set_game_id(Number(game.game_id));

}
}, [game]);
// In useEffect, pass the current player and game explicitly
useEffect(() => {
  const gameChanged = game !== prevGameRef.current;
  const playerChanged = player !== prevPlayerRef.current;

  if (gameChanged || playerChanged) {
    console.log('Changes detected:', { gameChanged, playerChanged }, player,game);
    
    // Pass the player and game to updateGameState explicitly
   // updateGameState(player, game);

    prevGameRef.current = game;
    prevPlayerRef.current = player;
  }
}, [game, player]);

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

  //console.log(entities);

  return (
    <div className="font-vt323 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
       <Navbar />
      <div className="container mx-auto px-4 py-8 mt-12">
        <div className="flex flex-col justify-center items-center gap-8">
          <header className="w-full flex justify-between items-center mb-6">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-green">
              {/* Command Nexus */}
            </h1>
            <div className="flex items-center gap-4">
              <WalletButton />
            </div>
          </header>

          { Object.keys(nstate.games).length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
                  <div className="relative border border-green-500/30 bg-black/40 p-8 rounded-lg mb-2">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center space-x-3 font-mono text-2xl text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span>{messages[messageIndex]}</span>
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <div className="text-center font-mono text-green-400/70">
                          INITIALIZE NEW OPERATION TO BEGIN MISSION
                        </div>
                      </div>
                      
                      {/* Optional scanning line effect */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-scan" />
                      </div>
                    </div>
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
            <div className="w-full max-w-4xl">
            {/* Command Center Header */}
            <div className="border border-green-500/30 rounded-t-lg bg-black/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-green-400 font-mono text-xl">OPERATIONS</h2>
                </div>
                <div className="text-green-500/60 font-mono text-sm">
                  [SECURE CHANNEL]
                </div>
              </div>
            </div>
      
            {/* Main Content Area */}
            <div className="border-l border-r border-green-500/30 bg-black/40">
              <div className="p-6">
                {/* Grid overlay effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                  
                  <Table className="w-full relative">
                    <TableHeader>
                      <TableRow className="border-green-500/30 bg-green-900/20">
                        <TableHead className="text-green-400 font-mono text-left">COMMANDER</TableHead>
                        <TableHead className="text-green-400 font-mono text-center">OP-ID</TableHead>
                        <TableHead className="text-green-400 font-mono text-center">SQUAD STATUS</TableHead>
                        <TableHead className="text-green-400 font-mono text-right">ACTIONS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {Object.entries(nstate.games).map(([gameId, currentGame]) => {
                          return (
                            <GameRow 
                              key={gameId}
                              game={currentGame as Game}
                              setPlayerName={setPlayerName}
                              nstates={nstate}                            />
                          );

                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
      
            {/* Control Panel Footer */}
            <div className="border border-green-500/30 rounded-b-lg bg-black/60 p-4">
              <div className="flex justify-between items-center">
                <div className="text-green-500/60 font-mono text-sm">
                  STATUS: READY FOR DEPLOYMENT
                </div>
                <DialogCreateJoin
                  onClick={createNewGame}
                  playerName={player_name}
                  setPlayerName={setPlayerName}
                  dialogTitle="INITIALIZE NEW OPERATION"
                  buttonText="DEPLOY"
                  buttonTextDisplayed={
                    <div className="flex items-center space-x-2">
                      <span>◈</span>
                      <span>INITIATE NEW OPERATION</span>
                      <span>◈</span>
                    </div>
                  }
                  hours={hours}
                  setHours={setHours}
                  minutes={minutes}
                  setMinutes={setMinutes}
                  limit={round_limit}
                  setLimit={setRoundLimit}
                  isCreating={true}
                />
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default MainMenu;