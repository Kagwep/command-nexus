import { AnimationGroup, AssetContainer, Mesh, TransformNode, Vector3 } from "@babylonjs/core";
import { useMe } from "../hooks/useMe";
import { useTurn } from "../hooks/useTurn";
import { usePhase } from "../hooks/usePhase";
import { useGame } from "../hooks/useGame";
import { useGetPlayersForGame } from "../hooks/useGetPlayersForGame";

export interface Player {
  address: string;  // Player's address
  game_id: number;  // Game ID the player is associated with (0 or more)
  home_base: string; // Name of the player's home base
  index: number;     // Index of the player
  last_action: bigint; // Last action timestamp or identifier
  name: string;      // Player's name
  player_score: {
      score: number; // Total score of the player
      kills: number; // Number of kills
      deaths: number; // Number of deaths
      assists: number; // Number of assists
  };
  rank: number;     // Player's rank
  supply: {
      infantry: number; // Number of infantry units
      armored: number;  // Number of armored units
      air: number;      // Number of air units
      naval: number;    // Number of naval units
      cyber: number;    // Number of cyber units
  };
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

export enum  BannerLevel {
  Recruit,
  Soldier,
  Veteran,
  Elite,
  Commander,
  Legend,
  Mythic
}


export enum BattlefieldName {
  None,
  RadiantShores,
  Ironforge,
  Skullcrag,
  NovaWarhound,
  SavageCoast,
}


export interface GameState {
  player: ReturnType<typeof useMe>['me'];
  isItMyTurn: ReturnType<typeof useMe>['isItMyTurn'];
  turn: ReturnType<typeof useTurn>['turn'];
  phase: ReturnType<typeof usePhase>['phase'];
  game: ReturnType<typeof useGame>;
  players: ReturnType<typeof useGetPlayersForGame>['players'];
}


export interface Region {
  name: BattlefieldName;
  points: Vector3[];
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