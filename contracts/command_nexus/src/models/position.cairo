use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Introspect, Debug)]
pub struct Position {
    pub coord: Vec3,
}

#[derive(Copy, Drop, Serde, Introspect,PartialEq, Debug)]
pub struct Vec3 {
    pub x: u256,
    pub y: u256,
    pub z: u256
}
