use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use contracts::models::position::{Vec3,Position};
use contracts::models::units::infantry::{Infantry,InfantryTrait};
use contracts::models::units::air::{AirUnit,AirUnitTrait};
use contracts::models::units::cyber::{CyberUnit,CyberUnitTrait};
use contracts::models::units::naval::{Ship,ShipTrait};
use contracts::models::units::armored::{Armored,ArmoredTrait};

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

    fn set_position(ref self: NexusUnit, pos: Position) {
        match self {
            NexusUnit::Infantry(mut infantry) => infantry.set_position(pos),
            NexusUnit::Armored(mut armored) => armored.set_position(pos),
            NexusUnit::Air(mut air) => air.set_position(pos),
            NexusUnit::Naval(mut naval) => naval.set_position(pos),
        }
    }
}

mod helper {
    use super::ContractAddress;
    use super::IWorldDispatcher;
    use super::NexusUnit;
    use contracts::models::game::{Game, GameTrait, GameAssert};
    use contracts::models::player::{Player,UnitType, PlayerTrait, PlayerAssert};
    use contracts::models::units::unit_states::{UnitMode,UnitState};
    use contracts::models::units::infantry::{Infantry};
    use contracts::models::units::air::{AirUnit};
    use contracts::models::units::cyber::{CyberUnit};
    use contracts::models::units::naval::{Ship};
    use contracts::models::units::armored::{Armored};
    use contracts::models::position::{Vec3,Position};
    use contracts::constants::{SCALE,OFFSET};


    

    #[generate_trait]
    impl HelperImpl of HelperTrait {
        fn game(world: IWorldDispatcher, id: u32) -> Game {
            get!(world, id, (Game))
        }

        fn player(world: IWorldDispatcher, game: Game, index: u32) -> Player {
            get!(world, (game.game_id, index), (Player))
        }

        fn find_unit_infantry(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> Infantry{
            get!(world, (game_id,unit_id, player_id), (Infantry))
        }
        fn find_unit_armored(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> Armored{
            get!(world, (game_id,unit_id, player_id), (Armored))
        }
        fn find_unit_air(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> AirUnit{
            get!(world, (game_id,unit_id, player_id), (AirUnit))
        }
        fn find_unit_naval(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> Ship{
            get!(world, (game_id,unit_id, player_id), (Ship))
        }

        fn get_unit(
            world: IWorldDispatcher,
            game_id: u32,
            player_id: u32,
            unit_id: u32,
            unit_type: UnitType
        ) -> NexusUnit {
            match unit_type {
                UnitType::Infantry =>{
                    let mut infantry = get!(world, (game_id, unit_id, player_id),Infantry);
                    NexusUnit::Infantry(
                        infantry
                    )
                },
                UnitType::Armored => {
                    let mut armored = get!(world, (game_id, unit_id, player_id), Armored);
                    NexusUnit::Armored(
                        armored
                    )
                },
                UnitType::Air => {
                    let mut air = get!(world, (game_id, unit_id, player_id), AirUnit);
                    NexusUnit::Air(
                        air
                    )
                },
                UnitType::Naval => {
                    let mut naval = get!(world, (game_id, unit_id, player_id), Ship);
                    NexusUnit::Naval(
                        naval
                    )
                },
                _ => panic(array!['Invalid unit type'])
            }
        }

        fn unit_state(world: IWorldDispatcher, game_id: u32,unit_id:u32, index: u32) -> UnitState {
            get!(world, (game_id,index,unit_id), (UnitState))
        }

        fn find_player(world: IWorldDispatcher, game: Game, account: ContractAddress) -> Option<Player> {
            let mut index: u32 = game.player_count.into();
            loop {
                if index == 0 {
                    break Option::None;
                };
                index -= 1;
                let player_key = (game.game_id, index);
                let player: Player = get!(world, player_key.into(), (Player));
                if player.address == account {
                    break Option::Some(player);
                }
            }
        }

        fn find_ranked_player(world: IWorldDispatcher, game: Game, rank: u8) -> Option<Player> {
            let mut index: u32 = game.player_count.into();
            loop {
                if index == 0 {
                    break Option::None;
                };
                index -= 1;
                let player_key = (game.game_id, index);
                let player: Player = get!(world, player_key.into(), (Player));
                if player.rank == rank {
                    break Option::Some(player);
                }
            }
        }

        fn players(world: IWorldDispatcher, game: Game) -> Array<Player> {
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

        fn current_player(world: IWorldDispatcher, game: Game) -> Player {
            let player_key = (game.game_id, game.player());
            get!(world, player_key.into(), (Player))
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

        fn compute_damage(world: IWorldDispatcher,attacker_id: u32, attacker: UnitType, target: UnitType,target_id: u32,player_id: u32) -> u32 {

            match (attacker, target) {

                // Infantry matchups
                (UnitType::Infantry, UnitType::Infantry) => {

                    let mut infantry_attacker = get!(world, (game_id, attacker_id, player_id),Infantry);

                    assert(infantry_attacker.accessories > 0, 'Infantry: No ammo')

                    let mut infantry_target = get!(world, (game_id, target_id, player_id),Infantry);

                    let (distance_squared,range_squared) = Self::get_distance(infantry_attacker.range, infantry_target.position.coord, infantry_attacker.position.coord)

                    assert(distance_squared <= range_squared, 'Infantry: Out of range');
                    
                    let distance_coverage = (distance_squared /range_squared) * 100;

                    let hit_probability = infantry_attacker.calculate_hit_probability(distance_coverage, weather_condition);

                    let is_critical = hit_probability >= 90;

                    let mut  damage = 0;

                    if is_critical {
                        damage =  100;
                    }

                   damage



                },
                (UnitType::Infantry, UnitType::Armored) => 0,
                (UnitType::Infantry, UnitType::Air) => 0,
                (UnitType::Infantry, UnitType::Naval) => 0,
                (UnitType::Infantry, UnitType::Cyber) =>0,
                
                // Armored matchups
                (UnitType::Armored, UnitType::Infantry) =>0,
                (UnitType::Armored, UnitType::Armored) => 0,
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

