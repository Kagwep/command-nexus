import { create } from 'zustand';
import GameState from './gamestate';
import { AbilityType, AnimationMapping, BannerLevel, Battle, BattlefieldName, EncodedVector3, Region, UnitAbilities, UnitType } from './types';
import { Color3, Vector3 } from '@babylonjs/core';
import { removeLeadingZeros } from './sanitizer';
import { bigintToU256 } from "../lib/lib_utils/starknet";
import { Uint256ToBigint } from '../lib/lib_utils/starknet';
import { ToriiClient } from '@dojoengine/torii-client';
import { Game } from '../dojogen/models.gen';

export enum Phase {
  DEPLOY,
  ATTACK,
  FORTIFY,
  ENDTURN,
}

export type ScreenPage =
  | "start"
  | "play"
  | "market"
  | "inventory"
  | "beast"
  | "leaderboard"
  | "upgrade"
  | "profile"
  | "encounters"
  | "guide"
  | "settings"
  | "player"
  | "wallet"
  | "tutorial"
  | "onboarding"
  | "create adventurer"
  | "future";

interface State {
  onboarded: boolean;
  handleOnboarded: () => void;
  handleOffboarded: () => void;
  game_id: number | undefined;
  set_game_id: (game_id: number) => void;
  game_state: GameState;
  set_game_state: (game_state: GameState) => void;
  current_source: number | null;
  set_current_source: (source: number | null) => void;
  current_target: number | null;
  set_current_target: (target: number | null) => void;
  isContinentMode: boolean;
  setContinentMode: (mode: boolean) => void;
  highlighted_region: number | null;
  setHighlightedRegion: (region: number | null) => void;
  battleReport: Battle | null;
  setBattleReport: (report: Battle | null) => void;
  player_name: string;
  setPlayerName: (name: string) => void;
  lastDefendResult: Event | null;
  setLastDefendResult: (result: Event | null) => void;
  lastBattleResult: Battle | null;
  setLastBattleResult: (battle: Battle | null) => void;
  tilesConqueredThisTurn: number[];
  setTilesConqueredThisTurn: (tile: number[]) => void;
  round_limit: number;
  setRoundLimit: (limit: number) => void;
  username: string;
  setUsername: (value: string) => void;
  isWalletPanelOpen: boolean;
  setWalletPanelOpen: (isOpen: boolean) => void;
  network: Network;
  setNetwork: (value: Network) => void;
  onMainnet: boolean;
  onSepolia: boolean;
  onKatana: boolean;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  loginScreen: boolean;
  dojoConfig: any;
  setDojoConfig: (value: any) => void;
  setLoginScreen: (value: boolean) => void;
  screen: ScreenPage;
  setScreen: (value: ScreenPage) => void;
}

export const useElementStore = create<State>((set) => ({

  game_id: -1,
  set_game_id: (game_id: number) => {
    console.log('Setting game_id to:', game_id);
    set(() => ({ game_id }));
    console.log('New state:', useElementStore.getState());
  },
  game_state: GameState.MainMenu,
  set_game_state: (game_state: GameState) => set(() => ({ game_state })),
  current_source: null,
  set_current_source: (source: number | null) => set(() => ({ current_source: source })),
  current_target: null,
  set_current_target: (target: number | null) => set(() => ({ current_target: target })),
  isContinentMode: false,
  setContinentMode: (mode: boolean) => set(() => ({ isContinentMode: mode })),
  highlighted_region: null,
  setHighlightedRegion: (region: number | null) => set(() => ({ highlighted_region: region })),
  battleReport: null,
  setBattleReport: (report: Battle | null) => set(() => ({ battleReport: report })),
  player_name: '',
  setPlayerName: (name: string) => set(() => ({ player_name: name })),
  onboarded: false,
  handleOnboarded: () => {
    set({ onboarded: true });
  },
  handleOffboarded: () => {
    set({ onboarded: false });
  },
  lastDefendResult: null,
  setLastDefendResult: (result: Event | null) => set(() => ({ lastDefendResult: result })),
  lastBattleResult: null,
  setLastBattleResult: (battle: Battle | null) => set(() => ({ lastBattleResult: battle })),
  username: "",
  setUsername: (value) => set({ username: value }),
  tilesConqueredThisTurn: [],
  setTilesConqueredThisTurn: (tile: number[]) => set(() => ({ tilesConqueredThisTurn: tile })),
  round_limit: 15,
  setRoundLimit: (limit: number) => set(() => ({ round_limit: limit })),
  isWalletPanelOpen: false,
  setWalletPanelOpen: (isOpen: boolean) => set(() => ({ isWalletPanelOpen: isOpen })),
  network: undefined,
  setNetwork: (value) => {
    set({ network: value });
    set({ onMainnet: value === "mainnet" });
    set({ onSepolia: value === "sepolia" });
    set({ onKatana: value === "katana" || value === "localKatana" });
  },
  onMainnet: false,
  onSepolia: false,
  onKatana: false,
  isMuted: false,
  setIsMuted: (value) => set({ isMuted: value }),
  loginScreen: false,
  dojoConfig: undefined,
  setDojoConfig: (value) => {
    set({ dojoConfig: value });
  },
  setLoginScreen: (value) => set({ loginScreen: value }),
  screen: "start",
  setScreen: (value) => set({ screen: value }),
}));


