import './style.css';
import React, { useEffect, useRef,useState} from 'react';
import {
    Scene,
    Engine,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    StandardMaterial,
    Texture,
    SceneLoader,
    Mesh,
    AbstractMesh,
    VertexBuffer,
    ArcRotateCamera,
    Color3,

    
  } from "@babylonjs/core";
import './style.css';
import '@babylonjs/loaders';
import {House, houses} from './House';
import { Seeds } from './Seed';
import { state,playersStates } from './GameState';
import { housesToAccess } from './House';
import sphereTexture from "../Textures/nuttexture3.avif";
import CustomDialog from '../../Customs/CustomDialog';
import { Card, CardContent, CircularProgress, Typography, Grid ,Paper} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {Button} from '@mui/material';
import socket from "../../../socket";
import HouseIcon from '@mui/icons-material/House';
import { start } from './GameState';
import { v4 as uuidv4 } from 'uuid';
import { ethers } from 'ethers';
import { useWallet } from '../../../contexts/WalletContex';


export interface Players {
  id:string;
  username:string;
}
export interface Identity {
  player1:string;
  player2:string;
}

export interface CanvasProps {
  players:Players[];
  room:string;
  orientation?:string;
  cleanup?:() => void;
  username:string;
  player_identity:string;
}


export interface GameStartState {
  turn:string;
  opponentHouses:string[];
}


interface Move {
  selectedHouse:House;
  seedAdd:Seeds;
  player:string;
  action:number;
  progress:boolean;

}

// uint256 winId, string memory winTrace,address opponent,string memory player_username
interface Register {
 winId:string;
 winTrace:string;
 opponent_address:string;
 player_username:string;

}



