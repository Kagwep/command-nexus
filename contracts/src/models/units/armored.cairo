use starknet::ContractAddress;

use contracts::models::position::Position;
use contracts::models::battlefield::BattlefieldName;

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Armored {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u8,
    #[key]
    player_id: ContractAddress,
    accuracy: u8,
    firepower: u32,
    range: u64,
    accessories: ArmoredAccessories,
    amored_health: ArmoredHealth,
    position: Position,
    battlefield_name:BattlefieldName,
}

#[derive( Copy, Drop, Serde)]
#[dojo::model]
struct ArmoredAccessories {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    fuel: u32,
    ammunition: u32,
}

#[derive( Copy, Drop, Serde)]
#[dojo::model]
struct ArmoredHealth {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    shield_strength: u32,

}


#[generate_trait]
impl ArmoredImpl of ArmoredTrait {

}