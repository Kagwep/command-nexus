import { useCallback, useEffect, useRef, useState } from 'react';
import { Scene } from '@babylonjs/core';
import CommandNexusGui from './CommandNexusGui';
import { Phase } from '../../utils/nexus';
import { Player } from '../../utils/types';

export const useCommandNexusGui = (scene: Scene | null, player: Player, isItMyTurn: boolean, turn: number, phase: Phase, game: any, players: Player[]) => {
  const guiRef = useRef<CommandNexusGui | null>(null);
  const [isGuiReady, setIsGuiReady] = useState(false);

  function excludePlayer(players: Player[], addressToExclude: any) {
    return players.filter(player => player.address !== addressToExclude);
  }

  const getGui = useCallback(() => {
    return guiRef.current;
  }, []);

  useEffect(() => {
    if (scene) {
      // Cleanup previous GUI if it exists
      if (guiRef.current) {
        guiRef.current = null;
      }

      

      // Create new GUI
      try {
        guiRef.current = new CommandNexusGui(scene);
        setIsGuiReady(true);
        scene.onPointerDown = (evt, pickResult) => {
            if (pickResult.hit) {
                guiRef.current.handleMapClick(pickResult.pickedPoint);
            }
        };

      } catch (error) {
        console.error("Error creating CommandNexusGui:", error);
        setIsGuiReady(false);
      }
    }

    return () => {
      if (guiRef.current) {
        guiRef.current = null;
      }
      setIsGuiReady(false);
    };
  }, [scene]);

  useEffect(() => {
    if (isGuiReady && guiRef.current && player) {
      try {
        guiRef.current.updatePlayerInfo(player);
        
        if (turn === player.index) {
          guiRef.current.updateTurnInfo(``);
        } else {
          players.forEach((p) => {
            if (turn === p.index) {
              guiRef.current?.updateTurnInfo(``);
            }
          });
        }

       
        const playersExcludingPlayer = excludePlayer(players, player.address);

        guiRef.current.updateOpponentsInfo(playersExcludingPlayer);

      } catch (error) {
        console.error("Error updating GUI:", error);
      }
    }
  }, [isGuiReady, player, isItMyTurn, turn, phase, game, players]);

  return { getGui,gui: guiRef.current, isGuiReady };
};