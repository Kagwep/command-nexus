import React, { useEffect, useRef, useState } from 'react'
import { setupScene, updateScene } from './CommandNexusScene';
import { Engine, Scene } from '@babylonjs/core';
import { useDojo } from '../../dojo/useDojo';
import { useGame } from '../../hooks/useGame';
import { useGetPlayersForGame } from '../../hooks/useGetPlayersForGame';
import { useElementStore } from '../../utils/nexus';
import { useMe } from '../../hooks/useMe';
import { useTurn } from '../../hooks/useTurn';
import { usePhase } from '../../hooks/usePhase';
import CommandNexusGui from './CommandNexusGui';

const CommandNexus = () => {
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const guiRef = useRef<CommandNexusGui | null>(null);

    const {
      setup: {
        client: { arena, nexus }
      },
    } = useDojo();
    const { me: player, isItMyTurn } = useMe();
    const { turn } = useTurn();
    const { phase } = usePhase();
  
    const { set_game_state, set_game_id, game_id, round_limit } = useElementStore((state) => state);
  
    const game = useGame();
    console.log(game_id)
  
    const { players } = useGetPlayersForGame(game_id);

    useEffect(() => {
      if (canvasRef.current) {
        const engine = new Engine(canvasRef.current, true);
        let scene: Scene;
        const createScene = async () => {
            scene = new Scene(engine);
            sceneRef.current = scene;
           
            await setupScene(scene, engine, { player, isItMyTurn, turn, phase, game });
            
            // Create GUI and store the reference
            guiRef.current = new CommandNexusGui(scene);
          };
      
          createScene();
          
          // Main render loop
          engine.runRenderLoop(() => {
              scene.render();
          });
          
          // Resize handler
          window.addEventListener('resize', () => {
              engine.resize();
          });
    
          return () => {
              engine.dispose();
          };
      }
    }, []);

    useEffect(() => {
      if (sceneRef.current) {
        updateScene(sceneRef.current, { player, isItMyTurn, turn, phase });
      }
      
      // Update GUI methods here
      if (guiRef.current) {
        console.log("updated")
        guiRef.current.updatePlayerInfo(player)
      }
    }, [player, isItMyTurn, turn, phase]);
  
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
}

export default CommandNexus