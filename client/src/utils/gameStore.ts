// stores/gameStore.ts
import { Game } from '@/dojogen/models.gen';
import { create } from 'zustand';


interface GameState {
    games: Game[];
    currentGame: Game | null;
    loading: boolean;
    error: string | null;
    setGames: (games: Game[]) => void;
    setCurrentGame: (game: Game | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateGameState: (state: Partial<Pick<GameState, 'games' | 'currentGame' | 'loading' | 'error'>>) => void;
}

const useGameStore = create<GameState>((set) => ({
    games: [],
    currentGame: null,
    loading: false,
    error: null,
    
    setGames: (games) => set({ games }),
    setCurrentGame: (game) => set({ currentGame: game }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    updateGameState: (partialState) => 
        set((state) => ({
            ...state,
            ...partialState
        }))
}));

export default useGameStore;