use starknet::ContractAddress;

use contracts::models::position::Position;
use contracts::models::battlefield::BattlefieldName;

#[derive(Model, Copy, Drop, Serde)]
// #[dojo::model]
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
    battlefield_name:BattlefieldName,
}

#[derive(Model, Copy, Drop, Serde)]
// #[dojo::model]
struct AmoredAccessories {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    fuel: u32,
    ammunition: u32,
}

#[derive(Model, Copy, Drop, Serde)]
// #[dojo::model]
struct AmoredHealth {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    shield_strength: u32,

}
