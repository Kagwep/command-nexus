import { Scene, Vector3, AnimationGroup, TransformNode, SceneLoader, ISceneLoaderAsyncResult, Skeleton, Bone } from '@babylonjs/core';

export enum ArmoredAction {
    FireMainGun,
    FireSecondaryGun,
    DeploySmoke,
    UseRepairKit,
}

export default class TankSystem {
    private tank: TransformNode;
    private scene: Scene;
    private skeleton: Skeleton;
    private rotationBone: Bone;
    private animations: { [key: string]: AnimationGroup } = {};
    private currentAnimation: AnimationGroup | null = null;
    private animationsEnabled: boolean = true;
    private rotationAnimation: Animation;
   


    constructor(armoredResult: ISceneLoaderAsyncResult, scene: Scene) {
        this.scene = scene;
        this.tank = armoredResult.meshes[0];
        this.skeleton = armoredResult.skeletons[0];
        this.initializeTankPosition();
        this.loadAnimations(armoredResult);
        this.findRotationBone();
       
    }

    private findRotationBone(): Bone {
        const rotationBone = this.skeleton.bones.find(bone => bone.name === 'rotation');
        if (!rotationBone) {
            console.error("'rotation' bone not found. Turret aiming will not work correctly.");
            return this.skeleton.bones[0]; // Fallback to root bone
        }else{
            this.rotationBone = rotationBone;
        }
        return rotationBone;
    }

    public rotateTurret(yaw: number) {
        // Assuming the rotation bone only controls yaw (left-right rotation)
        this.rotationBone.setRotation(new Vector3(0, yaw, 0));
        this.skeleton.prepare();
    }

    public aimAtTarget(target: Vector3) {
        const tankPosition = this.tank.getAbsolutePosition();
        const direction = target.subtract(tankPosition);
        
        // Calculate yaw (rotation around Y-axis)
        const yaw = Math.atan2(direction.x, direction.z);
        
        this.rotateTurret(yaw);
    }

    private initializeTankPosition() {
        this.tank.position = new Vector3(808.0254908309985, -0.08039172726103061, 770.1119890077115);
    }

    private loadAnimations(armoredResult: ISceneLoaderAsyncResult) {
        armoredResult.animationGroups.forEach(animGroup => {
            this.animations[animGroup.name] = animGroup;
        });
    }

    public performAction(action: ArmoredAction) {
        switch (action) {
            case ArmoredAction.FireMainGun:
                this.fireMainGun();
                break;
            case ArmoredAction.FireSecondaryGun:
                this.fireSecondaryGun();
                break;
            case ArmoredAction.DeploySmoke:
                this.deploySmoke();
                break;
            case ArmoredAction.UseRepairKit:
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
        this.tank.position = new Vector3(x, y, z);
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
