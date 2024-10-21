use starknet::ContractAddress;
use contracts::models::position::{Position,Vec3};
use contracts::models::battlefield::BattlefieldName;
use contracts::models::units::unit_states::AbilityState;

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Armored {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    accuracy: u8,
    firepower: u32,
    range: u64,
    accessories: ArmoredAccessories,
    armored_health: ArmoredHealth,
    position: Position,
    battlefield_name: BattlefieldName,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ArmoredAccessories {
    fuel: u32,
    main_gun_ammunition: u32,
    secondary_gun_ammunition: u32,
    smoke_grenades: u8,
    repair_kits: u8,
    active_protection_system: u8,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ArmoredHealth {
    hull_integrity: u32,
    turret_integrity: u32,
    track_integrity: u32,
}


#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum ArmoredAction {
    FireMainGun,
    FireSecondaryGun,
    DeploySmoke,
    UseRepairKit,
}

#[generate_trait]
impl ArmoredImpl of ArmoredTrait {

    fn new(game_id: u32, unit_id: u32, player_id: u32, x: u256, y: u256, z: u256, battlefield_name: BattlefieldName) -> Armored {
        Armored {
            game_id,
            unit_id,
            player_id,
            accuracy: 85,
            firepower: 100,
            range: 3000,
            accessories: ArmoredAccessories {
                fuel: 1000,
                main_gun_ammunition: 40,
                secondary_gun_ammunition: 1000,
                smoke_grenades: 12,
                repair_kits: 3,
                active_protection_system: 5,
            },
            armored_health: ArmoredHealth {
                hull_integrity: 100,
                turret_integrity: 100,
                track_integrity: 100,
            },
            position: Position { coord: Vec3 {x, y, z} },
            battlefield_name,
        }
    }

    fn update_accessories(ref self: Armored, new_accessories: ArmoredAccessories) {
        self.accessories = new_accessories;
    }

    fn fire_main_gun(ref self: Armored, ref ability_state: AbilityState) {
        if ability_state.is_active && self.accessories.main_gun_ammunition > 0 {
            self.accessories.main_gun_ammunition -= 1;
            // main gun firing logic 
        }
    }

    fn fire_secondary_gun(ref self: Armored, ref ability_state: AbilityState) {
        if ability_state.is_active && self.accessories.secondary_gun_ammunition > 0 {
            self.accessories.secondary_gun_ammunition -= 1;
            // secondary gun firing logic 
        }
    }

    fn deploy_smoke_grenade(ref self: Armored, ref ability_state: AbilityState) {
        if ability_state.is_active && self.accessories.smoke_grenades > 0 {
            self.accessories.smoke_grenades -= 1;
            // smoke grenade deployment logic 
        }
    }

    fn use_repair_kit(ref self: Armored, ref ability_state: AbilityState) {
        if ability_state.is_active && self.accessories.repair_kits > 0 {
            self.accessories.repair_kits -= 1;
            
            // Repair hull integrity
            let new_hull = self.armored_health.hull_integrity + 20;
            if new_hull > 100 {
                self.armored_health.hull_integrity = 100;
            } else {
                self.armored_health.hull_integrity = new_hull;
            }

            // Repair turret integrity
            let new_turret = self.armored_health.turret_integrity + 20;
            if new_turret > 100 {
                self.armored_health.turret_integrity = 100;
            } else {
                self.armored_health.turret_integrity = new_turret;
            }

            // Repair track integrity
            let new_track = self.armored_health.track_integrity + 20;
            if new_track > 100 {
                self.armored_health.track_integrity = 100;
            } else {
                self.armored_health.track_integrity = new_track;
            }
        }
    }

    fn activate_protection_system(ref self: Armored, ref ability_state: AbilityState) {
        if ability_state.is_active && self.accessories.active_protection_system > 0 {
            self.accessories.active_protection_system -= 1;
            // active protection system logic 
    }
    }

    fn take_damage(ref self: Armored, hull_damage: u32, turret_damage: u32, track_damage: u32, ref ability_state: AbilityState) {
        if ability_state.is_active {
            // Handle hull damage
            if hull_damage >= self.armored_health.hull_integrity {
                self.armored_health.hull_integrity = 0;
            } else {
                self.armored_health.hull_integrity -= hull_damage;
            }

            // Handle turret damage
            if turret_damage >= self.armored_health.turret_integrity {
                self.armored_health.turret_integrity = 0;
            } else {
                self.armored_health.turret_integrity -= turret_damage;
            }

            // Handle track damage
            if track_damage >= self.armored_health.track_integrity {
                self.armored_health.track_integrity = 0;
            } else {
                self.armored_health.track_integrity -= track_damage;
            }

            // Check if the unit is destroyed
            if self.armored_health.hull_integrity == 0 {
                ability_state.is_active = false;  // Unit is destroyed
            }
        }
    }
    fn move_to(ref self: Armored, new_position: Position, ref ability_state: AbilityState) {
        if ability_state.is_active && self.armored_health.track_integrity > 0 {
            self.position = new_position;
            //consume fuel based on distance moved
        }
    }

    fn consume_fuel(ref self: Armored, amount: u32, ref ability_state: AbilityState) {
        if ability_state.is_active && self.accessories.fuel >= amount {
            self.accessories.fuel -= amount;
        } else if ability_state.is_active {
            self.accessories.fuel = 0;
            ability_state.is_active = false;  // Unit runs out of fuel and becomes inactive
        }
    }
}