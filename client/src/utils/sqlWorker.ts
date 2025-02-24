// sqlWorker.js
let isPolling = false;
let pollInterval = 5000;
let lastFetchTime = 0;

const SQL_ENDPOINT = 'http://localhost:8080/sql';

self.onmessage = async (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'START_POLLING':
            pollInterval = data.pollInterval || 5000;
            startPolling();
            break;
            
        case 'STOP_POLLING':
            stopPolling();
            break;
            
        case 'UPDATE_INTERVAL':
            pollInterval = data.interval;
            break;

        case 'REFETCH':
            await fetchGames();
            break;
    }
};

const startPolling = async () => {
    if (isPolling) return;
    isPolling = true;
    poll();
};

const stopPolling = () => {
    isPolling = false;
};

const fetchGames = async () => {
    try {
        self.postMessage({ type: 'SET_LOADING', loading: true });

        const response = await fetch(SQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: 'SELECT * FROM `command_nexus-Game`;'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const games = await response.json();

        self.postMessage({
            type: 'UPDATE_STATE',
            data: {
                games,
                loading: false,
                error: null
            }
        });

    } catch (error) {
        self.postMessage({
            type: 'UPDATE_STATE',
            data: {
                loading: false,
                error: error.message
            }
        });
    }
};

const poll = async () => {
    while (isPolling) {
        const now = Date.now();
        if (now - lastFetchTime >= pollInterval) {
            await fetchGames();
            lastFetchTime = now;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
};