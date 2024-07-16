use starknet::ContractAddress;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Position {
    #[key]
    player: ContractAddress,
    vec: Vec2,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
pub struct Vec2 {
    #[key]
    player: ContractAddress,
    x: u32,
    y: u32
}
