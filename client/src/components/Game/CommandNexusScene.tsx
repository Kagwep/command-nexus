import React, { useRef } from 'react'
import {ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, KeyboardEventTypes, MeshBuilder, Scene, SceneLoader, StandardMaterial, Vector3} from "@babylonjs/core"
import CommandNexusGui from './CommandNexusGui';
import '@babylonjs/loaders';
import { WeatherSystem, WeatherType } from './CommandNexusWeather';
import { useDojo } from '../../dojo/useDojo';
import { Phase } from '../../utils/nexus';
import { Player } from '../../utils/types';

const GRID_SIZE = 40;
const CELL_SIZE = 40;
const CAMERA_SPEED = 1;
const ROTATION_SPEED = 0.05;
const ZOOM_SPEED = 5;



export const setupScene = async (scene: Scene, engine: Engine,gameState: {
  player: Player,
  isItMyTurn: boolean,
  turn: number,
  phase: Phase,
  game: any
}) => {
  
  scene.clearColor = new Color4(0.8, 0.8, 0.8);

  console.log(gameState.player);

  // Camera
  const camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 2,  // alpha
    Math.PI / 3,   // beta
    100,           // radius
    new Vector3(GRID_SIZE * CELL_SIZE / 2, 0, GRID_SIZE * CELL_SIZE / 2),
    scene
  );
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 150;
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(engine.getRenderingCanvas(), true);

  let targetPosition = camera.target.clone();
  let targetAlpha = camera.alpha;
  let targetRadius = camera.radius;



  // Load battlefield model
  try {
    const result = await SceneLoader.ImportMeshAsync('', '/models/', "nexus.glb");
    const battlefieldMesh = result.meshes[0];
    battlefieldMesh.position = new Vector3(GRID_SIZE * CELL_SIZE / 2, 0, GRID_SIZE * CELL_SIZE / 2);
    //battlefieldMesh.scaling = new Vector3(10, 10, 10);  // Adjust scale as needed
  } catch (error) {
    console.error("Error loading battlefield model:", error);
  }

 

    // Create Weather System
  const weatherSystem = new WeatherSystem(scene);

    // Example of setting weather manually
    weatherSystem.setWeather("clear");
  // Keyboard controls
// Camera movement
const keys = { w: false, s: false, a: false, d: false, q: false, e: false, r: false, f: false };

scene.onKeyboardObservable.add((kbInfo) => {
  const key = kbInfo.event.key.toLowerCase();
  if (key in keys) {
    keys[key] = kbInfo.type === KeyboardEventTypes.KEYDOWN;
  }
});

scene.onBeforeRenderObservable.add(() => {
  let cameraSpeed = Vector3.Zero();

  if (keys['w']) cameraSpeed.addInPlace(camera.getDirection(Vector3.Forward()));
  if (keys['s']) cameraSpeed.addInPlace(camera.getDirection(Vector3.Backward()));
  if (keys['a']) cameraSpeed.addInPlace(camera.getDirection(Vector3.Left()));
  if (keys['d']) cameraSpeed.addInPlace(camera.getDirection(Vector3.Right()));

  cameraSpeed.scaleInPlace(CAMERA_SPEED);
  camera.target.addInPlace(cameraSpeed);

  if (keys['q']) camera.alpha += ROTATION_SPEED;
  if (keys['e']) camera.alpha -= ROTATION_SPEED;
  if (keys['r']) camera.radius -= ZOOM_SPEED;
  if (keys['f']) camera.radius += ZOOM_SPEED;

  camera.radius = Math.max(camera.lowerRadiusLimit, Math.min(camera.radius, camera.upperRadiusLimit));
});
};

// New function to update the scene based on game state
export const updateScene = (scene: Scene, gameState: {
  player: Player,
  isItMyTurn: boolean,
  turn: number,
  phase: Phase
}) => {
  // Update scene based on game state
  // For example:
  if (gameState.isItMyTurn) {
    // Highlight current player's units or enable controls
  }

  // Update turn display
  const turnText = scene.getMeshByName("turnText");
  if (turnText) {
    (turnText as any).text = `Turn: ${gameState.turn}`;
  }

  // Update phase display
  const phaseText = scene.getMeshByName("phaseText");
  if (phaseText) {
    (phaseText as any).text = `Phase: ${gameState.phase}`;
  }

  // Add more logic to update other aspects of the scene based on gameState
};