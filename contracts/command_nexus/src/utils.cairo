use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use command_nexus::models::position::{Vec3,Position};
use command_nexus::models::units::infantry::{Infantry,InfantryTrait};
use command_nexus::models::units::air::{AirUnit,AirUnitTrait};
use command_nexus::models::units::cyber::{CyberUnit,CyberUnitTrait};
use command_nexus::models::units::naval::{Ship,ShipTrait};
use command_nexus::models::units::armored::{Armored,ArmoredTrait};
use dojo::world::storage::WorldStorage;
use dojo::model::{ModelStorage, ModelValueStorage};
use dojo::event::EventStorage;

#[derive(Copy, Drop)]
enum NexusUnit {
    Infantry: Infantry,
    Armored: Armored,
    Air: AirUnit,
    Naval: Ship
}



#[generate_trait]
impl NexusUnitImpl of NexusUnitTrait {
    fn has_energy(self: NexusUnit) {
        match self {
            NexusUnit::Infantry(infantry) => infantry.has_energy(),
            NexusUnit::Armored(armored) => armored.has_energy(),
            NexusUnit::Air(air) => air.has_energy(),
            NexusUnit::Naval(naval) => naval.has_energy(),
        }
    }

    fn consume_energy(ref self: NexusUnit, amount: u32) {
        match self {
            NexusUnit::Infantry(mut infantry) => infantry.consume_energy(amount),
            NexusUnit::Armored( mut armored) => armored.consume_energy(amount),
            NexusUnit::Air(mut air) => air.consume_energy(amount),
            NexusUnit::Naval(mut naval) => naval.consume_energy(amount),
        }
    }

    fn is_position_occupied(ref self: NexusUnit, x: u256, y: u256, z: u256)  {
        match self {
            NexusUnit::Infantry(mut infantry) => infantry.is_position_occupied(x, y, z),
            NexusUnit::Armored(mut armored) => armored.is_position_occupied(x, y, z),
            NexusUnit::Air(mut air) => air.is_position_occupied(x, y, z),
            NexusUnit::Naval(mut naval) => naval.is_position_occupied(x, y, z),
        }
    }

    fn get_range(self: NexusUnit) -> u256 {
        match self {
            NexusUnit::Infantry(infantry) => infantry.get_range(),
            NexusUnit::Armored(armored) => armored.get_range(),
            NexusUnit::Air(air) => air.get_range(),
            NexusUnit::Naval(naval) => naval.get_range(),
        }
    }

    fn get_position(self: NexusUnit) -> Position {
        match self {
            NexusUnit::Infantry(infantry) => infantry.get_position(),
            NexusUnit::Armored(armored) => armored.get_position(),
            NexusUnit::Air(air) => air.get_position(),
            NexusUnit::Naval(naval) => naval.get_position(),
        }
    }

    fn set_position(ref self: NexusUnit,pos: Position) -> NexusUnit {
        match self {
            NexusUnit::Infantry(mut infantry) => {
                infantry.set_position(pos);
                NexusUnit::Infantry(infantry)
            },
            NexusUnit::Armored(mut armored) => {
                armored.set_position(pos);
                NexusUnit::Armored(armored)
            },
            NexusUnit::Air(mut air) => {
                air.set_position(pos);
                NexusUnit::Air(air)
            },
            NexusUnit::Naval(mut naval) => {
                naval.set_position(pos);
                NexusUnit::Naval(naval)
            },
        }
    }

    fn heal(ref self: NexusUnit, amount: u32) {
        match self {
            NexusUnit::Infantry(mut infantry) => infantry.heal(amount),
            NexusUnit::Armored(mut armored) => armored.use_repair_kit(),
            NexusUnit::Air(mut air) => air.use_repair_kit(),
            NexusUnit::Naval(mut naval) => naval.use_repair_kit(),
        }
    }

    fn take_damage(ref self: NexusUnit, amount: u32) {
        match self {
            NexusUnit::Infantry(mut infantry) => infantry.take_damage(amount),
            NexusUnit::Armored(mut armored) => armored.take_damage(amount),
            NexusUnit::Air(mut air) => air.take_damage(amount),
            NexusUnit::Naval(mut naval) => naval.take_damage(amount),
        }
    }
}

