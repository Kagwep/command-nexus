const ALL_BASES_AVAILABLE: felt252 = 0x3e;
const SCALE: u256 = 1000000000000000000; // 1e18
const OFFSET: u256 = 2; 

// Constants for calculations
const BASE_ENERGY_COST: u32 = 2; // Base energy cost for any shot
const DISTANCE_ENERGY_MULTIPLIER: u32 = 2; // Energy cost increases with distance
const MAX_ACCURACY_PENALTY: u32 = 70; // Maximum accuracy penalty from distance
const MAX_POINT_BONUS: u32 = 40;
const BASE_DAMAGE: u32 = 20;
const DAMAGE_SCAlE_FACTOR: u32 = 2;
const HEAL: u32 = 20;