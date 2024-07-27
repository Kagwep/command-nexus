// Starknet imports

use starknet::ContractAddress;

// Dojo imports

use dojo::world::IWorldDispatcher;

// Interfaces

#[starknet::interface]
trait IHost<TContractState> {
    fn create(
        self: @TContractState,
        world: IWorldDispatcher,
        player_name: felt252,
        price: u256,
        penalty: u64
    ) -> u32;
    fn join(self: @TContractState, world: IWorldDispatcher, game_id: u32, player_name: felt252);
    fn leave(self: @TContractState, world: IWorldDispatcher, game_id: u32);
    fn delete(self: @TContractState, world: IWorldDispatcher, game_id: u32);
    fn kick(self: @TContractState, world: IWorldDispatcher, game_id: u32, index: u32);
    fn transfer(self: @TContractState, world: IWorldDispatcher, game_id: u32, index: u32);
    fn start(self: @TContractState, world: IWorldDispatcher, game_id: u32, round_count: u32);
    fn claim(self: @TContractState, world: IWorldDispatcher, game_id: u32);
}

#[starknet::interface]
trait IERC20<TContractState> {
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transferFrom(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
}

// System implementation

#[starknet::contract]
mod host {
    // Starknet imports

    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_timestamp,
        contract_address_try_from_felt252
    };

    // Dojo imports

    use dojo::world;
    use dojo::world::IWorldDispatcher;
    use dojo::world::IWorldDispatcherTrait;
    use dojo::world::IWorldProvider;
    use dojo::world::IDojoResourceProvider;

    // External imports

    use origami::random::deck::{Deck, DeckTrait};

    // Models imports

    use contracts::models::game::{Game, GameTrait, GameAssert};
    use contractsr::models::player::{Player, PlayerTrait, PlayerAssert};


    // Local imports

    use super::{IHost, IERC20Dispatcher, IERC20DispatcherTrait};

    // Errors

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

    // Storage

    #[storage]
    struct Storage {}

    // Implementations

    #[abi(embed_v0)]
    impl DojoResourceProviderImpl of IDojoResourceProvider<ContractState> {
        fn dojo_resource(self: @ContractState) -> felt252 {
            'host'
        }
    }

    #[abi(embed_v0)]
    impl WorldProviderImpl of IWorldProvider<ContractState> {
        fn world(self: @ContractState) -> IWorldDispatcher {
            IWorldDispatcher { contract_address: constants::WORLD() }
        }
    }

