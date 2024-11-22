use starknet::ContractAddress;

use command_nexus::models::position::{Position,Vec3};
use command_nexus::models::battlefield::BattlefieldName;
use command_nexus::models::units::unit_states::AbilityState;
use command_nexus::constants::{SCALE,OFFSET};

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct Ship {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    range: u256,
    firepower: u32,
    accuracy: u8,
    ship_accessories: ShipAccessories,
    ship_health: ShipHealth,
    position: Position,
    battlefield_name:BattlefieldName,
    energy: u32
}

#[derive(Copy, Drop, Serde, Introspect)]
struct ShipAccessories {

    gun_ammunition: u32,
    missile_ammunition: u32,
    repair_kits: u8,

}

#[derive(Copy, Drop, Serde, Introspect)]
struct ShipHealth {
    current: u32,
    max:u32
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum NavalAction {
    FireCannon,
    LaunchTorpedo,

}

#[generate_trait]
impl ShipImpl of ShipTrait {
    #[inline(always)]
    fn new(game_id: u32, unit_id: u32, player_id: u32, x: u256, y: u256, z: u256, battlefield_name: BattlefieldName) -> Ship {
        Ship {
            game_id,
            unit_id,
            player_id,
            range: 10000,  // Long range for naval units
            firepower: 150,
            accuracy: 80,
            ship_accessories: ShipAccessories {
                gun_ammunition: 200,
                missile_ammunition: 50,
                repair_kits: 7,
            },
            ship_health: ShipHealth {
                current: 100,
                max: 100
            },
            position: Position { coord: Vec3 {x, y, z} },
            battlefield_name,
            energy: 100,
        }
    }

    #[inline(always)]
    fn update_accessories(ref self: Ship, new_accessories: ShipAccessories) {
        self.ship_accessories = new_accessories;
    }

    #[inline(always)]
    fn use_repair_kit(ref self: Ship) {
        if self.ship_accessories.repair_kits > 0 {
            self.ship_accessories.repair_kits -= 1;
            
            // Repair hull integrity
            let new_hull = self.ship_health.current + 20;
            if new_hull > self.ship_health.max {
                self.ship_health.current = 100;
            } else {
                self.ship_health.current = new_hull;
            }
        }
    }

    #[inline(always)]
    fn fire_main_gun(ref self: Ship) {
        if self.ship_accessories.gun_ammunition > 0 {
            self.ship_accessories.gun_ammunition -= 1;
            // Add main gun firing logic here
        }
    }

    #[inline(always)]
    fn launch_missile(ref self: Ship) {
        if  self.ship_accessories.missile_ammunition > 0 {
            self.ship_accessories.missile_ammunition -= 1;
            // Add missile launching logic here
        }
    }

    #[inline(always)]
    fn take_damage(ref self: Ship, damage: u32) {
            // Handle shield damage
            if damage >= self.ship_health.current {
                self.ship_health.current = 0;
            } else {
                self.ship_health.current -= damage;
            }
        
    }

    #[inline(always)]
    fn move_to(ref self: Ship, new_position: Position) {
        if  self.ship_health.current > 0 {
            self.position = new_position;
        }
    }


    #[inline(always)]
    fn consume_energy(ref self: Ship,amount: u32) {
        if self.energy > amount {
            self.energy -= amount;
        }else{
            self.energy = 0
        }
    }

    #[inline(always)]
    fn has_energy( self: Ship) {
     assert(self.energy > 0, 'Ship: Not engough energy' )
    }

    #[inline(always)]
    fn is_position_occupied(ref self: Ship, x: u256, y: u256, z: u256) {
        let current_pos = self.position.coord;
        
        // If all coordinates match, it's occupied
        if (current_pos.x == x && current_pos.y == y && current_pos.z == z) {
            assert(false, 'Ship: Position occupied');
        }
    }

    #[inline(always)]
    fn is_in_range(self: Ship, x: u256, y: u256, z: u256) -> bool {
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
    fn get_range(self: Ship) -> u256{
        self.range
    }

    #[inline(always)]
    fn get_position(self: Ship) -> Position{
        self.position
    }

    #[inline(always)]
    fn set_position(ref self: Ship, pos: Position){
        self.position = pos
    }
}