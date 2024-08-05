
#[dojo::interface]
trait IHost {
    fn create( ref world: IWorldDispatcher,
        player_name: felt252,
        price: u256,
        penalty: u64
    ) -> u32;
    fn join(ref world: IWorldDispatcher,game_id: u32, player_name: felt252);
    fn leave(ref world: IWorldDispatcher, game_id: u32);
    fn delete(ref world: IWorldDispatcher, game_id: u32);
    fn kick(ref world: IWorldDispatcher, game_id: u32, index: u32);
}



// System implementation

#[dojo::contract]
mod host {
    // Starknet imports

    use super::{IHost};

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
        const HOST_CALLER_IS_NOT_THE_HOST: felt252 = 'Host: caller is not the host';
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
    }

    #[abi(embed_v0)]
    impl HostImpl of IHost<ContractState> {
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
                game_id: game_id, host: caller, price: price, penalty: penalty
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

            // [Check] Caller is the host
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

        // fn start(self: @ContractState, world: IWorldDispatcher, game_id: u32, round_count: u32) {

        //     // [Check] Caller is the host
        //     let mut game = get!(world, game_id, (Game));
        //     let caller = get_caller_address();
        //     game.assert_is_host(caller.into());

        //     // [Effect] Start game
        //     let mut addresses = array![];
        //     let mut players = store.players(game);
        //     loop {
        //         match players.pop_front() {
        //             Option::Some(player) => { addresses.append(player.address); },
        //             Option::None => { break; },
        //         };
        //     };

        //     // [Effect] Update Game
        //     let time = get_block_timestamp();
        //     game.start(time, round_count, addresses);
        //     store.set_game(game);

        //     // [Effect] Update Tiles
        //     let army_count = start_supply(game.player_count);
        //     let mut map = MapTrait::new(
        //         game_id: game.id,
        //         seed: game.seed,
        //         player_count: game.player_count.into(),
        //         tile_count: TILE_NUMBER,
        //         army_count: army_count,
        //     );
        //     let mut player_index = 0;
        //     loop {
        //         if player_index == game.player_count {
        //             break;
        //         }
        //         let mut player_tiles = map.player_tiles(player_index.into());
        //         loop {
        //             match player_tiles.pop_front() {
        //                 Option::Some(tile) => { store.set_tile(*tile); },
        //                 Option::None => { break; },
        //             };
        //         };
        //         player_index += 1;
        //     };

        //     // [Effect] Update Players
        //     // Use the deck mechanism to define the player order
        //     // First player got his supply set
        //     let mut deck = DeckTrait::new(game.seed, game.player_count.into());
        //     let mut player_index = 0;
        //     let mut ordered_players: Array<Player> = array![];
        //     loop {
        //         if deck.remaining == 0 {
        //             break;
        //         };
        //         let index = deck.draw() - 1;
        //         let mut player = store.player(game, index.into());
        //         player.index = player_index;
        //         if player_index == 0 {
        //             let player_score = map.player_score(player_index.into());
        //             player.supply = if command-nexus < 12 {
        //                 3
        //             } else {
        //                 player_score / 3
        //             };
        //             player.supply += map.faction_score(player_index.into());
        //         };
        //         ordered_players.append(player);
        //         player_index += 1;
        //     };
        //     // Store ordered players
        //     loop {
        //         match ordered_players.pop_front() {
        //             Option::Some(player) => { store.set_player(player); },
        //             Option::None => { break; },
        //         };
        //     };
        // }

        // fn claim(self: @ContractState, world: IWorldDispatcher, game_id: u32,) {


        //     // [Interaction] Distribute rewards
        //     let game = get!(world, game_id, (Game));
        //     self._reward(game, game.reward(), ref store);
        // }
    }

}
