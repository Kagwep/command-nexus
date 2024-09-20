
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
    use contracts::utils::helper::{HelperTrait};
    use contracts::models::battlefield::{BattlefieldName,UrbanBattlefieldTrait,BattlefieldNameTrait, WeatherEffectTrait,UrbanBattlefield,WeatherEffect};

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
                game_id: game_id, arena_host: caller, price: price, penalty: penalty
            );

            let player_index: u32 = game.join_game().into();

            let player_home_base: BattlefieldName = game.assign_home_base();

            set!(world, (game));

            // [Effect] Player
            let player = PlayerTrait::new(
                game_id, index: player_index, address: caller, name: player_name, home_base: player_home_base
            );

            set!(world, (player));

            // [Return] Game id
            game_id
        }

        fn join(ref world: IWorldDispatcher, game_id: u32, player_name: felt252) {

            // [Check] Player not in lobby
            let mut game = get!(world, game_id, (Game));

            let caller = get_caller_address();

            match HelperTrait::find_player(world,game, caller) {
                Option::Some(_) => panic(array![errors::HOST_PLAYER_ALREADY_IN_LOBBY]),
                Option::None => (),
            };

            // [Effect] Game
            let player_index: u32 = game.join_game().into();

            let player_home_base: BattlefieldName = game.assign_home_base();

            set!(world, (game));

            // [Effect] Player
            let player = PlayerTrait::new(
                game_id, index: player_index, address: caller, name: player_name, home_base: player_home_base
            );

            set!(world, (player));

            let size = player_home_base.get_size();

            let weather = WeatherEffectTrait::create(game_id);

            let battlefield_id = player_home_base.to_battlefield_id();

            let urban_battle_field = UrbanBattlefieldTrait::new(
                game_id,
                battlefield_id,
                player_id: player_index,
                weather: weather,
                size: size,
            );

            set!(world,(urban_battle_field))
        }


        fn leave(ref world: IWorldDispatcher, game_id: u32,) {

            // [Check] Player in lobby
            let mut game = get!(world, game_id, (Game));
            let caller = get_caller_address();

            let mut player = match HelperTrait::find_player(world,game, caller) {
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
            let mut player = match HelperTrait::find_player(world,game, caller) {
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
            let mut players = HelperTrait::players(world,game);
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
