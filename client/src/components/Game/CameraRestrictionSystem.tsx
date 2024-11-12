import * as BABYLON from '@babylonjs/core';

export default class RestrictedCameraMovementSystem {
    private area: BABYLON.Vector3[];
    private camera: BABYLON.ArcRotateCamera;
    private scene: BABYLON.Scene;
    private keys: { [key: string]: boolean } = { w: false, s: false, a: false, d: false, q: false, e: false };
    private MOVE_SPEED: number = 1;
    private ROTATION_SPEED: number = 0.05;
    private GRID_SIZE: number = 1; // Adjust based on your game's grid size
    private currentGridPosition: BABYLON.Vector2;

    constructor(area: BABYLON.Vector3[], scene: BABYLON.Scene) {
        this.area = area;
        this.scene = scene;
        this.camera
        this.setupKeyboardObservable();
        this.setupRenderObservable();
        this.currentGridPosition = this.worldToGrid(this.camera.target);
    }


    private setupKeyboardObservable() {
        this.scene.onKeyboardObservable.add((kbInfo) => {
            const key = kbInfo.event.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN;
            }
        });
    }

    private setupRenderObservable() {
        this.scene.onBeforeRenderObservable.add(() => {
            this.updateCameraPosition();
        });
    }

    private updateCameraPosition() {
        let moveX = 0;
        let moveZ = 0;

        if (this.keys['w']) moveZ += 1;
        if (this.keys['s']) moveZ -= 1;
        if (this.keys['a']) moveX -= 1;
        if (this.keys['d']) moveX += 1;

        if (moveX !== 0 || moveZ !== 0) {
            const movementVector = new BABYLON.Vector3(moveX, 0, moveZ);
            movementVector.normalize().scaleInPlace(this.MOVE_SPEED);

            const rotationMatrix = BABYLON.Matrix.RotationY(this.camera.alpha);
            const rotatedMovement = BABYLON.Vector3.TransformNormal(movementVector, rotationMatrix);

            const newGridPosition = this.currentGridPosition.add(new BABYLON.Vector2(rotatedMovement.x, rotatedMovement.z));
            const worldPosition = this.gridToWorld(newGridPosition);

            if (this.isPointInPolygon(worldPosition)) {
                this.currentGridPosition = newGridPosition;
                this.camera.target = worldPosition;
            }
        }

        if (this.keys['q']) this.camera.alpha += this.ROTATION_SPEED;
        if (this.keys['e']) this.camera.alpha -= this.ROTATION_SPEED;
    }

    private isPointInPolygon(point: BABYLON.Vector3): boolean {
        let inside = false;
        for (let i = 0, j = this.area.length - 1; i < this.area.length; j = i++) {
            const xi = this.area[i].x, zi = this.area[i].z;
            const xj = this.area[j].x, zj = this.area[j].z;
            
            const intersect = ((zi > point.z) !== (zj > point.z))
                && (point.x < (xj - xi) * (point.z - zi) / (zj - zi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    private calculateAreaCenter(): BABYLON.Vector3 {
        let sumX = 0, sumZ = 0;
        for (const point of this.area) {
            sumX += point.x;
            sumZ += point.z;
        }
        return new BABYLON.Vector3(sumX / this.area.length, 0, sumZ / this.area.length);
    }

    private worldToGrid(worldPos: BABYLON.Vector3): BABYLON.Vector2 {
        return new BABYLON.Vector2(
            Math.round(worldPos.x / this.GRID_SIZE),
            Math.round(worldPos.z / this.GRID_SIZE)
        );
    }

    private gridToWorld(gridPos: BABYLON.Vector2): BABYLON.Vector3 {
        return new BABYLON.Vector3(
            gridPos.x * this.GRID_SIZE,
            0,
            gridPos.y * this.GRID_SIZE
        );
    }
}