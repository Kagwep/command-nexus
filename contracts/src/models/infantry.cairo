#[derive(Copy,Drop,Serde)]
#[dojo::model]
struct Infantry {
    #[key]
    game_id: u32,
    #[key]
    player_id: u256,
    range: u64,
    firepower: u32,
    accuracy: u8,
    accessories: InfantryAccessories,
    health: InfantryHealth,
    position: Position
}

#[derive(Copy, Drop, Serde)]
struct InfantryAccessories {
    ammunition: u32,
    first_aid_kit: u32,
}

#[derive(Copy, Drop, Serde)]
struct InfantryHealth {
    shield_strength: u32,
}



