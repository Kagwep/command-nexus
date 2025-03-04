import React, { useState, useMemo } from 'react';
import { Player } from '@/dojogen/models.gen';
import { BigNumberish } from 'starknet';



type SortKey = 'score' | 'kills' | 'deaths' | 'kd_ratio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Record<string, Player>;
  gameId: string;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  players,
  gameId
}) => {
  const [sortBy, setSortBy] = useState<SortKey>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Handle sort when a column header is clicked
  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc'); // Default to descending when changing sort column
    }
  };

  // Convert player record to array and sort based on criteria
  const sortedPlayers = useMemo(() => {
    const playerArray = Object.entries(players).map(([address, player]) => ({
      ...player,
      address
    }));

    return playerArray.sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;

      if (sortBy === 'score') {
        aValue = Number(a.player_score.score);
        bValue = Number(b.player_score.score);
      } else if (sortBy === 'kills') {
        aValue = Number(a.player_score.kills);
        bValue = Number(b.player_score.kills);
      } else if (sortBy === 'deaths') {
        aValue = Number(a.player_score.deaths);
        bValue = Number(b.player_score.deaths);
      } else if (sortBy === 'kd_ratio') {
        const aDeaths = Number(a.player_score.deaths) || 1; // Avoid division by zero
        const bDeaths = Number(b.player_score.deaths) || 1;
        aValue = Number(a.player_score.kills) / aDeaths;
        bValue = Number(b.player_score.kills) / bDeaths;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [players, sortBy, sortOrder]);

  // Get appropriate emoji for rank
  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}`;
    }
  };

  // Get K/D ratio with appropriate styling
  const getKDRatio = (kills: BigNumberish, deaths: BigNumberish) => {
    const k = Number(kills);
    const d = Number(deaths) || 1; // Avoid division by zero
    const ratio = (k / d).toFixed(2);
    
    // Determine color based on K/D ratio
    let colorClass = 'text-gray-400'; // Default
    if (k / d >= 2) colorClass = 'text-green-400'; // Great
    else if (k / d >= 1) colorClass = 'text-blue-400'; // Good
    else colorClass = 'text-red-400'; // Poor
    
    return <span className={colorClass}>{ratio}</span>;
  };

  // Get appropriate emoji for K/D performance
  const getPerformanceEmoji = (kills: BigNumberish, deaths: BigNumberish) => {
    const k = Number(kills);
    const d = Number(deaths) || 0;
    
    if (k === 0 && d === 0) return '🔄';
    if (k / (d || 1) >= 3) return '🔥';
    if (k / (d || 1) >= 2) return '⚡';
    if (k / (d || 1) >= 1) return '✅';
    if (k / (d || 1) >= 0.5) return '⚠️';
    return '💀';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* Modal backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="relative font-vt323 max-w-2xl w-full border border-green-500/30 bg-black/90 text-white p-4 mx-4">
        {/* Header */}
        <div className="border-b border-green-500/30 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-green-400 font-mono text-2xl">
                COMBAT PERFORMANCE // GAME #{gameId}
              </h3>
            </div>
            <div className="text-green-500/60 font-mono text-xs">
              [CONFIDENTIAL]
            </div>
          </div>
        </div>

        {/* Grid background effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
          
          {sortedPlayers.length > 0 ? (
            <div className="mt-4 relative">
              {/* Leaderboard Table */}
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-green-500/30 bg-green-900/20">
                    <th className="text-green-400 font-mono text-center p-2 w-12">RANK</th>
                    <th className="text-green-400 font-mono text-left p-2">OPERATOR</th>
                    <th 
                      className="text-green-400 font-mono text-center p-2 cursor-pointer hover:bg-green-900/40"
                      onClick={() => handleSort('score')}
                    >
                      SCORE {sortBy === 'score' && (sortOrder === 'desc' ? '▼' : '▲')}
                    </th>
                    <th 
                      className="text-green-400 font-mono text-center p-2 cursor-pointer hover:bg-green-900/40"
                      onClick={() => handleSort('kills')}
                    >
                      KILLS {sortBy === 'kills' && (sortOrder === 'desc' ? '▼' : '▲')}
                    </th>
                    <th 
                      className="text-green-400 font-mono text-center p-2 cursor-pointer hover:bg-green-900/40"
                      onClick={() => handleSort('deaths')}
                    >
                      DEATHS {sortBy === 'deaths' && (sortOrder === 'desc' ? '▼' : '▲')}
                    </th>
                    <th 
                      className="text-green-400 font-mono text-center p-2 cursor-pointer hover:bg-green-900/40"
                      onClick={() => handleSort('kd_ratio')}
                    >
                      K/D {sortBy === 'kd_ratio' && (sortOrder === 'desc' ? '▼' : '▲')}
                    </th>
                    <th className="text-green-400 font-mono text-center p-2">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map((player, index) => (
                    <tr 
                      key={player.address.toString()} 
                      className="border-b border-green-500/10 hover:bg-green-900/10"
                    >
                      <td className="text-center font-bold p-2">
                        {getRankEmoji(index)}
                      </td>
                      <td className="font-mono p-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>{String(player.name).substring(0, 15)}</span>
                        </div>
                      </td>
                      <td className="text-center font-bold text-yellow-400 p-2">
                        {Number(player.player_score.score).toLocaleString()}
                      </td>
                      <td className="text-center text-green-400 p-2">
                        {Number(player.player_score.kills).toLocaleString()}
                      </td>
                      <td className="text-center text-red-400 p-2">
                        {Number(player.player_score.deaths).toLocaleString()}
                      </td>
                      <td className="text-center p-2">
                        {getKDRatio(player.player_score.kills, player.player_score.deaths)}
                      </td>
                      <td className="text-center text-xl p-2">
                        {getPerformanceEmoji(player.player_score.kills, player.player_score.deaths)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Scanning line effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-scan" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-green-400 text-xl mb-2">NO COMBAT DATA AVAILABLE</div>
              <div className="text-green-500/60">Awaiting field reports...</div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-green-500/30 mt-4">
          <div className="text-green-500/60 font-mono text-xs">
            SYSTEM: COMBAT-ANALYTICS-MODULE-V2.4
          </div>
          <button 
            onClick={onClose}
            className="bg-green-900/20 hover:bg-green-800/40 text-green-400 border border-green-500/30 font-mono px-4 py-2 flex items-center"
          >
            <span className="mr-2">◈</span> CLOSE <span className="ml-2">◈</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;

