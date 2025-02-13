const ALL_BASES_AVAILABLE: felt252 = 0x3e;
const SCALE: u256 = 1000000000000000000; // 1e18
const OFFSET: u256 = 2; 

const OFFSET_DISTANCE: u256 = 57896044618658097711785492504343953926634992332820282019728792003956564819968; // 2^255
// Constants for calculations
const BASE_ENERGY_COST: u32 = 2; // Base energy cost for any shot
const DISTANCE_ENERGY_MULTIPLIER: u32 = 2; // Energy cost increases with distance
const MAX_ACCURACY_PENALTY: u32 = 70; // Maximum accuracy penalty from distance
const MAX_POINT_BONUS: u32 = 40;
const BASE_DAMAGE: u32 = 20;
const DAMAGE_SCAlE_FACTOR: u32 = 3;
const RANGE_SCALE_FACTOR: u256 = 120;
const HEAL: u32 = 20;

// Air unit kill scores
const AIR_KILLS_AIR: u32 = 150;
const AIR_KILLS_INFANTRY: u32 = 100;
const AIR_KILLS_ARMORED: u32 = 200;
const AIR_KILLS_CYBER: u32 = 50;
const AIR_KILLS_NAVAL: u32 = 175;

// Infantry unit kill scores
const INFANTRY_KILLS_AIR: u32 = 250;
const INFANTRY_KILLS_INFANTRY: u32 = 100;
const INFANTRY_KILLS_ARMORED: u32 = 150;
const INFANTRY_KILLS_CYBER: u32 = 75;
const INFANTRY_KILLS_NAVAL: u32 = 100;

// Armored unit kill scores
const ARMORED_KILLS_AIR: u32 = 200;
const ARMORED_KILLS_INFANTRY: u32 = 125;
const ARMORED_KILLS_ARMORED: u32 = 175;
const ARMORED_KILLS_CYBER: u32 = 50;
const ARMORED_KILLS_NAVAL: u32 = 125;

// Cyber unit kill scores
const CYBER_KILLS_AIR: u32 = 175;
const CYBER_KILLS_INFANTRY: u32 = 75;
const CYBER_KILLS_ARMORED: u32 = 150;
const CYBER_KILLS_CYBER: u32 = 125;
const CYBER_KILLS_NAVAL: u32 = 200;

// Naval unit kill scores
const NAVAL_KILLS_AIR: u32 = 200;
const NAVAL_KILLS_INFANTRY: u32 = 75;
const NAVAL_KILLS_ARMORED: u32 = 100;
const NAVAL_KILLS_CYBER: u32 = 150;
const NAVAL_KILLS_NAVAL: u32 = 175;