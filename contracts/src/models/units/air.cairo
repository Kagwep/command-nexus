use contracts::models::battlefield::BattlefieldName;
use contracts::models::position::Position;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct AirUnit {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    range: u64,
    firepower: u32,
    accuracy: u8,
    accessories: AirUnitAccessories,
    health: AirUnitHealth,
    position: Position,
    battlefield_name: BattlefieldName,
    altitude: u32,  // New field for air units
    max_speed: u32, // New field for air units
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct AirUnitAccessories {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    missiles: u32,
    flares: u32,
    fuel: u32,
    radar_jammer: u32,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct AirUnitHealth {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    hull_integrity: u32,
    engine_health: u32,
}