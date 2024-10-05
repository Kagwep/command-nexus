import { Color3, GroundMesh, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3 } from '@babylonjs/core';

export default class PointNavigation {
    private mesh: GroundMesh;
    private material: StandardMaterial;
    private rotationSpeed: number;

    constructor(scene: Scene, texturePath: string) {
        this.rotationSpeed = 0.03;

        // Create Point Navigation mesh
        this.mesh = MeshBuilder.CreateGround("pointNav", {width: 1, height: 1}, scene);
        
        // Create and configure material
        this.material = new StandardMaterial("pointNavMaterial", scene);
        this.material.diffuseTexture = new Texture(texturePath, scene);
        this.material.diffuseTexture.hasAlpha = true;
        this.material.useAlphaFromDiffuseTexture = true;
        this.material.specularPower = 0;
        this.material.specularColor = new Color3(0.1, 0.1, 0.1);
        this.material.roughness = 1;
        this.material.alphaCutOff = 0.2;
        this.material.backFaceCulling = false;

        // Apply material to mesh
        this.mesh.material = this.material;
        this.mesh.visibility = 0;

        // Register rotation animation
        scene.registerAfterRender(() => {
            this.mesh.rotation.y += this.rotationSpeed;
        });
    }

    public getPointNavMesh(){
        return this.mesh
    }

    setVisibility(visibility: number): void {
        this.mesh.visibility = visibility;
    }

    setPosition(x: number, y: number, z: number): void {
        this.mesh.position = new Vector3(x, y, z);
    }

    setRotationSpeed(speed: number): void {
        this.rotationSpeed = speed;
    }

    dispose(): void {
        this.mesh.dispose();
        this.material.dispose();
    }
}