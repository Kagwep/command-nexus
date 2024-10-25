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
    energy: u32,
    accessories: ArmoredAccessories,
    armored_health: ArmoredHealth,
    position: Position,
    battlefield_name: BattlefieldName,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ArmoredAccessories {
    ammunition: u32,
    repair_kits: u8,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ArmoredHealth {
    current: u32,
    max: u32,
}


#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum ArmoredAction {
    FireMainGun,
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
                ammunition: 40,
                repair_kits: 3,
            },
            armored_health: ArmoredHealth {
                current: 100,
                max: 100,
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

    fn activate_protection_system(ref self: Armored,) {
        if ability_state.is_active && self.accessories.active_protection_system > 0 {
            self.accessories.active_protection_system -= 1;
            // active protection system logic 
    }
    }

    fn take_damage(ref self: Armored, hull_damage: u32) {
        if ability_state.is_active {
            // Handle hull damage
            if hull_damage >= self.armored_health.current {
                self.armored_health.hull_integrity = 0;
            } else {
                self.armored_health.hull_integrity -= hull_damage;
            }

        }
    }
    fn move_to(ref self: Armored, new_position: Position, ref ability_state: AbilityState) {
        if ability_state.is_active && self.armored_health.track_integrity > 0 {
            self.position = new_position;
            //consume fuel based on distance moved
        }
    }


    #[inline(always)]
    fn consume_energy(ref self: Armored,amount: u32) {
        if self.energy > amount {
            self.energy -= amount;
        }else{
            self.energy = 0
        }
    }

    #[inline(always)]
    fn has_energy(ref self: Armored) {
     assert(self.energy > 0, 'Armored: Not engough energy' )
    }

    fn is_position_occupied(ref self: Armored, x: u256, y: u256, z: u256) {
        let current_pos = self.position.coord;
        
        // If all coordinates match, it's occupied
        if (current_pos.x == x && current_pos.y == y && current_pos.z == z) {
            assert(false, 'Armored: Position occupied');
        }
    }

    fn is_in_range(self: Armored, x: u256, y: u256, z: u256) -> bool {
        let position = self.position.coord;
        let new_position = Vec3 { x, y, z };
        //  SCALE but not offset
        let range = self.range * SCALE;
    
        let dx = if new_position.x >= position.x { 
            new_position.x - position.x 
        } else { 
            position.x - new_position.x 
        };
        let dy = if new_position.y >= position.y { 
            new_position.y - position.y 
        } else { 
            position.y - new_position.y 
        };
        let dz = if new_position.z >= position.z { 
            new_position.z - position.z 
        } else { 
            position.z - new_position.z 
        };
    
        // Since dx already contains one SCALE factor
        let dx_squared = (dx * dx);
        let dy_squared = (dy * dy);
        let dz_squared = (dz * dz);
    
        let distance_squared = (dx_squared + dy_squared + dz_squared) * OFFSET;
        let range_squared = range * range;
    
        distance_squared <= range_squared
    }

    fn get_range(self: Armored) -> u256{
        self.range
    }
    fn get_position(self: Armored) -> Position{
        self.position
    }
    fn set_position(ref self: Armored, pos: Position){
        self.position = pos
    }
}