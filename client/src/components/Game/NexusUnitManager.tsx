import { Scene, Mesh, Vector3, GroundMesh, TransformNode, PointerEventTypes, StandardMaterial, Color3, AnimationGroup, AssetContainer, Ray, AbstractMesh } from '@babylonjs/core';
import { RecastJSPlugin } from '@babylonjs/core/Navigation/Plugins/recastJSPlugin';
import CommandNexusGui from './CommandNexusGui';
import { UnitType,UnitAssetContainers, Agent, AnimationMapping, AgentAnimations, UnitAnimations } from '../../utils/types';
import { soldierAnimationMapping, tankAnimationMapping } from '../../utils/nexus';

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

    constructor(
        scene: Scene, 
        navigationPlugin: RecastJSPlugin, 
        ground: Mesh, 
        pointNavPre: GroundMesh,
        getGui: () => CommandNexusGui,
        InfantryAssetContainer: AssetContainer,
        ArmoredAssetContainer: AssetContainer,
    ) {
        this.scene = scene;
        this.navigationPlugin = navigationPlugin;
        this.ground = ground;
        this.pointNavPre = pointNavPre;
        this.getGui= getGui;
        console.log(InfantryAssetContainer)
        this.unitAssets[UnitType.Infantry] = InfantryAssetContainer;
        this.unitAssets[UnitType.Armored] = ArmoredAssetContainer;
        this.unitAnimations = {
            [UnitType.Infantry]: soldierAnimationMapping,
            [UnitType.Armored]: tankAnimationMapping,
            [UnitType.Air]: { idle: ["Hover"], movement: ["Fly"], attack: ["Missile"] },
            [UnitType.Naval]: { idle: ["Float"], movement: ["Sail"], attack: ["Cannon"] },
            [UnitType.Cyber]: { idle: ["Standby"], movement: ["Transfer"], attack: ["Hack"] }
          };
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
        this.navmeshdebug.visibility = 0;
    }

    private setupCrowd(): void {
        const maxAgents = 10;
        this.crowd = this.navigationPlugin.createCrowd(maxAgents, 0.1, this.scene);

        this.crowd.onReachTargetObservable.add((agentInfos: any) => {
            console.log("Agent reached destination:", agentInfos.agentIndex);
            this.pointNavPre.visibility = 0;
            console.log(this.activeUnitType)
           // this.getGui().showActionsMenu(this.activeUnitType);
            const elevation = this.getElevationAtPosition(this.activePosition)
            const coverPosition = this.getCoverLevel(this.activePosition)
            console.log(elevation,coverPosition);
            // Implement stop walk animation here if needed
            //this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(this.selectedAgent.animations.movement, 1.3, this.selectedAgent.animations.idle, 1.0, true, 0.05));
        
            this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(this.selectedAgent.animations.movement, 1.3, this.selectedAgent.animations.idle, 1.0, true, 0.05));


        });
        console.log("called..............")
    }

    private addAgent(unitType: UnitType, position: Vector3): Agent {
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

        rootMesh.metadata = { agentIndex: this.agents.length };
        rootMesh.getChildMeshes().forEach(childMesh => {
            childMesh.metadata = { agentIndex: this.agents.length };
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
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERTAP && pointerInfo.pickInfo?.hit) {
                this.handlePointerTap(pointerInfo.pickInfo.pickedMesh as Mesh);
            }
        });
    }



    private handlePointerTap(mesh: Mesh): void {
        const startingPoint = this.getGroundPosition();
        if (mesh.metadata && mesh.metadata.agentIndex !== undefined) {
            this.selectedAgent = this.agents[mesh.metadata.agentIndex];
           
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
                this.activeUnitType = this.selectedAgent.cUnitType;
            }
        }else if (mesh.name.includes("ground") && this.getGui().getDeploymentMode()) {

            const {unit: unitType, position} = this.getGui().getSelectedUnitAndDeployPosition();
            this.activePosition = startingPoint;
            
            this.addAgent(unitType, startingPoint)
        }

        
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
    
    

    
}

export { NexusUnitManager };