
#[dojo::interface]
trait IArena {
    fn create( ref world: IWorldDispatcher,
        player_name: felt252,
        price: u256,
        penalty: u64
    ) -> u32;
    fn join(ref world: IWorldDispatcher,game_id: u32, player_name: felt252);
    fn leave(ref world: IWorldDispatcher, game_id: u32);
    fn start(ref world: IWorldDispatcher, game_id: u32, round_count: u32);
    fn delete(ref world: IWorldDispatcher, game_id: u32);
    fn kick(ref world: IWorldDispatcher, game_id: u32, index: u32);
}



// System implementation

#[dojo::contract]
mod Arena {
    // Starknet imports

    use super::{IArena};

    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_timestamp,
        contract_address_try_from_felt252
    };

    use contracts::models::game::{Game, GameTrait, GameAssert};
    use contracts::models::player::{Player, PlayerTrait, PlayerAssert};

    mod errors {
        const ERC20_REWARD_FAILED: felt252 = 'ERC20: reward failed';
        const ERC20_PAY_FAILED: felt252 = 'ERC20: pay failed';
        const ERC20_REFUND_FAILED: felt252 = 'ERC20: refund failed';
        const HOST_PLAYER_ALREADY_IN_LOBBY: felt252 = 'Host: player already in lobby';
        const HOST_PLAYER_NOT_IN_LOBBY: felt252 = 'Host: player not in lobby';
        const HOST_CALLER_IS_NOT_THE_HOST: felt252 = 'Host: caller is not the arena';
        const HOST_MAX_NB_PLAYERS_IS_TOO_LOW: felt252 = 'Host: max player numbers is < 2';
        const HOST_GAME_NOT_OVER: felt252 = 'Host: game not over';
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {

        fn _find_player(self: @ContractState,world: IWorldDispatcher, game: Game, account: ContractAddress) -> Option<Player> {
            let mut index: u32 = game.player_count.into();
            loop {
                index -= 1;
                let player_key = (game.game_id, index);
                let player: Player = get!(world, player_key.into(), (Player));
                if player.address == account {
                    break Option::Some(player);
                }
                if index == 0 {
                    break Option::None;
                };
            }
        }



        fn _find_ranked_player(self: @ContractState,world: IWorldDispatcher, game: Game, rank: u8) -> Option<Player> {
            let mut index: u32 = game.player_count.into();
            loop {
                index -= 1;
                let player_key = (game.game_id, index);
                let player: Player = get!(world, player_key.into(), (Player));
                if player.rank == rank {
                    break Option::Some(player);
                }
                if index == 0 {
                    break Option::None;
                };
            }
        }

        fn _players(self: @ContractState,world: IWorldDispatcher, game: Game) -> Array<Player> {
            let mut index = game.player_count;
            let mut players: Array<Player> = array![];
            loop {
                if index == 0 {
                    break;
                };
                index -= 1;
                players.append(self.player(game, index.into()));
            };
            players
        }
    }

    #[abi(embed_v0)]
    impl ArenaImpl of IArena<ContractState> {
        fn create(
            ref world: IWorldDispatcher,
            player_name: felt252,
            price: u256,
            penalty: u64
        ) -> u32 {
          
            let caller = get_caller_address();
        

            // [Effect] Game
            let game_id = world.uuid();
            let mut game = GameTrait::new(
                game_id: game_id, arena: caller, price: price, penalty: penalty
            );

            let player_index: u32 = game.join().into();

            set!(world, (game));

            // [Effect] Player
            let player = PlayerTrait::new(
                game_id, index: player_index, address: caller, name: player_name
            );

            set!(world, (player));

            // [Return] Game id
            game_id
        }

        fn join(ref world: IWorldDispatcher, game_id: u32, player_name: felt252) {

            // [Check] Player not in lobby
            let mut game = get!(world, game_id, (Game));

            let caller = get_caller_address();

            match self._find_player(world,game, caller) {
                Option::Some(_) => panic(array![errors::HOST_PLAYER_ALREADY_IN_LOBBY]),
                Option::None => (),
            };


            // [Effect] Game
            let player_index: u32 = game.join().into();

            set!(world, (game));

            // [Effect] Player
            let player = PlayerTrait::new(
                game_id, index: player_index, address: caller, name: player_name
            );
            set!(world, (player));
        }


        fn leave(ref world: IWorldDispatcher, game_id: u32,) {

            // [Check] Player in lobby
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();

            let mut player = match self._find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };
                     
            // [Effect] Update Game
            let last_index = game.leave(caller);

            set!(world, (game));

            // [Effect] Update Player
            
            let mut last_player = get!(world, (game.game_id, last_index), (Player));
            
            if last_player.index != player.index {
                last_player.index = player.index;
                set!(world, (last_player));
            }

            // [Effect] Update Player
            player.nullify();
            set!(world, (player));
        }

        fn kick(ref world: IWorldDispatcher, game_id: u32, index: u32) {

            // [Check] Caller is the arena
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();
            game.assert_is_host(caller.into());

            // [Check] Player exists
            let mut player = get!(world, (game.game_id, index), (Player));
            player.assert_exists();

            // [Effect] Update Game
            let last_index = game.kick(player.address);
            set!(world, (game));

            // [Effect] Update last Player
            let mut last_player = get!(world, (game.game_id, last_index), (Player));
            if last_player.index != player.index {
                last_player.index = player.index;
                set!(world, (last_player));
            }

            // [Effect] Update Player
            player.nullify();
            set!(world, (player));
        }

        fn delete(ref world: IWorldDispatcher, game_id: u32) {


            // [Check] Player exists
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();
            let mut player = match self._find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };
            player.assert_exists();


            // [Effect] Update Game
            game.delete(player.address);
            set!(world, (game));

            // [Effect] Update Player
            player.nullify();
            set!(world, (player));
        }

        fn start(ref world: IWorldDispatcher, game_id: u32, round_count: u32) {

            // [Check] Caller is the arena
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();
            game.assert_is_host(caller);

            // [Effect] Start game
            let mut addresses = array![];
            let mut players = self._players(world,game);
            loop {
                match players.pop_front() {
                    Option::Some(player) => { addresses.append(player.address); },
                    Option::None => { break; },
                };
            };

            // [Effect] Update Game
            let time = get_block_timestamp();
            game.start(time, round_count, addresses);
        
            set!(world, (game))

        }

    }

}
