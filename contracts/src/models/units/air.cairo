use contracts::models::battlefield::BattlefieldName;
use contracts::models::position::{Position,Vec3};
use contracts::models::units::unit_states::AbilityState;

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct AirUnit {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    range: u64,
    firepower: u32,
    accuracy: u8,
    accessories: AirUnitAccessories,
    health: AirUnitHealth,
    position: Position,
    battlefield_name: BattlefieldName,
    altitude: u32,  
    max_speed: u32, 
}

#[derive(Copy, Drop, Serde, Introspect)]
struct AirUnitAccessories {
    missiles: u32,
    flares: u32,
    fuel: u32,
    radar_jammer: u32,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct AirUnitHealth {
    hull_integrity: u32,
    engine_health: u32,
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum AirUnitAction {
    LaunchMissile,
    DropBomb,
    DeployFlares,
    ChangeAltitude,
}

#[generate_trait]
impl AirUnitIMpl of AirUnitTrait{
  
    #[inline(always)]
  fn new(game_id: u32,unit_id: u32, player_id:u32,x: u256,y: u256, z: u256,battlefield_name: BattlefieldName) -> AirUnit{
    let new_position  = Vec3{
        x,
        y,
        z
    };
    AirUnit{
        game_id,
        unit_id,
        player_id,
        range:150,
        firepower:100,
        accuracy: 100,
        accessories: AirUnitAccessories {
            missiles: 16,
            flares: 30,
            fuel: 1360,
            radar_jammer:5,
        },
        health: AirUnitHealth {
            hull_integrity: 100,
            engine_health: 100,
        },
        position: Position {
            coord: new_position
        },
        battlefield_name,
        altitude:0,  
        max_speed: 2000, 
    }
  }

  fn update_accessories(ref self: AirUnit, new_accessories: AirUnitAccessories) {
    self.accessories = new_accessories;
  }

  fn fire_missile(ref self: AirUnit, ref ability_state: AbilityState) {
    if ability_state.is_active && self.accessories.missiles > 0 {
        self.accessories.missiles -= 1;
        // missile logic here
    }
  }

  fn deploy_flares(ref self: AirUnit, ref ability_state: AbilityState) {
    if ability_state.is_active && self.accessories.flares > 0 {
        self.accessories.flares -= 1;
        // flare deployment logic
    }
}

fn use_radar_jammer(ref self: AirUnit, ref ability_state: AbilityState) {
    if ability_state.is_active && self.accessories.radar_jammer > 0 {
        self.accessories.radar_jammer -= 1;
        //  radar jamming logic 
    }
}

fn take_damage(ref self: AirUnit, hull_damage: u32, engine_damage: u32, ref ability_state: AbilityState) {
    if ability_state.is_active {
        if hull_damage >= self.health.hull_integrity {
            self.health.hull_integrity = 0;
            ability_state.is_active = false;  // Unit is destroyed
        } else {
            self.health.hull_integrity -= hull_damage;
        }

        if engine_damage >= self.health.engine_health {
            self.health.engine_health = 0;
            // Potentially affect max_speed or other attributes
        } else {
            self.health.engine_health -= engine_damage;
        }
    }
}

fn repair(ref self: AirUnit, hull_repair: u32, engine_repair: u32) {
    // Repair hull integrity
    let new_hull_integrity = self.health.hull_integrity + hull_repair;
    if new_hull_integrity > 100 {
        self.health.hull_integrity = 100;
    } else {
        self.health.hull_integrity = new_hull_integrity;
    }

    // Repair engine health
    let new_engine_health = self.health.engine_health + engine_repair;
    if new_engine_health > 100 {
        self.health.engine_health = 100;
    } else {
        self.health.engine_health = new_engine_health;
    }
}

fn change_altitude(ref self: AirUnit, new_altitude: u32, ref ability_state: AbilityState) {
    if ability_state.is_active {
        self.altitude = new_altitude;
        // Potentially affect other attributes based on altitude
    }
}

fn move_to(ref self: AirUnit, new_position: Position, ref ability_state: AbilityState) {
    if ability_state.is_active {
        self.position = new_position;
        // consume fuel based on distance moved
    }
}

fn consume_fuel(ref self: AirUnit, amount: u32, ref ability_state: AbilityState) {
    if ability_state.is_active && self.accessories.fuel >= amount {
        self.accessories.fuel -= amount;
    } else if ability_state.is_active {
        self.accessories.fuel = 0;
        ability_state.is_active = false;  // Unit runs out of fuel and becomes inactive
    }
}



}