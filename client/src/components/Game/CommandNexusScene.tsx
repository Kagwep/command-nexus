import React, { useRef } from 'react'
import {AbstractMesh, ArcRotateCamera, Axis, Color3, Color4, Engine, GroundMesh, HavokPlugin, HemisphericLight, KeyboardEventTypes, Mesh, MeshBuilder, PhysicsAggregate, PhysicsShapeType, PhysicsViewer, PointerEventTypes, RecastJSPlugin, Scalar, Scene, SceneLoader, Space, StandardMaterial, Texture, TransformNode, Vector3} from "@babylonjs/core"
import CommandNexusGui from './CommandNexusGui';
import '@babylonjs/loaders';
import { WeatherSystem, WeatherType } from './CommandNexusWeather';
import { useDojo } from '../../dojo/useDojo';
import { Phase } from '../../utils/nexus';
import { Player } from '../../utils/types';
import { CameraSlidingCollision } from './CameraCollisionSystem';
import NexusAreaSystem from './BattleField';
import TankSystem, { ArmoredAction } from './Armored';
import Recast from "recast-detour";
import PointNavigation from './PointNavigation';
import { AgentAnimations, AnimationMapping, MultiAgentNavigation } from './SceneNavigation';
import InfantrySystem from './Infantry';


interface MeshN extends Mesh {
  idx?: number;
}

const GRID_SIZE = 40;
const CELL_SIZE = 40;
const CAMERA_SPEED = 1;
const ROTATION_SPEED = 0.05;
const ZOOM_SPEED = 5;



