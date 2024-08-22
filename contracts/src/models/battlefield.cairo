use starknet::ContractAddress;
use starknet::get_block_timestamp;


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
    player_id: u32,
    name: BattlefieldName,
    size: u32,
    weather: WeatherEffect,
    control:u16,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Scoreboard {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
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
    weather_condition: WeatherCondition,
    visibility: u8,
    movement_penalty: u8,
    comms_interference: u8,

}

trait BattlefieldNameTrait {
    fn from_u8(value: u8) -> Option<BattlefieldName>;
}

impl BattlefieldNameImpl of BattlefieldNameTrait {

    const NONE_SIZE: u32 = 0;
    const RADIANT_SHORES_SIZE: u32 = 100;
    const IRONFORGE_SIZE: u32 = 80;
    const SKULLCRAG_SIZE: u32 = 120;
    const NOVA_WARHOUND_SIZE: u32 = 90;
    const SAVAGE_COAST_SIZE: u32 = 110;

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

    fn get_size(self: BattlefieldName) -> u32 {
        match self {
            BattlefieldName::None => 0,
            BattlefieldName::RadiantShores => 100,
            BattlefieldName::Ironforge => 80,
            BattlefieldName::Skullcrag => 120,
            BattlefieldName::NovaWarhound => 90,
            BattlefieldName::SavageCoast => 110,
        }
    }
}

#[generate_trait]
impl UrbanBattlefieldImpl of UrbanBattlefieldTrait {

    #[inline(always)]
    fn new(ref self: UrbanBattlefield, game_id: u32, player_id: u32, name: BattlefieldName, weather: WeatherEffect, size: u32) -> UrbanBattlefield {

        assert(name != BattlefieldName::None, 'Cannot Occupy territory none');
        assert(weather != WeatherCondition::None, 'Must have a weather condition');



        UrbanBattlefield {
            game_id,
            player_id,
            name,
            size,
            weather,
            control: 0,
        }

    }
}

#[generate_trait]
impl WeatherEffectImpl of WeatherEffectTrait {

    #[inline(always)]
    fn get_weather_condition(self: WeatherEffect, game_id: u32) -> WeatherCondition {
        let timestamp: u64 = get_block_timestamp();
        let last_digit = timestamp % 10;
        
        // Use the last digit to determine the weather condition
        match last_digit {
            0 | 1 => WeatherCondition::None,
            2 | 3 | 4 => WeatherCondition::Clear,
            5 | 6 => WeatherCondition::Rainy,
            7 | 8 => WeatherCondition::Foggy,
            _ => WeatherCondition::Stormy,
        }
    }

    fn create(game_id: u32) -> WeatherEffect {

        let weather_condition = get_weather_condition(game_id);
        
        match weather_condition {
            WeatherCondition::None => WeatherEffect {
                game_id,
                weather_condition,
                visibility: 0,
                movement_penalty: 0,
                comms_interference: 0,
            },
            WeatherCondition::Clear => WeatherEffect {
                game_id,
                weather_condition,
                visibility: 10,
                movement_penalty: 0,
                comms_interference: 0,
            },
            WeatherCondition::Rainy => WeatherEffect {
                game_id,
                weather_condition,
                visibility: 6,
                movement_penalty: 2,
                comms_interference: 2,
            },
            WeatherCondition::Foggy => WeatherEffect {
                game_id,
                weather_condition,
                visibility: 2,
                movement_penalty: 2,
                comms_interference: 1,
            },
            WeatherCondition::Stormy => WeatherEffect {
                game_id,
                weather_condition,
                visibility: 4,
                movement_penalty: 3,
                comms_interference: 3,
            },
        }
    }
    

}