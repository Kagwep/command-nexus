use starknet::ContractAddress;

use contracts::models::position::{Position,Vec3};
use contracts::models::battlefield::BattlefieldName;
use contracts::models::units::unit_states::AbilityState;


#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Ship {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    range: u64,
    firepower: u32,
    accuracy: u8,
    ship_accessories: ShipAccessories,
    ship_health: ShipHealth,
    position: Position,
    battlefield_name:BattlefieldName,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ShipAccessories {
    fuel: u32,
    main_gun_ammunition: u32,
    missile_ammunition: u32,
    torpedo_ammunition: u32,
    anti_air_ammunition: u32,
    sonar_charges: u8,
    repair_drones: u8,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ShipHealth {
    hull_integrity: u32,
    engine_integrity: u32,
    weapon_systems_integrity: u32,
    shield_strength: u32,
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum NavalAction {
    FireCannon,
    LaunchTorpedo,
    DeployRepairDrone,
    ActivateSonar,
}

#[generate_trait]
impl ShipImpl of ShipTrait {
    fn new(game_id: u32, unit_id: u32, player_id: u32, x: u32, y: u32, z: u32, battlefield_name: BattlefieldName) -> Ship {
        Ship {
            game_id,
            unit_id,
            player_id,
            range: 10000,  // Long range for naval units
            firepower: 150,
            accuracy: 80,
            ship_accessories: ShipAccessories {
                fuel: 10000,
                main_gun_ammunition: 200,
                missile_ammunition: 50,
                torpedo_ammunition: 20,
                anti_air_ammunition: 1000,
                sonar_charges: 10,
                repair_drones: 5,
            },
            ship_health: ShipHealth {
                hull_integrity: 100,
                engine_integrity: 100,
                weapon_systems_integrity: 100,
                shield_strength: 100,
            },
            position: Position { coord: Vec3 {x, y, z} },
            battlefield_name,
        }
    }

    fn update_accessories(ref self: Ship, new_accessories: ShipAccessories) {
        self.ship_accessories = new_accessories;
    }

    fn fire_main_gun(ref self: Ship, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_accessories.main_gun_ammunition > 0 {
            self.ship_accessories.main_gun_ammunition -= 1;
            // Add main gun firing logic here
        }
    }

    fn launch_missile(ref self: Ship, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_accessories.missile_ammunition > 0 {
            self.ship_accessories.missile_ammunition -= 1;
            // Add missile launching logic here
        }
    }

    fn launch_torpedo(ref self: Ship, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_accessories.torpedo_ammunition > 0 {
            self.ship_accessories.torpedo_ammunition -= 1;
            // Add torpedo launching logic here
        }
    }

    fn fire_anti_air(ref self: Ship, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_accessories.anti_air_ammunition > 0 {
            self.ship_accessories.anti_air_ammunition -= 1;
            // Add anti-air firing logic here
        }
    }

    fn use_sonar(ref self: Ship, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_accessories.sonar_charges > 0 {
            self.ship_accessories.sonar_charges -= 1;
            // Add sonar usage logic here
        }
    }

    fn deploy_repair_drone(ref self: Ship, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_accessories.repair_drones > 0 {
            self.ship_accessories.repair_drones -= 1;
            
            // Repair hull integrity
            let new_hull_integrity = self.ship_health.hull_integrity + 10;
            if new_hull_integrity > 100 {
                self.ship_health.hull_integrity = 100;
            } else {
                self.ship_health.hull_integrity = new_hull_integrity;
            }

            // Repair engine integrity
            let new_engine_integrity = self.ship_health.engine_integrity + 10;
            if new_engine_integrity > 100 {
                self.ship_health.engine_integrity = 100;
            } else {
                self.ship_health.engine_integrity = new_engine_integrity;
            }

            // Repair weapon systems integrity
            let new_weapon_systems_integrity = self.ship_health.weapon_systems_integrity + 10;
            if new_weapon_systems_integrity > 100 {
                self.ship_health.weapon_systems_integrity = 100;
            } else {
                self.ship_health.weapon_systems_integrity = new_weapon_systems_integrity;
            }
        }
    }

    fn take_damage(ref self: Ship, mut hull_damage: u32, engine_damage: u32, weapon_damage: u32, shield_damage: u32,mut ability_state: AbilityState) {
        if ability_state.is_active {
            // Handle shield damage
            if shield_damage >= self.ship_health.shield_strength {
                let overflow_damage = shield_damage - self.ship_health.shield_strength;
                self.ship_health.shield_strength = 0;
                hull_damage += overflow_damage;
            } else {
                self.ship_health.shield_strength -= shield_damage;
            }

            // Handle hull damage
            if hull_damage >= self.ship_health.hull_integrity {
                self.ship_health.hull_integrity = 0;
                ability_state.is_active = false;  // Ship is sunk
            } else {
                self.ship_health.hull_integrity -= hull_damage;
            }

            // Handle engine damage
            if engine_damage >= self.ship_health.engine_integrity {
                self.ship_health.engine_integrity = 0;
            } else {
                self.ship_health.engine_integrity -= engine_damage;
            }

            // Handle weapon system damage
            if weapon_damage >= self.ship_health.weapon_systems_integrity {
                self.ship_health.weapon_systems_integrity = 0;
            } else {
                self.ship_health.weapon_systems_integrity -= weapon_damage;
            }
        }
    }

    fn move_to(ref self: Ship, new_position: Position, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_health.engine_integrity > 0 {
            self.position = new_position;
            // Potentially consume fuel based on distance moved
        }
    }



    fn consume_fuel(ref self: Ship, amount: u32, ref ability_state: AbilityState) {
        if ability_state.is_active && self.ship_accessories.fuel >= amount {
            self.ship_accessories.fuel -= amount;
        } else if ability_state.is_active {
            self.ship_accessories.fuel = 0;
            ability_state.is_active = false;  // Ship runs out of fuel and becomes inactive
        }
    }
}