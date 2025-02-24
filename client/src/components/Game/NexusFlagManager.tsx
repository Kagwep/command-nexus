import { Agent, EncodedVector3, FlagData, GameState, ToastType } from '../../utils/types';
import { Scene, SceneLoader, Vector3, TransformNode, AbstractMesh, AssetContainer, ActionManager, ExecuteCodeAction, Mesh, AnimationGroup } from '@babylonjs/core';
import { Account, AccountInterface, Uint256 } from 'starknet';
import CommandNexusGui from './CommandNexusGui';
import { battlefieldTypeToInt, positionDecoder, positionEncoder, regions } from '@/utils/nexus';
import { StarknetErrorParser } from './ErrorParser';
import { bigintToU256 } from '@/lib/lib_utils/starknet';
import { sceneUboDeclaration } from '@babylonjs/core/Shaders/ShadersInclude/sceneUboDeclaration';

// Constants for positions
export const RADIANT_SHORES_POSITION = new Vector3(-113.93625811395006, 0.2321734670549631, 219.11772991590624);
export const IRONFORGE_POSITION = new Vector3(74.33719768521131, 0.2321734670549631, 269.60137678784145);
export const SAVAGE_COAST_POSITION = new Vector3(-33.27912511926547, 0.2321734670549631, 102.75661677810596);
export const NOVA_WARHOUND_POSITION = new Vector3(93.9453515129216, 0.2321734670549631, 2.5107717843192985);
export const SKULLCRAG_POSITION = new Vector3(-250.75874226517567, 0.23217346705495956, 186.03813654706522);

// Enum for location names
export enum NexusLocation {
    RADIANT_SHORES = 'RadiantShores',
    IRONFORGE = 'Ironforge',
    SAVAGE_COAST = 'SavageCoast',
    NOVA_WARHOUND = 'NovaWarhound',
    SKULLCRAG = 'Skullcrag'
}

export class NexusFlagManager {
    private scene: Scene;
    private flagPositions: Map<NexusLocation, Vector3>;
    private flagContainer?: AssetContainer;
    private flags: Map<NexusLocation, AbstractMesh[]>;
    private deployedFlags: Set<NexusLocation>;
    private client;
    private getAccount: () => AccountInterface | Account;
    private flagCollectUnit?: Agent;
    private getGui: () => CommandNexusGui;
    private getGameState: () => GameState;
    private flagAnimations: Map<NexusLocation, AnimationGroup> = new Map();

    constructor(scene: Scene, flagContainer: AssetContainer, client: any, getAccount: () => AccountInterface | Account,  getGui: () => CommandNexusGui,getGameState: () => GameState) {
        this.scene = scene;
        this.flagPositions = new Map();
        this.flags = new Map();
        this.flagContainer = flagContainer;
        this.deployedFlags = new Set();
        this.initializeFlagPositions();
        this.client = client;
        this.getAccount = getAccount;
        this.getGui = getGui;
        this.initialize(getGui);
        this.getGameState = getGameState;
    }

    private initializeFlagPositions() {
        this.flagPositions.set(NexusLocation.RADIANT_SHORES, RADIANT_SHORES_POSITION);
        this.flagPositions.set(NexusLocation.IRONFORGE, IRONFORGE_POSITION);
        this.flagPositions.set(NexusLocation.SAVAGE_COAST, SAVAGE_COAST_POSITION);
        this.flagPositions.set(NexusLocation.NOVA_WARHOUND, NOVA_WARHOUND_POSITION);
        this.flagPositions.set(NexusLocation.SKULLCRAG, SKULLCRAG_POSITION);
    }