export type Network =
  | "mainnet"
  | "katana"
  | "sepolia"
  | "localKatana"
  | undefined;

  export function stringToUnitType(unitString: string): UnitType {
    switch (unitString.toLowerCase()) {
        case 'infantry':
            return UnitType.Infantry;
        case 'armored':
            return UnitType.Armored;
        case 'air':
            return UnitType.Air;
        case 'naval':
            return UnitType.Naval;
        case 'cyber':
            return UnitType.Cyber;
        default:
            throw new Error(`Invalid unit type: ${unitString}`);
    }
}

export function numberToUnitType(unitNumber: number): string {
  switch (unitNumber) {
      case 1:
          return "Infantry";
      case 2:
          return "Armored";
      case 3:
          return "Air";
      case 4:
          return "Naval";
      case 5:
          return "Cyber";
      default:
          throw new Error(`Invalid unit type: ${unitNumber}`);
  }
}


export function unitTypeToInt(unit: UnitType): number {
  switch (unit) {
      case UnitType.Infantry:
          return 1;
      case UnitType.Armored:
          return 2;
      case UnitType.Air:
          return 3;
      case UnitType.Naval:
          return 4;
      case UnitType.Cyber:
          return 5;
      default:
          throw new Error(`Invalid unit type: ${unit}`);
  }
}


export function battlefieldTypeToString(battlefield: BattlefieldName): string {
  switch (battlefield) {
      case BattlefieldName.RadiantShores:
          return "RadiantShores";
      case BattlefieldName.Ironforge:
          return "Ironforge";
      case BattlefieldName.Skullcrag:
          return "Skullcrag";
      case BattlefieldName.NovaWarhound:
          return "NovaWarhound";
      case BattlefieldName.SavageCoast:
          return "SavageCoast";
      default:
          throw new Error(`Invalid region: ${battlefield}`);
  }
}



export function battlefieldTypeToInt(battlefield: string): number {
  switch (battlefield) {
      case "RadiantShores":
          return 1;
      case "Ironforge":
          return 2;
      case "Skullcrag":
          return 3;
      case "NovaWarhound":
          return 4;
      case "SavageCoast":
          return 5;
      default:
          throw new Error(`Invalid region: ${battlefield}`);
  }
}

      // Define animation mappings
export const tankAnimationMapping: AnimationMapping = {
        idle: ["Idle", "Stand"],
        movement: ["Movement", "Run", "Walk"],
        attack: ["Attack", "Fire"]
    };

