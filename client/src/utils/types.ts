import { AnimationGroup, AssetContainer, Mesh, TransformNode, Vector3 } from "@babylonjs/core";

export interface Player {
    game_id: number;
    index: number;
    address: string;
    name: string;
    supply: number;
    last_Action: number;
    rank: number;
  }
  export type BurnerStorage = {
    [address: string]: {
      privateKey: string;
      publicKey: string;
      deployTx: string;
      active: boolean;
      masterAccount: string;
      masterAccountProvider: string;
      gameContract: string;
    };
  };
  export type Tile = {
    game_id: number;
    id: number;
    army: number;
    owner: number;
    dispatched: number;
    to: number;
    from: number;
    order: bigint;
  };
  
  export type Point = {
    x: number;
    y: number;
  };
  
  export type Continent = {
    id: number;
    name: string;
    regions: number[];
    supply: number;
  };
  
  export interface Duel {
    battleId: number;
    duelId: number;
    attackerValue: number;
    defenderValue: number;
  }
  
  export interface Battle {
    gameId: number;
    attackerIndex: number;
    defenderIndex: number;
    attackerTroops: number;
    defenderTroops: number;
    rounds: Duel[][];
  }
  

  export enum UnitType {
    Infantry,
    Armored,
    Air,
    Naval,
    Cyber,
}



export enum AbilityType {
    Attack,
    Defend,
    Patrol,
    Stealth,
    Recon,
    Hack,
    Repair,
    Airlift,
    Bombard,
    Submerge,
}

export interface UnitAbilities {
  [key: string]: number;
}



// UnitMode enum (matching your contract)
export enum UnitMode {
  Idle,
  Moving,
  Attacking,
  Defending,
  Patrolling,
  Stealthed,
  Reconning,
  Healing,
  Retreating,
  Repairing,
}


export interface DeployInfo {
   unit: UnitType; position: Vector3 | null
}

export type UnitAssetContainers = {
  [key in UnitType]: AssetContainer;
};

export interface AgentAnimations {
  idle: AnimationGroup;
  movement: AnimationGroup;
  attack?: AnimationGroup;
  [key: string]: AnimationGroup | undefined;
}

export interface Agent {
  navAgent: TransformNode;
  visualMesh: Mesh;
  idx: number;
  animations: AgentAnimations;
  animationGroups: AnimationGroup[];
  cUnitType:UnitType;
}

export interface AnimationMapping {
  idle: string[];
  movement: string[];
  attack?: string[];
  [key: string]: string[] | undefined;
}


export type UnitAnimations = {
  [key in UnitType] : AnimationMapping
}