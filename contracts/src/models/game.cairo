use starknet::ContractAddress;


#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    game_id: u32,
    next_to_move: ContractAddress,
    minimum_moves: u8,
    winner: ContractAddress,
}

#[derive(Model, Copy, Drop, Serde)]
struct GameData {
    #[key]
    game_id: u32,
    number_of_players: u8
}

