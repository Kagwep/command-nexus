use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};




mod helper {
    use super::ContractAddress;
    use super::IWorldDispatcher;
    use contracts::models::game::{Game, GameTrait, GameAssert};
    use contracts::models::player::{Player, PlayerTrait, PlayerAssert};
    use contracts::models::units::unit_states::{UnitMode,UnitState};
    use contracts::models::units::infantry::{Infantry};
    use contracts::models::units::air::{AirUnit};
    use contracts::models::units::cyber::{CyberUnit};
    use contracts::models::units::naval::{Ship};
    use contracts::models::units::armored::{Armored};
    use contracts::models::units::position::{Vec3};


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

        fn unit_state(world: IWorldDispatcher, game_id: u32,unit_id:u32, index: u32,unit_type:u8) -> UnitState {
            get!(world, (game_id,index,unit_id,unit_type), (UnitState))
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

        fn is_in_range( range:u256,x: u256, y: u256, z: u256) -> bool {
            let position = self.position.coord;
            let new_position = Vec3 { x, y, z };
            //  SCALE but not offset

            let (distance,range_squared) = Self::get_distance(range,new_position,position);

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

    }
}