const Canvas:React.FC<CanvasProps> = ({ players, room,username,player_identity,cleanup }) => {

    const [over, setOver] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [playerHouses, setPlayerHouses] = useState<string[]>([]);
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [playerTurn, setPlayerTurn] = useState<string>("");
    const { provider, account, connectWallet, disconnectWallet,contract,signer } = useWallet();


 
    

    //console.log(player_identity);
    const handleCopySuccess = () => {
      setIsCopied(true);
    };


    //console.log(room);




    const isWaitingForOpponent = !(players[0] && Object.keys(players[0]).length !== 0 && players[1] && Object.keys(players[1]).length !== 0);

    const createScene = async (canvas: HTMLCanvasElement | null): Promise<{ scene: Scene | undefined, defaultSpheres: () => void,moveSpheres: (move:Move) => void,playersTurn :string}> => {
       
      if (!canvas) {
        // If canvas is null, return a promise with an object where scene is undefined
        return Promise.resolve({ scene: undefined, defaultSpheres: () => {},moveSpheres: () => {},playersTurn:'' });
      }    
      
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        let playing_next = player_identity;

        let trace = ""
      
        var camera = new ArcRotateCamera("camera1", 0,  0, 10, Vector3.Zero(), scene);

        camera.attachControl(canvas, true);

        camera.speed = 0.25;

        camera.setPosition(new Vector3(0.003763740788813662, 43.32877130120143, 9.1329997049811053));



        camera.lowerAlphaLimit = camera.upperAlphaLimit = camera.alpha ;

        camera.lowerBetaLimit = Math.PI / 11; // Set to the desired angle in radians
        camera.upperBetaLimit = Math.PI * 0.8; // Set to the desired angle in radians
    
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 2, 0), scene);


        hemiLight.intensity = 1;
      
        //const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);

        // const board = SceneLoader.ImportMesh('','./models/','board.gltf',scene,(meshes) => {
        //   console.log('meshes',meshes)
        // })

        const registerWin = async(winId:string,winTrace:string,opponent_address:string,player_username:string) =>{

            if (contract){
              const transaction = await contract.recordWin(winId, winTrace,opponent_address,player_username);
              await transaction.wait();
              

            }

        }
  
        
        
        const loadModels = async (modelName:string) => {
          try {
            const result = await SceneLoader.ImportMeshAsync('', './models/', modelName);
            // Do something with the result here
            return result; // You can return the result if needed
          } catch (error) {
            // Handle errors if necessary
            console.error(error);
            throw error; // Re-throw the error if needed
          }
        };
        
        // Call the function
        const {meshes} = await loadModels('board.gltf');

        let boardRootMesh = meshes.find(mesh => mesh.name === '__root__');

        if (boardRootMesh) {
          // Example: Move the root mesh to a specific position
          boardRootMesh.position = new Vector3(5.5, 6, 0);
      }

        const {meshes:meshes_capture} = await loadModels('captur.gltf');
        const {meshes:bulbMeshes} = await loadModels('bulb.gltf');
        // Now modelsResult contains the result directly
        console.log(meshes_capture);
       

        const rootMesh = meshes_capture.find(mesh => mesh.name === '__root__');

        const bulb = bulbMeshes.find(mesh => mesh.name === 'bulb');

        if (bulb) {
          console.log('here is the bulb',bulb);
        }else{
          console.log('bulb not found')
        }

        if (rootMesh) {
          // Example: Move the root mesh to a specific position
          rootMesh.position = new Vector3(-22.5, 9, 0);
      }
        
       // console.log(meshes);

        const addedSpheres: Mesh[] = [];
        const capturedSpheres: Mesh[] = [];

        let sphere_count: number  = 1;

        //const housesToAccess = ['house-1', 'house-2', 'house-3', 'house-4', 'house-5', 'house-6', 'house-7', 'house-8', 'house-9', 'house-10', 'house-11', 'house-12'];

        
          // var box = MeshBuilder.CreateBox('box', { size: 1 }, scene);

          var material = new StandardMaterial('material', scene);

          console.log(player_identity,playing_next)
          // Assuming player_identity is a boolean variable
          if (!start.inprogress && player_identity === 'player-1') {
              // Set the material color to green
              material.diffuseColor = new Color3(0, 1, 0); // Green
              material.specularColor = new Color3(1, 1, 1);
              // box.material = material;

              if (bulb){
                bulb.material = material;
              }
              
          }

          

          // box.position.x = 22.5; // Half of the box's width in the negative x direction
          // box.position.y = 15;   // Half of the box's height in the positive y direction
          // box.position.z = 2;

          const bulbRootMesh = bulbMeshes.find(mesh => mesh.name === '__root__');

          if (bulbRootMesh) {
            // Example: Move the root mesh to a specific position
            bulbRootMesh.position = new Vector3(22.5, 15, 0);
        }
          


          const defaultSpheres = () : void => {
                  const selectedMeshes = housesToAccess
                  .map((houseKey) => {
                    const model = meshes.find((model) => model.id === houseKey);
                    return model ? model: null;
                  })
                  .filter(Boolean);

                //console.log(selectedMeshes);
          
                  selectedMeshes.forEach((mesh) => {

                    if (mesh){
                      const house = houses[mesh.name];
                      //console.log(`Mesh name: ${mesh.name}, Seeds count before loop: ${house.seeds.length}`);
                     const houseSeeds = house.seeds;

                     houseSeeds.forEach((seed) => {
                        addSphereInsideMesh(mesh,seed.seedName,false,true);
                     })
                      
                      // Additional logic if needed
                    //console.log(house.houseNumber, house.seeds);
                    }
                  });
                }



        
        // Function to add a small sphere inside the clicked mesh
      // Function to add a small sphere inside the clicked mesh
      function addSphereInsideMesh(mesh: AbstractMesh,seedName: string,capture:boolean = false,isDefault:boolean=false) {
        // Create a new sphere with MeshBuilder
        const newSphere = MeshBuilder.CreateSphere(seedName, { diameter: 1 }, scene); // Adjust the diameter as needed

        let sphereADefault: boolean = false;
        // Compute the center of the clicked mesh's bounding box in world space
        const boundingBoxCenter =  () : Vector3 => {

          if (isDefault){
            if(boardRootMesh){
              const offset = boardRootMesh.position.clone();
              const boundingBoxCenter = mesh.getBoundingInfo().boundingBox.centerWorld;
              const resultantVector = boundingBoxCenter.add(offset);
              sphereADefault = true;
              return resultantVector
            }else {
              sphereADefault = true;
              return mesh.getBoundingInfo().boundingBox.centerWorld;
            }
          }else{
            return mesh.getBoundingInfo().boundingBox.centerWorld;
          }   
        } 

        newSphere.position.copyFrom(boundingBoxCenter());
        newSphere.isPickable = false;
        // applyRandomDeformities(newSphere, 6);

        //console.log(boundingBoxCenter);

        const sphereMaterial = new StandardMaterial(`seed-${sphere_count}`, scene);
        sphereMaterial.diffuseTexture = new Texture(sphereTexture, scene);
        newSphere.material = sphereMaterial;

        // Check for collisions with previously added spheres
        if (checkSphereCollisions(newSphere, mesh.name === 'capture-house' ? true : false)) {
          // If collision detected, calculate a new position
          const newPosition = calculateNewSpherePosition(mesh,sphereADefault);
          newSphere.position.copyFrom(newPosition);
          newSphere.isPickable = false;
        } 

       if (!capture){
        addedSpheres.push(newSphere);
       } else{
        capturedSpheres.push(newSphere);
        
       }
      
      }

          // Function to calculate a new position for the sphere in case of collision
          function calculateNewSpherePosition(mesh: AbstractMesh,isDefaultSphere = false): Vector3 {
            // Get the center of the clicked mesh's bounding box in world space
            //const boundingBoxCenter = mesh.getBoundingInfo().boundingBox.centerWorld;

            const boundingBoxCenter =  () : Vector3 => {

              if (isDefaultSphere){
                if(boardRootMesh){
                  const offset = boardRootMesh.position.clone();
                  const boundingBoxCenter = mesh.getBoundingInfo().boundingBox.centerWorld;
                  const resultantVector = boundingBoxCenter.add(offset);
                  return resultantVector
                }else {

                  return mesh.getBoundingInfo().boundingBox.centerWorld;
                }
              }else{
                return mesh.getBoundingInfo().boundingBox.centerWorld;
              }   
            }

            // Calculate random offsets for X, Y, and Z directions
            const xOffset = (Math.random() - 0.5) * 2.4; // Adjust the range of X offset as needed
            const yOffset = (Math.random() - 0.5) * 1.4; // Adjust the range of Y offset as needed
            const zOffset = (Math.random() - 0.5) * 2.6; // Adjust the range of Z offset as needed

            const boundingBoxCenterResult = boundingBoxCenter()

            // Apply the random offsets to the bounding box center
            const newPosition = new Vector3(
              boundingBoxCenterResult.x + xOffset,
              boundingBoxCenterResult.y + yOffset,
              boundingBoxCenterResult.z + zOffset
            );

            if (mesh.name === 'capture-house'){
              console.log("new position sphere", newPosition);
            }

            return newPosition;
          }





          
          const moveSpheres = (move: Move)  => {

            //console.log("oppent made a move", move);

            const house = houses[housesToAccess[move.selectedHouse.houseNumber - 1]]

          //  console.log(house);

            if (move.action===0){
              house.seedsNumber = 0;

              // console.log(`House ${house.houseNumber}: Position - x: ${clickedMesh.position.x}, y: ${clickedMesh.position.y}, z: ${clickedMesh.position.z}, Seed: ${house.seedNumber}`);
            
              // console.log("number of picked seeds", numberOfSeedsPicked);

               const seeds = house.seeds;

              // console.log("the seeds",seeds);

               seeds.forEach((seed) => {
                 // Find the sphere in the addedSpheres array by name
                
                 const sphere = addedSpheres.find(s => s.name === seed.seedName);

                // console.log(sphere);
               
                // console.log(`Attempt to dispose of sphere with name '${seed.seedName}':`, sphere);
               
                 if (sphere) {
                 //  console.log(`Disposing of sphere with name '${seed.seedName}'`);
                   sphere.dispose();
                   // Remove the disposed sphere from the addedSpheres array
                   const index = addedSpheres.indexOf(sphere);
                   if (index !== -1) {
                     addedSpheres.splice(index, 1);
                   }
                 } else {
                   console.log(`Sphere not found with name '${seed.seedName}'`);
                 }
               });

               const player = player_identity === 'player-1' ? playersStates['player-2'] : playersStates['player-1']
               
               player.onHand = house.seeds

               house.seeds = [];

               player.previouseHouse = player.nextHouse[0];

               const nextMove = () : string[] => {
                  
                   const indexOfCurrentHouse = housesToAccess.indexOf(housesToAccess[move.selectedHouse.houseNumber - 1]);

                   const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                   const house = housesToAccess[indexOfNextHouse];

                   return [house];
               }


               player.nextHouse = nextMove();
               player.originalHouse = [housesToAccess[move.selectedHouse.houseNumber - 1]];
               playing_next = move.player;
               start.inprogress = true;
               setPlayerTurn(playing_next);
               

            }else if (move.action===1){
              const meshClicked =  meshes.find((model) => model.id === housesToAccess[house.houseNumber-1]);
              if(meshClicked){

                house.seedsNumber +=1;
                //numberOfSeedsPicked -= 1;
                const player = player_identity === 'player-1' ? playersStates['player-2'] : playersStates['player-1']


                addSphereInsideMesh(meshClicked,move.seedAdd[0].seedName);

                house.seeds.push(move.seedAdd[0]);
                player.onHand.splice(0, 1);

                player.previouseHouse = player.nextHouse[0];

                

                const nextMove = () : string[] => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(meshClicked.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    return [house];
                }

                if (player.onHand.length === 0){

                  player.nextHouse= []
                  player.originalHouse =[]

                  material.diffuseColor = new Color3(0, 1, 0); // Green
                  material.specularColor = new Color3(1, 1, 1);
                  // box.material = material;
                  if (bulb){
                    bulb.material = material;
                  }

                  const isPlayeerHouse =  playerHouses.includes(meshClicked.name);

                  if (isPlayeerHouse && (house.seeds.length === 2 || house.seeds.length === 3)){

                    const seeds = house.seeds;
  
                    seeds.forEach((seed) => {
                      // Find the sphere in the addedSpheres array by name
                     
                      const sphere = addedSpheres.find(s => s.name === seed.seedName);
    
                    //  console.log(sphere);
                    
                     // console.log(`Attempt to dispose of sphere with name '${seed.seedName}':`, sphere);
                          
                      if (sphere) {
                       // console.log(`Disposing of sphere with name '${seed.seedName}'`);

                        sphere.dispose();
  
                        if (capturedSpheres.length > 24){
                          console.log(" You are the winner!!!")
                        }
                        // Remove the disposed sphere from the addedSpheres array
                        const index = addedSpheres.indexOf(sphere);
                        if (index !== -1) {
                          addedSpheres.splice(index, 1);
                        }
                      } else {
                        console.log(`Sphere not found with name '${seed.seedName}'`);
                      }
                    });
  
                  }

  
                 }else{
  
                  player.nextHouse = nextMove();
                  player.originalHouse = [meshClicked.name];
  
                 }

                 playing_next = move.player;
                 setPlayerTurn(playing_next);
                 start.inprogress = true;
                 start.player = move.player;

              }
            }
        }

      // Function to check for collisions with existing spheres
      function checkSphereCollisions(newSphere: Mesh,capture: boolean = false): boolean {
        const meshToCheck = !capture ? addedSpheres : capturedSpheres;
        for (const existingSphere of meshToCheck) {
          // Calculate the distance between the centers of the spheres
          const distance = Vector3.Distance(existingSphere.position, newSphere.position);

          // Check if the spheres overlap (distance less than sum of their radii)
          if (distance < (existingSphere.scaling.x + newSphere.scaling.x) / 2) {
            return true; // Collision detected
          }
        }

        return false; // No collision detected
      }

      // winId:string;
      // winTrace:string;
      // opponent_address:string;
      // player_username:string;


 

      function applyRandomDeformities(mesh: Mesh, strength: number) {
        const positions = mesh.getVerticesData(VertexBuffer.PositionKind) as Float32Array;
      
        // Apply random deformities to each vertex
        for (let i = 0; i < positions.length; i += 3) {
          const randomX = (Math.random() - 0.5) * strength;
          const randomY = (Math.random() - 0.5) * strength;
          const randomZ = (Math.random() - 0.5) * strength;
      
          positions[i] += randomX;
          positions[i + 1] += randomY;
          positions[i + 2] += randomZ;
        }
      
        mesh.updateVerticesData(VertexBuffer.PositionKind, positions);
      }

        // console.log(modelsPromise)
        let numberOfSeedsPicked: number = 0;

          scene.onPointerDown = function (evt, pickResult) {
             

            let isPlayerTurn:boolean;

            if (!start.inprogress && player_identity === 'player-1'){
              isPlayerTurn = true;
              start.inprogress = true;
            }else if(start.inprogress && player_identity === playing_next){
              isPlayerTurn = true;
            }else{
              isPlayerTurn = false;
              console.log(player_identity,playing_next)
            }
          
            if (pickResult.hit && pickResult.pickedMesh && playersStates[player_identity].onHand.length === 0 && isPlayerTurn) {
              // Find the corresponding house in the houses object
              const clickedMesh: AbstractMesh = pickResult.pickedMesh;
              const house = houses[clickedMesh.name];
              const isOriginalHouseEmpty = playersStates[player_identity].originalHouse.length === 0
              const isOrginalHouse = !isOriginalHouseEmpty && playersStates[player_identity].originalHouse[0] === clickedMesh.name;
              const isHousePlayers = playerHouses.includes(clickedMesh.name)
              const isNextHousesEmpty = playersStates[player_identity].nextHouse.length === 0;
              const validHouseMove = isNextHousesEmpty ? housesToAccess[housesToAccess.indexOf(clickedMesh.name) + 1] : playersStates[player_identity].nextHouse[0];
              const checkMove = validHouseMove === housesToAccess[housesToAccess.indexOf(clickedMesh.name)];
              const isValidMove = isHousePlayers 

              console.log(isValidMove);
              console.log(playerHouses,clickedMesh.name)

             
              

              if (house && isValidMove && (!isOrginalHouse || isOriginalHouseEmpty)) {

                //console.log(house.seeds.length)
                // Print the position and seed number of the corresponding house
                numberOfSeedsPicked = house.seedsNumber;

                house.seedsNumber = 0;

               // console.log(`House ${house.houseNumber}: Position - x: ${clickedMesh.position.x}, y: ${clickedMesh.position.y}, z: ${clickedMesh.position.z}, Seed: ${house.seedNumber}`);
             
               // console.log("number of picked seeds", numberOfSeedsPicked);

                const seeds = house.seeds;

                console.log("the seeds",seeds);

                seeds.forEach((seed) => {
                  // Find the sphere in the addedSpheres array by name
                 
                  const sphere = addedSpheres.find(s => s.name === seed.seedName);

                //  console.log(sphere);
                
                 // console.log(`Attempt to dispose of sphere with name '${seed.seedName}':`, sphere);
                      
                  if (sphere) {
                   // console.log(`Disposing of sphere with name '${seed.seedName}'`);
                    sphere.dispose();
                    // Remove the disposed sphere from the addedSpheres array
                    const index = addedSpheres.indexOf(sphere);
                    if (index !== -1) {
                      addedSpheres.splice(index, 1);
                    }
                  } else {
                    console.log(`Sphere not found with name '${seed.seedName}'`);
                  }
                });
                
                playersStates[player_identity].onHand = house.seeds

                house.seeds = [];

                playersStates[player_identity].previouseHouse = state.nextHouse[0];

                const nextMove = () : string[] => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(clickedMesh.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    //console.log("the house to",house);

                    return [house];
                }


                playersStates[player_identity].nextHouse = nextMove();
                playersStates[player_identity].originalHouse = [clickedMesh.name];

                //console.log("Remaining seeds ", house.seeds);
              // console.log(playersStates[player_identity].nextHouse)




              const move: Move = {

                selectedHouse:house,
                seedAdd:[],
                player:player_identity,
                action:0,
                progress:true,

              };

              // illegal move
              if (move === null) return false;
          
              socket.emit("move", { // <- 3 emit a move event.
                move,
                room,
              }); // this event will be transmitted to the opponent via the server

             
              } else {
                console.warn("House not found for clicked mesh: " + clickedMesh.name);
              }
            } else if (pickResult.hit && pickResult.pickedMesh && playersStates[player_identity].onHand.length !== 0 && isPlayerTurn) {
              // Find the corresponding house in the houses object
              const clickedMesh: AbstractMesh = pickResult.pickedMesh;
              const house = houses[clickedMesh.name];
              const isValidMove = clickedMesh.name === playersStates[player_identity].nextHouse[0];
              //console.log('how?',playersStates[player_identity].nextHouse)
              //console.log('isvalidmove',playersStates[player_identity].nextHouse[0],clickedMesh.name);

              if (house && isValidMove) {
                // Print the position and seed number of the corresponding house
                
                house.seedsNumber +=1;
                const player = playersStates[player_identity];

               // console.log("remaining seed", numberOfSeedsPicked);

                addSphereInsideMesh(clickedMesh,player.onHand[0].seedName);

                const seedAdded = player.onHand[0];

                house.seeds.push(player.onHand[0]);
                player.onHand.splice(0, 1);

                player.previouseHouse = player.nextHouse[0];

                const nextMove = () : string[] => {
                   
                    const indexOfCurrentHouse = housesToAccess.indexOf(clickedMesh.name);

                    const indexOfNextHouse = indexOfCurrentHouse < 11 ? indexOfCurrentHouse + 1 : 0;

                    const house = housesToAccess[indexOfNextHouse];

                    return [house];
                }


               if (player.onHand.length === 0){

                player.nextHouse= []
                player.originalHouse =[]


                const nextPlayer = player_identity === 'player-1' ? 'player-2' :'player-1';
                
                playing_next = nextPlayer;
                start.player = playing_next ;
                setPlayerTurn(playing_next);

                material.diffuseColor = new Color3(1, 0, 0);
                material.specularColor = new Color3(1, 1, 1);
                // box.material = material;
                if (bulb){
                  bulb.material = material;
                }

                const isPlayeerHouse =  playerHouses.includes(clickedMesh.name);

                if (!isPlayeerHouse && (house.seeds.length === 2 || house.seeds.length === 3)){

                  const seeds = house.seeds;
                  const captureMesh = meshes_capture.find(mesh => mesh.name === 'capture-house');

                  trace = trace + " " + clickedMesh.name;

                  seeds.forEach((seed) => {
                    // Find the sphere in the addedSpheres array by name
                   
                    const sphere = addedSpheres.find(s => s.name === seed.seedName);
  
                  //  console.log(sphere);
                  
                   // console.log(`Attempt to dispose of sphere with name '${seed.seedName}':`, sphere);
                        
                    if (sphere && captureMesh) {
                     // console.log(`Disposing of sphere with name '${seed.seedName}'`);
                     //const theSphere = sphere;
                     capturedSpheres.push(sphere);

                     console.log("The captured",capturedSpheres.length)
                      
                      
                      sphere.dispose();

                      addSphereInsideMesh(captureMesh,seed.seedName,true);

                      if (capturedSpheres.length > 24){

                        const win_id = uuidv4();
                        const winId = win_id;
                        const winTrace = trace;
                        const opponent_address = "0x12";
                        const opponentAddress = ethers.utils.getAddress(opponent_address);
                        const player_username = username;

                        registerWin(winId,winTrace,opponentAddress,player_username);

                        console.log(" You are the winner!!!")
                      }
                      // Remove the disposed sphere from the addedSpheres array
                      const index = addedSpheres.indexOf(sphere);
                      if (index !== -1) {
                        addedSpheres.splice(index, 1);
                      }
                    } else {
                      console.log(`Sphere not found with name '${seed.seedName}'`);
                    }
                  });

                }

                const move: Move = {

                  selectedHouse:house,
                  seedAdd:[seedAdded],
                  player:nextPlayer,
                  action:1,
                  progress:true,
  
                };

                // illegal move
                if (move === null) return false;
            
                socket.emit("move", { // <- 3 emit a move event.
                  move,
                  room,
                }); // this event will be transmitted to the opponent via the server


               }else{

                player.nextHouse = nextMove();
                player.originalHouse = [clickedMesh.name];
                const nextPlayer = player_identity;

                playing_next = nextPlayer;
                setPlayerTurn(playing_next);




                const move: Move = {

                  selectedHouse:house,
                  seedAdd:[seedAdded],
                  player:nextPlayer,
                  action:1,
                  progress:true,
  
                };

                // illegal move
                if (move === null) return false;
            
                socket.emit("move", { // <- 3 emit a move event.
                  move,
                  room,
                }); // this event will be transmitted to the opponent via the server

                

               }

                //console.log(`House ${house.houseNumber}: Position - x: ${clickedMesh.position.x}, y: ${clickedMesh.position.y}, z: ${clickedMesh.position.z}, Seed: ${house.seedNumber}`);
              } else {
                console.warn("House not found for clicked mesh: " + clickedMesh.name);
              }
            } 
          };

        // const ball = MeshBuilder.CreateSphere("ball", { diameter: 1 }, scene);
        // ball.position = new Vector3(0, 1, 0);

        
        
        // Assuming 'scene' is your Babylon.js scene object
        engine.runRenderLoop(() => {

  
          scene.render();
        });
      
        window.addEventListener('resize', () => {
          engine.resize();
        });

        //ground.material = CreateGroundMaterial(scene);
        // ball.material = CreateBallMaterial(scene);

        const  playersTurn: string =playing_next;

        

      
        return {scene, defaultSpheres,moveSpheres,playersTurn};
      };

 
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const [scene, setScene] = useState<Scene | undefined>(undefined);
      const [makeAMove, setMakeAMove] = useState<(move: Move) => void>(() => {});
      const [player_turn, setThePlayerTurn] = useState<(playerTurn: string) => void>(() => {})
      const sceneRef = useRef(null);
    

      useEffect(() => {
        const loadScene = async (): Promise<() => void> => {
          const {scene:sceneCreated, defaultSpheres,moveSpheres: sceneMoveSpheres,playersTurn:player} = await createScene(canvasRef.current);
          defaultSpheres();
          
          // Optionally, you can handle the scene instance or perform additional actions here

          if (sceneCreated) {
            setScene(sceneCreated);
            setMakeAMove(() =>  sceneMoveSpheres);
            setPlayerTurn(player);
            console.log('ebu check',player);
          }
          
          return () => {
            if (sceneCreated) {
              sceneCreated.dispose(); // Clean up the scene when the component unmounts
            }
          };
        };
    
        const cleanup = loadScene().then(cleanupFunction => cleanupFunction);
    
        return () => {
          cleanup.then(cleanupFunction => cleanupFunction());
        };
      }, [playerHouses]);



      
      useEffect(() => {
        if (scene) {
          socket.on("move", (move) => {
            makeAMove(move);
            setPlayerTurn(move.player);
          });
        }
    
        return () => {
          // Clean up the socket event listener when the component unmounts
          socket.off("move");
        };
      }, [scene, makeAMove,playerTurn]);


      //console.log("am available here",playerTurn);

      useEffect(() => {
        if (!isWaitingForOpponent && !inProgress) {
          let newPlayerHouses, newPlayerTurn;
    
          if (player_identity === 'player-1') {
            newPlayerHouses = housesToAccess.slice(0, 6);
            newPlayerTurn = player_identity;
          } else {
            newPlayerHouses = housesToAccess.slice(6, 12);
            newPlayerTurn = 'player-1';
          }
    
          // Update playerHouses only if it has changed
          if (JSON.stringify(newPlayerHouses) !== JSON.stringify(playerHouses)) {
            setPlayerHouses(newPlayerHouses);
          }
    
          // Update playerTurn only if it has changed
          if (newPlayerTurn !== playerTurn) {
            setPlayerTurn(newPlayerTurn);
          }
        }
      }, [isWaitingForOpponent, inProgress, player_identity, housesToAccess, playerHouses, playerTurn]);

      useEffect(() => {
        socket.on('playerDisconnected', (player) => {
          setOver(`${player.username} has disconnected`); // set game over
        });
      }, []);
    
  
      useEffect(() => {
        socket.on('closeRoom', ({ roomId }) => {
          if (roomId === room) {
            if (cleanup) {
              cleanup();
          }90
          }
        });
      }, [room, cleanup]);


  return (
    <>
        <div className='m-5'>
            <a href="https://flowbite.com" className="flex items-center ">
                <img src="./logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">command-nexus</span>
            </a>
            <div className='pt-2'>
            <Card sx={{
              backgroundColor:'rgb(15 23 42)',
              borderRadius: '16px 16px 0 0'
            }}>
            <CardContent>
              <Grid container spacing={4} alignItems="center">
                <Grid item width={'100%'}>
                  {isWaitingForOpponent ? (
                  <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <CircularProgress size={18} />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" color={'whitesmoke'}>Waiting for opponent</Typography>
                  </Grid>
                  <Grid item>
                  <CopyToClipboard text={room} onCopy={handleCopySuccess}>
                    <Button color="primary">
                      {isCopied ? 'Copied!' : 'Copy Room Id to Clipboard'}
                    </Button>
                  </CopyToClipboard>
                  </Grid>
                </Grid>
                  ) : (
                    <>
                    <AccountCircleIcon fontSize="large" color="primary" />
                    <Grid item>
                    <div>
                      <Typography variant="h6" color={'white'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize:15
                      }}>Player: <span className='text-sky-500 px-1'>{username}</span></Typography>
                      <Typography variant="body1" color={'white'} sx={{fontSize:15
                      }}>Room: <span className='text-sky-500 px-1'>{room}</span></Typography>
                    </div>
                  </Grid>

                <Grid container spacing={2} sx={{margin:'auto',textAlign:'center',alignItems:"center",position:'center'}} columns={16}>
                  {playerHouses.map((houseName, index) => (
                    <Grid item xs={6} sm={2} md={2} lg={2} key={index}>
                      <Paper elevation={3} sx={{padding:1,display:'flex'}} >
                        <HouseIcon />
                        <Typography variant="h6">{houseName}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>  

                  </>
                  )}

                </Grid>
  
              </Grid>
            </CardContent>
          </Card>
        </div>
        <canvas className='canvas rounded-md' ref={canvasRef}>
        
        </canvas>
        </div>
      <CustomDialog // Game Over CustomDialog
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          socket.emit("closeRoom", { roomId: room });
          if (cleanup) {
            cleanup();
        }
        }}
      />
    </>
  )
}

export default Canvas