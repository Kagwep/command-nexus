import { Scene, Mesh, Vector3, Ray, MeshBuilder, Color3, StandardMaterial, AbstractMesh, RayHelper } from "@babylonjs/core";

export class RayCaster {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public castRay(originMesh: AbstractMesh,targetMesh: AbstractMesh): { hit: boolean } {
        const originMeshPosition = originMesh.absolutePosition;
        const targetMeshPosition = targetMesh.absolutePosition;
        originMeshPosition.y +=2;
        targetMeshPosition.y +=2;

        console.log(originMeshPosition,targetMeshPosition)
        
        // Create direction vector from origin to target
        const direction = targetMeshPosition.subtract(originMeshPosition).normalize();
        
        // Create ray from origin to target
        const ray = new Ray(originMeshPosition, direction, Vector3.Distance(originMeshPosition, targetMeshPosition));

        // Use RayHelper to visualize the ray
        // const rayHelper = new RayHelper(ray);
        // // rayHelper.show(this.scene,new Color3(1,1,0));


        const hitInfo = this.scene.multiPickWithRay(ray);
        
        // Check for blocking meshes
        let isLineOfSightBlocked = false;
        
        for (let i = 0; i < hitInfo.length; i++) {
            const hit = hitInfo[i];
            
            // Skip if the hit is on the origin or target mesh
            if (hit.pickedMesh !== originMesh && hit.pickedMesh !== targetMesh) {
                isLineOfSightBlocked = true;
                break;
            }
        }
        
        if (isLineOfSightBlocked) {
            console.log("Line of sight is blocked.");
        } else {
            console.log("Line of sight is clear.");
        }
        

        if (isLineOfSightBlocked) {
            return { 
                hit: true, 
            };
        } else {
            return { hit: false};
        }
    }

    public visualizeRay(fromMesh: AbstractMesh, toMesh: AbstractMesh, hitPoint: Vector3 | null): Mesh {
        const points = [fromMesh.position, hitPoint || toMesh.position];
        const lines = MeshBuilder.CreateLines("ray", { points: points }, this.scene);
        lines.color = hitPoint ? Color3.Red() : Color3.Green();

        if (hitPoint) {
            const hitMarker = MeshBuilder.CreateSphere("hitMarker", { diameter: 0.2 }, this.scene);
            hitMarker.position = hitPoint;
            const material = new StandardMaterial("hitMarkerMat", this.scene);
            material.emissiveColor = Color3.Red();
            hitMarker.material = material;


        }

        return lines;
    }
}