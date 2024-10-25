use contracts::models::battlefield::BattlefieldName;
use contracts::models::position::{Position, Vec3};
use contracts::constants::{SCALE,OFFSET};

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Infantry {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    range: u256,
    energy: u32,
    firepower: u32,
    accuracy: u8,
    accessories: InfantryAccessories,
    health: InfantryHealth,
    position: Position,
    battlefield_name:BattlefieldName,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct InfantryAccessories {
    ammunition: u32,
    first_aid_kit: u32,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct InfantryHealth {
    current: u32,
    max: u32,
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum InfantryAction {
    UseFirstAidKit,
    Patrol,
}



#[generate_trait]
impl InfantryImpl of InfantryTrait{

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
            firepower:100,
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
    fn has_energy(ref self: Infantry) {
     assert(self.energy > 0, 'Infantry: Not engough energy' )
    }

    fn is_position_occupied(ref self: Infantry, x: u256, y: u256, z: u256) {
        let current_pos = self.position.coord;
        
        // If all coordinates match, it's occupied
        if (current_pos.x == x && current_pos.y == y && current_pos.z == z) {
            assert(false, 'Infantry: Position occupied');
        }
    }

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

    fn get_range(self: Infantry) -> u256{
        self.range
    }
    fn get_position(self: Infantry) -> Position{
        self.position
    }
    fn set_position(ref self: Infantry, pos: Position){
        self.position = pos
    }
}


