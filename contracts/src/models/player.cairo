#[derive(Copy,Drop,Serde)]
#[dojo::model]
struct Player {
    #[key]
    game_id: u32,
    #[key]
    address: starknet::ContractAddress,
    last_action:u64,
    rank: u8,
   
}


#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct PlayerScore {
    #[key]
    game_id: u32,
    player: Player,
    score: u32,
    kills: u16,
    deaths: u16,
    assists: u16,
}