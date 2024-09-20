use starknet::ContractAddress;
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use contracts::models::game::Game;
use contracts::models::player::Player;



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

