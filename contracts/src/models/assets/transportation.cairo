#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Transportation {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    airport: Airport,
    seaport: Seaport,
    railway_station: RailwayStation,
    depot: Depot
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Airport {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    airport_id: u32,
    airport_name: felt252
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Seaport {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    seaport_id: u32,
    seaport_name: felt252,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct RailwayStation {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    station_id: u32,
    station_name: felt252

}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Depot {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    depot_id: u32,
    depot_name: felt252,
}