export const soldierAnimationMapping: AnimationMapping = {
        idle: ["Idle", "Stand"],
        movement: ["Run", "Walk"],
        attack: ["Fire"],
        defensive: ["Defensive"]
    };

    export function getBannerLevelString(level: BannerLevel): string {
      return BannerLevel[level];
    }
    

    export const getUnitAbilities = (unitType: UnitType): UnitAbilities => {
      switch (unitType) {
          case UnitType.Infantry:
              return {
                  attack: 2, defend: 2,
                  patrol: 1, stealth: 1, recon: 0,
                  hack: 0, repair: 0, airlift: 0,
                  bombard: 0, submerge: 0
              };
          case UnitType.Armored:
              return {
                  attack: 3, defend: 3,
                  patrol: 1, stealth: 0, recon: 0,
                  hack: 0, repair: 1, airlift: 0,
                  bombard: 2, submerge: 0
              };
          case UnitType.Naval:
              return {
                  attack: 2, defend: 2,
                  patrol: 2, stealth: 1, recon: 1,
                  hack: 0, repair: 1, airlift: 0,
                  bombard: 2, submerge: 1
              };
          case UnitType.Air:
              return {
                  attack: 2, defend: 1,
                  patrol: 2, stealth: 1, recon: 2,
                  hack: 0, repair: 0, airlift: 2,
                  bombard: 1, submerge: 0
              };
          case UnitType.Cyber:
              return {
                  attack: 1, defend: 1,
                  patrol: 0, stealth: 2, recon: 2,
                  hack: 3, repair: 2, airlift: 0,
                  bombard: 0, submerge: 0
              };
          default:
              throw new Error("Invalid unit type");
      }
  }


  export function abilityStringToEnum(ability: string): AbilityType | undefined {
    // If the ability is "Attack", explicitly return 0
    console.log(ability)
    if (ability === "Attack") return AbilityType.Attack;
    
    return AbilityType[ability as keyof typeof AbilityType];
}



export const NovaWarhoundPoints: Vector3[] = [
  new Vector3(-701.1143110284269, -4.724697113037109, -613.5130894128426),
  new Vector3(135.2915183946171, -4.724697113036996, 140.48346988813887),
  new Vector3(930.3866023298494, -4.724697113036996, -253.01963900603135),
  new Vector3(554.3687183857892, -4.724697113037223, -606.869953651963)
];


export const IronforgePoints: Vector3[] = [
  new Vector3(-40.34674016534149, -4.724697113037109, 246.94971527372445),
  new Vector3(-41.92048839982266, -4.724697113037109, 797.001260541894),
  new Vector3(918.0348243184673, -4.724697113037109, 794.4816519981175),
  new Vector3(929.6542846267871, -4.724697113037109, -201.31500393718164)
];


export const RadiantShoresPoints: Vector3[] = [
  new Vector3(-44.196680927944726, -4.7246971130370525, 241.8750392048088),
  new Vector3(-168.20402177229565, -4.724697113037109, 132.66805411641394),
  new Vector3(-224.44661019700706, -4.724697113037109, 241.57445828506684),
  new Vector3(-596.1817341386354, -4.724697113037109, 247.93515516561172),
  new Vector3(-923.7357331408812, -4.724697113037109, 789.4817941049374),
  new Vector3(-5.241598217332637, -4.7246971130370525, 800.4915650788527)
];



export const SkullcragPoints: Vector3[] = [
  new Vector3(-210.01917913768062, 3.334695195105759, 213.63762816982944),
  new Vector3(-175.03646913444982, -4.724697113037109, 130.5347643517446),
  new Vector3(-196.65097201368565, -4.724697113037102, 76.48515275188214),
  new Vector3(-292.9622171292379, -4.724697113037109, 70.40431770105654),
  new Vector3(-170.27564772619093, -4.724697113037095, -120.70127057236148),
  new Vector3(-889.8629214636325, -4.724697113037109, -570.6022537156441),
  new Vector3(-939.2950710815101, -4.724697113037109, 190.73043485634932)
];

export const regions: Region[] = [
  { name: "RadiantShores", points: RadiantShoresPoints },
  { name: "Ironforge", points: IronforgePoints },
  { name: "NovaWarhound", points: NovaWarhoundPoints },
  { name: "Skullcrag", points: SkullcragPoints },
  // Add Skullcrag when you have its points
];


export const isHost = (arena: string, address: string) => {
  return arena === removeLeadingZeros(address);
};

const OFFSET = BigInt(2 ** 255); // Half of the u256 range (for 256-bit unsigned integers)
const SCALE = BigInt(1e18); // Use SCALE to maintain high precision

// Encoder: Shift the position by adding the OFFSET to handle negative values.
export const positionEncoder = (position: Vector3): EncodedVector3 => {

  const x = BigInt(Math.floor(position.x * Number(SCALE))) + OFFSET;
  const y = BigInt(Math.floor(position.y * Number(SCALE))) + OFFSET;
  const z = BigInt(Math.floor(position.z * Number(SCALE))) + OFFSET;

  return {
    x: bigintToU256(x),
    y: bigintToU256(y),
    z: bigintToU256(z)
  };
};