    #[abi(embed_v0)]
    impl Host of IHost<ContractState> {
        fn create(
            self: @ContractState,
            world: IWorldDispatcher,
            player_name: felt252,
            price: u256,
            penalty: u64
        ) -> u32 {
          
            let caller = get_caller_address();
            self._pay(world, caller, price);

            // [Effect] Game
            let game_id = world.uuid();
            let mut game = GameTrait::new(
                game_id: game_id, host: host, price: price, penalty: penalty
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

        fn join(self: @ContractState, world: IWorldDispatcher, game_id: u32, player_name: felt252) {

            // [Check] Player not in lobby
            let mut game = get!(world, game_id, (Game));

            let caller = get_caller_address();

            let mut index: u32 = game.player_count.into();

            loop {
                index -= 1;
                let player_key = (game.game_id, index);
                let player: Player = get!(self.world, player_key.into(), (Player));
                if player.address == caller {
                    panic(array![errors::HOST_PLAYER_ALREADY_IN_LOBBY]);
                }
            }

            // [Interaction] Pay
            self._pay(world, caller, game.price);

            // [Effect] Game
            let player_index: u32 = game.join().into();

            set!(world, (game));

            // [Effect] Player
            let player = PlayerTrait::new(
                game_id, index: player_index, address: caller, name: player_name
            );
            set!(world, (player));
        }

        fn transfer(self: @ContractState, world: IWorldDispatcher, game_id: u32, index: u32) {

            // [Check] Caller is the host
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();
            game.assert_is_host(caller);

            // [Check] Player exists
            let mut player =  get!(world, (game.game_id, index), (Player));
            player.assert_exists();

            // [Effect] Update Game
            game.transfer(player.address);

            set!(world, (game));
        }

        fn leave(self: @ContractState, world: IWorldDispatcher, game_id: u32,) {

            // [Check] Player in lobby
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();

            let mut player = self._find_player(world,game, caller);
                     
            // [Effect] Update Game
            let last_index = game.leave(caller);

            set!(world, (game));

            // [Effect] Update Player
            let mut last_player = get!(world, (game.game_id, index), (Player));
            
            if last_player.index != player.index {
                last_player.index = player.index;
                set!(world, (last_player));
            }

            // [Interaction] Refund
            let recipient = player.address;
            self._refund(world, recipient, game.price);

            // [Effect] Update Player
            player.nullify();
            set!(world, (player));
        }

        fn kick(self: @ContractState, world: IWorldDispatcher, game_id: u32, index: u32) {

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
            let mut last_player = get!(world, (game.game_id, index), (Player));
            if last_player.index != player.index {
                last_player.index = player.index;
                set!(world, (last_player));
            }

            // [Interaction] Refund
            let address = player.address;
            self._refund(world, address, game.price);

            // [Effect] Update Player
            player.nullify();
            set!(world, (player));
        }

        fn delete(self: @ContractState, world: IWorldDispatcher, game_id: u32) {


            // [Check] Player exists
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();
            let mut player = self._find_player(world,game, caller);
            player.assert_exists();

            // [Interaction] Refund
            let address = player.address;
            self._refund(world, address, game.price);

            // [Effect] Update Game
            game.delete(player.address);
            set!(world, (game));

            // [Effect] Update Player
            player.nullify();
            set!(world, (player));
        }

        fn start(self: @ContractState, world: IWorldDispatcher, game_id: u32, round_count: u32) {

            // [Check] Caller is the host
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();
            game.assert_is_host(caller.into());

            // [Effect] Start game
            let mut addresses = array![];
            let mut players = store.players(game);
            loop {
                match players.pop_front() {
                    Option::Some(player) => { addresses.append(player.address); },
                    Option::None => { break; },
                };
            };

            // [Effect] Update Game
            let time = get_block_timestamp();
            game.start(time, round_count, addresses);
            store.set_game(game);

            // [Effect] Update Tiles
            let army_count = start_supply(game.player_count);
            let mut map = MapTrait::new(
                game_id: game.id,
                seed: game.seed,
                player_count: game.player_count.into(),
                tile_count: TILE_NUMBER,
                army_count: army_count,
            );
            let mut player_index = 0;
            loop {
                if player_index == game.player_count {
                    break;
                }
                let mut player_tiles = map.player_tiles(player_index.into());
                loop {
                    match player_tiles.pop_front() {
                        Option::Some(tile) => { store.set_tile(*tile); },
                        Option::None => { break; },
                    };
                };
                player_index += 1;
            };

            // [Effect] Update Players
            // Use the deck mechanism to define the player order
            // First player got his supply set
            let mut deck = DeckTrait::new(game.seed, game.player_count.into());
            let mut player_index = 0;
            let mut ordered_players: Array<Player> = array![];
            loop {
                if deck.remaining == 0 {
                    break;
                };
                let index = deck.draw() - 1;
                let mut player = store.player(game, index.into());
                player.index = player_index;
                if player_index == 0 {
                    let player_score = map.player_score(player_index.into());
                    player.supply = if player_score < 12 {
                        3
                    } else {
                        player_score / 3
                    };
                    player.supply += map.faction_score(player_index.into());
                };
                ordered_players.append(player);
                player_index += 1;
            };
            // Store ordered players
            loop {
                match ordered_players.pop_front() {
                    Option::Some(player) => { store.set_player(player); },
                    Option::None => { break; },
                };
            };
        }

        fn claim(self: @ContractState, world: IWorldDispatcher, game_id: u32,) {
            // [Setup] Datastore
            let mut store: Store = StoreTrait::new(world);

            // [Interaction] Distribute rewards
            let game = store.game(game_id);
            self._reward(game, game.reward(), ref store);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {

        fn _find_player(self: @ContractState, world: IWorldDispatcher, game: Game, account: ContractAddress) -> Option<Player> {
            let mut index: u32 = game.player_count.into();
            loop {
                index -= 1;
                let player_key = (game.id, index);
                let player: Player = get!(world, player_key.into(), (Player));
                if player.address == account {
                    break Option::Some(player);
                }
                if index == 0 {
                    break Option::None;
                };
            }
        }


        fn _pay(
            self: @ContractState, world: IWorldDispatcher, caller: ContractAddress, amount: u256
        ) {
            // [Check] Amount is not null, otherwise return
            if amount == 0 {
                return;
            }

            // [Interaction] Transfer
            let contract = get_contract_address();
            let erc20 = IERC20Dispatcher { contract_address: constants::ERC20_ADDRESS() };
            let status = erc20.transferFrom(caller, contract, amount);

            // [Check] Status
            assert(status, errors::ERC20_PAY_FAILED);
        }

        fn _refund(
            self: @ContractState, world: IWorldDispatcher, recipient: ContractAddress, amount: u256
        ) {
            // [Check] Amount is not null, otherwise return
            if amount == 0 {
                return;
            }

            // [Interaction] Transfer
            let erc20 = IERC20Dispatcher { contract_address: constants::ERC20_ADDRESS() };
            let status = erc20.transfer(recipient, amount);

            // [Check] Status
            assert(status, errors::ERC20_REFUND_FAILED);
        }

        fn _reward(self: @ContractState, game: Game, amount: u256, ref store: Store,) {
            // [Check] Amount is not null, otherwise return
            if amount == 0 {
                return;
            }

            // [Setup] Top players
            let first = store.find_ranked_player(game, 1);
            let first_address: ContractAddress = match first {
                Option::Some(player) => {
                    contract_address_try_from_felt252(player.address).unwrap()
                },
                Option::None => { constants::ZERO() },
            };

            let second = store.find_ranked_player(game, 2);
            let second_address: ContractAddress = match second {
                Option::Some(player) => {
                    contract_address_try_from_felt252(player.address).unwrap()
                },
                Option::None => { constants::ZERO() },
            };

            let third = store.find_ranked_player(game, 3);
            let third_address: ContractAddress = match third {
                Option::Some(player) => {
                    contract_address_try_from_felt252(player.address).unwrap()
                },
                Option::None => { constants::ZERO() },
            };

            // [Interaction] Transfers
            let erc20 = IERC20Dispatcher { contract_address: constants::ERC20_ADDRESS() };
            let mut rewards: Span<Reward> = RewardTrait::rewards(
                game.player_count, amount, first_address, second_address, third_address
            );
            loop {
                match rewards.pop_front() {
                    Option::Some(reward) => {
                        let status = erc20.transfer(*reward.recipient, *reward.amount);
                        assert(status, errors::ERC20_REWARD_FAILED);
                    },
                    Option::None => { break; },
                };
            }
        }
    }
}
