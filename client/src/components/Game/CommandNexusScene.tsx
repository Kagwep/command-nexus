import React, { useRef } from 'react'
import {ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, KeyboardEventTypes, MeshBuilder, Scene, SceneLoader, StandardMaterial, Vector3} from "@babylonjs/core"
import CommandNexusGui from './CommandNexusGui';
import '@babylonjs/loaders';
import { WeatherSystem, WeatherType } from './CommandNexusWeather';
import { useDojo } from '../../dojo/useDojo';
import { Phase } from '../../utils/nexus';
import { Player } from '../../utils/types';
import { CameraSlidingCollision } from './CameraCollisionSystem';
import NexusAreaSystem from './BattleField';
import TankSystem, { ArmoredAction } from './Armored';





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
  camera.checkCollisions = true;
  camera.collisionRadius = new Vector3(1, 1, 1);


  let targetPosition = camera.target.clone();
  let targetAlpha = camera.alpha;
  let targetRadius = camera.radius;

 

  // Load battlefield model
  try {
    const result = await SceneLoader.ImportMeshAsync('', '/models/', "nexus.glb");

    result.meshes.forEach(mesh => {
      mesh.checkCollisions = true;
    })

    const armored =  await SceneLoader.ImportMeshAsync('', '/models/', "Tank.glb");

    armored.meshes.forEach((mesh) => {
      mesh.checkCollisions = true;
    })

    const tank = armored.meshes[0];

    tank.position = new Vector3(808.0254908309985,-0.08039172726103061, 770.1119890077115);

    console.log(armored)

    const tankSystem = new TankSystem(armored, scene);

    tankSystem.setIdleAnimation();

   // tankSystem.stopAllAnimations();

    tankSystem.rotateTurret(50);

    tankSystem.performAction(ArmoredAction.FireMainGun);

    const battlefieldMesh = result.meshes[0];
    battlefieldMesh.position = new Vector3(GRID_SIZE * CELL_SIZE / 2, 0, GRID_SIZE * CELL_SIZE / 2);
    //battlefieldMesh.scaling = new Vector3(10, 10, 10);  // Adjust scale as needed
  } catch (error) {
    console.error("Error loading battlefield model:", error);
  }

  const areaSystemOne = new NexusAreaSystem(scene);

  // RadiantShores,
  // Ironforge,
  // Skullcrag,
  // NovaWarhound,
  // SavageCoast,

//   const complexAreaPoints = [
//     new Vector3(852.5509877908504, -0.14761458337295608, 758.9692187112205),
//     new Vector3(893.5529652153359, -0.08039172726097377, 839.130093353469),
//     new Vector3(917.5572048258765, -0.30003630329429143, 895.7555439107293),
//     new Vector3(1022.2176402963837, -0.08039172726103061, 874.4706940989424),
//     new Vector3(1042.8196019748418, -0.14761458337306976, 850.5284954540897),
//     new Vector3(1046.7855684428391, -0.14761458337306976, 785.4498092467963),
//     new Vector3(1064.7283954052075, -0.14761458337301292, 813.7681701227885),
//     new Vector3(1121.3155191853955, -0.14761458337309818, 819.7479110334095),
//     new Vector3(1273.7406247327149, -0.14761458337306976, 816.397528651424),
//     new Vector3(1254.3572263799138, -0.14761458337301292, 746.0177863984642),
//     new Vector3(1253.8637497492393, -4.724697113037109, 190.2639365757862),
//     new Vector3(907.4799501815879, -4.724697113037223, 194.276443631348)
    
// ];

const NovaWarhoundPoints: Vector3[] = [
  new Vector3(730.5467471709067, -4.724697113037109, 190.73690047725162),
  new Vector3(675.3514988227852, -4.724697113037223, 660.1602674193605),
  new Vector3(968.7855318752481, -4.724697113037109, 932.9703875779442),
  new Vector3(1447.4623918502261, -4.724697113037223, 195.96328441847112)
];

areaSystemOne.addArea(NovaWarhoundPoints, {
    name: "NovaWarhound",
    color: new Color4(0, 1, 0, 0.5),
    alpha: 0.5
});

const IronforgePoints: Vector3[] = [
  new Vector3(1469.1237614022982, -4.724697113037109, 195.10749872040142),
  new Vector3(972.4897285476902, -0.09647619724273682, 941.8156671391265),
  new Vector3(758.2028310346097, -4.724697113036996, 1063.6247380330788),
  new Vector3(802.070642140824, -4.724697113037109, 1599.093106802532),
  new Vector3(1721.28227015607, -4.724697113036996, 1589.2691094773127)
];

const areaSystemTwo = new NexusAreaSystem(scene);

areaSystemTwo.addArea(IronforgePoints, {
  name: "Ironforge",
  color: new Color4(0, 1, 0, 0.5),
  alpha: 0.5
});

const RadiantShoresPoints: Vector3[] = [
  new Vector3(656.7453083810918, -4.724697113036882, 1599.221712962129),
  new Vector3(705.447522951092, -0.14761458337306976, 959.67568381819),
  new Vector3(494.58448396652415, -4.724697113037223, 846.3462530203496),
  new Vector3(-140.4915378734339, -4.724697113037109, 1350.377682276965)
];

const areaSystemThree = new NexusAreaSystem(scene);

areaSystemThree.addArea(RadiantShoresPoints, {
  name: "RadiantShores",
  color: new Color4(0, 1, 0, 0.5),
  alpha: 0.5
});

const SavageCoastPoints: Vector3[] = [
  new Vector3(-139.6726017686658, -4.724697113037109, 1271.3336887731152),
  new Vector3(442.51928678286686, -4.724697113037109, 908.8976983560792),
  new Vector3(627.9791629136411, -4.724697113037109, 640.8770786211204),
  new Vector3(225.50933003149942, -4.724697113037223, 190.16510894844487)
];

const areaSystemFour = new NexusAreaSystem(scene);

areaSystemFour.addArea(SavageCoastPoints, {
  name: "SavageCoast",
  color: new Color4(0, 1, 0, 0.5),
  alpha: 0.5
});


  
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