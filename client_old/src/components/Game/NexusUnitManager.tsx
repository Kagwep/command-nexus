import { Scene, Mesh, Vector3, GroundMesh, TransformNode, PointerEventTypes, StandardMaterial, Color3, AnimationGroup, AssetContainer, Ray, AbstractMesh, Axis, Quaternion, Space, Tools, MeshBuilder, VertexBuffer } from '@babylonjs/core';
import { RecastJSPlugin } from '@babylonjs/core/Navigation/Plugins/recastJSPlugin';
import CommandNexusGui from './CommandNexusGui';
import { UnitType,UnitAssetContainers, Agent, AnimationMapping, AgentAnimations, UnitAnimations, AbilityType, BattlefieldName, Deploy, ToastType, Infantry, EncodedVector3, Armored } from '../../utils/types';
import { regions, soldierAnimationMapping, tankAnimationMapping, positionEncoder, positionDecoder,unitTypeToInt,battlefieldTypeToInt, numberToUnitType } from '../../utils/nexus';
import { Weapon } from './BulletSystem';
import { SoundManager } from './SoundManager';
import { RayCaster } from './RayCaster';
import { GameState } from './GameState';
import { BattlefieldCameraManager } from './BattlefieldCameraManager';
import { Account, AccountInterface } from 'starknet';
import { bigintToU256 } from '../../lib/lib_utils/starknet';



class NexusUnitManager {
    private scene: Scene;
    private navigationPlugin: RecastJSPlugin;
    private ground: Mesh;
    private pointNavPre: GroundMesh;
    private crowd: any; // Type this properly if you have type definitions for the crowd
    private agents: Agent[] = [];
    private selectedAgent: Agent | null = null;
    public navmeshdebug;
    private guiRef: CommandNexusGui | null;
    private getGui: () => CommandNexusGui;
    private unitAssets: UnitAssetContainers = {
        [UnitType.Infantry]: new AssetContainer(),
        [UnitType.Armored]: new AssetContainer(),
        [UnitType.Air]: new AssetContainer(),
        [UnitType.Naval]: new AssetContainer(),
        [UnitType.Cyber]: new AssetContainer(),
    };
    private unitAnimations: UnitAnimations;
    private activeUnitType: UnitType;
    private activePosition: Vector3;
    private bulletSystem: Weapon;
    private soundManager: SoundManager;
    private navMeshIndices: any;
    private highlightMesh: Mesh;
    private threshold = 0.1;
    private epsilon = 0.001
    private indices: any;
    private rayCaster: RayCaster;
    private getGameState: () => GameState;
    private battlefieldCameraManager;
    private arena;
    private nexus;
    private getAccount: () => AccountInterface | Account;
    private game;
    private infantryUnits: Map<string, Infantry> = new Map();
    private armoredUnits: Map<string, Infantry> = new Map();
    

    constructor(
        scene: Scene, 
        navigationPlugin: RecastJSPlugin, 
        ground: Mesh, 
        pointNavPre: GroundMesh,
        getGui: () => CommandNexusGui,
        getGameState: () => GameState,
        InfantryAssetContainer: AssetContainer,
        ArmoredAssetContainer: AssetContainer,
        battlefieldCameraManager: BattlefieldCameraManager,
        arena,
        nexus,
        getAccount,
   
    ) {
        this.scene = scene;
        this.navigationPlugin = navigationPlugin;
        this.ground = ground;
        this.pointNavPre = pointNavPre;
        this.getGui= getGui;
       // console.log(InfantryAssetContainer)
        this.unitAssets[UnitType.Infantry] = InfantryAssetContainer;
        this.unitAssets[UnitType.Armored] = ArmoredAssetContainer;
        this.unitAnimations = {
            [UnitType.Infantry]: soldierAnimationMapping,
            [UnitType.Armored]: tankAnimationMapping,
            [UnitType.Air]: { idle: ["Hover"], movement: ["Fly"], attack: ["Missile"] },
            [UnitType.Naval]: { idle: ["Float"], movement: ["Sail"], attack: ["Cannon"] },
            [UnitType.Cyber]: { idle: ["Standby"], movement: ["Transfer"], attack: ["Hack"] }
          };
          this.bulletSystem = new Weapon(scene);
          this.initializeSoundManager();
          this.rayCaster = new RayCaster(scene);
          this.getGameState = getGameState;
          this.battlefieldCameraManager = battlefieldCameraManager;
          this.arena = arena,
          this.nexus = nexus;
          this.getAccount = getAccount;
          this.addUnits();
   
         // this.initializeCameraPosition();
        
    }

    initializeCameraPosition(){

         if(this.getGameState().player.home_base === "NovaWarhound"){
            const selectedBattlefield = BattlefieldName.NovaWarhound; // This would come from user input
            this.battlefieldCameraManager.setCameraForBattlefield(selectedBattlefield);
          }

          if(this.getGameState().player.home_base === "Skullcrag"){
            const selectedBattlefield = BattlefieldName.Skullcrag; // This would come from user input
            this.battlefieldCameraManager.setCameraForBattlefield(selectedBattlefield);
          }

          if(this.getGameState().player.home_base === "Ironforge"){
            const selectedBattlefield = BattlefieldName.Ironforge; // This would come from user input
            this.battlefieldCameraManager.setCameraForBattlefield(selectedBattlefield);
          }

          if(this.getGameState().player.home_base === "RadiantShores"){
            const selectedBattlefield = BattlefieldName.RadiantShores; // This would come from user input
            this.battlefieldCameraManager.setCameraForBattlefield(selectedBattlefield);
          }

        //   if(this.getGameState().player.home_base === "Skullcrag"){
        //     const selectedBattlefield = BattlefieldName.Skullcrag; // This would come from user input
        //     this.battlefieldCameraManager.setCameraForBattlefield(selectedBattlefield);
        //   }


    }

