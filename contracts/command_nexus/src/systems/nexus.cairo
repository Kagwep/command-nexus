use command_nexus::models::player::{Player, PlayerTrait, PlayerAssert,UnitType,UnitTypeTrait,UnitTypeImpl};
use command_nexus::models::units::unit_states::{
    UnitMode,UnitState,UnitStateTrait,EnvironmentInfo,TerrainType,TerrainTypeTrait,AbilityType,AbilityState,AbilityStateTrait};
use command_nexus::models::battlefield::BattlefieldName;
// Dojo imports
use dojo::world::IWorldDispatcher;

#[starknet::interface]
pub trait INexus<TContractState>  {
    fn deploy_forces(
        ref self: TContractState,
        game_id: u32,
        battlefield_id: u8,
        unit: u8,
        supply: u32,
        x: u256,
        y: u256,
        z: u256,
        terrain_num: u8,
        cover_level: u8,   
        elevation: u8,
    );

    fn patrol(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: u8,
        start_x: u256,
        start_y: u256,
        start_z: u256,
    );

    fn attack(ref self: TContractState, game_id: u32,player_target_id: u32, attacker_id: u32, target_id: u32,unit_id: u32,attacker_unit_type: u8,target_unit_type: u8,x: u256,y: u256,z: u256,);

    fn defend(ref self: TContractState, game_id: u32, unit_id: u32,unit_type: u8, x: u256, y: u256, z: u256);

    fn move_unit(ref self: TContractState, game_id: u32, unit_id: u32,unit_type: u8, dest_x: u256, dest_y: u256, dest_z: u256);

    fn stealth(ref self: TContractState, game_id: u32, unit_id: u32,unit_type:u8,x: u256,y: u256,z: u256,);

    fn heal(ref self: TContractState, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256);

    fn recon(ref self: TContractState, game_id: u32, unit_id: u32,unit_type:u8, area_x: u256, area_y: u256, area_z: u256);

    fn force_end_player_turn (ref self: TContractState, game_id: u32);

    fn capture_flag(ref self: TContractState, game_id: u32,unit_id: u32,unit_type: u8, flag_id: u8,x: u256,y: u256,z: u256);

    fn boost(ref self: TContractState, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256);

}


#[starknet::interface]
trait INexusInternal<TContractState> {

    fn _handle_unit_deployment(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player: Player,
        environment:EnvironmentInfo,
        battlefield_name: BattlefieldName,
        x:u256,y:u256,z:u256
    );


    fn _handle_unit_type_action(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player: Player,
        operation: AbilityType,
        x:u256,y:u256,z:u256
    );

    fn _handle_unit_boost(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player: Player,
        x:u256,y:u256,z:u256
    );


    fn _update_unit_state(
        ref self: TContractState,
        game_id: u32,
        player_index: u32,
        unit_id: u32,
        unit_type: UnitType,
        new_mode: UnitMode,
        x: u256,
        y: u256,
        z: u256
    );

    fn _handle_unit_move(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player_id: u32,
        x: u256,
        y: u256,
        z: u256,
    );

    fn _handle_operation(
        ref self: TContractState,
        game_id: u32, 
        unit_id: u32,
        unit_type: UnitType,
        operation: AbilityType,
        player: Player,
        x: u256,
        y: u256,
        z: u256
    );

    fn _handle_unit_attack(
        ref self: TContractState,
        game_id: u32,
        target_id: u32,
        attacker_id: u32,
        player_id:u32,
        player_target_id: u32,
        attacker: UnitType,
        target: UnitType,
        x: u256,
        y: u256,
        z: u256,
    );

    fn _handle_defend(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player_id: u32,
        x: u256,
        y: u256,
        z: u256,
    );

    fn _handle_stealth(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player_id: u32,
        operation: AbilityType
    );

   fn _handle_patrol(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player_id: u32,
        operation: AbilityType
    );


    fn _handle_recon(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player_id: u32,
        operation: AbilityType
    );


    fn _handle_heal(
        ref self: TContractState,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player_id: u32,
        operation: AbilityType
    );
}

#[dojo::contract]
mod nexus {
    use super::{INexus};
    use starknet::{ContractAddress, get_caller_address,get_block_timestamp};
    use command_nexus::models::{
        battlefield::{BattlefieldName,UrbanBattlefield,BattlefieldNameTrait,BattlefieldFlag,BattlefieldFlagTrait},
        units::unit_states::{UnitMode,UnitState,TerrainTypeTrait,EnvironmentInfo,UnitStateTrait,UnitTrait,AbilityType,AbilityState,AbilityStateTrait},
        
    };

    use command_nexus::models::player::{Player, PlayerTrait, PlayerAssert,UnitType,UnitTypeTrait,UnitTypeImpl};
    use command_nexus::models::game::{Game, GameTrait, GameAssert};

    use command_nexus::utils::helper::{HelperTrait};

    use command_nexus::utils::{NexusUnit,NexusUnitTrait};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;
    

    use command_nexus::models::units::air::{
        AirUnit,
        AirUnitTrait,
    };
    
    use command_nexus::models::units::armored::{
        Armored,
        ArmoredTrait,
    };
    
    use command_nexus::models::units::infantry::{Infantry,InfantryTrait,InfantryAccessories};
    use command_nexus::models::units::naval::{Ship,ShipTrait};
    
    use command_nexus::models::units::cyber::{CyberUnitTrait,CyberUnit};

    use command_nexus::models::position::{Position,Vec3};

    use command_nexus::constants::{MAX_POINT_BONUS,BASE_DAMAGE,HEAL,DAMAGE_SCAlE_FACTOR,BOOSTER};

    


