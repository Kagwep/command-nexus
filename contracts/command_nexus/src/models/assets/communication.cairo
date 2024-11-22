#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Communication {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    cable: Cable,
    communication_tower: CommunicationTower,
    satellite_dish: SatelliteDish,
    relay_station: RelayStation,
    control_center: ControlCenter,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Cable {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    cable_id: u32,
    cable_name: felt252,
    length: u32,
    status: felt252, // e.g. "active", "damaged"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct CommunicationTower {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    tower_id: u32,
    tower_name: felt252,
    height: u32,
    status: felt252, // e.g. "active", "under maintenance"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct SatelliteDish {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    dish_id: u32,
    dish_name: felt252,
    diameter: u32,
    status: felt252, // e.g. "active", "offline"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct RelayStation {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    station_id: u32,
    station_name: felt252,
    capacity: u32,
    status: felt252, // e.g. "active", "overloaded"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct ControlCenter {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    center_id: u32,
    center_name: felt252,
    location: felt252,
    status: felt252, // e.g. "operational", "destroyed"
}