    initialize(): Promise<void> {
        return new Promise((resolve) => {
            const navmeshParameters = {
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
                tileSize: 25
            }
            this.navigationPlugin.createNavMesh([this.ground], navmeshParameters, (navmeshData) => {
                this.createDebugNavMesh(navmeshData);
                this.setupCrowd();
                this.setupPointerObservable();
                this.setupRenderObservable();

                console.log("Navigation mesh created and initialized");
                
                // Resolve the promise after a 500ms delay
                setTimeout(() => {
                    resolve();
                }, 500);
            });
        });
    }




    private createDebugNavMesh(navmeshData): void {
        this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.scene);
        this.navigationPlugin.buildFromNavmeshData(navmeshData);
        this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.scene);
        this.navmeshdebug.name = "ground";
        this.navmeshdebug.position = new Vector3(0, 0.01, 0);
        var matdebug = new StandardMaterial('matdebug', this.scene);
        matdebug.diffuseColor = new Color3(0.1, 0.2, 1);
        matdebug.alpha = 1;
        this.navmeshdebug.material = matdebug;
        this.navmeshdebug.visibility = 0.15;

        const positions = this.navmeshdebug.getVerticesData(VertexBuffer.PositionKind);
        this.navMeshIndices =positions
        this.indices = this.navmeshdebug.getIndices();

        //console.log(this.navMeshIndices)


        //new InteractiveGridObstructionSystem(this.scene, 300, 1);
    }

    private initializeSoundManager(){
            this.soundManager =new SoundManager(this.scene)
            this.soundManager.addSound("bulletFire","/sounds/riflefire.mp3")
            this.soundManager.addSound("move","/sounds/footsteps-running-away-fading-2-103763.mp3")
    }

    private setupCrowd(): void {
        const maxAgents = 10;
        this.crowd = this.navigationPlugin.createCrowd(maxAgents, 0.1, this.scene);

        this.crowd.onReachTargetObservable.add((agentInfos: any) => {
            console.log("Agent reached destination:", agentInfos.agentIndex);
            this.pointNavPre.visibility = 0;
            this.soundManager.stopSound("move")
            this.getGui().showActionsMenu(this.activeUnitType);
            //const elevation = this.getElevationAtPosition(this.activePosition)
           // const coverPosition = this.getCoverLevel(this.activePosition)
           // console.log(elevation,coverPosition);
            // Implement stop walk animation here if needed
            //this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(this.selectedAgent.animations.movement, 1.3, this.selectedAgent.animations.idle, 1.0, true, 0.05));
        
            this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(this.selectedAgent.animations.movement, 1.3, this.selectedAgent.animations.idle, 1.0, true, 0.05));


        });
        console.log("called..............")
    }

    private addAgent(unitType: UnitType, position: Vector3,unitData: any): Agent {
        const agentParams = {
            radius: 0.3,
            height: 0.01,
            maxAcceleration: 50.0,
            maxSpeed: 4,
            collisionQueryRange: 0.5,
            pathOptimizationRange: 0.2,
            separationWeight: 1.0
        };

        const navAgent = new TransformNode("navAgent_" + this.agents.length, this.scene);
        
        // Create a new instance of the model
        const result = this.unitAssets[unitType].instantiateModelsToScene(undefined, false, { doNotInstantiate: true });
        const rootMesh = result.rootNodes[0] as Mesh;
        rootMesh.parent = navAgent;
        rootMesh.position = Vector3.Zero(); // Reset position relative to navAgent

        const agentPosition = this.navigationPlugin.getClosestPoint(position);
       
        const agentIndex = this.crowd.addAgent(agentPosition, agentParams, navAgent);

        const animations: AgentAnimations   = this.mapAnimations(result.animationGroups, this.unitAnimations[unitType]);

        const agent: Agent = {
            navAgent: navAgent,
            visualMesh: rootMesh,
            idx: agentIndex,
            animations: animations,
            animationGroups: result.animationGroups,
            cUnitType: unitType
        };

        const newUnitData = { ...unitData, unitType };

        rootMesh.metadata = { agentIndex: this.agents.length, UnitData: newUnitData };
        rootMesh.getChildMeshes().forEach(childMesh => {
            childMesh.metadata = { agentIndex: this.agents.length, UnitData: newUnitData };
        });

        this.agents.push(agent);

        // Start with idle animation
        agent.animations.idle.start(true);

        this.getGui().handleDeployement();

        return agent;
    }

    private mapAnimations(animationGroups: AnimationGroup[], mapping: AnimationMapping): AgentAnimations {
        const result: AgentAnimations = {} as AgentAnimations;

        for (const [key, nameParts] of Object.entries(mapping)) {
            const matchingAnimation = animationGroups.find(ag => 
                nameParts.some(part => ag.name.toLowerCase().includes(part.toLowerCase()))
            );

            if (matchingAnimation) {
                result[key] = matchingAnimation;
            } else {
                console.warn(`Animation for ${key} not found`);
            }
        }

        return result;
    }


    private setupPointerObservable(): void {
        this.scene.onPointerObservable.add(async (pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERTAP && pointerInfo.pickInfo?.hit) {
                await this.handlePointerTap(pointerInfo.pickInfo.pickedMesh as Mesh);
            }
        });
    }



    private async handlePointerTap(mesh: Mesh): Promise<void> {
        const startingPoint = this.getGroundPosition();
        console.log(mesh.name, mesh.metadata)
        if (mesh.metadata && mesh.metadata.agentIndex !== undefined) {
            if (this.selectedAgent){
                switch (mesh.metadata.UnitData.unitType) {
                    case UnitType.Infantry:
                        console.log("..")
                        this.getGui().showInfantryInfo(mesh.metadata.UnitData);
                        break;
                    case UnitType.Armored:
                        console.log("*-*")
                        this.getGui().showArmoredInfo(mesh.metadata.UnitData);
                        break;
                    // case UnitType.Naval:

                    // case UnitType.Air:

                    // case UnitType.Cyber:
                    default:
                       console.log(mesh.metadata.UnitData.unitType);
                }
            }
            if (this.selectedAgent && this.selectedAgent.idx !== mesh.metadata.agentIndex && this.getGui().getAbilityMode() == AbilityType.Attack) {
                console.log("different", this.selectedAgent.visualMesh);
                console.log(this.getGui().getAbilityMode());
                // Get the target agent
                const targetAgent = this.agents[mesh.metadata.agentIndex];

                const { hit} = this.rayCaster.castRay(this.selectedAgent.visualMesh, targetAgent.visualMesh);

                if (hit) {
                    console.log(`Ray hit at `);
                    console.log(`Hit normal:`);
                } else {
                    console.log("Ray did not hit the target mesh");
                }
                            
                if (targetAgent && targetAgent.navAgent) {

                    const distanceBetweenMeshes = this.getDistanceBetweenMeshes(this.selectedAgent.visualMesh, targetAgent.visualMesh);

                    console.log(distanceBetweenMeshes*2.5);

                    // const obstructions = this.detectPlayerObstructions(this.selectedAgent.navAgent, 5, 360);
                    // console.log("Blocked Regions:", obstructions);
                    // Log positions for debugging
                    // console.log("Selected Agent Position:", this.selectedAgent.navAgent.position);
                    // console.log("Target Agent Position:", targetAgent.navAgent.position);

                    const originalRotation = this.selectedAgent.navAgent.rotationQuaternion;
                    const agentRotation  = this.selectedAgent.visualMesh.rotationQuaternion;
            
                    // Calculate the direction vector from the selected agent to the target agent
                    const direction = targetAgent.navAgent.position.subtract(this.selectedAgent.navAgent.position);
            
                    // Log direction for debugging
                    // console.log("Direction Vector:", direction);
            
                    // Normalize the direction vector
                    direction.normalize();
            
                    // Log normalized direction for debugging
                    // console.log("Normalized Direction Vector:", direction);
            
                    // Calculate the angle between the world forward vector and the direction vector
                    const worldForward = Vector3.Forward().negate();
                    const angle = Math.atan2(direction.x, direction.z) - Math.atan2(worldForward.x, worldForward.z);
            
                    // Log angle for debugging
                    // console.log("Rotation Angle (radians):", angle);
            
                    // Create a rotation quaternion based on the calculated angle
                    const rotationQuaternion = Quaternion.RotationAxis(Axis.Y, angle);
            
                    // Apply the rotation to the selected agent's navAgent
                    this.selectedAgent.navAgent.rotationQuaternion = rotationQuaternion;
            
                    // If visualMesh is parented to navAgent, we need to reset its local rotation
                    if (this.selectedAgent.visualMesh) {
                        this.selectedAgent.visualMesh.rotationQuaternion = Quaternion.Identity();
                    }
            
                    this.scene.onBeforeRenderObservable.runCoroutineAsync(
                        this.animationBlending(
                            this.selectedAgent.animations.idle,
                            1.0,
                            this.selectedAgent.animations.attack,
                            1.3,
                            true,
                            0.05
                        )
                    );
                    this.soundManager.playSound("bulletFire");
            
                    console.log("Agent is now facing the target",this.selectedAgent.visualMesh);

                    // Assuming this.selectedAgent.visualMesh is the parent mesh
                    const nozzMesh = this.selectedAgent.visualMesh.getChildMeshes().find(mesh => mesh.name === "Clone of nozz");

                    if (nozzMesh) {
                        console.log("Found nozz mesh:", nozzMesh);
                        // You can now use nozzMesh for further operations
                        this.bulletSystem.triggerMuzzleFlash(nozzMesh as Mesh);
                    } else {
                        console.log("Nozz mesh not found");
                    
                    }


                    setTimeout(() => {
                        this.soundManager.stopSound("bulletFire")
                        this.scene.onBeforeRenderObservable.runCoroutineAsync(
                            this.animationBlending(
                                this.selectedAgent.animations.attack,
                                1.3,
                                this.selectedAgent.animations.idle,
                                1.0,
                                true,
                                0.05
                            )
                        );
                        // this.selectedAgent.navAgent.rotate(Axis.Y, Math.PI, Space.LOCAL);
                        // this.selectedAgent.visualMesh.rotate(Axis.Y, Math.PI, Space.LOCAL);
                        this.selectedAgent.navAgent.rotationQuaternion = originalRotation;
                        this.selectedAgent.visualMesh.rotationQuaternion = agentRotation;

                        this.getGui().handleAttack();

                        console.log("Stopping attack animation and returning to idle");
                    }, 3000); // 3000 milliseconds = 3 seconds
                } else {
                    console.log("Target agent or its navAgent not found");
                }
            }
            if(this.getGui().getAbilityMode() !== AbilityType.Attack){
                 this.selectedAgent = this.agents[mesh.metadata.agentIndex];
            }
           
        } else if (mesh.name.includes("ground") && this.selectedAgent && !this.getGui().getDeploymentMode()) {
            //console.log(this.getGui().getDeploymentMode())
            // const startingPoint = this.getGroundPosition();

        
            if (startingPoint) {
                this.pointNavPre.position = startingPoint;
                this.pointNavPre.visibility = 1;
                // Apply animation blending only to the selected agent


                    this.scene.onBeforeRenderObservable.runCoroutineAsync(
                        this.animationBlending(
                            this.selectedAgent.animations.idle,
                            1.0,
                            this.selectedAgent.animations.movement,
                            1.3,
                            true,
                            0.05
                        )
                    );

                this.crowd.agentGoto(this.selectedAgent.idx, this.navigationPlugin.getClosestPoint(startingPoint));
        
                if (this.selectedAgent.cUnitType === UnitType.Infantry){
                    this.soundManager.playSound("move");
                }

                this.activeUnitType = this.selectedAgent.cUnitType;
            }
        }else if (mesh.name.includes("ground") && this.getGui().getDeploymentMode()) {

            console.log("0.0.0.0...0.0..")

            const {unit: unitType, position} = this.getGui().getSelectedUnitAndDeployPosition();
            this.activePosition = startingPoint;

            const clickedRegion = this.getClickedRegion(startingPoint);
            console.log(`Clicked region: ${BattlefieldName[clickedRegion]}`);

            console.log(this.getGameState().player)

            const player_base = this.getGameState().player.home_base;

            if (player_base === BattlefieldName[clickedRegion]){

                const encodedPosition= positionEncoder(startingPoint);
                const unit = unitTypeToInt(unitType);
                const  battlefieldId = battlefieldTypeToInt(clickedRegion);
                

                const deployInfo: Deploy = {
                    game_id: this.getGameState().game.game_id,
                    battlefield_id: battlefieldId,
                    unit: unit,
                    supply: 1,
                    x: encodedPosition.x,
                    y: encodedPosition.y,
                    z: encodedPosition.z,
                    terrain_num: 1,
                    cover_level: 50,
                    elevation: 0
                }

                try {
                    // Wait for the kickPlayer function to complete before hiding the infoPanel
                    await this.deployUnit(deployInfo);
                   
                } catch (error: any) {
                    this.getGui().showToast(error.message);
                }
    
                
               //a this.addAgent(unitType, startingPoint)
            }else{
                console.log("can not deploy here")
                this.getGui().showToast(`You can only delpy units from your base region ${player_base}`);
            }

            
            
            
        }

        
    }

    // private findClosestVertexToPosition(clickedPosition) {
    //     let closestIndex = -1;
    //     let closestDistanceSq = Number.MAX_VALUE;

    //     for (let i = 0; i < this.navMeshIndices.length; i += 3) {
    //         const vertexPosition = new Vector3(
    //             this.navMeshIndices[i],
    //             this.navMeshIndices[i + 1],
    //             this.navMeshIndices[i + 2]
    //         );
    //         const distanceSq = Vector3.DistanceSquared(clickedPosition, vertexPosition);

    //         if (distanceSq < closestDistanceSq) {
    //             closestDistanceSq = distanceSq;
    //             closestIndex = i / 3;

    //             // Break early if we're close enough
    //             if (distanceSq <= this.threshold * this.threshold) {
    //                 break;
    //             }
    //         }
    //     }

    //     if (closestIndex === -1) {
    //         console.warn("No vertex found within the threshold distance.");
    //         return null;
    //     }

    //     return {
    //         index: closestIndex,
    //         position: new Vector3(
    //             this.navMeshIndices[closestIndex * 3],
    //             this.navMeshIndices[closestIndex * 3 + 1],
    //             this.navMeshIndices[closestIndex * 3 + 2]
    //         ),
    //         distance: Math.sqrt(closestDistanceSq)
    //     };
    // }

    highlightVertex(position) {
        if (this.highlightMesh) {
            this.highlightMesh.dispose();
        }

        this.highlightMesh = MeshBuilder.CreateSphere("highlight", { diameter: 0.1 }, this.navmeshdebug.getScene());
        this.highlightMesh.position = position;
        const material = new StandardMaterial("highlightMat", this.navmeshdebug.getScene());
        material.emissiveColor = new Color3(1, 0, 0);
        this.highlightMesh.material = material;
        
    }

    private setupRenderObservable(): void {
        this.scene.onBeforeRenderObservable.add(() => {
            this.agents.forEach(agent => {
                // New Agent Position
                agent.navAgent.position = this.crowd.getAgentPosition(agent.idx);
                let vel = this.crowd.getAgentVelocity(agent.idx);
                this.crowd.getAgentPositionToRef(agent.idx, agent.navAgent.position);
                
                if (vel.length() > 1) {
                    // New Agent Rotation
                    vel.normalize();
                    let desiredRotation = Math.atan2(vel.x, vel.z);
                    agent.navAgent.rotation.y = agent.navAgent.rotation.y + (desiredRotation - agent.navAgent.rotation.y);
                }
            });
        });
    }

    private getGroundPosition(): Vector3 | null {
        const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
        return pickinfo.hit ? pickinfo.pickedPoint : null;
    }

    private* animationBlending(fromAnim: any, fromAnimSpeedRatio: any, toAnim: any, toAnimSpeedRatio: any, repeat: any, animationBlendingSpeed: any)
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

    private getElevationAtPosition(position: Vector3): number {
        // Create a ray starting from the position and pointing downwards
        const ray = new Ray(position, new Vector3(0, -1, 0));
        const pickResult = this.scene.pickWithRay(ray);
    
        if (pickResult.hit) {
            // If the ray hits a mesh, return the Y position (elevation)
            return pickResult.pickedPoint.y;
        }
        return 0; // Return 0 if there's no hit
    }

    private getCoverLevel(unitPosition: Vector3): number {
        // Define your logic to determine cover level
        let coverLevel = 0;
    
        // Example logic: Check for nearby objects to determine cover
        const objects = this.scene.meshes; // Assuming all your objects are in the scene
    
        // Check surrounding objects within a certain radius
        const radius = 5; // Define your radius for checking cover
        objects.forEach((mesh) => {
            if (mesh instanceof AbstractMesh) {
                const distance = Vector3.Distance(unitPosition, mesh.position);
                if (distance < radius) {
                    // Calculate cover level based on distance or other criteria
                    // For simplicity, let's say objects provide a fixed cover level
                    coverLevel += 20; // Increase cover level based on proximity
                }
            }
        });
    
        // Cap the cover level at 100
        return Math.min(coverLevel, 100);
    }
    
    private getDistanceBetweenMeshes(mesh1: Mesh, mesh2: Mesh) {
        // Get the world position of each mesh
        let position1 = mesh1.getAbsolutePosition();
        let position2 = mesh2.getAbsolutePosition();
        
        // Calculate the distance
        let distance = Vector3.Distance(position1, position2);
        
        return distance;
      }

      private detectPlayerObstructions(playerMesh, radius, rayCount) {
        const obstructions = [];
        const origin = playerMesh.position.clone();
        origin.y += 2; // Slightly above the ground to avoid self-intersection
    
        let currentObstruction = null;
        let obstructionCache = new Set(); // Cache for already detected obstructions
    
        const stepAngle = 360 / rayCount; // Precompute step angle
    
        // Loop through rays, with dynamic step size
        for (let i = 0; i <= rayCount; i++) {
            const angle = i * stepAngle; // Simplified angle calculation
            const direction = new Vector3(
                Math.sin(Tools.ToRadians(angle)),
                0,
                Math.cos(Tools.ToRadians(angle))
            );
    
            // Use bounding volumes first for a fast check
            const ray = new Ray(origin, direction, radius);
            const hit = this.fastBoundingBoxCheck(ray); // Fast check before exact ray-picking
    
            if (hit) {
                if (!obstructionCache.has(hit.pickedMesh)) { // Avoid recalculating the same obstructions
                    obstructionCache.add(hit.pickedMesh); // Cache the obstruction
    
                    if (currentObstruction === null) {
                        currentObstruction = [angle];
                    }
                }
            } else {
                if (currentObstruction !== null) {
                    currentObstruction.push(angle);
                    obstructions.push(currentObstruction);
                    this.createObstructionMesh(currentObstruction, playerMesh, radius); // Create mesh for obstruction
                    currentObstruction = null;
                }
            }
        }
    
        // Handle obstruction that wraps around 360 degrees
        if (currentObstruction !== null) {
            if (obstructions.length > 0 && obstructions[0][0] === 0) {
                obstructions[0][0] = currentObstruction[0];
            } else {
                currentObstruction.push(360);
                obstructions.push(currentObstruction);
                this.createObstructionMesh(currentObstruction, playerMesh, radius); // Create mesh for obstruction
            }
        }
    
        return obstructions;
    }
    
    // A fast bounding box check to pre-filter unnecessary ray picks
    private fastBoundingBoxCheck(ray) {
        const meshesInScene = this.scene.meshes; // All meshes in the scene
    
        for (const mesh of meshesInScene) {
            if (ray.intersectsMesh(mesh, true)) {
                // Perform exact ray-picking only if a fast bounding box check hits
                return this.scene.pickWithRay(ray); // Exact ray pick
            }
        }
        return null; // No hit
    }
    

    private createObstructionMesh(obstruction, playerMesh, radius) {
        const [startAngle, endAngle] = obstruction;
        const sliceAngle = endAngle - startAngle;
    
        // Create a pie slice for obstruction using MeshBuilder.CreateDisc
        const slice = MeshBuilder.CreateDisc("obstructionSlice", {
            radius: radius,
            tessellation: 3, // Low tessellation to create a "slice" effect
            arc: sliceAngle  // Define arc based on the obstruction angle
        }, this.scene);
    
        // Position the slice at the player's position
        slice.position = playerMesh.position.clone();
        slice.position.y += 0.01; // Slightly above the ground to avoid z-fighting
    
        // Set the disc to be flat on the ground (in the XZ plane)
        slice.rotation.x = Math.PI / 2; // Rotate 90 degrees to lay flat
        // slice.rotation.z = Math.PI / 2; 
    
        // Adjust the rotation.y to point towards the midpoint of the obstruction
        const midpointAngle = startAngle + (sliceAngle / 2); // Midpoint between start and end angle
        slice.rotation.y = Tools.ToRadians(midpointAngle); // Rotate the slice towards the correct obstruction direction
    
        // Make the mesh red and semi-transparent
        const redMaterial = new StandardMaterial("redMat", this.scene);
        redMaterial.diffuseColor = new Color3(1, 0, 0); // Red color
        redMaterial.alpha = 0.5; // Semi-transparent
        slice.material = redMaterial;
    }

    private areVerticesOnStraightLine(indexA, indexB) {
        const pointA = new Vector3(
            this.navMeshIndices[indexA * 3],
            this.navMeshIndices[indexA * 3 + 1],
            this.navMeshIndices[indexA * 3 + 2]
        );
        const pointB = new Vector3(
            this.navMeshIndices[indexB * 3],
            this.navMeshIndices[indexB * 3 + 1],
            this.navMeshIndices[indexB * 3 + 2]
        );

        // Vector from A to B
        const vectorAB = pointB.subtract(pointA);
        const directionAB = Vector3.Normalize(vectorAB);

        // Check all points between A and B
        const start = Math.min(indexA, indexB);
        const end = Math.max(indexA, indexB);

        for (let i = start + 1; i < end; i++) {
            const point = new Vector3(
                this.navMeshIndices[i * 3],
                this.navMeshIndices[i * 3 + 1],
                this.navMeshIndices[i * 3 + 2]
            );

            // Vector from A to current point
            const vectorAP = point.subtract(pointA);

            // Check if AP is parallel to AB
            const cross = Vector3.Cross(vectorAP, directionAB);
            if (cross.length() > this.epsilon) {
                return false; // Not on the same line
            }

            // Check if point is between A and B
            const dot = Vector3.Dot(vectorAP, directionAB);
            if (dot < 0 || dot > vectorAB.length()) {
                return false; // Point is not between A and B
            }
        }

        return true; // All points are on the same line
    }

    private findClosestVertexIndex(point) {
        let closestIndex = -1;
        let closestDistanceSq = Number.MAX_VALUE;

        for (let i = 0; i < this.navMeshIndices.length; i += 3) {
            const vertexPosition = new Vector3(
                this.navMeshIndices[i],
                this.navMeshIndices[i + 1],
                this.navMeshIndices[i + 2]
            );
            const distanceSq = Vector3.DistanceSquared(point, vertexPosition);

            if (distanceSq < closestDistanceSq) {
                closestDistanceSq = distanceSq;
                closestIndex = i / 3;
            }
        }

        return closestIndex;
    }

    private isStraightLineContinuous(startPoint, endPoint) {
        const startIndex = this.findClosestVertexIndex(startPoint);
        const endIndex = this.findClosestVertexIndex(endPoint);

        const start = new Vector3(
            this.navMeshIndices[startIndex * 3],
            this.navMeshIndices[startIndex * 3 + 1],
            this.navMeshIndices[startIndex * 3 + 2]
        );
        const end = new Vector3(
            this.navMeshIndices[endIndex * 3],
            this.navMeshIndices[endIndex * 3 + 1],
            this.navMeshIndices[endIndex * 3 + 2]
        );

        const direction = end.subtract(start).normalize();
        const length = Vector3.Distance(start, end);

        // Check all triangles for intersection
        for (let i = 0; i < this.indices.length; i += 3) {
            const v1 = new Vector3(
                this.navMeshIndices[this.indices[i] * 3],
                this.navMeshIndices[this.indices[i] * 3 + 1],
                this.navMeshIndices[this.indices[i] * 3 + 2]
            );
            const v2 = new Vector3(
                this.navMeshIndices[this.indices[i + 1] * 3],
                this.navMeshIndices[this.indices[i + 1] * 3 + 1],
                this.navMeshIndices[this.indices[i + 1] * 3 + 2]
            );
            const v3 = new Vector3(
                this.navMeshIndices[this.indices[i + 2] * 3],
                this.navMeshIndices[this.indices[i + 2] * 3 + 1],
                this.navMeshIndices[this.indices[i + 2] * 3 + 2]
            );

            const intersection = this.rayTriangleIntersection(start, direction, v1, v2, v3);
            if (intersection && intersection.distanceTo(start) <= length) {
                // Check if the intersection point is actually on an edge of the triangle
                if (!this.isPointOnTriangleEdge(intersection, v1, v2, v3)) {
                    return false; // Found a triangle that blocks the straight path
                }
            }
        }

        return true; // No blocking triangles found
    }

    public isPointInPolygon(point: Vector3, polygonPoints: Vector3[]): boolean {
        let inside = false;
        for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
            const xi = polygonPoints[i].x, yi = polygonPoints[i].z;
            const xj = polygonPoints[j].x, yj = polygonPoints[j].z;
            
            const intersect = ((yi > point.z) !== (yj > point.z))
                && (point.x < (xj - xi) * (point.z - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    public getClickedRegion(clickPosition: Vector3): BattlefieldName {
        for (const region of regions) {
            if (this.isPointInPolygon(clickPosition, region.points)) {
                return region.name;
            }
        }
        return BattlefieldName.None;
    }
    

    private rayTriangleIntersection(rayOrigin, rayDirection, v1, v2, v3) {
        const edge1 = v2.subtract(v1);
        const edge2 = v3.subtract(v1);
        const h = Vector3.Cross(rayDirection, edge2);
        const a = Vector3.Dot(edge1, h);

        if (a > -this.epsilon && a < this.epsilon) return null;

        const f = 1.0 / a;
        const s = rayOrigin.subtract(v1);
        const u = f * Vector3.Dot(s, h);

        if (u < 0.0 || u > 1.0) return null;

        const q = Vector3.Cross(s, edge1);
        const v = f * Vector3.Dot(rayDirection, q);

        if (v < 0.0 || u + v > 1.0) return null;

        const t = f * Vector3.Dot(edge2, q);

        if (t > this.epsilon) {
            return rayOrigin.add(rayDirection.scale(t));
        }

        return null;
    }

    private isPointOnTriangleEdge(point, v1, v2, v3) {
        const onEdge1 = this.isPointOnLineSegment(point, v1, v2);
        const onEdge2 = this.isPointOnLineSegment(point, v2, v3);
        const onEdge3 = this.isPointOnLineSegment(point, v3, v1);
        return onEdge1 || onEdge2 || onEdge3;
    }

    private isPointOnLineSegment(point, start, end) {
        const d1 = Vector3.Distance(point, start);
        const d2 = Vector3.Distance(point, end);
        const length = Vector3.Distance(start, end);
        return Math.abs(d1 + d2 - length) < this.epsilon;
    }

    private visualizePath(startPoint, endPoint) {
        const lines = [startPoint, endPoint];
        const linesMesh = MeshBuilder.CreateLines("path", {points: lines}, this.navmeshdebug.getScene());
        linesMesh.color = new Color3(0, 1, 0); // Green line for continuous path
        return linesMesh;
    }

    private raycastWithCollisionCheck(startPoint: Vector3, endPoint: Vector3, minHeightAboveGround: number = 0.1): { hit: boolean, hitPoint: Vector3 | null, path: Vector3[] } {
        const direction = endPoint.subtract(startPoint).normalize();
        const length = Vector3.Distance(startPoint, endPoint);
    
        let currentPoint = startPoint.clone();
        const path: Vector3[] = [currentPoint];
    
        const stepSize = 0.1; // Adjust this value to change the precision of the check
        let distanceTraveled = 0;
    
        while (distanceTraveled < length) {
            const nextPoint = currentPoint.add(direction.scale(stepSize));
            
            // Ensure the point is above the minimum height
            const groundPoint = this.findGroundPoint(nextPoint);
            if (groundPoint) {
                nextPoint.y = Math.max(nextPoint.y, groundPoint.y + minHeightAboveGround);
            }
    
            // Check for collision
            const collision = this.checkCollision(currentPoint, nextPoint);
            if (collision) {
                return { hit: true, hitPoint: collision, path };
            }
    
            currentPoint = nextPoint;
            path.push(currentPoint);
            distanceTraveled += stepSize;
        }
    
        return { hit: false, hitPoint: null, path };
    }
    
    private findGroundPoint(point: Vector3): Vector3 | null {
        const rayOrigin = new Vector3(point.x, point.y + 1000, point.z); // Start high above the point
        const rayDirection = new Vector3(0, -1, 0); // Straight down
    
        for (let i = 0; i < this.indices.length; i += 3) {
            const v1 = new Vector3(
                this.navMeshIndices[this.indices[i] * 3],
                this.navMeshIndices[this.indices[i] * 3 + 1],
                this.navMeshIndices[this.indices[i] * 3 + 2]
            );
            const v2 = new Vector3(
                this.navMeshIndices[this.indices[i + 1] * 3],
                this.navMeshIndices[this.indices[i + 1] * 3 + 1],
                this.navMeshIndices[this.indices[i + 1] * 3 + 2]
            );
            const v3 = new Vector3(
                this.navMeshIndices[this.indices[i + 2] * 3],
                this.navMeshIndices[this.indices[i + 2] * 3 + 1],
                this.navMeshIndices[this.indices[i + 2] * 3 + 2]
            );
    
            const intersection = this.rayTriangleIntersection(rayOrigin, rayDirection, v1, v2, v3);
            if (intersection) {
                return intersection;
            }
        }
    
        return null;
    }
    
    private checkCollision(start: Vector3, end: Vector3): Vector3 | null {
        const direction = end.subtract(start).normalize();
        const length = Vector3.Distance(start, end);
    
        for (let i = 0; i < this.indices.length; i += 3) {
            const v1 = new Vector3(
                this.navMeshIndices[this.indices[i] * 3],
                this.navMeshIndices[this.indices[i] * 3 + 1],
                this.navMeshIndices[this.indices[i] * 3 + 2]
            );
            const v2 = new Vector3(
                this.navMeshIndices[this.indices[i + 1] * 3],
                this.navMeshIndices[this.indices[i + 1] * 3 + 1],
                this.navMeshIndices[this.indices[i + 1] * 3 + 2]
            );
            const v3 = new Vector3(
                this.navMeshIndices[this.indices[i + 2] * 3],
                this.navMeshIndices[this.indices[i + 2] * 3 + 1],
                this.navMeshIndices[this.indices[i + 2] * 3 + 2]
            );
    
            const intersection = this.rayTriangleIntersection(start, direction, v1, v2, v3);
            if (intersection && Vector3.Distance(start, intersection) <= length) {
                return intersection;
            }
        }
    
        return null;
    }
    
    private visualizeRaycast(path: Vector3[], hit: boolean, hitPoint: Vector3 | null) {
        const scene = this.navmeshdebug.getScene();
        const pathMesh = MeshBuilder.CreateLines("path", {points: path}, scene);
        pathMesh.color = hit ? new Color3(1, 0, 0) : new Color3(0, 1, 0); // Red if hit, Green if clear
    
        if (hitPoint) {
            const hitMarker = MeshBuilder.CreateSphere("hitMarker", {diameter: 0.2}, scene);
            hitMarker.position = hitPoint;
            const material = new StandardMaterial("hitMarkerMat", scene);
            material.emissiveColor = new Color3(1, 0, 0);
            hitMarker.material = material;
        }
    
        return pathMesh;
    }

    private deployUnit = async (deploy: Deploy) => {
        try {
    
          const result  = await this.nexus.deploy_forces(this.getAccount(), deploy.game_id, deploy.battlefield_id,deploy.unit, 1,deploy.x,deploy.y,deploy.z,deploy.terrain_num,deploy.cover_level,deploy.elevation);
          console.log(result)

          if (result?.message) {
            const match = result.message.match(/Failure reason: 0x[0-9a-f]+\s\(([^)]+)\)/i);
            if (match && match[1]) {
                // Remove single quotes from the extracted error message
                const cleanedMessage = match[1].replace(/['"]+/g, '');
                
                // readable message like "Turn Timeout" without quotes
                this.getGui().showToast(cleanedMessage, ToastType.Error);

                this.getGui().handleDeployement();
            }
        }

        if (result?.execution_status) {
            
            if (result?.execution_status === 'SUCCEEDED') {
                // Remove single quotes from the extracted error message
                const cleanedMessage = `Deployed ${numberToUnitType(deploy.unit)}`;
                
                // readable message like "Turn Timeout" without quotes
                this.getGui().showToast(cleanedMessage, ToastType.Success);
            }
        }
        

        } catch (error: any) {
          this.getGui().showToast(error.message);
        } finally {
          
        }
      };

      private addUnits() {
        this.scene.onBeforeRenderObservable.add(() => {
           // console.log('Current Infantry Units:', this.scene.metadata.infantryUnits);
            if (this.scene.metadata && Array.isArray(this.scene.metadata.infantryUnits) && this.crowd) {
               // console.log('Current Infantry Units:', this.scene.metadata.infantryUnits);
                
                this.scene.metadata.infantryUnits.forEach(unitData => {
                    if (!this.infantryUnits.has(unitData.unit_id) ) {
                        // This is a new unit
                       console.log('New infantry unit detected:', unitData);
                        this.infantryUnits.set(unitData.unit_id, unitData);
                        this.handleNewInfantryUnit(unitData);
                    } else {
                        // Update existing unit data
                        this.infantryUnits.set(unitData.unit_id, unitData);
                    }
                });

                // Optionally, remove units that no longer exist in the metadata
                this.removeNonExistentUnits();

               // console.log('Updated infantryUnits Map:', this.infantryUnits);
            }

            if (this.scene.metadata && Array.isArray(this.scene.metadata.armoredUnits) && this.crowd) {
                // console.log('Current Infantry Units:', this.scene.metadata.infantryUnits);
                 
                 this.scene.metadata.armoredUnits.forEach(unitData => {
                     if (!this.armoredUnits.has(unitData.unit_id) ) {
                         // This is a new unit
                        console.log('New Armored unit detected:', unitData);
                         this.armoredUnits.set(unitData.unit_id, unitData);
                         this.handleNewArmoredUnit(unitData);
                     } else {
                         // Update existing unit data
                         this.armoredUnits.set(unitData.unit_id, unitData);
                     }
                 });
 
                 // Optionally, remove units that no longer exist in the metadata
                 this.removeNonExistentArmoredUnits();
 
                // console.log('Updated infantryUnits Map:', this.infantryUnits);
             }

        });
    }

    private handleNewInfantryUnit(unitData: Infantry) {

        const x = bigintToU256(unitData.position.coord.x)
        const y = bigintToU256(unitData.position.coord.y)
        const z = bigintToU256(unitData.position.coord.z)

        const pos: EncodedVector3 = {x,y,z}

        const startingPoint = positionDecoder(pos)
        console.log(startingPoint)

        console.log(".............",this.crowd)


        this.addAgent(UnitType.Infantry, startingPoint,unitData)
        // Perform operations for new units here
        // For example:
        // - Create a 3D model for the unit
        // - Set up event listeners
        // - Initialize unit-specific logic
     //   console.log('Performing operations for new unit:', unitData);
        // Add your custom logic here
    }

    private handleNewArmoredUnit(unitData: Armored) {

        const x = bigintToU256(unitData.position.coord.x)
        const y = bigintToU256(unitData.position.coord.y)
        const z = bigintToU256(unitData.position.coord.z)

        const pos: EncodedVector3 = {x,y,z}

        const startingPoint = positionDecoder(pos)
        console.log(startingPoint)

        console.log(".............",this.crowd)


        this.addAgent(UnitType.Armored, startingPoint,unitData)
        // Perform operations for new units here
        // For example:
        // - Create a 3D model for the unit
        // - Set up event listeners
        // - Initialize unit-specific logic
     //   console.log('Performing operations for new unit:', unitData);
        // Add your custom logic here
    }

    private removeNonExistentUnits() {
        const currentUnitIds = new Set(this.scene.metadata.infantryUnits.map(u => u.unit_id));
        for (const [id, unit] of this.infantryUnits) {
            if (!currentUnitIds.has(id)) {
                this.infantryUnits.delete(id);
                console.log('Removed non-existent unit:', unit);
                // Perform any cleanup operations for removed units here
            }
        }
    }

    private removeNonExistentArmoredUnits() {
        const currentUnitIds = new Set(this.scene.metadata.armoredUnits.map(u => u.unit_id));
        for (const [id, unit] of this.armoredUnits) {
            if (!currentUnitIds.has(id)) {
                this.armoredUnits.delete(id);
                console.log('Removed non-existent unit:', unit);
                // Perform any cleanup operations for removed units here
            }
        }
    }

    // Method to get all current infantry units
    public getInfantryUnits(): any[] {
        return Array.from(this.infantryUnits.values());
    }

    // Method to get a specific infantry unit by ID
    public getInfantryUnit(id: string): any | undefined {
        return this.infantryUnits.get(id);
    }
 
}

export { NexusUnitManager };