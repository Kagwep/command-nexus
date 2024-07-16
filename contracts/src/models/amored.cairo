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
    Amored_health: AmoredHealth,
    position: Position,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct AmoredAccessories {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,

    fuel: u32,
    ammunition: u32,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct AmoredHealth {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    shield_strength: u32,

}
