#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Communication {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: u32,
    pub cable: Cable,
    pub communication_tower: CommunicationTower,
    pub satellite_dish: SatelliteDish,
    pub relay_station: RelayStation,
    pub control_center: ControlCenter,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Cable {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: u32,
    pub cable_id: u32,
    pub cable_name: felt252,
    pub length: u32,
    pub status: felt252, // e.g. "active", "damaged"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct CommunicationTower {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: u32,
    pub tower_id: u32,
    pub  tower_name: felt252,
    pub height: u32,
    pub status: felt252, // e.g. "active", "under maintenance"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
pub struct SatelliteDish {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: u32,
    pub dish_id: u32,
    pub dish_name: felt252,
    pub diameter: u32,
    pub status: felt252, // e.g. "active", "offline"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct RelayStation {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: u32,
    pub station_id: u32,
    pub station_name: felt252,
    pub capacity: u32,
    pub status: felt252, // e.g. "active", "overloaded"
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct ControlCenter {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: u32,
    pub center_id: u32,
    pub center_name: felt252,
    pub location: felt252,
    pub status: felt252, // e.g. "operational", "destroyed"
}