// Decoder: Subtract the OFFSET and divide by SCALE to recover the original value.
export const positionDecoder = (encodedPosition: EncodedVector3): Vector3 => {

  const x = Number(Uint256ToBigint(encodedPosition.x )- OFFSET) / Number(SCALE);
  const y = Number(Uint256ToBigint(encodedPosition.y )- OFFSET) / Number(SCALE);
  const z = Number(Uint256ToBigint(encodedPosition.z) - OFFSET) / Number(SCALE);

  return new Vector3(parseFloat(x.toString()), parseFloat(y.toString()), parseFloat(z.toString()));
};



// export async function fetchAllEntities(
//   client: ToriiClient,
//   updateTiles?: (tiles: Record<string, Game>) => void,
// ): Promise<Record<string, Game>> {
//   let allGames: Record<string, Game> = {}
//   let cursor = 0
//   let hasMore = true
//   const size = 100000

//   while (hasMore) {
//     const entities = await client.getEntities({
//       clause: {
//         Member: {
//           member: 'game_id',
//           model: 'command_nexus-Game',
//           operator: 'Neq',
//           value: {
//             Primitive: {
//               ContractAddress: '0x0',
//             },
//           },
//         },
//       },
//       limit: size,
//       offset: cursor,
//       dont_include_hashed_keys: true,
//     })

//     const fetchedTiles = Object.values(entities).reduce(
//       (acc, entity) => {
//         if (!entity['command_nexus-Game']) {
//           return acc
//         }

//         const tile = parseTileModel(entity['command_nexus-Game'])
//         acc[`${tile.x},${tile.y}`] = tile
//         return acc
//       },
//       {} as Record<string, Game>,
//     )

//     allGames = { ...allGames, ...fetchedTiles }

//     if (updateTiles) {
//       updateTiles(fetchedTiles)
//     }

//     const fetchedCount = Object.keys(entities).length
//     cursor += fetchedCount
//     hasMore = fetchedCount === size
//   }

//   return allGames
// }
// Color mapping system for military regions
export const RegionColorSystem = {
  // Color constants
  COLORS: {
      BRILLIANT_AZURE: new Color3(0.0, 0.7, 1.0),
      POLISHED_SILVER: new Color3(0.8, 0.8, 0.8),
      CRIMSON_RED: new Color3(1.0, 0.0, 0.0),
      BRILLIANT_GOLD: new Color3(1.0, 0.8, 0.0),
      EMERALD_GREEN: new Color3(0.0, 0.8, 0.0)
  },

  // Default mappings
  DEFAULT_MAPPINGS: {
      RadiantShores: 'BRILLIANT_AZURE',
      Ironforge: 'POLISHED_SILVER',
      Skullcrag: 'CRIMSON_RED',
      NovaWarhound: 'BRILLIANT_GOLD',
      SavageCoast: 'EMERALD_GREEN'
  },

  // Get color for a region
  getRegionColor(regionName, customMappings = null) {
      const mappings = customMappings || this.DEFAULT_MAPPINGS;
      const colorKey = mappings[regionName];
      return this.COLORS[colorKey] || this.COLORS.BRILLIANT_AZURE; // Default to azure if not found
  },




};


