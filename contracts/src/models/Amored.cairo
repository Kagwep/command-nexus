use starknet::ContractAddress;

use contracts::models::position::Position;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Amored {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    accuracy: u8,
    firepower: u32,
    range: u64,
    accessories: AmoredAccessories,
    Amored_health: Amored_health,
    position: Position,
}

#[derive(Copy, Drop, Serde)]
struct AmoredAccessories {
    fuel: u32,
    ammunition: u32,
}

#[derive(Copy, Drop, Serde)]
struct AmoredHealth {
    shield_strength: u32,
}
