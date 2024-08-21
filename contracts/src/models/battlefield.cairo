use starknet::ContractAddress;

#[derive(Serde, Drop, Copy, PartialEq, Introspect)]
enum BattlefieldName {
    None,
    RadiantShores,
    Ironforge,
    Skullcrag,
    NovaWarhound,
    SavageCoast,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct UrbanBattlefield {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    name: BattlefieldName,
    size: Vec3,
    weather: WeatherCondition,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Scoreboard {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    player_count: u8,
    top_score: u32,
    last_updated: u64,  
}


#[derive(Copy, Drop, Serde, Introspect)]
struct Vec3 {
    x: u32,
    y: u32,
    z: u32,
}

#[derive(Serde, Drop, Copy, PartialEq, Introspect)]
enum WeatherCondition {
    None,
    Clear,
    Rainy,
    Foggy,
    Stormy,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct WeatherEffect {
    #[key]
    game_id: u32,
    #[key]
    player_id: ContractAddress,
    battlefield_id: u32,
    visibility: u8,
    movement_penalty: u8,
    comms_interference: u8,
}

trait BattlefieldNameTrait {
    fn from_u8(value: u8) -> Option<BattlefieldName>;
}

impl BattlefieldNameImpl of BattlefieldNameTrait {
    fn from_u8(value: u8) -> Option<BattlefieldName> {
        match value {
            0 => Option::Some(BattlefieldName::None),
            1 => Option::Some(BattlefieldName::RadiantShores),
            2 => Option::Some(BattlefieldName::Ironforge),
            3 => Option::Some(BattlefieldName::Skullcrag),
            4 => Option::Some(BattlefieldName::NovaWarhound),
            5 => Option::Some(BattlefieldName::SavageCoast),
            _ => Option::None,
        }
    }
}