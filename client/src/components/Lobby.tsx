import GameState from '../utils/gamestate';
import { useElementStore } from '../utils/nexus';
import { Button } from './UI/button';
import { useEffect } from 'react';
import { removeLeadingZeros, shortAddress } from '../utils/sanitizer';
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
import { useNetworkAccount } from '../context/WalletContex';
import { Account } from 'starknet';
import { hexToUtf8 } from '../utils/unpack';
import { useDojoStore } from '../lib/utils';
import { useSDK } from '../context/SDKContext';
import Navbar from './Navbar';


const Lobby: React.FC = () => {
  const {
    setup: {
      client
    },
  } = useDojo();

  const sdk = useSDK();

  const { account, address, status, isConnected } = useNetworkAccount();

  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);

  const { set_game_state, set_game_id, game_id, round_limit } = useElementStore((state) => state);


  const game = useGame();

  //console.log(game_id,game )

  const { players } = useGetPlayersForGame(game_id);

  const { me } = useMe();
  
  // if (players.length > 0 && account.address) {
    
  //   me = players.find((p) => p.address === account.address)

  // }

  const [leaveLoading, setLeaveLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [kickLoading, setKickLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    if (me) {
      const playerIndex = players.findIndex((player) => {
        return player.address === me.address;
      });
      
      if (playerIndex === -1) {
        set_game_state(GameState.MainMenu);
      } else {
        console.log('Player still in game:', players[playerIndex]);
      }
    }
  }, [me, players, set_game_state, GameState]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    const subscribe = async () => {
        const subscription = await sdk.subscribeEntityQuery(
            {
                command_nexus: {
                    Game: {
                        $: {
                          where: {
                            game_id: {
                                $is:game_id,
                            },
                        },
                        },
                    },
                    Player: {
                      $: {
                          where: {
                              game_id: {
                                  $is:game_id,
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

  console.log("51456454464",game)
  console.log("51456454464",game_id)
  console.log("51456454464",players)
  console.log("51456454464",me)

  useEffect(() => {
    // console.log(game)
    if (game && game.seed !== undefined && Number(game.seed?.toString(16)) !== 0) {
      // Game has started
      console.log(".......................",game.seed?.toString(16))
      set_game_state(GameState.Game);
    }
  }, [game]);

  const isHost = (arena: string, address: string) => {

    return removeLeadingZeros(arena) === removeLeadingZeros(address);
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
      console.log("loading..........",game_id, round_limit)
      const response = await (await client).arena.start(account as Account, game_id, round_limit);
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
      if (isHost(game.arena_host, account.address)) {
        await (await client).arena.delete(account as Account, game.game_id);
      } else {
        await (await client).arena.leave(account as Account, game_id);
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
      await (await client).arena.kick(account as Account, game_id, player_index);
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
      await (await client).arena.transfer(account as Account, game_id, player_index);
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

    // Map base keys to battlefield names
  const baseNameMapping = {
    'base1': 'RadiantShores',
    'base2': 'Ironforge',
    'base3': 'Skullcrag',
    'base4': 'NovaWarhound'
  };

  // console.log(account.address)

  return (
    <div className="font-mono min-h-screen bg-gray-900 text-green-400 relative">
       <Navbar />
      {/* Grid overlay effect */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.03)1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)1px,transparent_1px)] bg-[size:20px_20px] mt-12" />

      <div className="relative z-10 flex flex-col justify-center items-center gap-6 p-4 mt-12">
        {/* Command Center Header */}
        <header className="w-full flex justify-between items-center bg-black/60 border border-green-500/30 p-4 rounded-lg backdrop-blur-sm">
          <button
            disabled={leaveLoading}
            onClick={() => leaveGame(game.game_id)}
            className="relative group px-4 py-2"
          >
            <div className="absolute inset-0 bg-red-900/20 border border-red-500/30 
                          group-hover:bg-red-900/30 transition-all duration-300" />
            <span className="relative text-red-400 group-hover:text-red-300">
              ◀ ABORT MISSION
            </span>
          </button>

          <h1 className="text-4xl font-mono text-green-400 flex items-center space-x-3">
            <span>⌘</span>
            <span>COMMAND NEXUS</span>
            <span>⌘</span>
          </h1>

          <WalletButton />
        </header>

        {/* Main Command Interface */}
        <main className="w-full max-w-6xl bg-black/60 border border-green-500/30 p-8 rounded-lg backdrop-blur-sm">
          {/* Operation Status Bar */}
          <div className="flex justify-between items-center mb-6 border-b border-green-500/30 pb-4">
            <h2 className="text-3xl font-mono">OPERATION #{game.game_id}</h2>
            <div className="flex items-center space-x-6">
              <StatusIndicator icon={<FaUsers />} label="SQUAD STRENGTH" value={`${players.length}/4`} />
              <StatusIndicator icon={<FaClock />} label="OPERATION TIME" value={parseInt(game.clock.toString())} />
              <StatusIndicator icon={<FaTrophy />} label="MISSION LIMIT" value={parseInt(game.limit.toString())} />
              <StatusIndicator icon={<FaCoins />} label="RESOURCES" value={parseInt(game.price.toString())} />
            </div>
          </div>

          {/* Tactical Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Operation Parameters */}
            <div className="bg-black/40 border border-green-500/20 p-4 rounded-lg">
              <h3 className="text-xl font-mono mb-4 pb-2 border-b border-green-500/30 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                TACTICAL DATA
              </h3>
              <div className="space-y-2 font-mono text-sm">
                <DataRow label="MINIMUM OPERATIONS" value={game.minimum_moves} />
                <DataRow label="NEXT COMMANDER" value={`COMMANDER ${parseInt(game.next_to_move.toString())}`} />
                <DataRow label="OPERATION PENALTY" value={parseInt(game.penalty.toString())} />
                <DataRow label="TACTICAL SEED" value={parseInt(game.seed.toString())} />
              </div>
            </div>

            {/* Base Status */}
            <div className="bg-black/40 border border-green-500/20 p-4 rounded-lg">
              <h3 className="text-xl font-mono mb-4 pb-2 border-b border-green-500/30 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                FORWARD OPERATING BASES
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(game.available_home_bases).map(([base, status]) => {
                  const baseName = baseNameMapping[base] || base;
                  
                  return (
                    <div 
                      key={base}
                      className={`p-2 border ${
                        parseInt(status.toString()) === 0 
                          ? 'border-red-500/30 bg-red-900/10' 
                          : 'border-green-500/30 bg-green-900/10'
                      } rounded`}
                    >
                      <span className="font-mono text-sm">
                        {baseName.toUpperCase()}: {parseInt(status.toString()) === 0 ? 'OCCUPIED' : 'AVAILABLE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Squad Roster */}
          <div className="border border-green-500/20 rounded-lg overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-green-900/20 border-b border-green-500/30">
                  <TableHead className="font-mono text-green-400">OPERATIVE</TableHead>
                  <TableHead className="font-mono text-green-400">IDENTIFIER</TableHead>
                  <TableHead className="font-mono text-green-400">COMMAND</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow 
                    key={player.address} 
                    className="border-b border-green-500/10 hover:bg-green-900/10"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isHost(game.arena_host, player.address) && (
                          <div className="relative">
                            <FaFire className="text-red-500" />
                            <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-20" />
                          </div>
                        )}
                        <span className="font-mono">{hexToUtf8(player.name)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-green-400/70">
                      {shortAddress(player.address)}
                    </TableCell>
                    <TableCell>
                      {isHost(game.arena_host, me.address) && player.address !== me.address && (
                        <button
                          disabled={kickLoading}
                          onClick={() => kickPlayer(player.index, game.game_id)}
                          className="relative group px-4 py-1"
                        >
                          <div className="absolute inset-0 bg-red-900/20 border border-red-500/30 
                                        group-hover:bg-red-900/30 transition-all duration-300" />
                          <span className="relative text-red-400 group-hover:text-red-300 font-mono">
                            TERMINATE
                          </span>
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Command Actions */}
          <div className="mt-6 flex justify-end">
            {isHost(game.arena_host, account.address) ? (
              <button
                disabled={startLoading || players.length < 2}
                onClick={startGame}
                className="relative group px-6 py-2 font-mono"
              >
                <div className="absolute inset-0 bg-green-900/20 border border-green-500/30 
                              group-hover:bg-green-900/30 transition-all duration-300" />
                <span className="relative text-green-400 group-hover:text-green-300 flex items-center space-x-2">
                  <span>◈</span>
                  <span>INITIATE OPERATION</span>
                  <span>◈</span>
                </span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 text-green-400/70 font-mono">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>AWAITING MISSION START</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Utility Components
const StatusIndicator: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
}> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center space-x-2 text-green-400/70">
      {icon}
      <span className="font-mono text-xs">{label}</span>
    </div>
    <span className="font-mono text-green-400">{value}</span>
  </div>
);

const DataRow: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-green-400/70">{label}:</span>
    <span className="text-green-400">{value}</span>
  </div>
);


export default Lobby;
