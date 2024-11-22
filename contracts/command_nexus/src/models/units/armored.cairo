use starknet::ContractAddress;
use command_nexus::models::position::{Position,Vec3};
use command_nexus::models::battlefield::{BattlefieldName,WeatherCondition,WeatherConditionTrait};
use command_nexus::models::units::unit_states::AbilityState;
use command_nexus::constants::{SCALE,OFFSET,DISTANCE_ENERGY_MULTIPLIER,BASE_ENERGY_COST,MAX_ACCURACY_PENALTY};

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
    range: u256,
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

    #[inline(always)]
    fn new(game_id: u32, unit_id: u32, player_id: u32, x: u256, y: u256, z: u256, battlefield_name: BattlefieldName) -> Armored {
        Armored {
            game_id,
            unit_id,
            player_id,
            accuracy: 85,
            firepower: 100,
            range: 3000,
            energy: 100,
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

    #[inline(always)]
    fn update_accessories(ref self: Armored, new_accessories: ArmoredAccessories) {
        self.accessories = new_accessories;
    }

    #[inline(always)]
    fn fire_main_gun(ref self: Armored) {
        if self.accessories.ammunition > 0 {
            self.accessories.ammunition -= 1;
        }
    }

    #[inline(always)]
    fn use_repair_kit(ref self: Armored) {
        if self.accessories.repair_kits > 0 {
            self.accessories.repair_kits -= 1;
            
            // Repair hull integrity
            let new_hull = self.armored_health.current + 20;
            if new_hull > self.armored_health.max {
                self.armored_health.current = 100;
            } else {
                self.armored_health.current = new_hull;
            }
        }
    }

    #[inline(always)]
    fn take_damage(ref self: Armored, hull_damage: u32) {
            // Handle hull damage
            if hull_damage >= self.armored_health.current {
                self.armored_health.current = 0;
            } else {
                self.armored_health.current -= hull_damage;
            }
    }

    #[inline(always)]
    fn move_to(ref self: Armored, new_position: Position) {
        if self.armored_health.current > 0 {
            self.position = new_position;
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
    fn has_energy( self: Armored) {
     assert(self.energy > 0, 'Armored: Not engough energy' )
    }

    #[inline(always)]
    fn is_position_occupied(ref self: Armored, x: u256, y: u256, z: u256) {
        let current_pos = self.position.coord;
        
        // If all coordinates match, it's occupied
        if (current_pos.x == x && current_pos.y == y && current_pos.z == z) {
            assert(false, 'Armored: Position occupied');
        }
    }

    #[inline(always)]
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

    #[inline(always)]
    fn get_range(self: Armored) -> u256{
        self.range
    }

    #[inline(always)]
    fn get_position(self: Armored) -> Position{
        self.position
    }

    #[inline(always)]
    fn set_position(ref self: Armored, pos: Position){
        self.position = pos
    }

    #[inline(always)]
    fn calculate_hit_probability(ref self: Armored, distance: u256, weather_condition: WeatherCondition) -> u32 {

        let base_hit_chance: u256= self.accuracy.into();

        let distance_factor = (distance * DISTANCE_ENERGY_MULTIPLIER.into()) / 100;
        let energy_cost = (BASE_ENERGY_COST.into()-1) + (distance_factor * distance_factor);

        if energy_cost > 100 {
            self.energy = 0;
        } else {
            self.energy -= energy_cost.try_into().unwrap()
        }

        let penalty = (distance * distance) / 100;

        let impact_on_accuracy = weather_condition.calculate_weather_impact();
    
        let accuracy_penalty = if penalty > MAX_ACCURACY_PENALTY.into() {
            MAX_ACCURACY_PENALTY.into()
        } else {
            penalty
        };

        let base_accuracy = if base_hit_chance > accuracy_penalty {
            base_hit_chance - accuracy_penalty
        } else {
            0
        };

        ((base_accuracy * impact_on_accuracy.into()) / 100).try_into().unwrap()



    }
}