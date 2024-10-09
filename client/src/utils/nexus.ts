import { create } from 'zustand';
import GameState from './gamestate';
import { AbilityType, AnimationMapping, Battle, UnitAbilities, UnitType } from './types';
import { LogType } from '../hooks/useLogs';
import { Event } from './events';

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
  last_log: LogType | null;
  set_last_log: (last_log: LogType | null) => void;
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
  setLoginScreen: (value: boolean) => void;
  screen: ScreenPage;
  setScreen: (value: ScreenPage) => void;
}

export const useElementStore = create<State>((set) => ({

  last_log: null,
  set_last_log: (last_log: LogType | null) => set(() => ({ last_log })),
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
    return AbilityType[ability as keyof typeof AbilityType];
}
