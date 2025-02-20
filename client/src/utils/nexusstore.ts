import { create } from 'zustand';
import { Game, Infantry, Player, AbilityState, UnitState } from '../dojogen/models.gen';

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
    
    setGame: (game: Game) => set((state) => ({
        games: {
            ...state.games,
            [`${game.game_id}`]: game 
        }
    })),
    
    setPlayer: (player: Player) => set((state) => ({
        players: {
            ...state.players,
            [player.address]: player  
        }
    })),
    
    setAbilityState: (abilityState: AbilityState) => set((state) => ({
        abilityState: {
            ...state.abilityState,
            [`${abilityState.unit_id}`]: abilityState  
        }
    })),
    
    setInfantry: (infantry: Infantry) => set((state) => ({
        infantry: {
            ...state.infantry,
            [`${infantry.unit_id}`]: infantry  
        }
    })),
    
    setUnitState: (unitState: UnitState) => set((state) => ({
        unitState: {
            ...state.unitState,
            [`${unitState.unit_id}`]: unitState
        }
    })),
    
}));