export const setupScene = async (scene: Scene,camera:ArcRotateCamera , engine: Engine,gameState: {
  player: Player,
  isItMyTurn: boolean,
  turn: number,
  phase: Phase,
  game: any
}) => {
  
  scene.clearColor = new Color4(0.8, 0.8, 0.8);
  

  console.log(gameState.player);


  let targetPosition = camera.target.clone();
  let targetAlpha = camera.alpha;
  let targetRadius = camera.radius;

   let navmeshdebug;

   let currentAnim ;

   let activeUnit;


  
  let hdrRotation = 0;

  // Load battlefield model
  try {

    let landNavMesh;

    const obstacles = [];

    const nameList: string[] = ["Road_01", "Road_01.001", "Landscape_01", "EnergyRes_RenewablePlant_Wall_01", "EnergyRes_NaturalGasFacility_Wall_01","Water_01"];

    const result = await SceneLoader.ImportMeshAsync('', '/models/', "nexusres1.glb");

    function checkNameUsingIncludes(name: string): boolean {
   //
      return nameList.includes(name);
  }
  

    result.meshes.forEach(mesh => {
      mesh.checkCollisions = true;
      if (mesh.name === "NavMesh"){
        landNavMesh = mesh as Mesh
        landNavMesh.visibility = 0;
      }
      if (! checkNameUsingIncludes(mesh.name)){
        obstacles.push(mesh)
      }
      addPhysicsAggregate(mesh);
    })

    const armored =  await SceneLoader.ImportMeshAsync('', '/models/', "Tank.glb");

    const tankContainer = await SceneLoader.LoadAssetContainerAsync("", "/models/Tank.glb", scene);
    const soldierContainer = await SceneLoader.LoadAssetContainerAsync("", "/models/Soldier.glb", scene);

    tankContainer.meshes[0].scaling = new Vector3(0.5, 0.5, 0.5);
    tankContainer.meshes[0].rotation = new Vector3(0, -Math.PI, 0);

    //

    tankContainer.meshes[0].rotate(Axis.Y, Math.PI, Space.LOCAL);


      // Define animation mappings
      const tankAnimationMapping: AnimationMapping = {
        idle: ["Idle", "Stand"],
        movement: ["Movement", "Run", "Walk"],
        attack: ["Attack", "Fire"]
    };

    const soldierAnimationMapping: AnimationMapping = {
        idle: ["Idle", "Stand"],
        movement: ["Run", "Walk"],
        attack: ["Fire"],
        defensive: ["Defensive"]
    };

    armored.meshes.forEach((mesh) => {
      mesh.checkCollisions = true;
      addPhysicsAggregate(mesh);
      mesh.isPickable = true
      mesh.setEnabled(false);
     // mesh.visibility = 0
    })
    

    const tank = armored.meshes[0];
    

        
    tank.scaling = new Vector3(0.5, 0.5, 0.5);

    // Correct Rotation from Imported Model
    tank.rotation = new Vector3(0, -Math.PI, 0);

    //

    tank.rotate(Axis.Y, Math.PI, Space.LOCAL);


    const infantryMesh =  await SceneLoader.ImportMeshAsync('', '/models/', "Soldier.glb");

    console.log(infantryMesh)

    infantryMesh.meshes.forEach((mesh) => {
      mesh.checkCollisions = true;
      mesh.isPickable = true
      mesh.setEnabled(false);
      addPhysicsAggregate(mesh);
    })

    const infantry = infantryMesh.meshes[0];

        
    infantry.scaling = new Vector3(0.5, 0.5, 0.5);

    // Correct Rotation from Imported Model
    infantry.rotation = new Vector3(0, -Math.PI, 0);

    //

    infantry.rotate(Axis.Y, Math.PI, Space.LOCAL);

    
    activeUnit = tank;


    //const tankSystem = new TankSystem(armored, scene);
    //const infantrySystem = new InfantrySystem(infantryMesh, scene);


    const recast =   await new Recast(); 
    const navigationPlugin = new RecastJSPlugin(recast);
    navigationPlugin.setWorkerURL("/src/libs/navMeshWorker.js");

    const pointNav = new PointNavigation(scene, "/circles.png")

    const pointNavMesh = pointNav.getPointNavMesh();

    // const infantryNode = infantrySystem.infantryNode()
    // const armoredNode = tankSystem.tankNode()

        // Find the animation groups for the tank
        const tankAnimations: AgentAnimations = {
          idle: scene.getAnimationGroupByName("Tank_Idle"),
          movement: scene.getAnimationGroupByName("Tank_Movement"),
          attack: scene.getAnimationGroupByName("Tank_Attack")
      };

      const soldierAnimations: AgentAnimations = {
        idle: scene.getAnimationGroupByName("Soldier_Idle"),
        movement: scene.getAnimationGroupByName("Soldier_Run"),
        attack: scene.getAnimationGroupByName("Soldier_Fire"),
        defensive: scene.getAnimationGroupByName("Soldier_Defensive")
    };



    
        // Create a Main Player Transform Root
        const playerTransform = new TransformNode("Player_Root", scene);    
        tank.parent = playerTransform;
        tank.checkCollisions = true
        // Create a single collision box for the entire tank
        const createTankCollider = (rootMesh: AbstractMesh) => {
          // Compute the world matrix to include all transformations
          rootMesh.computeWorldMatrix(true);

          // Get the bounding info of the entire mesh hierarchy
          const boundingInfo = rootMesh.getHierarchyBoundingVectors(true);
          const dimensions = boundingInfo.max.subtract(boundingInfo.min);

          const collisionBox = MeshBuilder.CreateBox("tankCollider", { 
            width: dimensions.x,
            height: dimensions.y,
            depth: dimensions.z
          }, scene);

          // Position the collision box to match the center of the tank
          const center = boundingInfo.min.add(dimensions.scale(0.5));
          collisionBox.position = center;

          collisionBox.isVisible = false;
          collisionBox.checkCollisions = true;

          return collisionBox;
        };

        const tankCollider = createTankCollider(tank);
        tankCollider.parent = playerTransform;

          // Setup Navigation
          setTimeout(async () => {
            // Create Point Navigation
            const pointNavPre = MeshBuilder.CreateGround("pointNav", {width: 1, height: 1}, scene!);
    
              // pointNav = BABYLON.MeshBuilder.CreateBox("pointNav", {size: 2, height:0.01}, scene);
              // pointNavPre.disableLighting = true;
              
              var pointNavMaterial = new StandardMaterial("pointNavMaterial", scene!);
              pointNavMaterial.diffuseTexture = new Texture("/circles.png");
              pointNavMaterial.diffuseTexture.hasAlpha = true;
              pointNavMaterial.useAlphaFromDiffuseTexture = true;
              pointNavMaterial.specularPower = 0;
              pointNavMaterial.specularColor = new Color3(0.1,0.1,0.1);
              pointNavMaterial.roughness = 1;
              pointNavMaterial.alphaCutOff  = 0.2;
              pointNavMaterial.backFaceCulling = false;
              // pointNavMaterial.reflectionLevel = null;
              //pointNavMaterial.emissiveColor = new BABYLON.Color3.White();
              // pointNavMaterial.emissiveTexture = pointNavMaterial.albedoTexture;
              //pointNavMaterial.emissiveIntensity = 0.3;
              pointNavPre.material = pointNavMaterial;
              pointNavPre.visibility = 0;
              
              var rot = 0;
              scene!.registerAfterRender(()=>{
                  pointNavPre.rotation.y = rot;
                  rot += 0.03;
              });
            // Setup Player Navigation
                      // Assuming you have already set up your scene, navigation plugin, ground, and pointNavPre
          const multiAgentNav = new MultiAgentNavigation(scene, navigationPlugin, landNavMesh, pointNavPre);
          await multiAgentNav.initialize();

          // Create your custom mesh
         // const customAgentMesh = MeshBuilder.CreateBox("agentTemplate", {size: 1}, scene);
          // Customize your mesh here (e.g., apply materials, adjust geometry)

          // Add agents at specific positions with the custom mesh
          const agent1 = multiAgentNav.addAgent(new Vector3(tank.position.x + 10, 0,tank.position.z + 1), tankContainer, tankAnimationMapping);
          //const agent3 = multiAgentNav.addAgent(new Vector3(tank.position.x + 10, 0,tank.position.z + 10), tankContainer, tankAnimationMapping);
          const agent2 = multiAgentNav.addAgent(new Vector3(2, 0, 2), soldierContainer, soldierAnimationMapping);


           // setNavigation(tank as MeshN, scene,navigationPlugin,landNavMesh,playerTransform,pointNavMesh)            
        }, 500);
    
    
const setNavigation = (player: MeshN,scene: Scene, navigationPlugin: RecastJSPlugin, ground: Mesh, playerTransform: TransformNode, pointNavPre: GroundMesh): void => {

    
          // Nav Mesh Parameters
    var navmeshParameters = {
      cs: 0.4,
      ch: 0.01,
      walkableSlopeAngle: 0,
      walkableHeight: 0.0,
      walkableClimb: 0,
      walkableRadius: 2,
      maxEdgeLen: 12,
      maxSimplificationError: 1,
      minRegionArea: 15,
      mergeRegionArea: 20,
      maxVertsPerPoly: 6,
      detailSampleDist: 6,
      detailSampleMaxError: 35,
      borderSize: 1,
      tileSize:25
  };

  // Navigation Plugin CreateNavMesh (Ground and Boxes separated)
  // Also you can previosly merge all the navigation meshes
  navigationPlugin.createNavMesh([ground], navmeshParameters,(navmeshData) =>
  {
      navigationPlugin.buildFromNavmeshData(navmeshData);
      navmeshdebug = navigationPlugin.createDebugNavMesh(scene);
      navmeshdebug.name = "ground";
      navmeshdebug.position = new Vector3(0, 0.01, 0);
      var matdebug = new StandardMaterial('matdebug', scene);
      matdebug.diffuseColor = new Color3(0.1, 0.2, 1);
      matdebug.alpha = 1;
      navmeshdebug.material = matdebug;
      navmeshdebug.visibility = 0.15;
      
      // Badge Information Ready to Navigate
      setTimeout(() => {
          // var badgeInfo = document.getElementById("badge");
          // badgeInfo.innerHTML = " Toggle NavMesh";
          console.log("RECAST Loaded");
      }, 300);
      
     // recastLoaded = true;

     

      // Setup Navigation Plugin using one Player
      var crowd = navigationPlugin.createCrowd(1, 0.1, scene);

      // Crow
      var agentParams = {
          radius: 0.3,
          height: 0.01,
          maxAcceleration: 50.0,
          maxSpeed: 4,
          collisionQueryRange: 0.5,
          pathOptimizationRange: 0.2,
          separationWeight: 1.0};

      // Setup Player Position
      var position = navigationPlugin.getClosestPoint(new Vector3(0, 0, 0));

      // Add Agent
      var agentIndex = crowd.addAgent(position, agentParams, playerTransform);
       player.idx = agentIndex; 

      // Hide Point Nav
      pointNavPre.visibility = 0;

      // Detecting Navigation Point Position
      var startingPoint;
      var getGroundPosition = function () {
          var pickinfo = scene.pick(scene.pointerX, scene.pointerY);
          if (pickinfo.hit) {
              return pickinfo.pickedPoint;
          }
          return null;
      }

      // Pointer Tap Functions
      var pointerTap = function (mesh: Mesh) {
          console.log("Tap: " + mesh.name);
          
          // Detect Pointer Tap only on Ground Mesh 
          if (!mesh.name.includes("ground"))
              return;

          startingPoint = getGroundPosition();
          pointNavPre.position = startingPoint as Vector3;
          pointNavPre.visibility = 1;
          var agents = crowd.getAgents();
          var i;

          for (i=0;i<agents.length;i++) {
              if (currentAnim == idleAnim)
              {
                  // Start Player Walk Animation
                  //currentAnim = walkAnim;
                 
                  scene.onBeforeRenderObservable.runCoroutineAsync(animationBlending(idleAnim, 1.0, walkAnim, 1.3, true, 0.05));
              }
              crowd.agentGoto(agents[i], navigationPlugin.getClosestPoint(startingPoint as Vector3));
          }
      }
      
      // On Point Observable
      scene.onPointerObservable.add((pointerInfo) => {      		
          switch (pointerInfo.type) {
              case PointerEventTypes.POINTERTAP:
                  if(pointerInfo.pickInfo && pointerInfo.pickInfo.hit) {
                      pointerTap(pointerInfo.pickInfo.pickedMesh as Mesh)
                  }
                  break;
          }
      });

      // Crowd On Before Render Observable
      scene.onBeforeRenderObservable.add(()=> {
          // New Player Position
          playerTransform.position = crowd.getAgentPosition(player.idx as number);
          let vel = crowd.getAgentVelocity(player.idx as number);
          crowd.getAgentPositionToRef(player.idx as number, playerTransform.position);
          if (vel.length() > 1)
          {
              // New Player Rotation
              vel.normalize();
              var desiredRotation = Math.atan2(vel.x, vel.z);
              playerTransform.rotation.y = playerTransform.rotation.y + (desiredRotation - playerTransform.rotation.y);    
          }
      });

      const idleAnim = scene!.getAnimationGroupByName("Tank_Idle");
      const walkAnim = scene!.getAnimationGroupByName("Tank_Movement");
      idleAnim?.start(true);
      

      // Crowd On Reach Target Observable
      crowd.onReachTargetObservable.add((agentInfos: any) => {
          console.log("agent reach destination");
          //currentAnim = idleAnim;
       
          scene.onBeforeRenderObservable.runCoroutineAsync(animationBlending(walkAnim, 1.3, idleAnim, 1.0, true, 0.05));
          pointNavPre.visibility = 0;
      });

      console.log("....................",playerTransform)

  });
    
  };
    
    
    function* animationBlending(fromAnim: any, fromAnimSpeedRatio: any, toAnim: any, toAnimSpeedRatio: any, repeat: any, animationBlendingSpeed: any)
    {
        let currentWeight = 1;
        let newWeight = 0;
        //fromAnim.stop();
        toAnim.play(repeat);
        fromAnim.speedRatio = fromAnimSpeedRatio;
        toAnim.speedRatio = toAnimSpeedRatio;
        while(newWeight < 1)
        {
            newWeight += animationBlendingSpeed;
            currentWeight -= animationBlendingSpeed;
            toAnim.setWeightForAllAnimatables(newWeight);
            fromAnim.setWeightForAllAnimatables(currentWeight);
            yield;
        }
    }



    // const battlefieldMesh = result.meshes[0];
    // battlefieldMesh.position = new Vector3(GRID_SIZE * CELL_SIZE / 2, 0, GRID_SIZE * CELL_SIZE / 2);
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

function addPhysicsAggregate(meshe: TransformNode) {
  const res = new PhysicsAggregate(
      meshe,
      PhysicsShapeType.BOX,
      { mass: 0, friction: 0.5 },
      scene
  );
  // this.physicsViewer.showBody(res.body);
  return res;
}

const NovaWarhoundPoints: Vector3[] = [
  new Vector3(-701.1143110284269, -4.724697113037109, -613.5130894128426),
  new Vector3(135.2915183946171, -4.724697113036996, 140.48346988813887),
  new Vector3(930.3866023298494, -4.724697113036996, -253.01963900603135),
  new Vector3(554.3687183857892, -4.724697113037223, -606.869953651963)
];

areaSystemOne.addArea(NovaWarhoundPoints, {
    name: "NovaWarhound",
    color: new Color4(0, 1, 0, 0.5),
    alpha: 0.5
});

const IronforgePoints: Vector3[] = [
  new Vector3(-40.34674016534149, -4.724697113037109, 246.94971527372445),
  new Vector3(-41.92048839982266, -4.724697113037109, 797.001260541894),
  new Vector3(918.0348243184673, -4.724697113037109, 794.4816519981175),
  new Vector3(929.6542846267871, -4.724697113037109, -201.31500393718164)
];

const areaSystemTwo = new NexusAreaSystem(scene);

areaSystemTwo.addArea(IronforgePoints, {
  name: "Ironforge",
  color: new Color4(0, 1, 0, 0.5),
  alpha: 0.5
});

const RadiantShoresPoints: Vector3[] = [
  new Vector3(-44.196680927944726, -4.7246971130370525, 241.8750392048088),
  new Vector3(-168.20402177229565, -4.724697113037109, 132.66805411641394),
  new Vector3(-224.44661019700706, -4.724697113037109, 241.57445828506684),
  new Vector3(-596.1817341386354, -4.724697113037109, 247.93515516561172),
  new Vector3(-923.7357331408812, -4.724697113037109, 789.4817941049374),
  new Vector3(-5.241598217332637, -4.7246971130370525, 800.4915650788527)
];

const areaSystemThree = new NexusAreaSystem(scene);

areaSystemThree.addArea(RadiantShoresPoints, {
  name: "RadiantShores",
  color: new Color4(0, 1, 0, 0.5),
  alpha: 0.5
});

const SavageCoastPoints: Vector3[] = [
  new Vector3(-210.01917913768062, 3.334695195105759, 213.63762816982944),
  new Vector3(-175.03646913444982, -4.724697113037109, 130.5347643517446),
  new Vector3(-196.65097201368565, -4.724697113037102, 76.48515275188214),
  new Vector3(-292.9622171292379, -4.724697113037109, 70.40431770105654),
  new Vector3(-170.27564772619093, -4.724697113037095, -120.70127057236148),
  new Vector3(-889.8629214636325, -4.724697113037109, -570.6022537156441),
  new Vector3(-939.2950710815101, -4.724697113037109, 190.73043485634932)
];

const areaSystemFour = new NexusAreaSystem(scene);

areaSystemFour.addArea(SavageCoastPoints, {
  name: "SavageCoast",
  color: new Color4(0, 1, 0, 0.5),
  alpha: 0.5
});

  
  
    // Create Weather System
  const weatherSystem = new WeatherSystem(scene,camera);

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

//camera.setTarget(activeUnit, true, false, false);
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