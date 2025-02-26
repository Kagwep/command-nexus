import { Scene, Color3 } from "@babylonjs/core";
import { BattlefieldNameEnum, Game, Player } from '@/dojogen/models.gen';
import { feltToStr, hexToUtf8 } from '../utils/unpack';
import { BigNumberish } from 'starknet';
import { default as MainGameState } from '@/utils/gamestate';

const COLORS = {
    BRILLIANT_AZURE: new Color3(0.0, 0.7, 1.0),
    POLISHED_SILVER: new Color3(0.8, 0.8, 0.8),
    CRIMSON_RED: new Color3(1.0, 0.0, 0.0),
    BRILLIANT_GOLD: new Color3(1.0, 0.8, 0.0),
    EMERALD_GREEN: new Color3(0.0, 0.8, 0.0)
};

const BASE_MAPPINGS = {
    RadiantShores: 'BRILLIANT_AZURE',
    Ironforge: 'POLISHED_SILVER',
    Skullcrag: 'CRIMSON_RED',
    NovaWarhound: 'BRILLIANT_GOLD',
    SavageCoast: 'EMERALD_GREEN'
};

export class GameResultsUI {
    private container: HTMLDivElement;
    private scene: Scene;
    private set_game_state: (game_state: MainGameState) => void
    
    constructor(scene: Scene,set_game_state: (game_state: MainGameState) => void) {
        this.scene = scene;
        this.container = document.createElement('div');
        this.container.id = "game-results-container-" + Date.now(); // Add unique ID
        this.container.style.position = 'absolute';
        this.container.style.zIndex = '10';
        this.container.style.pointerEvents = 'none';
        document.body.appendChild(this.container);
        this.set_game_state = set_game_state
    }
    
