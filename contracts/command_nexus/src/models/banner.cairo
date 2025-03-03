#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
pub enum BannerLevel {
    Recruit,
    Soldier,
    Veteran,
    Elite,
    Commander,
    Legend,
    Mythic
}


#[derive(Copy, Drop, Serde, Introspect)]
pub struct Banner {
    #[key]
    pub id: u32,
    pub design: u16,
    pub color: u32,
    pub level: BannerLevel,
    pub required_player_level: u8,
}