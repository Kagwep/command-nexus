// Houses.ts

import { seeds } from "./Seed";
import { Seeds } from "./Seed";

export interface House {
    houseNumber: number;
    seedsNumber: number;
    seeds:Seeds
  }
  
  export interface Houses {
    [key: string]: House;
  }
  
  export const houses: Houses = {
    'house-1': { houseNumber: 1, seedsNumber: 4 ,seeds: seeds.slice(0,4)},
    'house-2': { houseNumber: 2, seedsNumber: 4 ,seeds:seeds.slice(4,8)},
    'house-3': { houseNumber: 3, seedsNumber: 4 ,seeds: seeds.slice(8,12)},
    'house-4': { houseNumber: 4, seedsNumber: 4 ,seeds: seeds.slice(12,16)},
    'house-5': { houseNumber: 5, seedsNumber: 4 ,seeds: seeds.slice(16,20)},
    'house-6': { houseNumber: 6, seedsNumber: 4 ,seeds: seeds.slice(20,24)},
    'house-7': { houseNumber: 7, seedsNumber: 4 ,seeds: seeds.slice(24,28)},
    'house-8': { houseNumber: 8, seedsNumber: 4 ,seeds: seeds.slice(28,32)},
    'house-9': { houseNumber: 9, seedsNumber: 4 ,seeds: seeds.slice(32,36)},
    'house-10': { houseNumber: 10, seedsNumber: 4,seeds: seeds.slice(36,40)},
    'house-11': { houseNumber: 11, seedsNumber: 4,seeds: seeds.slice(40,44)},
    'house-12': { houseNumber: 12, seedsNumber: 4 ,seeds:seeds.slice(44,48)},
  };

export const housesToAccess:string[] = ['house-1', 'house-2', 'house-3', 'house-4', 'house-5', 'house-6', 'house-7', 'house-8', 'house-9', 'house-10', 'house-11', 'house-12'];
  