// Import React and necessary hooks
import React from 'react';

// Define TypeScript interfaces for player data
interface Player {
    id: number;
    name: string;
    points: number;
    avatarUrl: string;
}

interface LeaderboardProps {
    players: Player[];
}

// The Leaderboard Component
const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
    return (
        <div className="max-w-screen-lg my-10 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white text-lg font-semibold p-4">Leaderboard</div>
            <ul className="divide-y divide-gray-300">
                {players.map((player) => (
                    <li key={player.id} className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                            {/* <img className="h-10 w-10 rounded-full " src={player.avatarUrl} alt={`Avatar of ${player.name}`} /> */}
                            <span className="ml-4 font-medium text-2xl">{player.name}</span>
                        </div>
                        <span className="font-medium text-indigo-600 text-2xl">{player.points} pts</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Leaderboard;
