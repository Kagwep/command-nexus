import { Scene, Vector3, AnimationGroup, TransformNode, SceneLoader, ISceneLoaderAsyncResult, Skeleton, Bone, Ray, IPhysicsCollisionEvent, PhysicsEventType, Mesh, Axis, RayHelper, Color3, DeepImmutable, MeshBuilder, Space } from '@babylonjs/core';

export enum InfantryAction {
    FireMainGun,
    FireSecondaryGun,
    DeploySmoke,
    UseRepairKit,
}

export default class InfantrySystem {
    private infantry: Mesh;
    private scene: Scene;
    private skeleton: Skeleton;
    private rotationBone: Bone;
    private animations: { [key: string]: AnimationGroup } = {};
    private currentAnimation: AnimationGroup | null = null;
    private animationsEnabled: boolean = true;
    private rotationAnimation: Animation;
    private moveSpeed: number = 2;
    private detectionRadius: number = 5;
    private navMesh: Mesh;
    private obstacleDetectionRange: number = 1;
    private targetPosition: Vector3 | null = null;
    private obstacles: Mesh[] = [];
    public infantryTransform: TransformNode;

    private nameList: string[] = ["Road_01", "Road_01.001", "Landscape_01", "EnergyRes_RenewablePlant_Wall_01", "EnergyRes_NaturalGasFacility_Wall_01","Water_01"];


    constructor(InfantryResult: ISceneLoaderAsyncResult, scene: Scene) {
        this.scene = scene;
        this.infantry = InfantryResult.meshes[0] as Mesh;
        this.skeleton = InfantryResult.skeletons[0];
        this.initializeTankPosition();
        this.loadAnimations(InfantryResult);
        this.setUpInfantry()
  

       
    }

    private setUpInfantry(){
        // Setup Player
        //this.infantry.isPickable = false;
        
        this.infantry.scaling = new Vector3(0.5, 0.5, 0.5);

        // Correct Rotation from Imported Model
        this.infantry.rotation = new Vector3(0, -Math.PI, 0);

        //

        this.infantry.rotate(Axis.Y, Math.PI, Space.LOCAL);

        const playerTransform = new TransformNode("infantry_root", this.scene);    
        this.infantry.parent = playerTransform;
        this.infantry.checkCollisions = true

        this.infantryTransform = playerTransform;

        const tankCollider = this.createTankCollider();
        tankCollider.parent = playerTransform;

       
    }

    private  createTankCollider = () => {
        // Compute the world matrix to include all transformations
        this.infantry.computeWorldMatrix(true);

        // Get the bounding info of the entire mesh hierarchy
        const boundingInfo = this.infantry.getHierarchyBoundingVectors(true);
        const dimensions = boundingInfo.max.subtract(boundingInfo.min);

        const collisionBox = MeshBuilder.CreateBox("infantryCollider", { 
          width: dimensions.x,
          height: dimensions.y,
          depth: dimensions.z
        }, this.scene);

        // Position the collision box to match the center of the infantry
        const center = boundingInfo.min.add(dimensions.scale(0.5));
        collisionBox.position = center;

        collisionBox.isVisible = false;
        collisionBox.checkCollisions = true;

        return collisionBox;
      };

    public infantryNode(){
        return this.infantryTransform
    }


    private checkNameUsingIncludes(name: string): boolean {
        //console.log(name, this.nameList.includes(name));
        return this.nameList.includes(name);
    }
    
    

    // Helper function to check if a position is blocked by an obstacle
    public isPositionBlocked(position) {
        const rayStart = new Vector3(position.x, 10, position.z);
        const rayEnd = new Vector3(position.x, -10, position.z);
        const ray = new Ray(rayStart, rayEnd.subtract(rayStart), 20);
        const pick = this.scene.pickWithRay(ray, (mesh) => mesh !== this.navMesh && mesh !== this.infantry && !this.checkNameUsingIncludes(mesh.name));
        console.log(pick)
        return pick.hit;
    }

    public getSteeringVector(currentPosition, targetPosition) {
        const direction = targetPosition.subtract(currentPosition);
        direction.y = 0; // Keep movement on the xz plane
        direction.normalize();

        const rayStart = currentPosition.add(new Vector3(0, 1, 0));
        const rayDirection = direction.scale(this.obstacleDetectionRange);
        const ray = new Ray(rayStart, rayDirection, this.obstacleDetectionRange);
        const pick = this.scene.pickWithRay(ray, (mesh) => mesh !== this.navMesh && mesh !== this.infantry && this.checkNameUsingIncludes(mesh.name));

        if (pick.hit) {
            // Calculate an avoidance vector using cross product or a more complex avoidance strategy
            const avoidanceVector = Vector3.Cross(Axis.Y, direction);
            const avoidanceSteer = avoidanceVector.normalize();
            return direction.add(avoidanceSteer.scale(0.5)); // Steer slightly away from obstacle
        }

        return direction;
    }

    public setTargetPosition(targetPosition: Vector3) {
        // Project the target position onto the navigation mesh
        const projectedPosition = this.projectOnNavMesh(targetPosition);
        this.targetPosition = projectedPosition;
    }

    public getTankPosition(){
        return this.infantry.position
    }

    public getTank(){
        return this.infantry
    }

    public getNavMesh(){
        return this.navMesh
    }

