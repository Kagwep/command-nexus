import React, { useEffect, useRef, useState } from 'react';
import { TableRow, TableCell } from './UI/table';
import { HasValue } from '@dojoengine/recs';
import { feltToStr, hexToUtf8 } from '../utils/unpack';
import { useElementStore } from '../utils/nexus';
import GameState from '../utils/gamestate';
import { useDojo } from '../dojo/useDojo';
import { toast } from './UI/use-toast';
import { DialogCreateJoin } from './DialogCreateJoin';
import { useNetworkAccount } from '../context/WalletContex';
import { useDojoStore } from '../lib/utils';
import { bigIntAddressToString, removeLeadingZeros } from '../utils/sanitizer';
import { Account } from 'starknet';
import { Game,Player } from '@/dojogen/models.gen';

interface GameRowProps {
  game: Game;
  setPlayerName: (name: string) => void;
  nstates:any;
}

const GameRow: React.FC<GameRowProps> = ({ game, setPlayerName,nstates }) => {
  const {
    setup: {
      client
    },
  } = useDojo();


  const [player, setPlayer] = useState(null);
  const { account, address, status, isConnected } = useNetworkAccount();
  const textRef = useRef<HTMLTableCellElement>(null);
  const { set_game_state, set_game_id, player_name } = useElementStore((state) => state);

  useEffect(() => {
    Object.entries(nstates.players).forEach(([index, player]) => {

      const currentPlayer = player as Player;

      // if(currentPlayer){
      //   console.log(bigIntAddressToString(currentPlayer.address),account?.address)
      // }
      // Ensure currentPlayer exists before comparing its address property
      if (currentPlayer && removeLeadingZeros(currentPlayer.address) === account?.address) {
        // console.log("....",feltToStr(currentPlayer.name))
        const name = feltToStr(currentPlayer.name).toString();
        textRef.current.textContent = hexToUtf8(name)
       // console.log("....",feltToStr(currentPlayer.name).replace(/[\s\u200B\u200C\u200D\uFEFF]+/g, ''))
        setPlayer(currentPlayer);
      } else {
        setPlayer(null);
      }
    });
  }, [nstates, account?.address]);

  //console.log(game,player)



  const joinGame = async (gameid: number) => {
    if (!player_name) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Please enter a pseudo'}</code>,
      });
      return;
    }
    try {
      (await client).arena.join(account as Account, gameid, player_name);
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
    <TableRow className="border-green-500/10 hover:bg-green-900/10 transition-colors">
      <TableCell ref={textRef} className="font-mono text-green-400 ">
        --CLASSIFIED--
      </TableCell>
      <TableCell className="text-center font-mono text-green-400">
        <div className="inline-block px-3 py-1 bg-green-900/30 rounded border border-green-500/30">
          {game.game_id}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center">
          <div className="px-3 py-1 rounded bg-green-900/30 border border-green-500/30 font-mono text-green-400">
            {`${game.player_count}/4`} ACTIVE
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <DialogCreateJoin
            onClick={() => joinGame(game.game_id)}
            playerName={player_name}
            setPlayerName={setPlayerName}
            dialogTitle={`JOIN OPERATION ${game.game_id}`}
            buttonText="ENGAGE"
            buttonTextDisplayed={
              <div className="flex items-center space-x-2 text-green-400 hover:text-green-300">
              <span>〔</span>
              <span>JOIN OPERATION</span>
              <span>〕</span>
            </div>
            }
            isCreating={false}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
