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
import { bigIntAddressToString, removeLeadingZeros } from '../utils/sanitizer';
import { Game } from '../dojogen/models.gen';
import Navbar from './Navbar';
import { useGameStore, usePlayerStore } from '../utils/entitityStore';
import { useGamePolling, usePlayerPolling } from '../hooks/useEntityPolling ';
import { useEntityStore } from '../hooks/useEntityStore';

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

  const playerpol = usePlayerPolling(sdk.client)
  const gamepol = useGamePolling(sdk.client)

  const { entities: playerent, isLoading } = usePlayerStore()

  const { entities: gameEntities, isLoading: gameIsLoading } = useGameStore()

  // console.log(playerent)
  // console.log(gameEntities)


  Object.values(state.entities).forEach(entity => {
      useEntityStore.getState().addEntity(entity);
  });

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
                        Player: {
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
    console.log("value changed")
}, [sdk, account?.address]);

useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    const subscribe = async () => {
        const subscription = await sdk.subscribeEntityQuery(
            {
                command_nexus: {
                    Game: {
                        $: {
                        },
                    },
                    Player: {
                      $: {
                      },
                  },
                },
            },
            (response) => {
                if (response.error) {
                    console.error(
                        "Error setting up entity sync:",
                        response.error
                    );
                } else if (
                    response.data &&
                    response.data[0].entityId !== "0x0"
                ) {
                    console.log("subscribed", response.data[0]);
                    state.updateEntity(response.data[0]);

                }
            },
            { logging: true }
        );
  
        unsubscribe = () => subscription.cancel();
    };
  
    subscribe();
  
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
  }, [sdk, account.address]);



// Separate function for fetching entities
const fetchEntities = async () => {
  console.log("fetc ..............................")
  try {
      await sdk.getEntities(
          {
              command_nexus: {
                  Game: {
                      $: {

                      },
                  },
                  Player: {
                    $: {
                    },
                },
              },
          },
          (response) => {
              if (response.error) {
                  console.error(
                      "Error setting up entity sync:",
                      response.error
                  );
              } else if (
                  response.data &&
                  response.data[0].entityId !== "0x0"
              ) {
                  console.log("polled", response.data[0]);
                  state.updateEntity(response.data[0]);
              }
          },
 
      );
  } catch (error) {
      console.error("Polling error:", error);
  }
};



// Use in useEffect
useEffect(() => {
  fetchEntities();
}, []); // Empty dependency array means this only runs once on mount


useEffect(() => {
  let unsubscribe: (() => void) | undefined;

  const subscribe = async () => {
      const subscription = await sdk.subscribeEntityQuery(
          {
              command_nexus: {
                  Infantry: {
                      $: {
                          where: {
                              game_id: {
                                  $is:game?.game_id,
                              },
                          },
                      },
                  },
              },
          },
          (response) => {
              if (response.error) {
                  console.error(
                      "Error setting up entity sync:",
                      response.error
                  );
              } else if (
                  response.data &&
                  response.data[0].entityId !== "0x0"
              ) {
                  console.log("subscribed", response.data[0]);
                  state.updateEntity(response.data[0]);
                  console.log(state.entities)
              }
          },
          { logging: true }
      );

      unsubscribe = () => subscription.cancel();
  };

  subscribe();

  return () => {
      if (unsubscribe) {
          unsubscribe();
      }
  };
}, [sdk, game?.game_id]);

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

  const setStates = () => {


    Object.entries(state.entities).forEach(([entityId, entity]) => {
      const currentGame = entity.models.command_nexus.Game;
      
  
      if (currentGame && removeLeadingZeros(currentGame.arena_host) === account?.address) {
        setGame(currentGame as Game);
        setGame(game);
        if (game){
          if (game.game_id >= 0) {
            set_game_id(game.game_id);
  
          }
        }
      } else {
        setGame(null);
    
      }
     
      const currentPlayer = entity.models.command_nexus.Player;
      // Ensure currentPlayer exists before comparing its address property
      if (currentPlayer && removeLeadingZeros(currentPlayer.address) === account?.address) {
        setPlayer(currentPlayer);
        if (currentPlayer?.game_id >= 0) {
          set_game_id(currentPlayer.game_id);
          console.log(".......................",currentPlayer.game_id)
          set_game_state(GameState.Lobby);
        }
      } else {
        setPlayer(null);
      }

    });



  }

  useEffect(() => {
    setStates();
  }, [state.entities, account?.address]);

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

          { Object.keys(entities).length === 0 ? (
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
                  <h2 className="text-green-400 font-mono text-xl">ACTIVE OPERATIONS</h2>
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
                    {Object.entries(state.entities).map(([entityId, entity]) => {
                        if (entity.models.command_nexus.Game) {
                          const game = entity.models.command_nexus.Game;
                          return (
                            <GameRow 
                              key={entityId} 
                              game={game as Game} 
                              setPlayerName={setPlayerName}
                            />
                          );
                        }
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
