// gameState.ts
import { Seeds } from "./Seed";


export type GameState = {
    username:string;
    previouseHouse:string;
    nextHouse:string[];
    onHand: Seeds;
    inPlay: Seeds;
    captured: Seeds;
    originalHouse:string[];
    room:string;
    validHouses:string[]

};

export const state: GameState = {
    username:"",
    room:"",
    previouseHouse:"",
    nextHouse:[],
    onHand: [],
    inPlay: [],
    captured: [],
    originalHouse:[],
    validHouses:[]
};

export interface PlayerState{
    [key: string] : GameState;
}

export const playersStates: PlayerState = {
    "player-1" : {
        username:"",
        room:"",
        previouseHouse:"",
        nextHouse:[],
        onHand: [],
        inPlay: [],
        captured: [],
        originalHouse:[],
        validHouses:[]
    },

    "player-2": {
        username:"",
        room:"",
        previouseHouse:"",
        nextHouse:[],
        onHand: [],
        inPlay: [],
        captured: [],
        originalHouse:[],
        validHouses:[]
    },
    
    
}


export const playerT:string = "";

export interface theStartState {
    inprogress: boolean;
    start:boolean;
    ended:boolean;
    player:string;
}

export const start:theStartState = {
    inprogress: false,
    start:true,
    ended:false,
    player:'',
}

export const movements:string[] = [];