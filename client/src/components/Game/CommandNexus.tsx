import React, { useCallback, useEffect, useRef, useState } from 'react'
import { setupScene, updateScene } from './CommandNexusScene';
import { ArcRotateCamera, Engine, HavokPlugin, PhysicsViewer, Scene, Tools, Vector3 } from '@babylonjs/core';
import { useDojo } from '../../dojo/useDojo';
import { useGame } from '../../hooks/useGame';
import { useGetPlayersForGame } from '../../hooks/useGetPlayersForGame';
import { useElementStore } from '../../utils/nexus';
import { useMe } from '../../hooks/useMe';
import { useTurn } from '../../hooks/useTurn';
import { useCommandNexusGui } from './useCommandNexusGui';
import HavokPhysics from '@babylonjs/havok';

import { Account, AccountInterface, addAddressPadding } from 'starknet';
import { useInfantryUnits } from '../../hooks/useGetInfantryUnits';
import { useArmoredUnits } from '../../hooks/useGetArmoredUnits';
import { CommandNexusSchemaType, Player } from '../../dojogen/models.gen';
import GameState from '../../utils/gamestate';


import { useNetworkAccount } from '../../context/WalletContex';
import { useInfantryUnitState } from '../../hooks/useGetInfantryUnitStates';
import { useInfantryAbilityModes } from '../../hooks/useGetUnitAbilityMode';
import { useAllEntities } from '../../utils/command';
import { useGameState } from './GameState';
import { removeLeadingZeros } from '../../utils/sanitizer';
import { getGame } from '../../lib/utils';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { ParsedEntity, QueryBuilder } from '@dojoengine/sdk';


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
  const { useDojoStore, client: dojoClient, sdk } = useDojoSDK();
  
  const {
    setup: {
      client
    },
  } = useDojo();

  const { me: player, isItMyTurn } = useMe();
  const { turn } = useTurn();

const { state: nstate, refetch } = useAllEntities();

  const {  game_id} = useElementStore((state) => state);
  const { account, address, status, isConnected } = useNetworkAccount();
  const infantry = useInfantryUnits();

  const armored = useArmoredUnits();

  const game = useGame();
  const {players} = useGetPlayersForGame(game_id);

  const [guiState, setGuiState] = useState({});
  const updateGuiState = useCallback((newState: {}) => {
      setGuiState(prevState => ({...prevState, ...newState}));
  }, []);

  const nexusGameState = useGameState(nstate);

  const getAccount = () : AccountInterface | Account => {
    return account
  }

  const state = useDojoStore((state) => state);

  const getGameState = () => nexusGameState ? nexusGameState.getGameState() : null;
  
  const {getGui, gui, isGuiReady } = useCommandNexusGui(sceneRef.current, player, isItMyTurn, turn,game, players,client,getAccount,getGameState);


  useEffect(() => {
      if (canvasRef.current && !engineRef.current && account) {
          engineRef.current = new Engine(canvasRef.current, true);
          const createScene = async () => {
              const scene = new Scene(engineRef.current!);
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
              //console.log("------------------------",gameState,account)

              // const me = nexusGameState?.gameState.players.find((p: Player) => p.address === account.address);


              sceneRef.current = scene;

              
              
              if (player){
                await setupScene(sceneRef.current, camera, engineRef.current!,player, getGui,getGameState, nexusGameState?.gameState,client,getAccount);
              }
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
  }, [player?.address]);


  useEffect(() => {
    console.log(isSceneReady,nstate)
    if (isSceneReady && sceneRef.current) {
      console.log("Updating scene metadata with infantry units");
      const found = Object.values(nstate.players).find((p) => {
        const cleanAddress = removeLeadingZeros(p.address);
        console.log("Comparing:", {
          playerAddress: p.address,
          cleanAddress: cleanAddress,
          accountAddress: account.address,
          isMatch: cleanAddress === account.address
        });
        return cleanAddress === account.address;
      });
      const n_game = getGame(game_id,nstate.games);
      sceneRef.current.metadata = {
        ...sceneRef.current.metadata,
        infantryUnits:nstate.infantry,
        //armoredUnits: nstate.armored,
        infantryStates: nstate.unitState,
        infantryModes: nstate.abilityState,
        playerInfo: found,
        playersInfo: nstate.players,
        gameInfo: n_game,
      };
    }
  }, [isSceneReady, infantry?.infantryUnits,game,armored?.armoredUnits]);



  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      overflow: 'hidden',
      position: 'fixed',  // This helps prevent scrolling
      top: 0,
      left: 0
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100vh',
          display: 'block'
        }} 
      />
    </div>
  );
}

export default CommandNexus