export const guideContent = [
  {
      gType: 'section',
      data: {
          title: 'Welcome to Tutorial',
          content: 'Learn how to control and manage your troops effectively in this guide.'
      }
  },
  {
      gType: 'image',
      data: {
          url: '/images/im1.PNG',
          width: '400px',
          height: '225px'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Basic Controls',
          content: 'Your control panel contains several important buttons: Deploy (bottom), Heal and Boost (center), and an Info guide (top). Each serves a crucial function in managing your units.'
      }
  },
  {
      gType: 'image',
      data: {
          url: '/images/sec4.PNG',
          width: '400px',
          height: '225px'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Deploy Units',
          content: 'The large green circle at the bottom is your Deploy button. Click it to place new units on the battlefield. This is your primary way of building your army.'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Unit Management',
          content: 'In the center panel, you have two key abilities:\n\n• Heal (♥): Select an injured unit and press Heal to restore their health\n• Boost (⚡): Increases unit energy for special actions\n\nRemember: Every action consumes energy, so manage your resources wisely!'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Help & Information',
          content: 'The "i" button at the top right will open this guide anytime you need to review the controls. Use it to refresh your memory about game mechanics and unit management.'
      }
  },
  {
      gType: 'image',
      data: {
          url: '/images/sec3.PNG', // The unit actions control panel image
          width: '400px',
          height: '100px'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Unit States',
          content: 'Units can be assigned different states:\n\n• Attack: Click unit, select attack, then click target unit\n• Defend: Holds position and engages nearby enemies\n• Patrol: Guards an area in a repeated pattern\n• Stealth: Moves quietly, harder to detect'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Movement',
          content: 'To move a unit:\n1. Select your unit\n2. Look for the crosshair cursor (+)\n3. Click the destination\n\nIMPORTANT: Each movement costs energy. Plan your moves carefully and avoid long distances in single moves.'
      }
  },
  {
      gType: 'image',
      data: {
          url: '/images/sec6.PNG',
          width: '400px',
          height: '225px'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Base Insignias',
          content: ''
      }
  },
  {
      gType: 'image',
      data: {
          url: '/images/sec2.PNG', // Unit info panes image
          width: '400px',
          height: '225px'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Unit Information Display',
          content: 'Click on any unit to view its detailed information. The info panes show crucial stats about your selected unit:'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Unit Stats',
          content: '• Health: Current unit health points\n• Energy: Available energy for actions\n• Accuracy: Hit chance in combat\n• Range: Attack and visibility range\n• Unit ID: Unique identifier\n• Player: Owner of the unit\n• Mode: Current unit state (Attack/Defend/Patrol/Stealth/Move)'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Live Updates',
          content: 'The information panes update in real-time as you select different units or when unit stats change during gameplay. Keep an eye on energy levels - they affect your unit\'s ability to perform actions!'
      }
  },
  {
      gType: 'image',
      data: {
          url: '/images/sec1.PNG', // Commander info bar image
          width: '1200px',
          height: '40px'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Commander Information',
          content: 'The top bar shows your commander status. From left to right:\n\n• Commander Name\n• Home Base (with insignia)\n• Military Rank\n• Captured Flags Count\n• Available Boosts\n• Score\n• Available Commands\n• Turn Status Button'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Command System',
          content: 'Commands are your action points for troop control:\n\n• Start with 8 commands in your first turn\n• Renewed to 3 commands in subsequent turns\n• Each action type (Attack/Defend/Patrol/Move) can only be used once before switching\n• Plan your actions carefully - commands are precious resources!'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Turn Management',
          content: 'The End Turn button indicates your turn status:\n\n• Green: It\'s your turn - take your actions\n• Red: Opponent\'s turn - plan your next moves\n\nStrategic Tip: Always monitor your units\' health and energy levels when planning commands. Efficient command usage is key to victory!'
      }
  },    {
      gType: 'section',
      data: {
          title: 'Combat Mechanics',
          content: 'Unit states affect combat performance:\n\n• Attack Bonuses:\n  - Attacking mode: +10 attack\n  - Stealth mode: +15 attack (highest)\n  - Recon mode: +5 attack\n\n• Defense Bonuses:\n  - Defending mode: +15 defense (highest)\n  - Patrol mode: +5 defense\n  - Stealth mode: +10 defense'
      }
  },
  {
    gType: 'image',
    data: {
        url: '/images/sec5.PNG',
        width: '400px',
        height: '225px'
    }
  },
  {
      gType: 'section',
      data: {
          title: 'Victory Conditions',
          content: 'Win the game by achieving either:\n\n• Capture 5 flags\n• Eliminate 5 enemy units\n\nStrategize your approach based on the battlefield situation!'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Points & Modes',
          content: 'Points earned vary by unit states:\n\nHighest Reward Targets:\n• Stealthed units: 40 points\n• Defending units: 35 points\n• Attacking units: 30 points\n\nAttacking From:\n• Stealth: 40 points\n• Recon: 30 points\n• Idle: 25 points\n\nTip: Stealth operations offer the highest risk/reward ratio!'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Ranks & Progression',
          content: 'Earn points to progress through ranks:\n\n• Recruit → Soldier → Veteran → Elite\n• Commander → Legend → Mythic\n\nEarn points through strategic combat and flag captures!'
      }
  },
  {
      gType: 'section',
      data: {
          title: 'Boost System',
          content: 'Boost resource management:\n\n• Earn boost by:\n  - Eliminating enemy units\n  - Capturing flags\n\n• Spend boost on:\n  - Healing units (20 boost)\n  - Boosting unit energy (20 boost)\n\nStrategic tip: Save boosts for critical moments in battle!'
      }
  }
];



export const getElementStoreState = () => {
    return useElementStore.getState();
  };