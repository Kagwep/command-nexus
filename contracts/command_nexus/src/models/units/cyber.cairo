use command_nexus::models::battlefield::BattlefieldName;
use command_nexus::models::position::{Position,Vec3};
use command_nexus::models::units::unit_states::AbilityState;
use command_nexus::constants::{SCALE,OFFSET};

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
pub struct CyberUnit {
    #[key]
    pub game_id: u32,
    #[key]
    pub unit_id: u32,
    #[key]
    pub player_id: u32,
    pub hacking_range: u64,
    pub encryption_strength: u32,
    pub stealth: u8,
    pub range: u256,
    pub accessories: CyberUnitAccessories,
    pub health: CyberUnitHealth,
    pub position: Position,
    pub battlefield_name: BattlefieldName,
    pub energy: u32,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct CyberUnitAccessories {
    pub malware: u32,
    pub repair_kits: u8,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub struct CyberUnitHealth {
    pub current: u32,
    pub max: u32,
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
pub enum CyberUnitAction {
    Attack,
    DeployMalware,
}



#[generate_trait]
pub impl CyberUnitImpl of CyberUnitTrait {

    #[inline(always)]
    fn new(game_id: u32, unit_id: u32, player_id: u32, x: u256, y: u256, z: u256, battlefield_name: BattlefieldName) -> CyberUnit {
        CyberUnit {
            game_id,
            unit_id,
            player_id,
            hacking_range: 1000,  // Global range for cyber units
            encryption_strength: 100,
            stealth: 90,
            range: 400,
            accessories: CyberUnitAccessories {
                malware: 50,
                repair_kits: 3,
            },
            health: CyberUnitHealth {
                current: 100,
                max: 100,
            },
            position: Position { coord: Vec3{x, y, z} },
            battlefield_name,
            energy: 100
        }
    }

    #[inline(always)]
    fn update_accessories(ref self: CyberUnit, new_accessories: CyberUnitAccessories) {
        self.accessories = new_accessories;
    }

    #[inline(always)]
    fn deploy_malware(ref self: CyberUnit) {
        if self.accessories.malware > 0 {
            self.accessories.malware -= 1;
        
        } 
    }

    #[inline(always)]
    fn use_repair_kit(ref self: CyberUnit) {
        if self.accessories.repair_kits > 0 {
            self.accessories.repair_kits -= 1;
            
            // Repair hull integrity
            let new_hull = self.health.current + 20;
            if new_hull > self.health.max {
                self.health.current = 100;
            } else {
                self.health.current = new_hull;
            }
        }
    }


    #[inline(always)]
    fn take_damage(ref self: CyberUnit, damage: u32, ) {

        if damage >= self.health.current {
            self.health.current = 0;

        } else {
            self.health.current -= damage;
        }
    
    }

    #[inline(always)]
    fn move_to(ref self: CyberUnit, new_position: Position) {
        if self.health.current > 0 {
            self.position = new_position;
            
        } 
    }

    #[inline(always)]
    fn consume_energy(ref self: CyberUnit,amount: u32) {
        if self.energy > amount {
            self.energy -= amount;
        }else{
            self.energy = 0
        }
    }

    #[inline(always)]
    fn has_energy(self: CyberUnit) {
     assert(self.energy > 0, 'CyberUnit: Not engough energy' )
    }

    #[inline(always)]
    fn is_position_occupied(ref self: CyberUnit, x: u256, y: u256, z: u256) {
        let current_pos = self.position.coord;
        
        // If all coordinates match, it's occupied
        if (current_pos.x == x && current_pos.y == y && current_pos.z == z) {
            assert(false, 'CyberUnit: Position occupied');
        }
    }

    #[inline(always)]
    fn is_in_range(self: CyberUnit, x: u256, y: u256, z: u256) -> bool {
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
    fn get_range(self: CyberUnit) -> u256{
        self.range
    }

    #[inline(always)]
    fn get_position(self: CyberUnit) -> Position{
        self.position
    }

    #[inline(always)]
    fn set_position(ref self: CyberUnit, pos: Position){
        self.position = pos
    }



}