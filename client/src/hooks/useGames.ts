// hooks/useGames.ts
import { useEffect } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import useGameStore from '@/utils/gameStore';
import { GameQueryResponse } from '@/utils/graphql/types';
import { GAME_SUBSCRIPTION, GET_ALL_GAMES } from '@/utils/graphql/query';

export const useGames = () => {
    const { updateGameState } = useGameStore();
    
    // Query for initial data
    const { refetch } = useQuery<{ games: GameQueryResponse[] }>(GET_ALL_GAMES, {
        onCompleted: (data) => {
            updateGameState({
                games: data.games.map(g => g.command_nexus_Game),
                loading: false,
                error: null
            });
        },
        onError: (error) => {
            updateGameState({
                loading: false,
                error: error.message
            });
        }
    });

    // Subscribe to updates
    useSubscription(GAME_SUBSCRIPTION, {
        onData: ({ data }) => {
            if (data?.data?.command_nexus_GameUpdate) {
                const updatedGame = data.data.command_nexus_GameUpdate;
                const currentGames = useGameStore.getState().games;
                updateGameState({
                    games: currentGames.map(game =>
                        game.game_id === updatedGame.game_id ? updatedGame : game
                    )
                });
            }
        }
    });

    const fetchGameById = async (gameId: number) => {
        updateGameState({ loading: true });
        try {
            const response = await refetch({ gameId });
            if (response.data.games[0]) {
                updateGameState({ 
                    currentGame: response.data.games[0].command_nexus_Game,
                    loading: false 
                });
            }
        } catch (error) {
            updateGameState({
                loading: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    };

    return {
        ...useGameStore(),
        refetch,
        fetchGameById
    };
};