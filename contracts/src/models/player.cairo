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
