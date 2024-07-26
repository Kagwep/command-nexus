use starknet::ContractAddress;

#[derive(Enum, Copy, Drop, Serde, SerdeLen)]
enum BattlefieldName {
    None,
    RadiantShores,
    Ironforge,
    Skullcrag,
    NovaWarhound,
    SavageCoast,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct UrbanBattlefield {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    name: BattlefieldName,
    size: Vec3,
    weather: WeatherCondition,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Scoreboard {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    player_count: u8,
    top_score: u32,
    last_updated: u64,  
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct MilitaryPosition {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    battlefield_id: u32,
    faction: ContractAddress,
    name: felt252,
    location: Vec3,
    control_level: u8,
}

#[derive(Copy, Drop, Serde, SerdeLen)]
struct Vec3 {
    x: u32,
    y: u32,
    z: u32,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct MilitaryUnits {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    position_id: u32,
    infantry: u16,
    special_forces: u16,
    drones: u16,
}

#[derive(Enum, Copy, Drop, Serde, SerdeLen)]
enum WeatherCondition {
    None,
    Clear,
    Rainy,
    Foggy,
    Stormy,
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct WeatherEffect {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    battlefield_id: u32,
    visibility: u8,
    movement_penalty: u8,
    comms_interference: u8,
}