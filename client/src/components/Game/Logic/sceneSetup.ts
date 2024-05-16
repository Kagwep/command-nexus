import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, Vector3, StandardMaterial, Color3, Mesh, AbstractMesh, Animation, SceneLoader, RecastJSPlugin, Material,Texture } from '@babylonjs/core';
import "@babylonjs/loaders";
import Recast from "recast-detour";
import { Assets } from './Assets';
import { GUI } from './GUI';

export class GameScene {
    private scene: Scene;
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private selectedMesh: Mesh | null = null;
    private navigation!: RecastJSPlugin;
    private navMesh: Mesh | null = null;
    recast: any;

    constructor(canvasElement:  HTMLCanvasElement) {

        this.canvas = canvasElement;
        this.engine = new Engine(this.canvas, true);
        this.scene = new Scene(this.engine);
        

        this.initRecast().then(() => {
            this.createCamera();
            this.createLight();
            this.createObjects();
            this.addListeners();
        });
    }

    private async initRecast(): Promise<void> {
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), this.scene);
        camera.attachControl(this.canvas, true);
        const recast = await Recast()
        const navigationPlugin = new RecastJSPlugin(recast);
        navigationPlugin.setWorkerURL("/home/kagwe/projects/loyalty/src/workers/navMeshWorker.js");
        this.navigation = navigationPlugin;
    }

    private createCamera(): void {
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), this.scene);
        camera.attachControl(this.canvas, true);
    }

    private createLight(): void {
        new HemisphericLight("light", new Vector3(1, 1, 0), this.scene);
    }

    private async createObjects(): Promise<void> {
        let unitpositionZ = 0;
        let unitpositionX = 0;

        const gameGUI = new GUI(this.scene);

        const box = MeshBuilder.CreateBox("box", { size: 0.05 }, this.scene) as Mesh;
        box.position.x = 1.5;
        box.position.y = 0.1;
        box.name = "box";



        const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2 }, this.scene) as Mesh;
        sphere.position.x = -20;
        sphere.position.y = 4;
  
        sphere.name = "sphere";

        //const ground = MeshBuilder.CreateGround("ground", { width: 5, height: 10 }, this.scene);

        const threatMaterialSphere = new StandardMaterial("threatMaterialSphere", this.scene);
        threatMaterialSphere.diffuseColor = new Color3(1, 0, 0); // Red
        threatMaterialSphere.alpha = 0.5; // Semi-transparent

        const threatMaterialBox = new StandardMaterial("threatMaterialBox", this.scene);
        threatMaterialBox.diffuseColor = new Color3(0, 0, 1); // Blue
        threatMaterialBox.alpha = 0.5; // Semi-transparent

        const sphereThreatArea = MeshBuilder.CreateDisc("sphereThreatArea", {radius: 5, tessellation: 0}, this.scene);
        sphereThreatArea.position = sphere.position; // Assume 'sphere' is your existing mesh
        sphereThreatArea.material = threatMaterialSphere;
        sphereThreatArea.rotation.x = Math.PI / 2; // Rotate to lay flat on the ground
        
        const boxThreatArea =MeshBuilder.CreateDisc("boxThreatArea", {radius: 0.3, tessellation: 0}, this.scene);
        boxThreatArea.position = box.position; // Assume 'box' is your existing mesh
        boxThreatArea.material = threatMaterialBox;
        boxThreatArea.rotation.x = Math.PI / 2; // Rotate to lay flat on the ground

        
        const transparentMaterial = new StandardMaterial("navMaterial", this.scene);
        transparentMaterial.diffuseColor = new Color3(0, 1, 0); // Example: Green color
        transparentMaterial.alpha = 0; // Set transparency



        const { meshes } = await SceneLoader.ImportMeshAsync('', './models/', 'loyalty.glb');