mod helper {
    use super::ContractAddress;
    use super::NexusUnit;
    use command_nexus::models::game::{Game, GameTrait, GameAssert};
    use command_nexus::models::player::{Player,UnitType, PlayerTrait, PlayerAssert};
    use command_nexus::models::units::unit_states::{UnitMode,UnitState};
    use command_nexus::models::units::infantry::{Infantry,InfantryTrait};
    use command_nexus::models::units::air::{AirUnit,AirUnitTrait};
    use command_nexus::models::units::cyber::{CyberUnit,CyberUnitTrait};
    use command_nexus::models::units::naval::{Ship,ShipTrait};
    use command_nexus::models::units::armored::{Armored,ArmoredTrait};
    use command_nexus::models::position::{Vec3,Position};
    use command_nexus::constants::{SCALE,OFFSET};
    use command_nexus::models::battlefield::{WeatherCondition,UrbanBattlefield,UrbanBattlefieldTrait,BattlefieldName,BattlefieldNameTrait};
    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait, Resource};


    use dojo::world::storage::WorldStorage;

    #[generate_trait]
    impl HelperImpl of HelperTrait {
        fn game(world: WorldStorage, id: u32) -> Game {
           // get!(world, id, (Game))
           let mut game: Game  =  world.read_model(id);

           game
        }

        fn player(world: WorldStorage, game: Game, index: u32) -> Player {
            //get!(world, (game.game_id, index), (Player))
            let player: Player  =  world.read_model((game.game_id,index));
            player
        }

        fn find_unit_infantry(world: WorldStorage,game_id:u32,player_id:u32,unit_id:u32)-> Infantry{
            //get!(world, (game_id,unit_id, player_id), (Infantry))
            let  infantry: Infantry  =  world.read_model((game_id,unit_id, player_id));
            infantry
        }
        fn find_unit_armored(world: WorldStorage,game_id:u32,player_id:u32,unit_id:u32)-> Armored{
           // get!(world, (game_id,unit_id, player_id), (Armored))
            let  armored: Armored  =  world.read_model((game_id,unit_id, player_id));
            armored
        }
        fn find_unit_air(world: WorldStorage,game_id:u32,player_id:u32,unit_id:u32)-> AirUnit{
           // get!(world, (game_id,unit_id, player_id), (AirUnit))
           let mut air: AirUnit  =  world.read_model((game_id,unit_id, player_id));
           air
        }
        fn find_unit_naval(world: WorldStorage,game_id:u32,player_id:u32,unit_id:u32)-> Ship{
            //get!(world, (game_id,unit_id, player_id), (Ship))
            let  ship: Ship  =  world.read_model((game_id,unit_id, player_id));
            ship
        }

        fn get_unit(
            world: WorldStorage,
            game_id: u32,
            player_id: u32,
            unit_id: u32,
            unit_type: UnitType
        ) -> NexusUnit {
            match unit_type {
                UnitType::Infantry =>{
                    let mut infantry: Infantry = world.read_model((game_id,unit_id, player_id));
                    NexusUnit::Infantry(
                        infantry
                    )
                },
                UnitType::Armored => {
                    let mut armored: Armored = world.read_model((game_id,unit_id, player_id));
                    NexusUnit::Armored(
                        armored
                    )
                },
                UnitType::Air => {
                    let mut air: AirUnit = world.read_model((game_id,unit_id, player_id));
                    NexusUnit::Air(
                        air
                    )
                },
                UnitType::Naval => {
                    let mut naval: Ship = world.read_model((game_id,unit_id, player_id));
                    NexusUnit::Naval(
                        naval
                    )
                },
                _ => panic(array!['Invalid unit type'])
            }
        }

        fn unit_state(world: WorldStorage, game_id: u32,unit_id:u32, index: u32) -> UnitState {
            //get!(world, (game_id,index,unit_id), (UnitState))

            let unit_state: UnitState = world.read_model((game_id,index,unit_id));
            unit_state
        }

        fn find_player(world: WorldStorage, game: Game, account: ContractAddress) -> Option<Player> {
            let mut index: u32 = game.player_count.into();
            loop {
                if index == 0 {
                    break Option::None;
                };
                index -= 1;
                let player_key = (game.game_id, index);
                let player: Player = world.read_model((player_key));
                if player.address == account {
                    break Option::Some(player);
                }
            }
        }

        fn find_ranked_player(world: WorldStorage, game: Game, rank: u8) -> Option<Player> {
            let mut index: u32 = game.player_count.into();
            loop {
                if index == 0 {
                    break Option::None;
                };
                index -= 1;
                let player_key = (game.game_id, index);
                let player: Player =  world.read_model(player_key);
                if player.rank == rank {
                    break Option::Some(player);
                }
            }
        }

        fn players(world: WorldStorage, game: Game) -> Array<Player> {
            let mut index = game.player_count;
            let mut players: Array<Player> = array![];
            loop {
                if index == 0 {
                    break;
                };
                index -= 1;
                players.append(Self::player(world, game, index.into()));
            };
            players
        }

        fn current_player(world: WorldStorage, game: Game) -> Player {
            let player_key = (game.game_id, game.player());
            let player =world.read_model(player_key);
            player
        }

        fn is_in_range(position: Position, range:u256,x: u256, y: u256, z: u256) -> bool {
            let position = position.coord;
            let new_position = Vec3 { x, y, z };
            //  SCALE but not offset

            let (distance_squared,range_squared) = Self::get_distance(range,new_position,position);

            (distance_squared <= range_squared)
        }


        fn get_distance(range: u256, new_position: Vec3, position: Vec3) -> (u256, u256){

            let range = range * SCALE;

            let range = range * SCALE;

            let range_squared = range * range;
            

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

            (distance_squared,range_squared)
        }

        fn get_distance_difference(distance_squared:u256, range_squared:u256) -> u256{
           if distance_squared >= range_squared { 
                distance_squared - range_squared 
            } else { 
                range_squared - distance_squared 
            }
        }

        fn calculate_movement_cost(distance_squared: u256) -> u256 {
            // Distance at which movement cost increases (100 spaces)
            let movement_unit = 100 * SCALE;  
            let movement_unit_squared = movement_unit * movement_unit;
            
            // Calculate cost, rounding up
            // e.g., 250 units = 3 movement cost
            (distance_squared + movement_unit_squared - 1) / movement_unit_squared
        }


        fn calculate_defend_cost(unit: NexusUnit) -> u32{
            match unit {
                NexusUnit::Infantry(_infantry) => 2,  
                NexusUnit::Armored(_armored) => 4,   
                NexusUnit::Air(_air) => 3,           
                NexusUnit::Naval(_naval) => 5,        
            }
        }


        fn calculate_patrol_cost(unit: NexusUnit) -> u32{
            match unit {
                NexusUnit::Infantry(_infantry) => 1,  
                NexusUnit::Armored(_armored) => 3,   
                NexusUnit::Air(_air) => 2,           
                NexusUnit::Naval(_naval) => 3,        
            }
        }


        fn calculate_stealth_cost(unit: NexusUnit) -> u32{
            match unit {
                NexusUnit::Infantry(_infantry) => 1,  
                NexusUnit::Armored(_armored) => 5,   
                NexusUnit::Air(_air) => 3,           
                NexusUnit::Naval(_naval) => 4,        
            }
        }


        fn calculate_recon_cost(unit: NexusUnit) -> u32{
            match unit {
                NexusUnit::Infantry(_infantry) => 2,  
                NexusUnit::Armored(_armored) => 3,   
                NexusUnit::Air(_air) => 1,           
                NexusUnit::Naval(_naval) => 2,        
            }
        }

        fn calculate_heal_cost(unit: NexusUnit) -> u32{
            match unit {
                NexusUnit::Infantry(_infantry) => 2,  
                NexusUnit::Armored(_armored) => 4,   
                NexusUnit::Air(_air) => 5,           
                NexusUnit::Naval(_naval) => 6,        
            }
        }

        fn calculate_heal_value(unit: NexusUnit) -> u32 {
            match unit {
                NexusUnit::Infantry(_infantry) => 15,    // Basic infantry can heal moderately
                NexusUnit::Armored(_armored) => 25,      // Armored units need more substantial repairs
                NexusUnit::Air(_air) => 20,              // Aircraft repairs are significant
                NexusUnit::Naval(_naval) => 30,          // Naval units need largest repairs
            }
        }

        fn compute_damage(world: WorldStorage,game_id:u32,attacker_id: u32, attacker: UnitType, target: UnitType,target_id: u32,player_id: u32,player_target_id: u32) -> u32 {



            match (attacker, target) {

                // Infantry matchups
                (UnitType::Infantry, UnitType::Infantry) => {

                    let mut infantry_attacker: Infantry = world.read_model((game_id, attacker_id, player_id));

                    let battle_field_name = infantry_attacker.battlefield_name;

                    // let battle_field = get!(world,(game_id,battle_field_name.to_battlefield_id()),UrbanBattlefield);
                    let battle_field: UrbanBattlefield = world.read_model((game_id, battle_field_name.to_battlefield_id()));

                    let weather_condition = battle_field.weather.weather_condition;

                    assert(infantry_attacker.accessories.ammunition > 0, 'Infantry: No ammo');

                    //let mut infantry_target = get!(world, (game_id, target_id, player_target_id),Infantry);
                    let mut infantry_target: Infantry = world.read_model((game_id, target_id, player_target_id));

                    let (distance_squared,range_squared) = Self::get_distance(infantry_attacker.range, infantry_target.position.coord, infantry_attacker.position.coord);

                    assert(distance_squared <= range_squared, 'Infantry: Out of range');
                    
                    let distance_coverage = (distance_squared /range_squared) * 100;

                    let hit_probability = infantry_attacker.calculate_hit_probability(distance_coverage, weather_condition);

                    let is_critical = hit_probability >= 90_u32;

                    let mut  damage = 0;

                    if is_critical {
                        damage =  100;
                    }

                   damage

                },
                (UnitType::Infantry, UnitType::Armored) => {

                    //let mut infantry_attacker = get!(world, (game_id, attacker_id, player_id),Infantry);
                    let mut infantry_attacker: Infantry = world.read_model((game_id, attacker_id, player_id));

                    let battle_field_name = infantry_attacker.battlefield_name;

                   // let battle_field = get!(world,(game_id,battle_field_name.to_battlefield_id()),UrbanBattlefield);
                   let battle_field: UrbanBattlefield = world.read_model((game_id, battle_field_name.to_battlefield_id()));

                    let weather_condition = battle_field.weather.weather_condition;

                    assert(infantry_attacker.accessories.ammunition > 0, 'Infantry: No ammo');

                    //let mut infantry_target = get!(world, (game_id, target_id, player_target_id),Infantry);
                    let mut infantry_target: Infantry = world.read_model((game_id, target_id, player_target_id));

                    let (distance_squared,range_squared) = Self::get_distance(infantry_attacker.range, infantry_target.position.coord, infantry_attacker.position.coord);

                    assert(distance_squared <= range_squared, 'Infantry: Out of range');
                    
                    let distance_coverage = (distance_squared /range_squared) * 100;

                    let hit_probability = infantry_attacker.calculate_hit_probability(distance_coverage, weather_condition);

                    let is_critical = hit_probability >= 98;

                    let mut  damage = 0;

                    if is_critical {
                        damage =  20;
                    }

                   damage 

                },
                (UnitType::Infantry, UnitType::Air) => 0,
                (UnitType::Infantry, UnitType::Naval) => 0,
                (UnitType::Infantry, UnitType::Cyber) =>0,
                
                // Armored matchups
                (UnitType::Armored, UnitType::Infantry) =>{
                    //let mut armored_attacker = get!(world, (game_id, attacker_id, player_id),Armored);
                    let mut armored_attacker: Armored = world.read_model((game_id, attacker_id, player_id));

                    let battle_field_name = armored_attacker.battlefield_name;

                    //let battle_field = get!(world,(game_id,battle_field_name.to_battlefield_id()),UrbanBattlefield);
                    let battle_field: UrbanBattlefield = world.read_model((game_id, battle_field_name.to_battlefield_id()));

                    let weather_condition = battle_field.weather.weather_condition;

                    assert(armored_attacker.accessories.ammunition > 0, 'Armored: No ammo');

                    //let mut armored_target = get!(world, (game_id, target_id, player_target_id),Armored);
                    let mut armored_target: Armored = world.read_model((game_id, target_id, player_target_id));

                    let (distance_squared,range_squared) = Self::get_distance(armored_attacker.range, armored_target.position.coord, armored_attacker.position.coord);

                    assert(distance_squared <= range_squared, 'Armored: Out of range');
                    
                    let distance_coverage = (distance_squared /range_squared) * 100;

                    let hit_probability = armored_attacker.calculate_hit_probability(distance_coverage, weather_condition);

                    let is_critical = hit_probability >= 20;

                    let mut  damage = 0;

                    if is_critical {
                        damage =  20;
                    }

                   damage 
                },
                (UnitType::Armored, UnitType::Armored) => {
                    //let mut armored_attacker = get!(world, (game_id, attacker_id, player_id),Armored);
                    let mut armored_attacker: Armored = world.read_model((game_id, attacker_id, player_id));

                    let battle_field_name = armored_attacker.battlefield_name;

                    //let battle_field = get!(world,(game_id,battle_field_name.to_battlefield_id()),UrbanBattlefield);
                    let battle_field: UrbanBattlefield = world.read_model((game_id, battle_field_name.to_battlefield_id()));

                    let weather_condition = battle_field.weather.weather_condition;

                    assert(armored_attacker.accessories.ammunition > 0, 'Armored: No ammo');

                    //let mut armored_target = get!(world, (game_id, target_id, player_target_id),Armored);
                    let mut armored_target: Armored = world.read_model((game_id, target_id, player_target_id));

                    let (distance_squared,range_squared) = Self::get_distance(armored_attacker.range, armored_target.position.coord, armored_attacker.position.coord);

                    assert(distance_squared <= range_squared, 'Armored: Out of range');
                    
                    let distance_coverage = (distance_squared /range_squared) * 100;

                    let hit_probability = armored_attacker.calculate_hit_probability(distance_coverage, weather_condition);

                    let is_critical = hit_probability >= 20;

                    let mut  damage = 0;

                    if is_critical {
                        damage =  20;
                    }

                   damage
                },
                (UnitType::Armored, UnitType::Air) => 0,
                (UnitType::Armored, UnitType::Naval) => 0,
                (UnitType::Armored, UnitType::Cyber) => 0,
                
                // Air matchups
                (UnitType::Air, UnitType::Infantry) =>0,
                (UnitType::Air, UnitType::Armored) =>0,
                (UnitType::Air, UnitType::Air) => 0,
                (UnitType::Air, UnitType::Naval) => 0,
                (UnitType::Air, UnitType::Cyber) => 0,
                
                // Naval matchups
                (UnitType::Naval, UnitType::Infantry) =>0,
                (UnitType::Naval, UnitType::Armored) => 0,
                (UnitType::Naval, UnitType::Air) => 0,
                (UnitType::Naval, UnitType::Naval) => 0,
                (UnitType::Naval, UnitType::Cyber) => 0,
                
                // Cyber matchups
                (UnitType::Cyber, UnitType::Infantry) => 0,
                (UnitType::Cyber, UnitType::Armored) =>0,
                (UnitType::Cyber, UnitType::Air) =>0,
                (UnitType::Cyber, UnitType::Naval) =>0,
                (UnitType::Cyber, UnitType::Cyber) => 0,
                
                // Handle None cases
                (UnitType::None, _) => 0,
                (_, UnitType::None) => 0,
            }
        }

    }
}