    mod errors {
        pub const ERC20_REWARD_FAILED: felt252 = 'ERC20: reward failed';
        pub const ERC20_PAY_FAILED: felt252 = 'ERC20: pay failed';
        pub const ERC20_REFUND_FAILED: felt252 = 'ERC20: refund failed';
        pub const HOST_PLAYER_ALREADY_IN_LOBBY: felt252 = 'Host: player already in lobby';
        pub const HOST_PLAYER_NOT_IN_LOBBY: felt252 = 'Host: player not in lobby';
        pub const HOST_CALLER_IS_NOT_THE_HOST: felt252 = 'Host: caller is not the arena';
        pub const HOST_MAX_NB_PLAYERS_IS_TOO_LOW: felt252 = 'Host: max player numbers is < 2';
        pub const HOST_GAME_NOT_OVER: felt252 = 'Host: game not over';
        pub const INVALID_PLAYER:felt252 = 'Not player';
    }




    // player deploy force to battle field assigned
    #[abi(embed_v0)]
    pub impl NexusImpl of INexus<ContractState> {



        fn deploy_forces(
            ref self: ContractState,
            game_id: u32,
            battlefield_id: u8,
            unit: u8,
            supply: u32,
            x: u256,
            y: u256,
            z: u256,
            terrain_num: u8,
            cover_level: u8,  
            elevation: u8,
        ) {

            let mut world = self.world_default();

            let caller = get_caller_address();

           // let mut game = get!(world,game_id,(Game));

            let mut game: Game  =  world.read_model(game_id);

            // get the player
            let mut player = match HelperTrait::find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };

            player.assert_exists();

            player.assert_has_commands();

            let time = get_block_timestamp();

            if player.is_turn_timed_out(time){
                game.advance_turn();
                player.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);

                world.write_model(@game);

                
            }else{
                            // let battle_field: UrbanBattlefield = get!(world,(game_id, battlefield_id),(UrbanBattlefield));

            let battle_field: UrbanBattlefield  =  world.read_model((game_id, battlefield_id));

            assert(battle_field.player_id == player.index, 'Not Player');

            let unit_type = match  UnitTypeTrait::from_int(unit) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };


            let unit_supply = player.get_unit_supply(unit_type);

            // Ensure supply contraints for unit type
            assert(supply > 0, 'Invalid deployment: '); // Added

            assert(unit_supply >= supply, 'Insufficient supply');

            let terrain = match TerrainTypeTrait::from_u8(terrain_num) {
                Option::Some(ter) => ter,
                Option::None => panic(array!['Invalid Terrain type'])
            };


            let environment = EnvironmentInfo {
                terrain,
                cover_level,   
                elevation,     
            };

            let battlefield_name = match BattlefieldNameTrait::from_battlefield_id(battlefield_id){
                Option::Some(name) => name,
                Option::None => panic(array!['Invalid battle field'])
            };

            let unit_id = game.add_unit();

            self._handle_unit_deployment(
                game_id,
                unit_id,
                unit_type,
                player,
                environment,
                battlefield_name,
                x,y,z
            );


            player.unit_supply(unit_type);

            let remaining_commands = player.send_command();

