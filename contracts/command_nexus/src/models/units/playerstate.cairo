
#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct UnitsSupply {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    infantry: u32,
    armored: u32,
    air: u32,
    naval: u32,
    cyber: u32,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct PlayerState {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    supply: UnitsSupply,
}