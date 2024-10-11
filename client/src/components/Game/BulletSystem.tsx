import { Color4, Mesh, MeshBuilder, ParticleSystem, Scene, Sprite, SpriteManager, Texture, Vector3, Matrix } from "@babylonjs/core";

export class Weapon {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    // Method to create and trigger the muzzle flash
    public triggerMuzzleFlash(sourceMesh: Mesh): void {
    //     const ps1 = new ParticleSystem("particles", 500, this.scene);

    //     // Texture of each particle
    //     ps1.particleTexture = new Texture("textures/flare.png", this.scene);
    //    const newmesh =  sourceMesh.unfreezeWorldMatrix();

    //     // Get the local-to-world matrix of the mesh
    //     const localToWorldMatrix = sourceMesh.computeWorldMatrix(true);

    //     // Transform the local origin (0,0,0) to world space
    //     const worldPosition = Vector3.TransformCoordinates(Vector3.Zero(), localToWorldMatrix);

       
    //     // Set the emitter to the calculated world position
    //     ps1.emitter = sourceMesh

    //     console.log(`Muzzle flash position: x=${worldPosition.x}, y=${worldPosition.y}, z=${worldPosition.z}`);

    //     // Adjust emit box to be relative to the mesh's local space
    //     ps1.minEmitBox = new Vector3(-.05, -.05, -.05);
    //     ps1.maxEmitBox = new Vector3(.05, .05, .05);

    //     // Colors of all particles
    //     ps1.color1 = new Color4(1, 0.92, 0);
    //     ps1.color2 = new Color4(1, 0.83, 0.15);
    //     ps1.colorDead = new Color4(1, 0.82, 0.43);

    //     // Size of each particle (random between...
    //     ps1.minSize = 0.05;
    //     ps1.maxSize = 0.2;

    //     // Life time of each particle (random between...
    //     ps1.minLifeTime = 0.03;
    //     ps1.maxLifeTime = 0.08;

    //     // Emission rate
    //     ps1.manualEmitCount = 300;

    //     // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    //     ps1.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    //     // Set the gravity of all particles
    //     ps1.gravity = new Vector3(0, 0, 0);

    //     // Direction of each particle after it has been emitted
    //     ps1.direction1 = new Vector3(-0.3, -0.3, -1);
    //     ps1.direction2 = new Vector3(0.3, 0.3, -0.7);

    //     // Angular speed, in radians
    //     ps1.minAngularSpeed = 0;
    //     ps1.maxAngularSpeed = Math.PI;

    //     // Speed
    //     ps1.minEmitPower = 0.5;
    //     ps1.maxEmitPower = 2;

    //     ps1.updateSpeed = 0.01;

    //     // Start the particle system
    //     ps1.start();

    //     // Dispose of the particle system after a short delay
    //     setTimeout(() => {
    //         ps1.dispose();
    //     }, 100);
    }
}