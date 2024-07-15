use starknet::ContractAddress;

use contracts::models::position::Position;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Ship {
    #[key]
    game_id: u32,
    #[key]
    player: ContractAddress,
    range: u64,
    firepower: u32,
    accuracy: u8,
    ship_accessories: ShipAccessories,
    ship_health: ShipHealth,
    position: Position
}

#[derive(Copy, Drop, Serde)]
struct ShipAccessories {
    fuel: u32,
    ammunition: u32,
}

#[derive(Copy, Drop, Serde)]
struct ShipHealth {
    hull_integrity: u32,
    shield_strength: u32,
}

