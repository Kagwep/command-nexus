use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo::model]
enum UnitMode {
    Idle,
    Moving,
    Attacking,
    Defending,
    Patrolling,
    Stealthed,
    Reconning,
    Healing,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct UnitsSupply {
    infantry: u32,
    armored: u32,
    air: u32,
    naval: u32,
    cyber: u32,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct UnitState {
    mode: UnitMode,
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    #[key]
    unit_id: u32,
    unit_type: u8,  // 0: infantry, 1: armored, 2: air, 3: naval, 4: cyber
    x: u32,
    y: u32,
    z: u32,
}

