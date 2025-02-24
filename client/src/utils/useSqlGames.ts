// useSqlGames.js
import { useEffect, useRef } from 'react';
import useGameStoreOne  from './gameStore';

export const useSqlGames = (pollInterval = 5000) => {
    const workerRef = useRef(null);
    const { updateGameState : updateGameStateOne } = useGameStoreOne();

    useEffect(() => {
        workerRef.current = new Worker(new URL('./sqlWorker.ts', import.meta.url));

        workerRef.current.onmessage = (event) => {
            const { type, data, loading } = event.data;

            switch (type) {
                case 'UPDATE_STATE':
                    updateGameStateOne(data);
                    break;
                    
                case 'SET_LOADING':
                    updateGameStateOne({ loading });
                    break;
            }
        };

        // Start polling
        workerRef.current.postMessage({
            type: 'START_POLLING',
            data: { pollInterval }
        });

        return () => {
            if (workerRef.current) {
                workerRef.current.postMessage({ type: 'STOP_POLLING' });
                workerRef.current.terminate();
            }
        };
    }, [pollInterval, updateGameStateOne]);

    const refetch = () => {
        if (workerRef.current) {
            workerRef.current.postMessage({ type: 'REFETCH' });
        }
    };

    return {
        ...useGameStoreOne(),
        refetch
    };
};