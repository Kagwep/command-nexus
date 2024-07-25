

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Battlefield {
    #[key]
    game_id: u32,
    width: u16,
    height: u16,
    terrain_type: u8,  
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Scoreboard {
    #[key]
    game_id: u32,
    player_count: u8,
    top_score: u32,
    last_updated: u64,  // This could be a timestamp or turn number
}