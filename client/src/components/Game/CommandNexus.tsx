import React, { useCallback, useEffect, useRef, useState } from 'react'
import { setupScene, updateScene } from './CommandNexusScene';
import { ArcRotateCamera, Engine, HavokPlugin, PhysicsViewer, Scene, Tools, Vector3 } from '@babylonjs/core';
import { useDojo } from '../../dojo/useDojo';
import { useGame } from '../../hooks/useGame';
import { useGetPlayersForGame } from '../../hooks/useGetPlayersForGame';
import { useElementStore } from '../../utils/nexus';
import { useMe } from '../../hooks/useMe';
import { useTurn } from '../../hooks/useTurn';
import { usePhase } from '../../hooks/usePhase';
import { useCommandNexusGui } from './useCommandNexusGui';
import HavokPhysics from '@babylonjs/havok';
import { useGameState } from './GameState';
import useNetworkAccount from '../../hooks/useNetworkAccount';
import { Account, AccountInterface } from 'starknet';
import { useInfantryUnits } from '../../hooks/useGetInfantryUnits';

const GRID_SIZE = 40;
const CELL_SIZE = 40;
const CAMERA_SPEED = 1;
const ROTATION_SPEED = 0.05;
const ZOOM_SPEED = 5;


const CommandNexus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  
  const {
    setup: {
      client: { arena, nexus }
    },
  } = useDojo();
  const { me: player, isItMyTurn } = useMe();
  const { turn } = useTurn();
  const { phase } = usePhase();
  const { set_game_state, set_game_id, game_id, round_limit } = useElementStore((state) => state);
  const { account, address, status, isConnected } = useNetworkAccount();
  const { infantryUnits} = useInfantryUnits();

  const game = useGame();
  const { players } = useGetPlayersForGame(game_id);

  const [guiState, setGuiState] = useState({});
  const updateGuiState = useCallback((newState) => {
      setGuiState(prevState => ({...prevState, ...newState}));
  }, []);

  const {getGameState,gameState} = useGameState();

  const getAccount = () : AccountInterface | Account => {
    return account
  }
  
  const {getGui, gui, isGuiReady } = useCommandNexusGui(sceneRef.current, player, isItMyTurn, turn, phase, game, players,arena,nexus,getAccount);

  const updateSceneAndGUI = () => {
      if (sceneRef.current && !isLoading && isGuiReady) {
          updateScene(sceneRef.current, gui, { player, isItMyTurn, turn, phase, game, players });
      }
  };




  useEffect(() => {
      if (canvasRef.current && !engineRef.current) {
          engineRef.current = new Engine(canvasRef.current, true);
          const createScene = async () => {
              const scene = new Scene(engineRef.current);
              const camera = new ArcRotateCamera("camera", Tools.ToRadians(90), Tools.ToRadians(65), 10, Vector3.Zero(), scene);
              camera.lowerRadiusLimit = 10;
              camera.upperRadiusLimit = 150;
              camera.lowerBetaLimit = 0.1;
              camera.upperBetaLimit = Math.PI / 2.2;
              camera.attachControl(canvasRef.current, true);
              camera.checkCollisions = true;
              camera.collisionRadius = new Vector3(1, 1, 1);
              
              scene.collisionsEnabled = true;
              
              const havokPlugin = await HavokPhysics();
              const physicsPlugin = new HavokPlugin(true, havokPlugin);
              scene.enablePhysics(undefined, physicsPlugin);
              const physicsViewer = new PhysicsViewer();
              console.log("------------------------",gameState,account)

              const me = gameState.players.find((p) => p.address === account.address);

              gameState.player = me

              console.log(me)

              sceneRef.current = scene;
              
              await setupScene(sceneRef.current, camera, engineRef.current, getGui, getGameState, gameState,arena,nexus,getAccount);
              setIsSceneReady(true);
              
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
                  setIsSceneReady(false);
              }
              engineRef.current?.dispose();
              engineRef.current = null;
              
          };
      }
  }, []);

  useEffect(() => {
      updateSceneAndGUI();
  }, [player, isItMyTurn, turn, phase, game, players, isLoading, isGuiReady]);

  useEffect(() => {
    console.log(isSceneReady)
    if (isSceneReady && sceneRef.current && infantryUnits) {
      console.log("Updating scene metadata with infantry units");
      sceneRef.current.metadata = {
        ...sceneRef.current.metadata,
        infantryUnits: infantryUnits
      };
    }
  }, [isSceneReady, infantryUnits,game]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100vh' }} />;
}

export default CommandNexus