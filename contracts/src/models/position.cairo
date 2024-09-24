use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, Introspect)]
pub struct Position {
    coord: Vec3,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct Vec3 {
    x: u32,
    y: u32,
    z: u32
}
