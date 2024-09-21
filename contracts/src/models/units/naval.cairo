use starknet::ContractAddress;

use contracts::models::position::Position;
use contracts::models::battlefield::BattlefieldName;


#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Ship {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player: ContractAddress,
    range: u64,
    firepower: u32,
    accuracy: u8,
    ship_accessories: ShipAccessories,
    ship_health: ShipHealth,
    position: Position,
    battlefield_name:BattlefieldName,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct ShipAccessories {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    fuel: u32,
    ammunition: u32,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct ShipHealth {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    hull_integrity: u32,
    shield_strength: u32,
}

