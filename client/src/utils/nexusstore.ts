import { create } from 'zustand';
import { Game, Infantry, Player, AbilityState, UnitState } from '@/dojogen/models.gen';

// Store types
type GameState = {
    games: Record<string, Game>;
    players: Record<string, Player>;
    infantry: Record<string, Infantry>;
    abilityState: Record<string, AbilityState>;
    unitState: Record<string, UnitState>;
    setGame: (game: Game) => void;
    setPlayer: (player: Player) => void;
    setAbilityState: (abilityState: AbilityState) => void;
    setUnitState: (abilityState: UnitState) => void;
    setInfantry: (infantry: Infantry) => void;

};

// Create store
export const useGameStore = create<GameState>((set) => ({
    games: {},
    players: {},
    infantry: {},
    unitAbilities: {},
    abilityState: {},
    unitState: {},
    
    setGame: (game) => set((state) => ({
        games: {
            ...state.games,
            [game.game_id]: game
        }
    })),
    
    setPlayer: (player) => set((state) => ({
        players: {
            ...state.players,
            [player.address]: player
        }
    })),
    
    setAbilityState: (abilityState) => set((state) => ({
        abilityState: {
            ...state.abilityState,
            [abilityState.unit_id]: abilityState
        }
    })),
    
    setInfantry: (infantry) => set((state) => ({
        infantry: {
            ...state.infantry,
            [infantry.unit_id]: infantry
        }
    })),

    setUnitState: (unitSate) => set((state) => ({
        unitState: {
            ...state.unitState,
            [unitSate.unit_id]: unitSate
        }
    })),
    
}));