    private colorToHex(color: Color3): string {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    private getHomeBaseColor(homeBase: BattlefieldNameEnum): string {
        const colorKey = BASE_MAPPINGS[homeBase as unknown as string] || 'POLISHED_SILVER';
        return this.colorToHex(COLORS[colorKey]);
    }
    
    private getPlayerName(nameField: BigNumberish): string {
        try {
            return hexToUtf8(feltToStr(nameField).toString());
        } catch (e) {
            return "Unknown Commander";
        }
    }
    
    public showGameResults(game: Game, players: Record<string, Player>): void {
        const htmlContent = document.createElement('div');
        htmlContent.className = 'fixed inset-0 flex items-center justify-center';
        htmlContent.style.pointerEvents = 'auto';
        
        // Convert record to array
        const playersArray = Object.values(players);
        
        // Find the winning player
        const winnerPlayerId = game.winner;
        const winnerPlayer = playersArray.find(p => p.address === winnerPlayerId);
        
        // Filter players that belong to this game
        const gamePlayersArray = playersArray.filter(p => p.game_id.toString() === game.game_id.toString());
        
        // Sort players by score for leaderboard
        const sortedPlayers = [...gamePlayersArray].sort((a, b) => 
            Number(b.player_score.score) - Number(a.player_score.score)
        );
        
        htmlContent.innerHTML = `
            <div class="w-[800px] h-[600px] bg-black/90 rounded-lg flex flex-col border-2 border-green-500/50">
                <div class="h-[60px] bg-green-900/50 rounded-t-lg flex items-center justify-between px-5">
                    <h2 class="text-green-400 text-2xl font-mono">OPERATION ${Number(game.game_id)} COMPLETE</h2>
                    <button class="w-10 h-10 bg-black/50 text-green-400 rounded-lg hover:bg-green-900/70 transition-colors border border-green-500/50">
                        X
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    ${this.generateWinnerSection(winnerPlayer, game)}
                    ${this.generateLeaderboard(sortedPlayers)}
                    ${this.generateGameStats(game)}
                </div>
                
                <div class="h-[60px] bg-green-900/50 rounded-b-lg flex items-center justify-center">
                    <button class="px-6 py-2 bg-black/50 text-green-400 rounded-lg hover:bg-green-900/70 transition-colors border border-green-500/50 font-mono">
                        RETURN TO BASE
                    </button>
                </div>
            </div>
        `;
        
        this.container.appendChild(htmlContent);
        
        const closeButton = htmlContent.querySelector('button');
        closeButton?.addEventListener('click', () => {
            this.closeGameResults();
        });
        
        const returnButton = htmlContent.querySelectorAll('button')[1];
        returnButton?.addEventListener('click', () => {
            this.closeGameResults();
        });
        
        // Add custom scrollbar styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #111111;
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #33553377;
                border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #447744;
            }
        `;
        document.head.appendChild(style);
    }
    
    private generateWinnerSection(winner: Player, game: Game): string {
        if (!winner) return '';
        
        const winnerName = winner.name.toString();
        const homeBase = winner.home_base as unknown as string;
        const homeBaseColor = this.getHomeBaseColor(winner.home_base as BattlefieldNameEnum);
        
        return `
            <div class="mb-8 text-center">
                <div class="text-4xl text-green-400 font-mono mb-2">🏆 VICTOR DECLARED 🏆</div>
                <div class="text-5xl font-bold mb-4" style="color: ${homeBaseColor}">${winnerName}</div>
                <div class="flex justify-center items-center gap-3 mb-2">
                    <span class="text-green-400 font-mono">HOME BASE:</span>
                    <span class="px-3 py-1 bg-green-900/30 rounded border border-green-500/30 font-mono" style="color: ${homeBaseColor}">
                        ${homeBase}
                    </span>
                </div>
                <div class="mt-4 flex justify-center gap-8">
                    <div class="text-center">
                        <div class="text-green-400 font-mono">⚔️ KILLS</div>
                        <div class="text-2xl text-white font-bold">${Number(winner.player_score.kills)}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-green-400 font-mono">☠️ DEATHS</div>
                        <div class="text-2xl text-white font-bold">${Number(winner.player_score.deaths)}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-green-400 font-mono">🏁 FLAGS</div>
                        <div class="text-2xl text-white font-bold">${Number(winner.flags_captured)}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-green-400 font-mono">📊 SCORE</div>
                        <div class="text-2xl text-white font-bold">${Number(winner.player_score.score)}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    private generateLeaderboard(players: Player[]): string {
        return `
            <div class="mb-6">
                <h3 class="text-green-400 text-xl font-mono mb-3">📋 LEADERBOARD</h3>
                <div class="bg-black/50 border border-green-500/30 rounded-lg p-2">
                    <table class="w-full">
                        <thead>
                            <tr class="text-green-400 font-mono border-b border-green-500/30">
                                <th class="p-2 text-left">RANK</th>
                                <th class="p-2 text-left">COMMANDER</th>
                                <th class="p-2 text-center">HOME BASE</th>
                                <th class="p-2 text-center">⚔️</th>
                                <th class="p-2 text-center">☠️</th>
                                <th class="p-2 text-center">🏁</th>
                                <th class="p-2 text-right">SCORE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${players.map((player, i) => {
                                const playerName = player.name.toString();
                                const homeBase = player.home_base as unknown as string;
                                const homeBaseColor = this.getHomeBaseColor(player.home_base as BattlefieldNameEnum);
                                return `
                                    <tr class="border-b border-green-500/10 text-white">
                                        <td class="p-2 text-left font-mono">${i + 1}</td>
                                        <td class="p-2 text-left font-bold" style="color: ${homeBaseColor}">${playerName}</td>
                                        <td class="p-2 text-center">${homeBase}</td>
                                        <td class="p-2 text-center">${Number(player.player_score.kills)}</td>
                                        <td class="p-2 text-center">${Number(player.player_score.deaths)}</td>
                                        <td class="p-2 text-center">${Number(player.flags_captured)}</td>
                                        <td class="p-2 text-right font-bold">${Number(player.player_score.score)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    private generateGameStats(game: Game): string {
        return `
            <div class="mb-6">
                <h3 class="text-green-400 text-xl font-mono mb-3">🎮 OPERATION DETAILS</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-black/50 p-4 rounded-lg border border-green-500/30">
                        <div class="text-green-400 font-mono mb-1">OPERATION ID</div>
                        <div class="text-white text-lg">#${Number(game.game_id)}</div>
                    </div>
                    <div class="bg-black/50 p-4 rounded-lg border border-green-500/30">
                        <div class="text-green-400 font-mono mb-1">PLAYER COUNT</div>
                        <div class="text-white text-lg">${Number(game.player_count)}/4</div>
                    </div>
                    <div class="bg-black/50 p-4 rounded-lg border border-green-500/30">
                        <div class="text-green-400 font-mono mb-1">TOTAL UNITS DEPLOYED</div>
                        <div class="text-white text-lg">${Number(game.unit_count)}</div>
                    </div>
                    <div class="bg-black/50 p-4 rounded-lg border border-green-500/30">
                        <div class="text-green-400 font-mono mb-1">TOTAL MOVES</div>
                        <div class="text-white text-lg">${Number(game.minimum_moves)}</div>
                    </div>
                </div>
            </div>
        `;
    }
    private closeGameResults(): void {
        // Clear all children from the container
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        
            // Hide the container
        this.container.style.display = 'none';
            // Navigate to main menu
            // Create a completely new container
        const newContainer = document.createElement('div');
        const newId = "game-results-container-" + Date.now();
        newContainer.id = newId;
        newContainer.style.position = 'absolute';
        newContainer.style.zIndex = '10';
        newContainer.style.pointerEvents = 'none';
        document.body.appendChild(newContainer);
        
        // Update the reference
        this.container = newContainer;

        this.set_game_state(MainGameState.MainMenu);

        this.dispose();
    }
    public dispose(): void {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}