    public async initialize(getGui: () => CommandNexusGui): Promise<void> {
        try {

            // Create initial instance of each flag at its position
            Object.values(NexusLocation).forEach(location => {
                const position = this.flagPositions.get(location);
                if (position && this.flagContainer) {
                    const result = this.flagContainer.instantiateModelsToScene(
                        undefined, 
                        false, 
                        { doNotInstantiate: true }
                    );
                    
                    const rootNode = result.rootNodes[0] as Mesh;
                    rootNode.position = position;
                    rootNode.rotation = new Vector3(0, Math.PI, 0);
                    rootNode.metadata = {location : location};
                    
                    const meshes = rootNode.getChildMeshes();
                    this.flags.set(location, meshes);

                    if (result.animationGroups && result.animationGroups.length > 0) {
                        const animationGroup = result.animationGroups[0];
                        this.flagAnimations.set(location, animationGroup);
                        animationGroup.play(true); // Start playing with loop enabled
                    }
                    
                    // Setup click actions
                    meshes.forEach(mesh => {
                        mesh.actionManager = new ActionManager(this.scene);
                        mesh.metadata = {location : location}
                        mesh.actionManager.registerAction(
                            new ExecuteCodeAction(
                                ActionManager.OnPickTrigger,
                                async () => await this.handleFlagClick(mesh)
                            )
                        );
                        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, function(ev){
                            getGui().showBoxInfo(`${location}\n⚔ Click to Capture ⚔`, {
                                rectColor: "rgb(76, 175, 80)",
                                textColor: "rgb(255, 255, 255)",
                                fontSize: 18,
                                autoHide: true,
                                hideDelay: 2000
                            });
                           }));
                    });
                }
            });
        } catch (error) {
            console.error("Failed to load flag model:", error);
            throw error;
        }
    }


    private async handleFlagClick(mesh): Promise<void> {

        
        //console.log("555555555555555", mesh.getAbsolutePosition())
        // fn capture_flag(ref self: TContractState, game_id: u32,unit_id: u32,unit_type: u8, flag_id: u8,x: u256,y: u256,z: u256);

        if(this.flagCollectUnit){


        const x = bigintToU256(this.flagCollectUnit.visualMesh.metadata.UnitData.position.coord.x);
        const y = bigintToU256(this.flagCollectUnit.visualMesh.metadata.UnitData.position.coord.y);
        const z = bigintToU256(this.flagCollectUnit.visualMesh.metadata.UnitData.position.coord.z);

        if (mesh.metadata.location === NexusLocation.SAVAGE_COAST){
            console.log(mesh.metadata.location)
        }
        console.log(mesh.metadata.location)
     
        const pos: EncodedVector3 = { x, y, z };

        const startingPoint = positionDecoder(pos);

        const clickedRegion = this.getClickedRegion(startingPoint);

        const  battlefieldId = mesh.metadata.location !== NexusLocation.SAVAGE_COAST ? battlefieldTypeToInt(clickedRegion): 5;

        const encodedPosition= positionEncoder(mesh.getAbsolutePosition());
        const unitId = this.flagCollectUnit.visualMesh.metadata.UnitData.unit_id
        const unitType = 1

        console.log(encodedPosition)
        
        const resultCapture  = await (await this.client).nexus.captureFlag(this.getAccount(), this.getGameState().game.game_id, unitId, unitType,battlefieldId, encodedPosition.x,encodedPosition.y,encodedPosition.z);
                
        //console.log(resultStealth)

        if (resultCapture && resultCapture.transaction_hash){
            this.getGui().showToastSide(`Unit ${unitId} captured flag`, ToastType.Success);
        }else{
            const errorMessage = StarknetErrorParser.parseError(resultCapture);
            //console.log(errorMessage)
            this.getGui().showToastSide(errorMessage,ToastType.Error)
        }


        }else{
            this.getGui().showToastSide("Select unit to capture flag",ToastType.Error)
        }
    }


    public isDeployed(location: NexusLocation): boolean {
        return this.deployedFlags.has(location);
    }

    public getDeployedLocations(): NexusLocation[] {
        return Array.from(this.deployedFlags);
    }

    public getFlagPosition(location: NexusLocation): Vector3 | undefined {
        return this.flagPositions.get(location);
    }

    public setFlagData(agent: Agent): void {
        this.flagCollectUnit = agent;
    }

    public getflagCollectUnit(): Agent | undefined {
        return this.flagCollectUnit;
    }

        public isPointInPolygon(point: Vector3, polygonPoints: Vector3[]): boolean {
            let inside = false;
            for (let i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
                const xi = polygonPoints[i].x, yi = polygonPoints[i].z;
                const xj = polygonPoints[j].x, yj = polygonPoints[j].z;
                
                const intersect = ((yi > point.z) !== (yj > point.z))
                    && (point.x < (xj - xi) * (point.z - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        }
    
        public getClickedRegion(clickPosition: Vector3): string {
            for (const region of regions) {
                if (this.isPointInPolygon(clickPosition, region.points)) {
                    return region.name;
                }
            }
            return "None";
        }

    public removeFlag(location: NexusLocation): void {
        const flagMeshes = this.flags.get(location);
        if (flagMeshes) {
            flagMeshes.forEach(mesh => mesh.dispose());
            this.flags.delete(location);
            this.deployedFlags.delete(location);
        }
    }

    public dispose(): void {
        this.flags.forEach((meshes) => {
            meshes.forEach(mesh => mesh.dispose());
        });
        this.flags.clear();
        this.deployedFlags.clear();
        this.flagContainer?.dispose();
    }
}