// https://drive.google.com/file/d/1bhdxRyuJ8RkwMunkz8NbjetLr7wzrDUl/view?usp=sharing

        const outpost = meshes.find(mesh => mesh.name === "outpost");
        
        if (outpost){
            outpost.isPickable = false;
            outpost.material = transparentMaterial;
        }

        console.log(meshes)
        this.navMesh = meshes.find(mesh => mesh.name === "NavMesh" && mesh instanceof Mesh) as Mesh;
        console.log(this.navMesh)
        
        const assets = new Assets(this.scene);

        await assets.setupAssetTasks();

        await assets.initialize();

        if (meshes){
            assets.setAssetsMeshNameToIndex(meshes);
        }

        assets.cavalry[0].model.isPickable = false;


        assets.cavalry[0].model.parent = sphere;

        console.log(assets.cavalry[0].strength)
    
        assets.cavalry[0].model.unfreezeWorldMatrix();

        //assets.cavalry[0].model.position.y = sphere.position.y;
        const cavalryMaterial = new StandardMaterial("cavalryMaterial1", this.scene);

        const cavalryTexture = new Texture("https://hambre.infura-ipfs.io/ipfs/QmR8ZXT5ka5wpY8ub8R1mQTLtb89Fxe9AEDdu5LR57jPp6", this.scene);

        // Set the diffuse texture using a URL
        cavalryMaterial.diffuseTexture = cavalryTexture;


        assets.cavalry[0].model.material= cavalryMaterial;

        console.log(assets.cavalry[0].model.isEnabled());

        console.log(assets.meshNameToIndex.get('loyalpalace'));

        assets.cavalry[0].model.getChildMeshes(false, (node) => {
            if (node instanceof Mesh) {
                node.material = cavalryMaterial;
                return true;  
            }
            return false;  
        });
        
       
        
        // Apply the material to the cavalry model
       sphere.material = cavalryMaterial

        console.log(sphere.material)


       console.log("samemo",assets.cavalry[0].model)

        const calvaryThreatAreaUnitOne = assets.cavalryThreatArea?.clone("calvaryThreatAreaUnitOne",null,false)

        calvaryThreatAreaUnitOne!.position.z = assets.cavalry[0].model.position.z;

        const isArmuUnitInOpponentsAsset = (unit: Mesh | undefined, asset: AbstractMesh | undefined) => {

            if (!asset || !unit) return;

            var position = unit.position.clone(); // Clone the position to avoid modifying the original
    
            // Check if the position of mesh1 is inside the bounding box of mesh2
            var isInside = asset.getBoundingInfo().boundingBox.intersectsPoint(position);
            
            if (isInside) {
                console.log("is Inside")
            }

        }
          

        this.scene.onBeforeRenderObservable.add(() => {
            sphereThreatArea.position.x = sphere.position.x;
            sphereThreatArea.position.z = sphere.position.z; // Adjust Y if your sphere moves up or down
            sphereThreatArea.position.y = sphere.position.y;
            
            calvaryThreatAreaUnitOne!.position.x = sphere.position.x;
            calvaryThreatAreaUnitOne!.position.z = sphere.position.z;

           //console.log(assets.cavalry[0].model)
        
            boxThreatArea.position.x = box.position.x;
            boxThreatArea.position.z = box.position.z; // Adjust Y if your box moves up or down

            isArmuUnitInOpponentsAsset(calvaryThreatAreaUnitOne,outpost);
        });
    
 

       

        if (this.navMesh) {
            this.navMesh.material = transparentMaterial;
            this.navigation.createNavMesh([this.navMesh], {
                cs: 0.2,
                ch: 0.2,
                walkableSlopeAngle: 90,
                walkableHeight: 1.0,
                walkableClimb: 1,
                walkableRadius: 1,
                maxEdgeLen: 12.,
                maxSimplificationError: 1.3,
                minRegionArea: 8,
                mergeRegionArea: 20,
                maxVertsPerPoly: 6,
                detailSampleDist: 6,
                detailSampleMaxError: 1,
            });
        } else {
            console.error("NavMesh not found or is not a Mesh instance.");
        }
    }

    private addListeners(): void {
        this.scene.onPointerDown = (evt, pickResult) => {
            console.log(pickResult.pickedMesh);
            if (pickResult.hit && pickResult.pickedMesh && (pickResult.pickedMesh.name === "sphere" || pickResult.pickedMesh.name === "box" )) {
                this.selectedMesh = pickResult.pickedMesh as Mesh;
            } else if (pickResult.hit && pickResult.pickedMesh === this.navMesh && this.selectedMesh) {
                console.log(pickResult.pickedPoint!)
                this.navigateMeshToPosition(pickResult.pickedPoint!);
            }
        };
    }

        private navigateMeshToPosition(targetPosition: Vector3): void {
           // console.log(this.selectedMesh)
            if (!this.selectedMesh) return;
        
            // Synchronously compute the path
            const path: Vector3[] = this.navigation.computePath(this.selectedMesh.position, targetPosition);
        
            // Check if a valid path was returned and animate the mesh along this path
            if (path && path.length > 0) {
                
                this.animateMeshAlongPath(this.selectedMesh, path);
            }
        }
        
        
    

    private animateMeshAlongPath(mesh: Mesh, path: Vector3[]): void {
        let currentPointIndex = 0;
        mesh.position = path[currentPointIndex]; // Start position
        

        const goToNextPoint = () => {
            currentPointIndex++;
            if (currentPointIndex < path.length) {
                Animation.CreateAndStartAnimation('moveToPoint', mesh, 'position', 30, 60, mesh.position, path[currentPointIndex], Animation.ANIMATIONLOOPMODE_CONSTANT, undefined, () => {
                    goToNextPoint();
                });
            }
        };

        goToNextPoint();
    }


    public renderLoop(): void {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}
