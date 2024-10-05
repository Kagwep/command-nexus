import { AbstractMesh, ActionManager, AnimationGroup, Color3, ExecuteCodeAction, GroundMesh, Mesh, PointerEventTypes, RecastJSPlugin, Scalar, Scene, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';


type UnitType = 'infantry' | 'armored';

interface MeshN extends Mesh {
    idx?: number;
  }

interface Unit {
    transform: TransformNode;
    mesh: Mesh;
    agentIndex: number;
    type: UnitType;
    idleAnim?: AnimationGroup;
    walkAnim?: AnimationGroup;
}

export default class SceneNavigation {
    private scene: Scene;
    private navigationPlugin: RecastJSPlugin;
    private ground: Mesh;
    private pointNavPre: GroundMesh;
    private navmeshdebug: Mesh;
    private crowd: any;
    private units: Unit[] = [];
    private originalUnits: Record<UnitType, TransformNode> = {} as Record<UnitType, TransformNode>;
    private selectedUnit: Unit | null = null;
    private highlightMaterial: StandardMaterial;
    private tank;
    private soldier;

    constructor(
        scene: Scene,
        navigationPlugin: RecastJSPlugin,
        ground: Mesh,
        pointNavPre: GroundMesh,
        infatryNode:TransformNode,
        armoredUnit: TransformNode,
        tank: AbstractMesh,
        soldier: AbstractMesh

    ) {
        this.scene = scene;
        this.navigationPlugin = navigationPlugin;
        this.ground = ground;
        this.pointNavPre = pointNavPre;

        this.highlightMaterial = new StandardMaterial("highlightMaterial", this.scene);
        this.highlightMaterial.emissiveColor = new Color3(0.5, 0.5, 0);

        this.originalUnits['armored'] = armoredUnit;
        this.originalUnits['infantry'] = infatryNode;

        this.tank = tank as MeshN;
        this.soldier = soldier as  MeshN;

        this.setupNavigation();
    }

    private setupNavigation(): void {
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
        };
        this.navigationPlugin.createNavMesh([this.ground], navmeshParameters,(navmeshData) =>
            {
                this.navigationPlugin.buildFromNavmeshData(navmeshData);
                this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.scene);
                this.navmeshdebug.name = "ground";
                this.navmeshdebug.position = new Vector3(0, 0.01, 0);
                var matdebug = new StandardMaterial('matdebug', this.scene);
                matdebug.diffuseColor = new Color3(0.1, 0.2, 1);
                matdebug.alpha = 0.5;
                this.navmeshdebug.material = matdebug;
                this.navmeshdebug.visibility = 0.15;

                console.log(this.navmeshdebug)
                
                // Badge Information Ready to Navigate
                setTimeout(() => {
                    // var badgeInfo = document.getElementById("badge");
                    // badgeInfo.innerHTML = " Toggle NavMesh";
                    console.log("RECAST Loaded");
                }, 300);
                

          
                // Setup Navigation Plugin using one Player
                var crowd = this.navigationPlugin.createCrowd(1, 0.1, this.scene);
          
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
                var position = this.navigationPlugin.getClosestPoint(new Vector3(0, 0, 0));
          
                // Add Agent
                var agentIndex = crowd.addAgent(position, agentParams, this.originalUnits['armored']);
                this.tank.idx = agentIndex; 
          
                // Hide Point Nav
                this.pointNavPre.visibility = 0;
          
                // Detecting Navigation Point Position
                var startingPoint;
                var getGroundPosition = function () {
                    var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
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
                    this.pointNavPre.position = startingPoint as Vector3;
                    this.pointNavPre.visibility = 1;
                    var agents = crowd.getAgents();
                    var i;
          
                    for (i=0;i<agents.length;i++) {
                        if (this.currentAnim == idleAnim)
                        {
                            // Start Player Walk Animation
                            //currentAnim = walkAnim;
                            
                            this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(idleAnim, 1.0, walkAnim, 1.3, true, 0.05));
                        }
                        crowd.agentGoto(agents[i], this.navigationPlugin.getClosestPoint(startingPoint as Vector3));
                    }
                }
                
                // On Point Observable
                this.scene.onPointerObservable.add((pointerInfo) => {      		
                    switch (pointerInfo.type) {
                        case PointerEventTypes.POINTERTAP:
                            if(pointerInfo.pickInfo && pointerInfo.pickInfo.hit) {
                                pointerTap(pointerInfo.pickInfo.pickedMesh as Mesh)
                            }
                            break;
                    }
                });
          
                // Crowd On Before Render Observable
                this.scene.onBeforeRenderObservable.add(()=> {
                    // New Player Position
                    this.originalUnits['armored'].position = crowd.getAgentPosition(this.tank.idx as number);
                    let vel = crowd.getAgentVelocity(this.tank.idx as number);
                    crowd.getAgentPositionToRef(this.tank.idx as number, this.originalUnits['armored'].position);
                    if (vel.length() > 1)
                    {
                        // New Player Rotation
                        vel.normalize();
                        var desiredRotation = Math.atan2(vel.x, vel.z);
                        this.originalUnits['armored'].rotation.y = this.originalUnits['armored'].rotation.y + (desiredRotation - this.originalUnits['armored'].rotation.y);    
                    }
                });
          
                const idleAnim = this.scene!.getAnimationGroupByName("Tank_Idle");
                const walkAnim = this.scene!.getAnimationGroupByName("Tank_Movement");
                idleAnim?.start(true);
                
          
                // Crowd On Reach Target Observable
                crowd.onReachTargetObservable.add((agentInfos: any) => {
                    console.log("agent reach destination");
                    //currentAnim = idleAnim;
                   
                    this.scene.onBeforeRenderObservable.runCoroutineAsync(this.animationBlending(walkAnim, 1.3, idleAnim, 1.0, true, 0.05));
                    this.pointNavPre.visibility = 0;
                });
          
                console.log("....................",this.originalUnits['armored'])
          
            });
    }

    private createDebugNavMesh(): void {
        this.navmeshdebug = this.navigationPlugin.createDebugNavMesh(this.scene);
        this.navmeshdebug.name = "ground";
        this.navmeshdebug.position = new Vector3(0, 0.01, 0);
        const matdebug = new StandardMaterial('matdebug', this.scene);
        matdebug.diffuseColor = new Color3(0.1, 0.2, 1);
        matdebug.alpha = 1;
        this.navmeshdebug.material = matdebug;
        this.navmeshdebug.visibility = 0.15;
    }

    public setOriginalUnit(type: UnitType, transform: TransformNode): void {
        this.originalUnits[type] = transform;
    }

    private getAgentParameters(type: UnitType): any {
        if (type === 'infantry') {
            return {
                radius: 0.2,
                height: 1.8,
                maxAcceleration: 40.0,
                maxSpeed: 3,
                collisionQueryRange: 0.5,
                pathOptimizationRange: 0.2,
                separationWeight: 1.0
            };
        } else { // armored
            return {
                radius: 0.5,
                height: 2.5,
                maxAcceleration: 30.0,
                maxSpeed: 2,
                collisionQueryRange: 0.8,
                pathOptimizationRange: 0.4,
                separationWeight: 1.5
            };
        }
    }

    public deployUnit(type: UnitType, position: Vector3): TransformNode {
        const originalTransform = this.originalUnits[type];
        if (!originalTransform) {
            throw new Error(`No original unit set for type: ${type}`);
        }

        const clonedTransform = originalTransform.clone(`${type}_${this.units.length}`, null, true) as TransformNode;
        clonedTransform.position = position;

        const clonedMesh = (originalTransform.getChildMeshes()[0] as Mesh).clone(`${type}_mesh_${this.units.length}`, clonedTransform);

        const agentParams = this.getAgentParameters(type);
        const navPosition = this.navigationPlugin.getClosestPoint(position);
        const agentIndex = this.crowd.addAgent(navPosition, agentParams, clonedTransform);

        const unit: Unit = { 
            transform: clonedTransform, 
            mesh: clonedMesh, 
            agentIndex, 
            type,
            idleAnim: this.scene.getAnimationGroupByName(`${type}_Idle`),
            walkAnim: this.scene.getAnimationGroupByName(`${type}_Movement`)
        };
        this.units.push(unit);

        // Add click event to select unit
        clonedMesh.actionManager = new ActionManager(this.scene);
        clonedMesh.actionManager.registerAction(
            new ExecuteCodeAction(
                ActionManager.OnPickTrigger,
                () => this.selectUnit(unit)
            )
        );

        // Start idle animation
        unit.idleAnim?.start(true);

        return clonedTransform;
    }

    private selectUnit(unit: Unit): void {
        if (this.selectedUnit) {
            this.selectedUnit.mesh.material = null; // Reset previous selection
        }
        this.selectedUnit = unit;
        unit.mesh.material = this.highlightMaterial;
    }

    private setupPointerObservable(): void {
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERTAP && pointerInfo.pickInfo && pointerInfo.pickInfo.hit) {
                this.handlePointerTap(pointerInfo.pickInfo.pickedMesh as Mesh, pointerInfo.pickInfo.pickedPoint);
            }
        });
    }

    private handlePointerTap(mesh: Mesh, position: Vector3): void {
        if (!mesh.name.includes("ground")) return;

        if (this.selectedUnit) {
            this.pointNavPre.position = position;
            this.pointNavPre.visibility = 1;
            
            const targetPoint = this.navigationPlugin.getClosestPoint(position);
            this.crowd.agentGoto(this.selectedUnit.agentIndex, targetPoint);

            // Start walk animation
            if (this.selectedUnit.idleAnim && this.selectedUnit.walkAnim) {
                this.scene.onBeforeRenderObservable.runCoroutineAsync(
                    this.animationBlending(this.selectedUnit.idleAnim, 1.0, this.selectedUnit.walkAnim, 1.3, true, 0.05)
                );
            }
        }
    }

    private setupRenderObservable(): void {
        this.scene.onBeforeRenderObservable.add(() => {
            this.units.forEach(unit => {
                unit.transform.position = this.crowd.getAgentPosition(unit.agentIndex);
                const vel = this.crowd.getAgentVelocity(unit.agentIndex);
                if (vel.length() > 0.1) {
                    vel.normalize();
                    const desiredRotation = Math.atan2(vel.x, vel.z);
                    unit.transform.rotation.y = Scalar.Lerp(unit.transform.rotation.y, desiredRotation, 0.1);
                }
            });
        });
    }

    private setupReachTargetObservable(): void {
        this.crowd.onReachTargetObservable.add((agentIndex: number) => {
            console.log(`Agent ${agentIndex} reached destination`);
            this.pointNavPre.visibility = 0;

            const unit = this.units.find(u => u.agentIndex === agentIndex);
            if (unit && unit.idleAnim && unit.walkAnim) {
                this.scene.onBeforeRenderObservable.runCoroutineAsync(
                    this.animationBlending(unit.walkAnim, 1.3, unit.idleAnim, 1.0, true, 0.05)
                );
            }
        });
    }

    private *animationBlending(
        fromAnim: AnimationGroup,
        fromAnimSpeedRatio: number,
        toAnim: AnimationGroup,
        toAnimSpeedRatio: number,
        loop: boolean,
        blendingSpeed: number
    ): Generator<void, void, unknown> {
        let currentWeight = 1;
        let newWeight = 0;
        toAnim.start(loop, toAnimSpeedRatio);
        fromAnim.stop();
        while (newWeight < 1) {
            newWeight += blendingSpeed;
            currentWeight -= blendingSpeed;
            toAnim.setWeightForAllAnimatables(newWeight);
            fromAnim.setWeightForAllAnimatables(currentWeight);
            yield;
        }
        fromAnim.stop();
    }
}