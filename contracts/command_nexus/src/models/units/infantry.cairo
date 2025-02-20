use command_nexus::models::battlefield::{BattlefieldName,WeatherCondition,WeatherConditionTrait,BattlefieldNameTrait};
use command_nexus::models::position::{Position, Vec3};
use command_nexus::constants::{SCALE,OFFSET,BASE_ENERGY_COST,DISTANCE_ENERGY_MULTIPLIER,MAX_ACCURACY_PENALTY};

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
pub struct Infantry {
    #[key]
    pub game_id: u32,
    #[key]
    pub unit_id: u32,
    #[key]
    pub player_id: u32,
    pub range: u256,
    pub energy: u32,
    pub accuracy: u8,
    pub accessories: InfantryAccessories,
    pub health: InfantryHealth,
    pub position: Position,
    pub battlefield_name:BattlefieldName,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct InfantryAccessories {
    pub ammunition: u32,
    pub first_aid_kit: u32,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct InfantryHealth {
    pub current: u32,
    pub max: u32,
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
pub enum InfantryAction {
    UseFirstAidKit,
    Patrol,
}



#[generate_trait]
pub impl InfantryImpl of InfantryTrait{

    #[inline(always)]
    fn new(game_id: u32,unit_id: u32, player_id:u32,x: u256,y: u256, z: u256,battlefield_name: BattlefieldName) -> Infantry {

        let position  = Vec3{
            x,
            y,
            z
        };

        Infantry {
            game_id,
            unit_id,
            player_id,
            range:300,
            energy: 100,
            accuracy: 100,
            accessories: InfantryAccessories {
                ammunition: 100,
                first_aid_kit: 100 
            },
            health: InfantryHealth { current: 100, max: 100 },
            position: Position {
                coord: position
            },
            battlefield_name,
        }

    }


    #[inline(always)]
    fn update_accessories(ref self: Infantry, new_accessories: InfantryAccessories) {
        self.accessories = new_accessories;
    }

    #[inline(always)]
    fn add_ammunation(ref self: Infantry, amount: u32){
        self.accessories.ammunition += amount;
    }


    #[inline(always)]
    fn use_first_aid_kit(ref self: Infantry) {
        if self.accessories.first_aid_kit > 0 {
            self.accessories.first_aid_kit -= 1;
            // Add healing logic here
        }
    }

    #[inline(always)]
    fn move_to(ref self: Infantry, new_position:Position) {
        self.position = new_position;
    }

    #[inline(always)]
    fn take_damage(ref self:Infantry, damage:u32){
        if damage >= self.health.current {
            self.health.current = 0;
        }else{
            self.health.current -=damage;
        }
    }

    #[inline(always)]
    fn heal(ref self: Infantry, amount: u32) {
        let new_health = self.health.current + amount;
        if new_health > self.health.max {
            self.health.current = self.health.max;
        } else {
            self.health.current = new_health;
        }
    }


    #[inline(always)]
    fn consume_energy(ref self: Infantry,amount: u32) {
        if self.energy > amount {
            self.energy -= amount;
        }else{
            self.energy = 0
        }
    }

    #[inline(always)]
    fn has_energy(self: Infantry) {
     assert(self.energy > 0, 'Infantry: Not engough energy' )
    }

    #[inline(always)]
    fn is_position_occupied(ref self: Infantry, x: u256, y: u256, z: u256) {
        let current_pos = self.position.coord;
        
        // If all coordinates match, it's occupied
        if (current_pos.x == x && current_pos.y == y && current_pos.z == z) {
            assert(false, 'Infantry: Position occupied');
        }
    }

    #[inline(always)]
    fn is_in_range(self: Infantry, x: u256, y: u256, z: u256) -> bool {
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
    fn get_range(self: Infantry) -> u256{
        self.range
    }

    #[inline(always)]
    fn get_position(self: Infantry) -> Position{
        self.position
    }

    #[inline(always)]
    fn set_position(ref self: Infantry, pos: Position){
        self.position = pos;
    }

    #[inline(always)]
    fn calculate_hit_probability(ref self: Infantry, distance: u256, weather_condition: WeatherCondition) -> u32 {

        let base_hit_chance: u32 = self.accuracy.into();

        let distance_factor = (distance * DISTANCE_ENERGY_MULTIPLIER.into()) / 100;
        let energy_cost = BASE_ENERGY_COST.into() + (distance_factor * distance_factor);

        if energy_cost > 100 {
            self.energy = 0;
        } else {
            self.energy -= energy_cost.try_into().unwrap();
        }

        let penalty = (distance * distance) / 100;

        let impact_on_accuracy = weather_condition.calculate_weather_impact();
    
        let accuracy_penalty: u32 = if penalty > MAX_ACCURACY_PENALTY.into(){
            MAX_ACCURACY_PENALTY
        } else {
            penalty.try_into().unwrap()
        };

        let base_accuracy: u32 = if base_hit_chance > accuracy_penalty.into() {
            base_hit_chance - accuracy_penalty.into()
        } else {
            0
        };

        ((base_accuracy * impact_on_accuracy.into()) / 100).into()



    }
}


