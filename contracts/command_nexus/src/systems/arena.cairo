

#[starknet::interface]
pub trait IArena<TContractState> {
    fn create( ref self: TContractState,
        player_name: felt252,
        price: u256,
        penalty: u64
    ) -> u32;
    fn join(ref self: TContractState,game_id: u32, player_name: felt252);
    fn transfer(ref self: TContractState, game_id: u32, index: u32);
    fn leave(ref self: TContractState, game_id: u32);
    fn start(ref self: TContractState, game_id: u32, round_count: u32);
    fn delete(ref self: TContractState, game_id: u32);
    fn kick(ref self: TContractState, game_id: u32, index: u32);
}

// System implementation

#[dojo::contract]
mod arena {
    // Starknet imports

    use dojo::world::IWorldDispatcherTrait;
    use super::{IArena};

    use starknet::{
        ContractAddress, get_caller_address, get_contract_address, get_block_timestamp
    };

    use command_nexus::models::game::{Game, GameTrait, GameAssert};
    use command_nexus::models::player::{Player, PlayerTrait, PlayerAssert};
    use command_nexus::utils::helper::{HelperTrait};
    use command_nexus::models::battlefield::{BattlefieldName,UrbanBattlefieldTrait,BattlefieldNameTrait, WeatherEffectTrait,UrbanBattlefield,WeatherEffect};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    pub mod errors {
        pub const ERC20_REWARD_FAILED: felt252 = 'ERC20: reward failed';
        pub const ERC20_PAY_FAILED: felt252 = 'ERC20: pay failed';
        pub const ERC20_REFUND_FAILED: felt252 = 'ERC20: refund failed';
        pub const HOST_PLAYER_ALREADY_IN_LOBBY: felt252 = 'Host: player already in lobby';
        pub const HOST_PLAYER_NOT_IN_LOBBY: felt252 = 'Host: player not in lobby';
        pub const HOST_CALLER_IS_NOT_THE_HOST: felt252 = 'Host: caller is not the arena';
        pub const HOST_MAX_NB_PLAYERS_IS_TOO_LOW: felt252 = 'Host: max player numbers is < 2';
        pub const HOST_GAME_NOT_OVER: felt252 = 'Host: game not over';
    }


    #[abi(embed_v0)]
    pub impl ArenaImpl of IArena<ContractState> {
        fn create(
            ref self: ContractState,
            player_name: felt252,
            price: u256,
            penalty: u64,
        ) -> u32 {

            let mut world = self.world_default();
          
            let caller = get_caller_address();
            
            // [Effect] Game
            let game_id = world.dispatcher.uuid();
            
            let mut game: Game = GameTrait::new(
                game_id: game_id, arena_host: caller, price: price, penalty: penalty,player_name: player_name
            );

            let player_index: u32 = game.join_game().into();

            let player_home_base: BattlefieldName = game.assign_home_base();

        
            //set!(world, (game));

            world.write_model(@game);


            // [Effect] Player
            let player: Player = PlayerTrait::new(
                game_id, index: player_index, address: caller, name: player_name, home_base: player_home_base
            );

           // set!(world, (player));

            world.write_model(@player);

            let size = player_home_base.get_size();

            let weather = WeatherEffectTrait::create();

            let battlefield_id = player_home_base.to_battlefield_id();

            let urban_battle_field = UrbanBattlefieldTrait::new(
                game_id,
                battlefield_id,
                player_id: player_index,
                weather: weather,
                size: size,
            );

            //set!(world,(urban_battle_field));

            world.write_model(@urban_battle_field);

   
            

            // [Return] Game id
            game_id
        }

        fn join(ref self: ContractState, game_id: u32, player_name: felt252) {

            let mut world = self.world_default();

            // [Check] Player not in lobby
            //let mut game = get!(world, game_id, (Game));

            let mut game: Game  = world.read_model(game_id);

            let caller = get_caller_address();

            match HelperTrait::find_player(world,game, caller) {
                Option::Some(_) => panic(array![errors::HOST_PLAYER_ALREADY_IN_LOBBY]),
                Option::None => (),
            };

            // [Effect] Game
            let player_index: u32 = game.join_game().into();

            let player_home_base: BattlefieldName = game.assign_home_base();

           // set!(world, (game));
           world.write_model(@game);

            // [Effect] Player
            let player = PlayerTrait::new(
                game_id, index: player_index, address: caller, name: player_name, home_base: player_home_base
            );

            //set!(world, (player));
            world.write_model(@player);

            let size = player_home_base.get_size();

            let weather = WeatherEffectTrait::create();

            let battlefield_id = player_home_base.to_battlefield_id();

            let urban_battle_field = UrbanBattlefieldTrait::new(
                game_id,
                battlefield_id,
                player_id: player_index,
                weather: weather,
                size: size,
            );

            //set!(world,(urban_battle_field));
            world.write_model(@urban_battle_field);
        }


