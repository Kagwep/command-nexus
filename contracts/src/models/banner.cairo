#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
enum BannerLevel {
    Recruit,
    Soldier,
    Veteran,
    Elite,
    Commander,
    Legend,
    Mythic
}


#[derive(Component, Copy, Drop, Serde, SerdeLen)]
#[dojo::model]
struct Banner {
    #[key]
    id: u32,
    design: u16,
    color: u32,
    level: BannerLevel,
    required_player_level: u8,
}