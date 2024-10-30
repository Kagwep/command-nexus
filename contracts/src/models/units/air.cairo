use contracts::models::battlefield::BattlefieldName;
use contracts::models::position::{Position,Vec3};
use contracts::models::units::unit_states::AbilityState;
use contracts::constants::{SCALE,OFFSET};

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct AirUnit {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    range: u256,
    firepower: u32,
    accuracy: u8,
    energy: u32,
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
    repair_kits: u8,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct AirUnitHealth {
    current: u32,
    max: u32,
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum AirUnitAction {
    LaunchMissile,
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
        energy:100,
        accessories: AirUnitAccessories {
            missiles: 16,
            repair_kits: 5,
        },
        health: AirUnitHealth {
            current: 100,
            max: 100,
        },
        position: Position {
            coord: new_position
        },
        battlefield_name,
        altitude:0,  
        max_speed: 2000,
        
    }
  }

  #[inline(always)]
  fn update_accessories(ref self: AirUnit, new_accessories: AirUnitAccessories) {
    self.accessories = new_accessories;
  }


  #[inline(always)]
  fn use_repair_kit(ref self: AirUnit) {
      if self.accessories.repair_kits > 0 {
          self.accessories.repair_kits -= 1;
          
          // Repair hull integrity
          let new_health = self.health.current + 20;
          if new_health > self.health.max {
              self.health.current = 100;
          } else {
              self.health.current = new_health;
          }
      }
  }


  #[inline(always)]
  fn fire_missile(ref self: AirUnit) {
    if  self.accessories.missiles > 0 {
        self.accessories.missiles -= 1;
        // missile logic here
    }
  }


  #[inline(always)]
    fn take_damage(ref self: AirUnit, damage: u32, ) {

            if damage >= self.health.current {
                self.health.current = 0;

            } else {
                self.health.current -= damage;
            }
        
    }


    #[inline(always)]
    fn move_to(ref self: AirUnit, new_position: Position) {

           if self.health.current > 0 {
            self.position = new_position;
           }

    }

    
    #[inline(always)]
    fn consume_energy(ref self: AirUnit,amount: u32) {
        if self.energy > amount {
            self.energy -= amount;
        }else{
            self.energy = 0
        }
    }

    #[inline(always)]
    fn has_energy(self: AirUnit) {
     assert(self.energy > 0, 'AirUnit: Not engough energy' )
    }

    #[inline(always)]
    fn is_position_occupied(ref self: AirUnit, x: u256, y: u256, z: u256) {
        let current_pos = self.position.coord;
        
        // If all coordinates match, it's occupied
        if (current_pos.x == x && current_pos.y == y && current_pos.z == z) {
            assert(false, 'AirUnit: Position occupied');
        }
    }

    #[inline(always)]
    fn is_in_range(self: AirUnit, x: u256, y: u256, z: u256) -> bool {
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
    fn get_range(self: AirUnit) -> u256{
        self.range
    }

    #[inline(always)]
    fn get_position(self: AirUnit) -> Position{
        self.position
    }

    #[inline(always)]
    fn set_position(ref self: AirUnit, pos: Position){
        self.position = pos
    }

}