    private projectOnNavMesh(position: Vector3): Vector3 {
        const ray = new Ray(position.add(new Vector3(0, 100, 0)), new Vector3(0, -1, 0), 200);
        const pickInfo = this.navMesh.intersects(ray, false);
        if (pickInfo && pickInfo.pickedPoint) {
            return pickInfo.pickedPoint;
        }
        return position; // Return original position if no intersection found
    }

  
    private stopAnimation(animationName: string) {
        const animation = this.animations[animationName];
        if (animation && animation.isPlaying) {
            animation.stop();
        }
    }
    private checkCollision(newPosition: Vector3): boolean {
        // Simple ray casting for collision detection
        const ray = new Ray(newPosition, new Vector3(0, -1, 0), 1);
        const hit = this.scene.pickWithRay(ray);
        return hit && hit.hit && hit.pickedMesh !== this.infantry;
    }

    public correctPosition(steeringVector: DeepImmutable<Vector3>){
        this.infantry.position.addInPlace(steeringVector)
    }

    public avoidObstacles(currentPosition) {
        // Create a number of rays in front of the character in a fan-like fashion
        const rays = [];
        const numRays = 7; // Spread of rays for detecting obstacles around the front
        const angleSpread = Math.PI / 4; // Spread angle in radians (45 degrees total)
        const halfSpread = angleSpread / 2;

        for (let i = -halfSpread; i <= halfSpread; i += angleSpread / (numRays - 1)) {
            const rayDirection =  Vector3.RotationFromAxis(
                new Vector3(Math.sin(i), 0, Math.cos(i)), 
                Axis.Y, Axis.Z
            ).normalize().scale(this.obstacleDetectionRange);

            const rayStart = currentPosition.add(new Vector3(0, 1, 0));
            const ray = new Ray(rayStart, rayDirection, this.obstacleDetectionRange);
            rays.push(ray);
        }

        // Check if any rays hit an obstacle, and adjust direction accordingly
        let adjustmentVector = new Vector3(0,0,0);
        for (const ray of rays) {
            const pick = this.scene.pickWithRay(ray, (mesh) => mesh !== this.navMesh && mesh !== this.infantry && this.checkNameUsingIncludes(mesh.name));
            if (pick.hit) {
                // Create an avoidance adjustment vector (e.g., steer away from obstacle)
                const avoidanceDirection = Vector3.Cross(ray.direction, Axis.Y);
                adjustmentVector.addInPlace(avoidanceDirection);
            }
        }

        return adjustmentVector.normalize();
    }

    public rotateTurret(yaw: number) {
        // Assuming the rotation bone only controls yaw (left-right rotation)
        this.rotationBone.setRotation(new Vector3(0, yaw, 0));
        this.skeleton.prepare();
    }

    public aimAtTarget(target: Vector3) {
        const tankPosition = this.infantry.getAbsolutePosition();
        const direction = target.subtract(tankPosition);
        
        // Calculate yaw (rotation around Y-axis)
        const yaw = Math.atan2(direction.x, direction.z);
        
        this.rotateTurret(yaw);
    }

    private initializeTankPosition() {
        this.infantry.position = new Vector3(808.0254908309985, -0.08039172726103061, 770.1119890077115);
    }

    private loadAnimations(InfantryResult: ISceneLoaderAsyncResult) {
        InfantryResult.animationGroups.forEach(animGroup => {
            this.animations[animGroup.name] = animGroup;
        });
    }

    public performAction(action: InfantryAction) {
        switch (action) {
            case InfantryAction.FireMainGun:
                this.fireMainGun();
                break;
            case InfantryAction.FireSecondaryGun:
                this.fireSecondaryGun();
                break;
            case InfantryAction.DeploySmoke:
                this.deploySmoke();
                break;
            case InfantryAction.UseRepairKit:
                this.useRepairKit();
                break;
        }
    }



    private fireMainGun() {
        console.log("Firing main gun", );
        this.playAnimation('Tank_Attack');  // Assuming 'Tank_Attack' is appropriate for main gun
    }

    private fireSecondaryGun() {
        console.log("Firing secondary gun");
        this.playAnimation('Tank_Attack');  // You might want to use a different animation if available
    }

    private deploySmoke() {
        console.log("Deploying smoke");
        // You might want to add a specific smoke deployment animation if available
    }

    private useRepairKit() {
        console.log("Using repair kit");
        // You might want to add a specific repair animation if available
    }



    public moveTank(x: number, y: number, z: number) {
        this.infantry.position = new Vector3(x, y, z);
        this.playAnimation('Tank_Movement');
    }

    private playAnimation(animationName: string) {
        this.stopCurrentAnimation();
        const animation = this.animations[animationName];
        if (animation) {
            animation.start(true, 1.0); // Loop the animation
            this.currentAnimation = animation;
        } else {
            console.warn(`Animation "${animationName}" not found`);
        }
    }

    public getAnimationNames(): string[] {
        return Object.keys(this.animations);
    }

    public playAnimationByName(name: string) {
        this.playAnimation(name);
    }

    public stopCurrentAnimation() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
            this.currentAnimation = null;
        }
    }

    public stopAllAnimations() {
        Object.values(this.animations).forEach(animation => animation.stop());
        this.currentAnimation = null;
    }

    public setIdleAnimation() {
        this.playAnimation('Tank_Idle');
    }
}
