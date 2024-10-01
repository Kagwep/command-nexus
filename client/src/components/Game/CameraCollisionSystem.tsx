import { Scene, ArcRotateCamera, Vector3, BoundingBox, Mesh } from "@babylonjs/core";

export class CameraSlidingCollision {
    private scene: Scene;
    private camera: ArcRotateCamera;
    private collidableMeshes: Mesh[] = [];
    private slideSpeed: number = 0.7;
    private collisionPadding: number = 0.1;

    constructor(scene: Scene, camera: ArcRotateCamera) {
        this.scene = scene;
        this.camera = camera;
        this.setupCameraCollision();
    }

    private setupCameraCollision(): void {
        this.scene.registerBeforeRender(() => {
            this.checkCollisionAndSlide();
        });
    }

    private checkCollisionAndSlide(): void {
        const cameraPosition = this.camera.position;
        const cameraTarget = this.camera.target;
        
        for (const mesh of this.collidableMeshes) {
            const boundingBox = mesh.getBoundingInfo().boundingBox;
            
            if (this.checkCollision(boundingBox, cameraPosition)) {
                const direction = cameraTarget.subtract(cameraPosition).normalize();
                let newPosition = this.findSlidePosition(boundingBox, cameraPosition, direction);
                
                // Update camera position
                this.camera.position = newPosition;
                
                // Adjust target to maintain the same viewing direction
                const distanceToTarget = Vector3.Distance(cameraTarget, cameraPosition);
                this.camera.target = newPosition.add(direction.scale(distanceToTarget));
                
                // Recalculate alpha and beta
                this.camera.alpha = Math.atan2((cameraTarget.z - newPosition.z), (cameraTarget.x - newPosition.x));
                this.camera.beta = Math.acos((cameraTarget.y - newPosition.y) / distanceToTarget);
            }
        }
    }

    private checkCollision(box: BoundingBox, position: Vector3): boolean {
        return box.intersectsPoint(position);
    }

    private findSlidePosition(box: BoundingBox, position: Vector3, direction: Vector3): Vector3 {
        let newPosition = position.clone();
        const slideVector = new Vector3(direction.z, 0, -direction.x).normalize();
        
        for (let angle = 0; angle < Math.PI; angle += Math.PI / 180) {
            const slideAmount = this.slideSpeed * Math.sin(angle);
            const forwardAmount = this.slideSpeed * Math.cos(angle);
            
            newPosition = position.add(slideVector.scale(slideAmount)).add(direction.scale(forwardAmount));
            
            if (!this.checkCollision(box, newPosition)) {
                // Add a small padding to prevent sticking to the surface
                return newPosition.add(direction.scale(this.collisionPadding));
            }
            
            newPosition = position.add(slideVector.scale(-slideAmount)).add(direction.scale(forwardAmount));
            
            if (!this.checkCollision(box, newPosition)) {
                // Add a small padding to prevent sticking to the surface
                return newPosition.add(direction.scale(this.collisionPadding));
            }
        }
        
        // If no valid position found, return the original position
        return position;
    }

    public addCollidableMesh(mesh: Mesh): void {
        if (!this.collidableMeshes.includes(mesh)) {
            this.collidableMeshes.push(mesh);
        }
    }

    public removeCollidableMesh(mesh: Mesh): void {
        const index = this.collidableMeshes.indexOf(mesh);
        if (index !== -1) {
            this.collidableMeshes.splice(index, 1);
        }
    }

    public setSlideSpeed(speed: number): void {
        this.slideSpeed = speed;
    }
}

// Usage example:
// const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, Vector3.Zero(), scene);
// const collisionSystem = new CameraSlidingCollision(scene, camera);
// 
// // Add collidable meshes
// scene.meshes.forEach(mesh => {
//     if (mesh instanceof Mesh && mesh.checkCollisions) {
//         collisionSystem.addCollidableMesh(mesh);
//     }
// });