        fn transfer(ref self: ContractState, game_id: u32, index: u32) {

            // [Check] Caller is the host
           // let mut game = get!(world, game_id, Game);
            let mut world = self.world_default();

            let mut game: Game  = world.read_model(game_id);

            let caller = get_caller_address();

            game.assert_is_host(caller);

            // [Check] Player exists
            //let mut player = get!(world,(game_id,index),Player);

            let mut player: Player = world.read_model((game_id,index));

            player.assert_exists();

            // [Effect] Update Game
            game.transfer(player.address);
            
            //set!(world,(game));
            world.write_model(@game);
        }

        fn leave(ref self: ContractState, game_id: u32,) {

            // [Check] Player in lobby
            //let mut game = get!(world, game_id, (Game));

            let mut world = self.world_default();

            let mut game: Game  = world.read_model(game_id);

            let caller = get_caller_address();

            let mut player = match HelperTrait::find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };
                     
            // [Effect] Update Game
            let last_index = game.leave(caller);

            //set!(world, (game));

            world.write_model(@game);

            // [Effect] Update Player
            
           // let mut last_player = get!(world, (game.game_id, last_index), (Player));

           let mut last_player: Player = world.read_model((game.game_id, last_index));
            
            if last_player.index != player.index {
                last_player.index = player.index;
                //set!(world, (last_player));
                world.write_model(@last_player);
            }

            // [Effect] Update Player
            player.nullify();
           // set!(world, (player));

           world.write_model(@player);
        }

        fn kick(ref self: ContractState, game_id: u32, index: u32) {

            // [Check] Caller is the arena
           // let mut game = get!(world, game_id, (Game));
            let mut world = self.world_default();

            let mut game: Game  = world.read_model(game_id);

            let caller = get_caller_address();
            game.assert_is_host(caller.into());

            // [Check] Player exists
           // let mut player = get!(world, (game.game_id, index), (Player));

           let mut player: Player = world.read_model((game.game_id, index));

            player.assert_exists();

            // [Effect] Update Game
            let last_index = game.kick(player.address);
            //set!(world, (game));
            world.write_model(@game);

            // [Effect] Update last Player
            //let mut last_player = get!(world, (game.game_id, last_index), (Player));

            let mut last_player: Player = world.read_model((game.game_id, last_index));

            if last_player.index != player.index {
                last_player.index = player.index;
                //set!(world, (last_player));
                world.write_model(@last_player);
            }

            // [Effect] Update Player
            player.nullify();
           // set!(world, (player));
             world.write_model(@player);
        }

        fn delete(ref self: ContractState, game_id: u32) {


            // [Check] Player exists
           // let mut game = get!(world, game_id, (Game));

           let mut world = self.world_default();

           let mut game: Game  = world.read_model(game_id);

            let caller = get_caller_address();
            let mut player = match HelperTrait::find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };

            player.assert_exists();
            
            // [Effect] Update Game

            game.delete(player.address);
            //set!(world, (game));

            world.write_model(@game);

            // [Effect] Update Player
            player.nullify();
            //set!(world, (player));
            world.write_model(@player);
        }

        fn start(ref self: ContractState, game_id: u32, round_count: u32) {

            // [Check] Caller is the arena
            //let mut game = get!(world, game_id, (Game));
            let mut world = self.world_default();

            let mut game: Game  = world.read_model(game_id);

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

            let player_index = game.player();
            //let mut player = get!(world, (game_id, player_index), Player);

            let  mut player:Player = world.read_model((game_id, player_index));

            player.set_turn_start_time(time);
        
            //set!(world, (game));
            //set!(world,(player));

            world.write_model(@game);
            world.write_model(@player);

        }

    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "command_nexus". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"command_nexus")
        }

    }

}
