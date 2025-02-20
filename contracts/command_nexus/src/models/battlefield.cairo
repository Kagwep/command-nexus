use starknet::ContractAddress;
use starknet::get_block_timestamp;
use command_nexus::models::position::{Position, Vec3};

#[derive(Serde, Drop, Copy, PartialEq, Introspect,Destruct)]
pub enum BattlefieldName {
    None,
    RadiantShores,
    Ironforge,
    Skullcrag,
    NovaWarhound,
    SavageCoast,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct UrbanBattlefield {
    #[key]
    pub game_id: u32,
    #[key]
    pub battlefield_id: u8,
    pub player_id: u32,
    pub size: u32,
    pub weather: WeatherEffect,
    pub control:u16,
}



#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct BattlefieldFlag {
    #[key]
    pub game_id: u32,
    #[key]
    pub flag_id:u8,
    pub player: ContractAddress,
    pub position: Vec3,
    pub captured: bool,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct Scoreboard {
    #[key]
    pub game_id: u32,
    #[key]
    pub player_id: u32,
    pub player_count: u8,
    pub top_score: u32,
    pub last_updated: u64,  
}


#[derive(Serde, Drop, Copy, PartialEq, Introspect)]
pub enum WeatherCondition {
    None,
    Clear,
    Rainy,
    Foggy,
    Stormy,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct WeatherEffect {
    pub weather_condition: WeatherCondition,
    pub visibility: u8,
    pub movement_penalty: u8,
    pub comms_interference: u8,

}

pub mod battle_field_sizes {

    pub const NONE_SIZE: u32 = 0;
    pub const RADIANT_SHORES_SIZE: u32 = 100;
    pub const IRONFORGE_SIZE: u32 = 80;
    pub const SKULLCRAG_SIZE: u32 = 120;
    pub const NOVA_WARHOUND_SIZE: u32 = 90;
    pub const SAVAGE_COAST_SIZE: u32 = 110;
}

pub trait BattlefieldNameTrait {
    fn from_battlefield_id(value: u8) -> Option<BattlefieldName>;
    fn to_battlefield_id(self: BattlefieldName) -> u8;
    fn get_size(self: BattlefieldName) -> u32;
}

pub impl BattlefieldNameImpl of BattlefieldNameTrait {



    fn from_battlefield_id(value: u8) -> Option<BattlefieldName> {
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

    fn to_battlefield_id(self: BattlefieldName) -> u8{
        match self {
            BattlefieldName::None => 0,
            BattlefieldName::RadiantShores => 1,
            BattlefieldName::Ironforge => 2,
            BattlefieldName::Skullcrag => 3,
            BattlefieldName::NovaWarhound => 4,
            BattlefieldName::SavageCoast => 5,
        }
    }

    fn get_size(self: BattlefieldName) -> u32 {
        match self {
            BattlefieldName::None => battle_field_sizes::NONE_SIZE,
            BattlefieldName::RadiantShores => battle_field_sizes::RADIANT_SHORES_SIZE,
            BattlefieldName::Ironforge => battle_field_sizes::IRONFORGE_SIZE,
            BattlefieldName::Skullcrag => battle_field_sizes::SKULLCRAG_SIZE,
            BattlefieldName::NovaWarhound => battle_field_sizes::NOVA_WARHOUND_SIZE,
            BattlefieldName::SavageCoast => battle_field_sizes::SAVAGE_COAST_SIZE,
        }
    }
}



#[generate_trait]
pub impl WeatherConditionImpl of WeatherConditionTrait {
    fn calculate_weather_impact(self: WeatherCondition) -> u32 {
        match self {
            WeatherCondition::None => 100, // No impact
            WeatherCondition::Clear => 100, // Perfect conditions
            WeatherCondition::Rainy => 70,  // 30% accuracy reduction
            WeatherCondition::Foggy => 50,  // 50% accuracy reduction
            WeatherCondition::Stormy => 30, // 70% accuracy reduction
        }
    }
}

#[generate_trait]
pub impl UrbanBattlefieldImpl of UrbanBattlefieldTrait {

    #[inline(always)]
    fn new(game_id: u32,  battlefield_id: u8,player_id: u32, weather: WeatherEffect, size: u32) -> UrbanBattlefield {

        assert(battlefield_id != 0, 'Cannot Occupy territory none');
        assert(weather.weather_condition != WeatherCondition::None, 'Must have a weather condition');



        UrbanBattlefield {
            game_id,
            battlefield_id,
            player_id,
            size,
            weather,
            control: 0,
        }

    }
}

#[generate_trait]
pub impl WeatherEffectImpl of WeatherEffectTrait {



    fn create() -> WeatherEffect {

        let timestamp: u64 = get_block_timestamp();
        let last_digit = timestamp % 10;

        let weather_condition = match last_digit {
            0 | 1 => WeatherCondition::Clear,
            2 | 3 | 4 => WeatherCondition::Clear,
            5 | 6 => WeatherCondition::Rainy,
            7 | 8 => WeatherCondition::Foggy,
            _ => WeatherCondition::Stormy,
        };
        
        match weather_condition {
            WeatherCondition::None => WeatherEffect {
                weather_condition,
                visibility: 0,
                movement_penalty: 0,
                comms_interference: 0,
            },
            WeatherCondition::Clear => WeatherEffect {
                weather_condition,
                visibility: 10,
                movement_penalty: 0,
                comms_interference: 0,
            },
            WeatherCondition::Rainy => WeatherEffect {
                weather_condition,
                visibility: 6,
                movement_penalty: 2,
                comms_interference: 2,
            },
            WeatherCondition::Foggy => WeatherEffect {
                weather_condition,
                visibility: 2,
                movement_penalty: 2,
                comms_interference: 1,
            },
            WeatherCondition::Stormy => WeatherEffect {
                weather_condition,
                visibility: 4,
                movement_penalty: 3,
                comms_interference: 3,
            },
        }
    }
    

}

#[generate_trait]
pub impl BattlefieldFlagImpl of BattlefieldFlagTrait {
    

    #[inline(always)]
    fn capture(game_id: u32,player: ContractAddress,position: Vec3,flag_id:u8) -> BattlefieldFlag{
        BattlefieldFlag {
            game_id: game_id,
            flag_id: flag_id,
            player: player,
            position: position,
            captured: true,
        }
    }
}