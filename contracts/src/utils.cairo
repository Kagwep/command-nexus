use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use contracts::models::game::Game;
use contracts::models::player::Player;
use contracts::models::units::unitsupply::{UnitMode,UnitState};
use contracts::models::units::infantry::{Infantry};
use contracts::models::units::air::{AirUnit};
use contracts::models::units::cyber::{CyberUnit};
use contracts::models::units::naval::{Ship};
use contracts::models::units::armored::{Armored};



mod helper {
    use super::ContractAddress;
    use super::IWorldDispatcher;
    use super::Game;
    use super::Player;


    #[generate_trait]
    impl HelperImpl of HelperTrait {
        fn game(world: IWorldDispatcher, id: u32) -> Game {
            get!(world, id, (Game))
        }

        fn player(world: IWorldDispatcher, game: Game, index: u32) -> Player {
            get!(world, (game.game_id, index), (Player))
        }

        fn find_unit_infantry(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> Infantry{
            get!(world, (game.game_id,unit_id, player_id), (Infantry))
        }
        fn find_unit_armored(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> Armored{
            get!(world, (game.game_id,unit_id, player_id), (Armored))
        }
        fn find_unit_air(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> AirUnit{
            get!(world, (game.game_id,unit_id, player_id), (AirUnit))
        }
        fn find_unit_naval(world: IWorldDispatcher,game_id:u32,player_id:u32,unit_id:u32)-> Ship{
            get!(world, (game.game_id,unit_id, player_id), (Ship))
        }

        fn unit_mode(world: IWorldDispatcher, game_id: u32,unit_id:u32, index: u32,unit_type:u8) -> UnitState {
            get!(world, (game_id,index,unit_id,unit_type), (UnitMode))
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
    }
}

