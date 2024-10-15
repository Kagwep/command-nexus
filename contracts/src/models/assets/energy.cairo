#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum EnergyStatus {
    Active,
    UnderMaintenance,
    Dameged,
    offline,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct OilDepot {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    depot_id: u32,
    depot_name: felt252,
    capacity: u32,
    current_storage: u32,
    status: EnergyStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct SolarPowerPlant {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    plant_id: u32,
    plant_name: u32,
    power_output: felt252,
    status: EnergyStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct GasStorage {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    storage_id: u32,
    storage_name: felt252,
    capacity: u32,
    current_storage: u32,
    status: EnergyStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct GasStation {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    station_id: u32,
    station_name: felt252,
    fuel_available: u32,
    fuel_price: u32,
    status: EnergyStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct NuclearPowerStation {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    station_id: u32,
    station_name: felt252,
    power_output: u32,
    fuel_level: u32,
    status: EnergyStatus,
}