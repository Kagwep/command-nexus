import { BoundingInfo, Color3, Color4, Mesh, Scene, StandardMaterial, Vector3, VertexData } from "@babylonjs/core";


interface AreaOptions {
    name: string;
    color?: Color4;
    alpha?: number;
    height?: number;
}

export default class NexusAreaSystem {
    private areas: Map<string, {
        vertices: Vector3[],
        boundingInfo: BoundingInfo
    }> = new Map();
    private areaMeshes: Map<string, Mesh> = new Map();
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    addArea(vertices: Vector3[], options: AreaOptions): void {
        const height = options.height || 300; // Default height if not specified

        // Calculate bounding box
        const min = vertices.reduce((min, p) => Vector3.Minimize(min, p), vertices[0].clone());
        const max = vertices.reduce((max, p) => Vector3.Maximize(max, p), vertices[0].clone());
        max.y += height; // Adjust max y for the height
        
        const boundingInfo = new BoundingInfo(min, max);

        // Create custom mesh
        const customMesh = new Mesh(options.name, this.scene);
        customMesh.visibility = 0
        customMesh.isPickable = false;

        const positions: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];

        // Create bottom and top vertices
        for (const vertex of vertices) {
            positions.push(vertex.x, vertex.y, vertex.z);
            positions.push(vertex.x, vertex.y + height, vertex.z);
        }

        const vertexCount = vertices.length;

        // Create indices for the side faces
        for (let i = 0; i < vertexCount; i++) {
            const bottomLeft = i * 2;
            const bottomRight = ((i + 1) % vertexCount) * 2;
            const topLeft = bottomLeft + 1;
            const topRight = bottomRight + 1;

            indices.push(bottomLeft, bottomRight, topRight);
            indices.push(bottomLeft, topRight, topLeft);
        }

        // Create indices for the bottom face
        for (let i = 2; i < vertexCount; i++) {
            indices.push(0, (i - 1) * 2, i * 2);
        }

        // Create indices for the top face
        for (let i = 2; i < vertexCount; i++) {
            indices.push(1, i * 2 + 1, (i - 1) * 2 + 1);
        }

        const vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;

        // Compute normals
        VertexData.ComputeNormals(positions, indices, normals);
        vertexData.normals = normals;

        vertexData.applyToMesh(customMesh);

        // Create and apply material
        const material = new StandardMaterial(options.name + "Material", this.scene);
        material.diffuseColor =  Color3.Random();
        material.alpha = options.alpha || 0.5;
        customMesh.material = material;

        this.areas.set(options.name, { vertices, boundingInfo });
        this.areaMeshes.set(options.name, customMesh);
    }

    isPointInArea(point: Vector3, areaName: string): boolean {
        const area = this.areas.get(areaName);
        if (!area) return false;

        // Quick check using bounding box
        if (!area.boundingInfo.intersectsPoint(point)) return false;

        // If inside bounding box, do a more precise check
        return this.isPointInPolygon(point, area.vertices);
    }

    private isPointInPolygon(point: Vector3, polygon: Vector3[]): boolean {
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x, zi = polygon[i].z;
            const xj = polygon[j].x, zj = polygon[j].z;
            
            const intersect = ((zi > point.z) !== (zj > point.z))
                && (point.x < (xj - xi) * (point.z - zi) / (zj - zi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    getAreaAtPosition(position: Vector3): string | null {
        for (const [name, area] of this.areas) {
            if (this.isPointInArea(position, name)) {
                return name;
            }
        }
        return null;
    }

    removeArea(name: string): void {
        this.areas.delete(name);
        const mesh = this.areaMeshes.get(name);
        if (mesh) {
            mesh.dispose();
            this.areaMeshes.delete(name);
        }
    }

    setAreaVisibility(name: string, visible: boolean): void {
        const mesh = this.areaMeshes.get(name);
        if (mesh) {
            mesh.isVisible = visible;
        }
    }
}

