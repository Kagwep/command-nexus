use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Introspect, Debug)]
pub struct Position {
    coord: Vec3,
}

#[derive(Copy, Drop, Serde, Introspect,PartialEq, Debug)]
struct Vec3 {
    x: u256,
    y: u256,
    z: u256
}