            if remaining_commands == 0 {
                game.advance_turn();
                player.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);
            }

            //set!(world, (player));

            world.write_model(@player);

           // set!(world, (game));

            world.write_model(@game);
            }
            



        }

        fn patrol(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: u8,
            start_x: u256,
            start_y: u256,
            start_z: u256,
        ) {

            let mut world = self.world_default();

            let player_address  = get_caller_address();
           // let mut game = get!(world, game_id, (Game));
           let mut game: Game  =  world.read_model(game_id);
            let mut attacker = HelperTrait::current_player(world, game);

            assert(player_address == attacker.address, errors::INVALID_PLAYER);

            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let time = get_block_timestamp();

            let operation = AbilityType::Patrol;

            // Handle unit type-specific operations
            self._handle_unit_type_action(
                game.game_id,
                unit_id,
                unit_type,
                attacker,
                operation,
                start_x,
                start_y,
                start_z
            );

            // Update the unit state to patrolling mode
            self._update_unit_state(
                game.game_id,
                attacker.index,
                unit_id,
                unit_type,
                UnitMode::Patrolling,
                start_x,
                start_y,
                start_z
            );

            let remaining_commands = attacker.send_command();

            if remaining_commands == 0 {
                game.advance_turn();
                attacker.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);
            }

            //set!(world, (player));

            world.write_model(@attacker);

           // set!(world, (game));

            world.write_model(@game);
        }
        
        fn attack(ref self: ContractState, game_id: u32,player_target_id: u32, attacker_id: u32, target_id: u32,unit_id: u32,attacker_unit_type: u8,target_unit_type: u8,x:u256,y:u256,z:u256) {
            
           let mut world = self.world_default();

           let player_address = get_caller_address();
          // let mut game = get!(world, game_id, (Game));
           let mut game: Game  =  world.read_model(game_id);

           let mut attacker = HelperTrait::current_player(world, game);

           assert(player_address  == attacker.address, errors::INVALID_PLAYER);

           let time = get_block_timestamp();

           let attacker_unit = match  UnitTypeTrait::from_int(attacker_unit_type) {
            Option::Some(unit) => unit,
            Option::None => panic(array!['Invalid unit Type'])
            };

           let target_unit = match  UnitTypeTrait::from_int(target_unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
                };

            self._handle_unit_attack(
                game.game_id,
                target_id,
                attacker_id,
                attacker.index,
                player_target_id,
                attacker_unit,
                target_unit,
                x,
                y,
                z,
             );
    

            // Update the unit state to attack mode
            self._update_unit_state(
                game.game_id,
                attacker.index,
                unit_id,
                attacker_unit,
                UnitMode::Attacking,
                x,
                y,
                z
            );

            let mut world = self.world_default();

            let mut game: Game  =  world.read_model(game_id);

            let mut attacker = HelperTrait::current_player(world, game);

            let remaining_commands = attacker.send_command();

            if remaining_commands == 0 {
                game.advance_turn();
                attacker.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);
            }

            //set!(world, (player));

            world.write_model(@attacker);

           // set!(world, (game));

            world.write_model(@game);

        }
        
        fn defend(ref self: ContractState, game_id: u32, unit_id: u32,unit_type: u8, x: u256, y: u256, z: u256) {

            let mut world = self.world_default();


            let player_address = get_caller_address();
            //let mut game = get!(world, game_id, (Game));

            let mut game: Game  =  world.read_model(game_id);
 
            let mut player = HelperTrait::current_player(world, game);

            let time = get_block_timestamp();
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Defend;

            // Handle unit type-specific operations
            self._handle_unit_type_action(
                game.game_id,
                unit_id,
                unit_type,
                player,
                operation,
                x,y,z
            );
    
            // Update the unit state to patrolling mode
            self._update_unit_state(
                game.game_id,
                player.index,
                unit_id,
                unit_type,
                UnitMode::Defending,
                x,
                y,
                z
            );
 
            let remaining_commands = player.send_command();

            if remaining_commands == 0 {
                game.advance_turn();
                player.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);
            }

            //set!(world, (player));

            world.write_model(@player);

           // set!(world, (game));

            world.write_model(@game);
        }
        
        fn move_unit(ref self: ContractState, game_id: u32, unit_id: u32,unit_type: u8, dest_x: u256, dest_y: u256, dest_z: u256) {

            let mut world = self.world_default();

            let player_address = get_caller_address();
           // let mut game = get!(world, game_id, (Game));
           let time = get_block_timestamp();

           let mut game: Game  =  world.read_model(game_id);
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Move;

 
             // Handle unit type-specific operations
            self._handle_unit_type_action(
             game.game_id,
             unit_id,
             unit_type,
             player,
             operation,
             dest_x,
             dest_y,
             dest_z
           );
 
         // Update the unit state to patrolling mode
         self._update_unit_state(
             game.game_id,
             player.index,
             unit_id,
             unit_type,
             UnitMode::Moving,
             dest_x,
             dest_y,
             dest_z
         );

         let remaining_commands = player.send_command();

         if remaining_commands == 0 {
             game.advance_turn();
             player.reset_moves();

             let mut new_player = HelperTrait::current_player(world,game);
             new_player.set_turn_start_time(time);
            // set!(world,(new_player));

             world.write_model(@new_player);
         }

         //set!(world, (player));

         world.write_model(@player);

        // set!(world, (game));

         world.write_model(@game);

        }
        
        fn stealth(ref self: ContractState, game_id: u32, unit_id: u32,unit_type:u8,x:u256,y:u256,z:u256) {

            let mut world = self.world_default();

            let player_address = get_caller_address();
           // let mut game = get!(world, game_id, (Game));

           let mut game: Game  =  world.read_model(game_id);

           let time = get_block_timestamp();
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Stealth;

 
             // Handle unit type-specific operations
            self._handle_unit_type_action(
                game.game_id,
                unit_id,
                unit_type,
                player,
                operation,
                x,y,z
            );
    
            // Update the unit state to patrolling mode
            self._update_unit_state(
                game.game_id,
                player.index,
                unit_id,
                unit_type,
                UnitMode::Stealthed,
                x,
                y,
                z
            );

            let remaining_commands = player.send_command();

            if remaining_commands == 0 {
                game.advance_turn();
                player.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);
            }

            //set!(world, (player));

            world.write_model(@player);

           // set!(world, (game));

            world.write_model(@game);
        }
        
        fn recon(ref self: ContractState, game_id: u32, unit_id: u32,unit_type:u8, area_x: u256, area_y: u256, area_z: u256) {

            let mut world = self.world_default();

            let player_address = get_caller_address();
           // let mut game = get!(world, game_id, (Game));

           let mut game: Game  =  world.read_model(game_id);

           let time = get_block_timestamp();
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };
 
            let operation = AbilityType::Recon;

             // Handle unit type-specific operations
          self._handle_unit_type_action(
             game.game_id,
             unit_id,
             unit_type,
             player,
             operation,
             area_x,
             area_y,
             area_z
           );
 
         // Update the unit state to patrolling mode
         self._update_unit_state(
             game.game_id,
             player.index,
             unit_id,
             unit_type,
             UnitMode::Reconning,
             area_x,
             area_y,
             area_z
         );

         let remaining_commands = player.send_command();

         if remaining_commands == 0 {
             game.advance_turn();
             player.reset_moves();

             let mut new_player = HelperTrait::current_player(world,game);
             new_player.set_turn_start_time(time);
            // set!(world,(new_player));

             world.write_model(@new_player);
         }

         //set!(world, (player));

         world.write_model(@player);

        // set!(world, (game));

         world.write_model(@game);
        }
        
        fn heal(ref self: ContractState, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256) {

            let mut world = self.world_default();


            let player_address = get_caller_address();
           // let mut game = get!(world, game_id, (Game));

           let mut game: Game  =  world.read_model(game_id);

           let time = get_block_timestamp();
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address== player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Repair;

             // Handle unit type-specific operations
            self._handle_unit_type_action(
                game.game_id,
                unit_id,
                unit_type,
                player,
                operation,
                area_x,
                area_y,
                area_z
            );
    
            // Update the unit state to patrolling mode
            self._update_unit_state(
                game.game_id,
                player.index,
                unit_id,
                unit_type,
                UnitMode::Healing,
                area_x,
                area_y,
                area_z
            );

            let remaining_commands = player.send_command();

            if remaining_commands == 0 {
                game.advance_turn();
                player.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);
            }

            player.booster -= BOOSTER;

            //set!(world, (player));

            world.write_model(@player);

           // set!(world, (game));

            world.write_model(@game);
        } 

        fn force_end_player_turn (ref self: ContractState, game_id: u32){

            let mut world = self.world_default();

            let caller = get_caller_address();

           // let mut game = get!(world,game_id,(Game));

           let mut game: Game  =  world.read_model(game_id);

            // get the player
            let mut player = match HelperTrait::find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };

            player.assert_exists();

            let mut target_player = HelperTrait::current_player(world,game);

            let time = get_block_timestamp();

            // replace with a penalty on score ,action, unit
            assert(target_player.is_turn_timed_out(time), 'Player Turn Valid');

            game.advance_turn();

            // penalty to delaying player
            //

            let mut new_player = HelperTrait::current_player(world,game);

            target_player.reset_moves();

            new_player.set_turn_start_time(time);

            //set!(world,(player));
            world.write_model(@player);
            //set!(world,(target_player));
            world.write_model(@target_player);
           // set!(world,(new_player));
            world.write_model(@new_player);
           // set!(world,(game));
            world.write_model(@game)
        
        }


        fn capture_flag(ref self: ContractState, game_id: u32,unit_id: u32,unit_type:u8, flag_id: u8,x: u256,y: u256,z: u256){

            let mut world = self.world_default();

            let caller = get_caller_address();

           // let mut game = get!(world,game_id,(Game));

           let mut game: Game  =  world.read_model(game_id);

            // get the player
            let mut player = match HelperTrait::find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };

            player.assert_exists();

            let battlefield_name = match BattlefieldNameTrait::from_battlefield_id(flag_id){
                Option::Some(name) => name,
                Option::None => panic(array!['Invalid battle field'])
            };

            let battle_field_flag_position = HelperTrait::get_battlefield_flag_position(battlefield_name);

            let position = Vec3 {
                x:x,
                y:y,
                z:z
            };

            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let mut unit = HelperTrait::get_unit(world, game_id, player.index, unit_id, unit_type);

            let is_in_range =  HelperTrait::is_in_range(unit.get_position(),100, x,y,z);

            assert(is_in_range,'Out of Range');


            let is_actual_flag = HelperTrait::is_same_position(battle_field_flag_position,position);

            assert(is_actual_flag,'Flag Not Recognized');

            let flag_exist: BattlefieldFlag = world.read_model((game_id,flag_id));

            assert(flag_exist.player != caller, 'Flag Already Captured');

            let flag: BattlefieldFlag = BattlefieldFlagTrait::capture(game_id,player.address,position,flag_id);

            player.flags_captured += 1;

            player.booster += BOOSTER;

            if (player.flags_captured >= 5 ){
                let mut game: Game  =  world.read_model(game_id);

                game.winner = player.address;
                game.over = true;

                world.write_model(@game);

            }

            

            world.write_model(@flag);

            world.write_model(@player);

        }

        fn boost(ref self: ContractState, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256){
           
            let mut world = self.world_default();


            let player_address = get_caller_address();
           // let mut game = get!(world, game_id, (Game));

           let mut game: Game  =  world.read_model(game_id);

           let time = get_block_timestamp();
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address== player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };


             // Handle unit type-specific operations
            self._handle_unit_boost(
                game.game_id,
                unit_id,
                unit_type,
                player,
                area_x,
                area_y,
                area_z
            );
    

            let remaining_commands = player.send_command();

            if remaining_commands == 0 {
                game.advance_turn();
                player.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
               // set!(world,(new_player));

                world.write_model(@new_player);
            }

            player.booster -= BOOSTER;

            //set!(world, (player));

            world.write_model(@player);

           // set!(world, (game));

            world.write_model(@game);
        }

    }



    impl NexusInternalImpl of super::INexusInternal<ContractState> {

        
        // Function to handle unit type-specific operations
        fn _handle_unit_type_action(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player: Player,
            operation: AbilityType,
            x: u256,
            y: u256,
            z: u256
        )  {
            assert(
                unit_type == UnitType::Infantry || 
                unit_type == UnitType::Armored || 
                unit_type == UnitType::Air || 
                unit_type == UnitType::Naval,
                'Invalid Unit Type'
            );
        
            self._handle_operation(
                game_id,
                unit_id,
                unit_type,
                operation,
                player,
                x,
                y,
                z
            )
        }


        fn _handle_unit_boost(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player: Player,
            x: u256,
            y: u256,
            z: u256
        )  {
            assert(
                unit_type == UnitType::Infantry || 
                unit_type == UnitType::Armored || 
                unit_type == UnitType::Air || 
                unit_type == UnitType::Naval,
                'Invalid Unit Type'
            );


            let mut world = self.world_default();
        
            let mut unit = HelperTrait::get_unit(world, game_id, player.index, unit_id, unit_type);

            assert(player.booster >= 20, 'Boost Not Enough');



            match unit {
                NexusUnit::Infantry(mut infantry) => {

                    infantry.energy += BOOSTER;
                    world.write_model(@infantry);

                },
                NexusUnit::Armored(mut armored) => {

                    armored.energy += BOOSTER;
                    world.write_model(@armored);

                },
                NexusUnit::Air(mut air) => {

                    air.energy += BOOSTER;
                    world.write_model(@air);

                },
                NexusUnit::Naval(mut naval) => {

                    naval.energy += BOOSTER;
                    world.write_model(@naval);
                },
            }

        }



        // Function to update unit state
        fn _update_unit_state(
            ref self: ContractState,
            game_id: u32,
            player_index: u32,
            unit_id: u32,
            unit_type: UnitType,
            new_mode: UnitMode,
            x: u256,
            y: u256,
            z: u256
        ) {

            let mut world = self.world_default();

            let mut unit_state: UnitState = HelperTrait::unit_state(world,game_id, unit_id, player_index);
            assert(unit_state.mode != new_mode, 'Unit already in this mode');

            unit_state.mode = new_mode;
            unit_state.x = x;
            unit_state.y = y;
            unit_state.z = z;

            //set!(world, (unit_state));
            world.write_model(@unit_state);
        }

        fn _handle_unit_deployment(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player: Player,
            environment:EnvironmentInfo,
            battlefield_name: BattlefieldName,
            x:u256,y:u256,z:u256
        ) {

            let mut world = self.world_default();

            let unit_state = UnitStateTrait::new(game_id,player.index,unit_id, x,y,z,environment);
            let ability_state = AbilityStateTrait::new(game_id, unit_id, unit_type, player.index);


            match unit_type {
                UnitType::Infantry =>  {
                    let infantry_unit = InfantryTrait::new(game_id,unit_id, player.index,x,y, z,battlefield_name);
                    //set!(world,(infantry_unit));
                    world.write_model(@infantry_unit);
                },
                UnitType::Armored =>  {
                    let armored_unit = ArmoredTrait::new(game_id, unit_id, player.index, x, y, z, battlefield_name);
                    //set!(world,(armored_unit));
                    world.write_model(@armored_unit);
                },
                UnitType::Naval =>  {
                    let naval_unit = ShipTrait::new(game_id, unit_id, player.index, x, y, z, battlefield_name);
                    //set!(world,(naval_unit))
                    world.write_model(@naval_unit);
                },
                UnitType::Air => {
                    let air_unit = AirUnitTrait::new(game_id,unit_id, player.index,x,y, z,battlefield_name);
                    //set!(world, (air_unit));
                    world.write_model(@air_unit);
                },
                UnitType::Cyber =>  {
                    let cyber_unit = CyberUnitTrait::new(game_id, unit_id, player.index, x, y, z, battlefield_name);
                   // set!(world, (cyber_unit));
                   world.write_model(@cyber_unit);
                },
                _=> panic(array!['Invalid unit type'])
            }
            

            //set!(world, (unit_state));
            //set!(world, (ability_state));

            world.write_model(@unit_state);
            world.write_model(@ability_state);



        }

        fn _handle_unit_move(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player_id: u32,
            x: u256,
            y: u256,
            z: u256,
        ) {


            let mut world = self.world_default();
            
            // Operation type check
            let _operation = AbilityType::Move;
            
            // Get unit abilities and validate
           // let mut unit_abilities = get!(world, (game_id, unit_id, player_id), AbilityState);

           let mut unit_abilities: AbilityState = world.read_model((game_id, unit_id, player_id));


            let current_time = get_block_timestamp();
            unit_abilities.validate_for_use(AbilityType::Move, current_time);
    
            // Get unit state and infantry
            //let mut unit_state = get!(world, (game_id, player_id, unit_id), UnitState);

            let mut unit_state:UnitState = world.read_model((game_id, player_id, unit_id));

            // 
            let mut unit = HelperTrait::get_unit(world, game_id, player_id, unit_id, unit_type);

             // Validate unit has energy
             unit.has_energy();
    
            // Check if position is occupied
            let new_position = Vec3 { x, y, z };
            unit.is_position_occupied(x, y, z);
    
            // Calculate distance and movement cost
            let (distance, _) = HelperTrait::get_distance(
                unit.get_range(),
                unit.get_position().coord,
                new_position
            );
            
            let move_cost = HelperTrait::calculate_movement_cost(distance);
    
            // Convert costs
            let movement_cost_u8: u8 = move_cost.try_into().unwrap();
            let energy_cost: u32 = move_cost.try_into().unwrap();
    
            // Update ability level and energy
            unit_abilities.decrease_ability_level(AbilityType::Move, movement_cost_u8);
            let mut unit = unit.consume_energy(energy_cost);
    
            // Update unit position
            let new_unit = unit.set_position(Position {coord: new_position});
    
            // Set updated components
            // match unit {
            //     NexusUnit::Infantry(infantry) => set!(world, (infantry, unit_abilities, unit_state)),
            //     NexusUnit::Armored(armored) => set!(world, (armored, unit_abilities, unit_state)),
            //     NexusUnit::Air(air) => set!(world, (air, unit_abilities, unit_state)),
            //     NexusUnit::Naval(naval) => set!(world, (naval, unit_abilities, unit_state)),
            // }

            match new_unit {
                NexusUnit::Infantry(mut infantry) => {
                    infantry.consume_energy(energy_cost);
                    world.write_model(@infantry);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
                NexusUnit::Armored(armored) => {
                    world.write_model(@armored);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
                NexusUnit::Air(air) => {
                    world.write_model(@air);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
                NexusUnit::Naval(naval) => {
                    world.write_model(@naval);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
            }
            
        }

        fn _handle_operation(
            ref self: ContractState,
            game_id: u32, 
            unit_id: u32,
            unit_type: UnitType,
            operation: AbilityType,
            player: Player,
            x: u256,
            y: u256,
            z: u256
         ) {
            match operation {
                AbilityType::Move => {
                    self._handle_unit_move(
                        game_id,
                        unit_id,
                        unit_type,
                        player.index,
                        x,
                        y,
                        z,
                    );
                },
                AbilityType::Defend => {
                    self._handle_defend(
                        game_id,
                        unit_id,
                        unit_type,
                        player.index,
                        x,
                        y,
                        z,
                    );
                },
                AbilityType::Patrol => {
                    self._handle_patrol(
                        game_id,
                        unit_id,
                        unit_type,
                        player.index,
                        operation,
                    )
                },
                AbilityType::Stealth => {
                    self._handle_stealth(
                        game_id,
                        unit_id,
                        unit_type,
                        player.index,
                        operation,
                    )
                },
                AbilityType::Recon => {
                    self._handle_recon(
                        game_id,
                        unit_id,
                        unit_type,
                        player.index,
                        operation,
                    ) 
                },
                AbilityType::Repair => {
                    self._handle_heal(
                        game_id,
                        unit_id,
                        unit_type,
                        player.index,
                        operation
                    )
                },
                _ => panic(array!['Invalid operation'])
            }
         }


         fn _handle_unit_attack(
            ref self: ContractState,
            game_id: u32,
            target_id: u32,
            attacker_id: u32,
            player_id:u32,
            player_target_id: u32,
            attacker: UnitType,
            target: UnitType,
            x: u256,
            y: u256,
            z: u256,
        ) {

            let mut world = self.world_default();

            // Operation type check
            let _operation = AbilityType::Attack;
            
            // Get unit abilities and validate
            //let mut unit_abilities_attacker = get!(world, (game_id, attacker_id, player_id), AbilityState);

            let mut unit_abilities_attacker: AbilityState = world.read_model((game_id, attacker_id, player_id));


            let current_time = get_block_timestamp();
            unit_abilities_attacker.validate_for_use(AbilityType::Attack, current_time);

            
    
            // Old version
            // let mut unit_state_attacker = get!(world, (game_id, player_id, attacker_id), UnitState);
            // let mut unit_state_target = get!(world, (game_id, player_target_id, target_id), UnitState);

            // New version
            let mut unit_state_attacker: UnitState = world.read_model((game_id, player_id, attacker_id));
            let mut unit_state_target: UnitState = world.read_model((game_id, player_target_id, target_id));

            let attack_points  = unit_state_attacker.attacking_mode_points();

            let target_points  = unit_state_target.attacked_mode_points();
            
            let attack_damage = HelperTrait::compute_damage(world,game_id,attacker_id,attacker, target,target_id,player_id,player_target_id);

            let mut unit_attacker = HelperTrait::get_unit(world, game_id, player_id, attacker_id, attacker);

            let mut unit_target = HelperTrait::get_unit(world, game_id,player_target_id, target_id, target);

            let is_in_range =  HelperTrait::is_in_range(unit_attacker.get_position(),unit_attacker.get_range(), x,y,z);

            assert(is_in_range,'Out of Range');
    
            // Validate unit has energy
            unit_attacker.has_energy();
    
            // Calculate base damage multiplier based on points (0-40% bonus)
            let point_bonus_multiplier = if attack_points > target_points {
                // If attacker has advantage, bonus of up to 40%
                let difference = attack_points - target_points;
                if difference > MAX_POINT_BONUS {
                    140 // Cap at 40% bonus
                } else {
                    100 + difference
                }
            } else {
                // If defender has advantage, reduction of up to 40%
                let difference = target_points - attack_points;
                if difference > MAX_POINT_BONUS {
                    60 // Cap at 40% reduction
                } else {
                    100 - difference
                }
            };

            // Calculate initial damage
            let mut final_damage = (((BASE_DAMAGE * point_bonus_multiplier )+attack_damage) / 100) * DAMAGE_SCAlE_FACTOR;

            //let mut unit_target = unit_target.take_damage(final_damage);
    
            // // Set updated components
            // set!(world, (unit_abilities_attacker, unit_state_attacker, unit_state_target));

            // match unit_target {
            //     NexusUnit::Infantry(infantry) => set!(world, (infantry)),
            //     NexusUnit::Armored(armored) => set!(world, (armored)),
            //     NexusUnit::Air(air) => set!(world, (air)),
            //     NexusUnit::Naval(naval) => set!(world, (naval)),
            // }

            // match unit_attacker {
            //     NexusUnit::Infantry(infantry) => set!(world, (infantry)),
            //     NexusUnit::Armored(armored) => set!(world, (armored)),
            //     NexusUnit::Air(air) => set!(world, (air)),
            //     NexusUnit::Naval(naval) => set!(world, (naval)),
            // }
            unit_abilities_attacker.decrease_ability_level(AbilityType::Attack, 1);

                        // Update the components
            world.write_model(@unit_abilities_attacker);
            world.write_model(@unit_state_attacker);
            world.write_model(@unit_state_target);

            let target_health_remainder: u32 = if final_damage >= unit_target.get_health() {
                0_u32
            }else{
                unit_target.get_health() - final_damage
            };

            // Handle target unit updates
            match unit_target {
                NexusUnit::Infantry(mut infantry) => {
                    infantry.take_damage(final_damage);

                    let target_health = infantry.health.current;

                    let mut player: Player = world.read_model((game_id,player_target_id));

                    if target_health == 0 {
                        player.player_score.deaths += 1;
                    }

                    world.write_model(@player);
                    world.write_model(@infantry);
                },
                NexusUnit::Armored(armored) => world.write_model(@armored),
                NexusUnit::Air(air) => world.write_model(@air),
                NexusUnit::Naval(naval) => world.write_model(@naval),
            }

            // Handle attacker unit updates
            match unit_attacker {
                NexusUnit::Infantry(mut infantry) => {
                    let new_ammunation = infantry.accessories.ammunition - 4;
                    let new_accessories = InfantryAccessories {
                        ammunition: new_ammunation,
                        first_aid_kit: infantry.accessories.first_aid_kit
                    };

                    let mut player: Player = world.read_model((game_id,player_id));

                     let score = HelperTrait::get_kill_score(attacker, target); // Returns 250_u32

                    if target_health_remainder == 0 {
                        player.player_score.score += score;
                        player.player_score.kills += 1;
                        player.booster += BOOSTER;

                        if (player.player_score.kills >= 5 ){
                            let mut game: Game  =  world.read_model(game_id);

                            game.winner = player.address;
                            game.over = true;

                            world.write_model(@game);

                        }


                    }

                    infantry.update_accessories(new_accessories);

                    world.write_model(@player);
                    world.write_model(@infantry);
                
                },
                NexusUnit::Armored(armored) => world.write_model(@armored),
                NexusUnit::Air(air) => world.write_model(@air),
                NexusUnit::Naval(naval) => world.write_model(@naval),
            }
    
            
        }

        fn _handle_defend(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player_id: u32,
            x: u256,
            y: u256,
            z: u256,
        ){

            let mut world = self.world_default();
            // Operation type check
            let _operation = AbilityType::Defend;

            // Get unit abilities and validate
           // let mut unit_abilities = get!(world, (game_id, unit_id, player_id), AbilityState);

           let mut unit_abilities: AbilityState = world.read_model((game_id, unit_id, player_id));

            let current_time = get_block_timestamp();
            unit_abilities.validate_for_use(AbilityType::Defend, current_time);
    
            // Get unit state and infantry
           // let mut unit_state = get!(world, (game_id, player_id, unit_id), UnitState);

           let mut unit_state: UnitState = world.read_model((game_id, player_id, unit_id));

            // 
            let mut unit = HelperTrait::get_unit(world, game_id, player_id, unit_id, unit_type);

            // Validate unit has energy
            unit.has_energy();
    
            let energy_cost = HelperTrait::calculate_defend_cost(unit);
    
            // Update ability level and energy
            unit_abilities.decrease_ability_level(AbilityType::Defend, 3);
            let mut unit = unit.consume_energy(energy_cost);
    
            // Set updated components
            // match unit {
            //     NexusUnit::Infantry(infantry) => set!(world, (infantry, unit_abilities, unit_state)),
            //     NexusUnit::Armored(armored) => set!(world, (armored, unit_abilities, unit_state)),
            //     NexusUnit::Air(air) => set!(world, (air, unit_abilities, unit_state)),
            //     NexusUnit::Naval(naval) => set!(world, (naval, unit_abilities, unit_state)),
            // }


            match unit {
                NexusUnit::Infantry(infantry) => {
                    world.write_model(@infantry);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
                NexusUnit::Armored(armored) => {
                    world.write_model(@armored);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
                NexusUnit::Air(air) => {
                    world.write_model(@air);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
                NexusUnit::Naval(naval) => {
                    world.write_model(@naval);
                    world.write_model(@unit_abilities);
                    world.write_model(@unit_state);
                },
            }
        }

        fn _handle_patrol(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player_id: u32,
            operation: AbilityType
        ){

            let mut world = self.world_default();

        // Operation type check
        let _operation = AbilityType::Patrol;

        // Get unit abilities and validate
        let mut unit_abilities: AbilityState = world.read_model((game_id, unit_id, player_id));
        let current_time = get_block_timestamp();
        unit_abilities.validate_for_use(AbilityType::Patrol, current_time);

        // Get unit state and infantry
        //let mut unit_state = get!(world, (game_id, player_id, unit_id), UnitState);
        let mut unit_state: UnitState = world.read_model((game_id, player_id, unit_id));

        // 
        let mut unit = HelperTrait::get_unit(world, game_id, player_id, unit_id, unit_type);

        // Validate unit has energy
        unit.has_energy();

        let energy_cost = HelperTrait::calculate_patrol_cost(unit);

        // Update ability level and energy
        unit_abilities.decrease_ability_level(AbilityType::Patrol, 2);
        let mut unit = unit.consume_energy(energy_cost);

        // Set updated components
        // match unit {
        //     NexusUnit::Infantry(infantry) => set!(world, (infantry, unit_abilities, unit_state)),
        //     NexusUnit::Armored(armored) => set!(world, (armored, unit_abilities, unit_state)),
        //     NexusUnit::Air(air) => set!(world, (air, unit_abilities, unit_state)),
        //     NexusUnit::Naval(naval) => set!(world, (naval, unit_abilities, unit_state)),
        // }

        match unit {
            NexusUnit::Infantry(infantry) => {
                world.write_model(@infantry);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Armored(armored) => {
                world.write_model(@armored);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Air(air) => {
                world.write_model(@air);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Naval(naval) => {
                world.write_model(@naval);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
        }
    
        }


        fn _handle_stealth(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player_id: u32,
            operation: AbilityType
        ){

        let mut world = self.world_default();
        // Operation type check
        let _operation = AbilityType::Stealth;

        // Get unit abilities and validate
        let mut unit_abilities: AbilityState = world.read_model((game_id, unit_id, player_id));
        let current_time = get_block_timestamp();
        unit_abilities.validate_for_use(AbilityType::Stealth, current_time);

        // Get unit state and infantry
       // let mut unit_state = get!(world, (game_id, player_id, unit_id), UnitState);
       let mut unit_state: UnitState = world.read_model((game_id, player_id, unit_id));

        // 
        let mut unit = HelperTrait::get_unit(world, game_id, player_id, unit_id, unit_type);

        // Validate unit has energy
        unit.has_energy();

        let energy_cost = HelperTrait::calculate_stealth_cost(unit);

        // Update ability level and energy
        unit_abilities.decrease_ability_level(AbilityType::Stealth, 2);
        let mut unit = unit.consume_energy(energy_cost);

        // Set updated components
        // match unit {
        //     NexusUnit::Infantry(infantry) => set!(world, (infantry, unit_abilities, unit_state)),
        //     NexusUnit::Armored(armored) => set!(world, (armored, unit_abilities, unit_state)),
        //     NexusUnit::Air(air) => set!(world, (air, unit_abilities, unit_state)),
        //     NexusUnit::Naval(naval) => set!(world, (naval, unit_abilities, unit_state)),
        // }

        match unit {
            NexusUnit::Infantry(infantry) => {
                world.write_model(@infantry);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Armored(armored) => {
                world.write_model(@armored);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Air(air) => {
                world.write_model(@air);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Naval(naval) => {
                world.write_model(@naval);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
        }
    
        }


        fn _handle_recon(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player_id: u32,
            operation: AbilityType
        ){

        let mut world = self.world_default();
        // Operation type check
        let _operation = AbilityType::Recon;

        // Get unit abilities and validate
        let mut unit_abilities: AbilityState = world.read_model((game_id, unit_id, player_id));
        let current_time = get_block_timestamp();
        unit_abilities.validate_for_use(AbilityType::Recon, current_time);

        // Get unit state and infantry
        //let mut unit_state = get!(world, (game_id, player_id, unit_id), UnitState);
        let mut unit_state: UnitState = world.read_model((game_id, player_id, unit_id));

        // 
        let mut unit = HelperTrait::get_unit(world, game_id, player_id, unit_id, unit_type);

        // Validate unit has energy
        unit.has_energy();

        let energy_cost = HelperTrait::calculate_recon_cost(unit);

        // Update ability level and energy
        unit_abilities.decrease_ability_level(AbilityType::Recon, 2);
        let mut unit = unit.consume_energy(energy_cost);

        let _heal_value = HelperTrait::calculate_heal_value(unit);

        // Set updated components
        // match unit {
        //     NexusUnit::Infantry(infantry) => set!(world, (infantry, unit_abilities, unit_state)),
        //     NexusUnit::Armored(armored) => set!(world, (armored, unit_abilities, unit_state)),
        //     NexusUnit::Air(air) => set!(world, (air, unit_abilities, unit_state)),
        //     NexusUnit::Naval(naval) => set!(world, (naval, unit_abilities, unit_state)),
        // }

        match unit {
            NexusUnit::Infantry(infantry) => {
                world.write_model(@infantry);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Armored(armored) => {
                world.write_model(@armored);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Air(air) => {
                world.write_model(@air);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Naval(naval) => {
                world.write_model(@naval);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
        }
    
        }



        fn _handle_heal(
            ref self: ContractState,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player_id: u32,
            operation: AbilityType
        ){

        let mut world = self.world_default();
        // Operation type check
        let _operation = AbilityType::Repair;

        // Get unit abilities and validate
        let mut unit_abilities: AbilityState = world.read_model((game_id, unit_id, player_id));
        let current_time = get_block_timestamp();
        unit_abilities.validate_for_use(AbilityType::Repair, current_time);

        // Get unit state and infantry
        //let mut unit_state = get!(world, (game_id, player_id, unit_id), UnitState);
        let mut unit_state: UnitState = world.read_model((game_id, player_id, unit_id));

        // 
        let mut unit = HelperTrait::get_unit(world, game_id, player_id, unit_id, unit_type);

        // Validate unit has energy
        unit.has_energy();

        let energy_cost = HelperTrait::calculate_heal_cost(unit);

        // Update ability level and energy
        unit_abilities.decrease_ability_level(AbilityType::Repair, 2);
        let mut unit = unit.consume_energy(energy_cost);

        // Set updated components
        // match unit {
        //     NexusUnit::Infantry(infantry) => set!(world, (infantry, unit_abilities, unit_state)),
        //     NexusUnit::Armored(armored) => set!(world, (armored, unit_abilities, unit_state)),
        //     NexusUnit::Air(air) => set!(world, (air, unit_abilities, unit_state)),
        //     NexusUnit::Naval(naval) => set!(world, (naval, unit_abilities, unit_state)),
        // }

       // let mut unit = unit.heal(HEAL);

        match unit {
            NexusUnit::Infantry(mut infantry) => {
                infantry.heal(HEAL);
                world.write_model(@infantry);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Armored(armored) => {
                world.write_model(@armored);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Air(air) => {
                world.write_model(@air);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
            NexusUnit::Naval(naval) => {
                world.write_model(@naval);
                world.write_model(@unit_abilities);
                world.write_model(@unit_state);
            },
        }
    
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

