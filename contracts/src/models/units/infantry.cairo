use contracts::models::battlefield::BattlefieldName;
use contracts::models::position::Position;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Infantry {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    range: u64,
    firepower: u32,
    accuracy: u8,
    accessories: InfantryAccessories,
    health: InfantryHealth,
    position: Position,
    battlefield_name:BattlefieldName,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct InfantryAccessories {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    ammunition: u32,
    first_aid_kit: u32,
    molotov: u32,
    grenade: u32, 
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct InfantryHealth {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    shield_strength: u32,
}



