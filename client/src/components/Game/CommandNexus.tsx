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
import { useCommandNexusGui } from './useCommandNexusGui';

const CommandNexus = () => {
    const [isLoading, setIsLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<Scene | null>(null);
    const engineRef = useRef<Engine | null>(null);

    const {
      setup: {
        client: { arena, nexus }
      },
    } = useDojo();
    const { me: player, isItMyTurn } = useMe();
    const { turn } = useTurn();
    const { phase } = usePhase();
    console.log("..............",turn)
  
    const { set_game_state, set_game_id, game_id, round_limit } = useElementStore((state) => state);
  
    const game = useGame();
    const { players } = useGetPlayersForGame(game_id);

    console.log(players)

    // Use our custom hook
    const { gui, isGuiReady } = useCommandNexusGui(sceneRef.current, player, isItMyTurn, turn, phase, game, players);

    useEffect(() => {
      if (canvasRef.current && !engineRef.current) {
        engineRef.current = new Engine(canvasRef.current, true);
        const createScene = async () => {
            const scene = new Scene(engineRef.current);
            scene.collisionsEnabled = true;
            sceneRef.current = scene;
           
            await setupScene(scene, engineRef.current, { player, isItMyTurn, turn, phase, game });
            
            setIsLoading(false);
        };
      
        createScene();


          
        engineRef.current.runRenderLoop(() => {
            if (sceneRef.current) {
                sceneRef.current.render();
            }
        });
          
        const handleResize = () => {
            engineRef.current?.resize();
        };

        window.addEventListener('resize', handleResize);
    
        return () => {
            window.removeEventListener('resize', handleResize);
            if (sceneRef.current) {
                sceneRef.current.dispose();
                sceneRef.current = null;
            }
            engineRef.current?.dispose();
            engineRef.current = null;
        };
      }
    }, []);

    useEffect(() => {
      if (sceneRef.current && !isLoading && isGuiReady) {
        updateScene(sceneRef.current, { player, isItMyTurn, turn, phase });
      }
    }, [player, isItMyTurn, turn, phase, game, isLoading, isGuiReady]);
  
    return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
}

export default CommandNexus