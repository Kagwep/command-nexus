use contracts::models::player::{Player, PlayerTrait, PlayerAssert,UnitType,UnitTypeTrait,UnitTypeImpl};
use contracts::models::units::unit_states::{
    UnitMode,UnitState,UnitStateTrait,EnvironmentInfo,TerrainType,TerrainTypeTrait,AbilityType,AbilityState,AbilityStateTrait};
use contracts::models::battlefield::BattlefieldName;


#[dojo::interface]
trait INexus {
    fn deploy_forces(
        ref world: IWorldDispatcher,
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
        ref world: IWorldDispatcher,
        game_id: u32,
        unit_id: u32,
        unit_type: u8,
        start_x: u256,
        start_y: u256,
        start_z: u256,
    );

    fn attack(ref world: IWorldDispatcher, game_id: u32, attacker_id: u32, target_id: u32,unit_id: u32,unit_action:u8,unit_type: u8,x: u256,y: u256,z: u256,);

    fn defend(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type: u8, x: u256, y: u256, z: u256);

    fn move_unit(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type: u8, dest_x: u256, dest_y: u256, dest_z: u256);

    fn stealth(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type:u8,x: u256,y: u256,z: u256,);

    fn heal(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256);

    fn recon(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type:u8, area_x: u256, area_y: u256, area_z: u256);

    fn force_end_player_turn (ref world: IWorldDispatcher, game_id: u32,target_player_index: u32);


}


#[dojo::interface]
trait INexusInternal {

    fn _handle_unit_deployment(
        ref world: IWorldDispatcher,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player: Player,
        environment:EnvironmentInfo,
        battlefield_name: BattlefieldName,
        x:u256,y:u256,z:u256
    );


    fn _handle_unit_type_operation(
        ref world: IWorldDispatcher,
        game_id: u32,
        unit_id: u32,
        unit_type: UnitType,
        player: Player,
        operation: AbilityType,
        x:u256,y:u256,z:u256
    );

    fn _update_unit_state(
        ref world: IWorldDispatcher,
        game_id: u32,
        player_index: u32,
        unit_id: u32,
        unit_type: UnitType,
        new_mode: UnitMode,
        x: u256,
        y: u256,
        z: u256
    );
}

#[dojo::contract(allow_ref_self)]
mod nexus {
    use super::{INexus};
    use starknet::{ContractAddress, get_caller_address,get_block_timestamp};
    use contracts::models::{
        battlefield::{BattlefieldName,UrbanBattlefield,BattlefieldNameTrait},
        units::unit_states::{UnitMode,UnitState,TerrainTypeTrait,EnvironmentInfo,UnitStateTrait,UnitTrait,AbilityState,AbilityStateTrait},
        
    };

    use contracts::models::player::{Player, PlayerTrait, PlayerAssert,UnitType,UnitTypeTrait,UnitTypeImpl};
    use contracts::models::game::{Game, GameTrait, GameAssert};

    use contracts::utils::helper::{HelperTrait};

    use contracts::models::units::air::{
        AirUnit,
        AirUnitTrait,
    };
    
    use contracts::models::units::armored::{
        Armored,
        ArmoredTrait,
    };
    
    use contracts::models::units::infantry::{Infantry,InfantryTrait};
    use contracts::models::units::naval::{Ship,ShipTrait};
    
    use contracts::models::units::cyber::{CyberUnitTrait,CyberUnit};


    mod errors {
        const ERC20_REWARD_FAILED: felt252 = 'ERC20: reward failed';
        const ERC20_PAY_FAILED: felt252 = 'ERC20: pay failed';
        const ERC20_REFUND_FAILED: felt252 = 'ERC20: refund failed';
        const HOST_PLAYER_ALREADY_IN_LOBBY: felt252 = 'Host: player already in lobby';
        const HOST_PLAYER_NOT_IN_LOBBY: felt252 = 'Host: player not in lobby';
        const HOST_CALLER_IS_NOT_THE_HOST: felt252 = 'Host: caller is not the arena';
        const HOST_MAX_NB_PLAYERS_IS_TOO_LOW: felt252 = 'Host: max player numbers is < 2';
        const HOST_GAME_NOT_OVER: felt252 = 'Host: game not over';
        const INVALID_PLAYER:felt252 = 'Not player';
       
    }




    // player deploy force to battle field assigned
    #[abi(embed_v0)]
    impl NexusImpl of INexus<ContractState> {



        fn deploy_forces(
            ref world: IWorldDispatcher,
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

            let caller = get_caller_address();

            let mut game = get!(world,game_id,(Game));

            // get the player
            let mut player = match HelperTrait::find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };

            player.assert_exists();

            player.assert_has_commands();

            let time = get_block_timestamp();

            assert(!player.is_turn_timed_out(time), 'Turn Timeout');
            

            let battle_field: UrbanBattlefield = get!(world,(game_id, battlefield_id),(UrbanBattlefield));

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

            if remaining_commands == 0{
                game.advance_turn();
                player.reset_moves();

                let mut new_player = HelperTrait::current_player(world,game);
                new_player.set_turn_start_time(time);
                set!(world,(new_player));


            }

            set!(world, (player));

            
            set!(world, (game));

        }

        fn patrol(
            ref world: IWorldDispatcher,
            game_id: u32,
            unit_id: u32,
            unit_type: u8,
            start_x: u256,
            start_y: u256,
            start_z: u256,
        ) {
            let player_address  = get_caller_address();
            let mut game = get!(world, game_id, (Game));
            let mut attacker = HelperTrait::current_player(world, game);

            assert(player_address == attacker.address, errors::INVALID_PLAYER);

            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Patrol;

            // Handle unit type-specific operations
            self._handle_unit_type_operation(
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
        }
        
        fn attack(ref world: IWorldDispatcher, game_id: u32, attacker_id: u32, target_id: u32,unit_id: u32,unit_action:u8,unit_type: u8,x:u256,y:u256,z:u256) {
           let player_address = get_caller_address();
           let mut game = get!(world, game_id, (Game));

           let mut attacker = HelperTrait::current_player(world, game);

           assert(player_address  == attacker.address, errors::INVALID_PLAYER);

           let unit_t = match  UnitTypeTrait::from_int(unit_type) {
            Option::Some(unit) => unit,
            Option::None => panic(array!['Invalid unit Type'])
        };

        let operation = AbilityType::Attack;


            // Handle unit type-specific operations
        self._handle_unit_type_operation(
            game.game_id,
            unit_id,
            unit_t,
            attacker,
            operation,
            x,y,z
        );

        // Update the unit state to patrolling mode
        self._update_unit_state(
            game.game_id,
            attacker.index,
            unit_id,
            unit_t,
            UnitMode::Attacking,
            x,
            y,
            z
        );

        }
        
        fn defend(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type: u8, x: u256, y: u256, z: u256) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Defend;

 
                // Handle unit type-specific operations
            self._handle_unit_type_operation(
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
 
        }
        
        fn move_unit(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type: u8, dest_x: u256, dest_y: u256, dest_z: u256) {

            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Move;

 
             // Handle unit type-specific operations
            self._handle_unit_type_operation(
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

        }
        
        fn stealth(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type:u8,x:u256,y:u256,z:u256) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Stealth;

 
             // Handle unit type-specific operations
            self._handle_unit_type_operation(
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
        }
        
        fn recon(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type:u8, area_x: u256, area_y: u256, area_z: u256) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address == player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };
 
            let operation = AbilityType::Recon;

             // Handle unit type-specific operations
          self._handle_unit_type_operation(
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
        }
        
        fn heal(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, unit_type:u8,area_x: u256, area_y: u256, area_z: u256) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player_address== player.address, errors::INVALID_PLAYER);
 
            let unit_type = match  UnitTypeTrait::from_int(unit_type) {
                Option::Some(unit) => unit,
                Option::None => panic(array!['Invalid unit Type'])
            };

            let operation = AbilityType::Repair;

             // Handle unit type-specific operations
            self._handle_unit_type_operation(
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
        } 

        fn force_end_player_turn (ref world: IWorldDispatcher, game_id: u32, target_player_index: u32){

            let caller = get_caller_address();

            let mut game = get!(world,game_id,(Game));

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

            set!(world,(player));
            set!(world,(target_player));
            set!(world,(new_player));
            set!(world,(game));
        
        }

    }


    impl NexusInternalImpl of super::INexusInternal<ContractState> {
        // Function to handle unit type-specific operations
        fn _handle_unit_type_operation(
            ref world: IWorldDispatcher,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player: Player,
            operation: AbilityType,
            x: u256,
            y: u256,
            z: u256
        )  {

            if let unit_type = UnitType::Infantry {
                let _infantry_unit = HelperTrait::find_unit_infantry(world,game_id, player.index, unit_id);
                
                if let operation = AbilityType::Move {

                    let mut unit_abilities = get!(world,(game_id,unit_id,player.index),AbilityState);

                    let current_time = get_block_timestamp();

                    unit_abilities.validate_for_use(AbilityType::Move, current_time);

                    let mut unit_state = get!(world,(game_id,player.index,unit_id),UnitState);

                    let mut unit = get!(world,(game_id,unit_id,player_id),Infantry);

                    unit.is_position_occupied(x,y,z);

                    let new_position = Vec3 { x, y, z };

                    let (distance,range_squared) = HelperTrait::get_distance(range.range,unit.position.coord,position);
                    
                    let move_cost = HelperTrait::calculate_movement_cost(distance);

                    let movement_cost_u8: u8 = movement_cost.try_into().unwrap();

                    unit_abilities.decrease_ability_level(movement_cost_u8);


                    
                }
            }

            match unit_type {
                UnitType::Infantry => {
                    assert(player.supply.infantry > 0, 'No Infantry Units Available');
                    
                },
                UnitType::Armored => {
                    assert(player.supply.armored > 0, 'No Armored Units Available');
                    let _armored_unit = HelperTrait::find_unit_armored(world,game_id, player.index, unit_id);
                },
                UnitType::Air => {
                    assert(player.supply.air > 0, 'No Air Units Available');
                    let _air_unit = HelperTrait::find_unit_air(world,game_id, player.index, unit_id);
                },
                UnitType::Naval => {
                    assert(player.supply.naval > 0, 'No Naval Units Available');
                    let _naval_unit = HelperTrait::find_unit_naval(world,game_id, player.index, unit_id);
                },
                _ => panic(array!['Invalid Unit Type'])
            }
        }



        // Function to update unit state
        fn _update_unit_state(
            ref world: IWorldDispatcher,
            game_id: u32,
            player_index: u32,
            unit_id: u32,
            unit_type: UnitType,
            new_mode: UnitMode,
            x: u256,
            y: u256,
            z: u256
        ) {
            let mut unit_state: UnitState = HelperTrait::unit_state(world,game_id, unit_id, player_index);
            assert(unit_state.mode != new_mode, 'Unit already in this mode');

            unit_state.mode = new_mode;
            unit_state.x = x;
            unit_state.y = y;
            unit_state.z = z;

            set!(world, (unit_state));
        }

        fn _handle_unit_deployment(
            ref world: IWorldDispatcher,
            game_id: u32,
            unit_id: u32,
            unit_type: UnitType,
            player: Player,
            environment:EnvironmentInfo,
            battlefield_name: BattlefieldName,
            x:u256,y:u256,z:u256
        ) {

            let unit_state = UnitStateTrait::new(game_id,player.index,unit_id, x,y,z,environment);
            let ability_state = AbilityStateTrait::new(game_id, unit_id, unit_type, player.index);


            match unit_type {
                UnitType::Infantry =>  {
                    let infantry_unit = InfantryTrait::new(game_id,unit_id, player.index,x,y, z,battlefield_name);
                    set!(world,(infantry_unit));
                },
                UnitType::Armored =>  {
                    let armored_unit = ArmoredTrait::new(game_id, unit_id, player.index, x, y, z, battlefield_name);
                    set!(world,(armored_unit));
                },
                UnitType::Naval =>  {
                    let naval_unit = ShipTrait::new(game_id, unit_id, player.index, x, y, z, battlefield_name);
                    set!(world,(naval_unit))
                },
                UnitType::Air => {
                    let air_unit = AirUnitTrait::new(game_id,unit_id, player.index,x,y, z,battlefield_name);
                    set!(world, (air_unit));
                },
                UnitType::Cyber =>  {
                    let cyber_unit = CyberUnitTrait::new(game_id, unit_id, player.index, x, y, z, battlefield_name);
                    set!(world, (cyber_unit));
                },
                _=> panic(array!['Invalid unit type'])
            }
            

            set!(world, (unit_state));
            set!(world, (ability_state));



        }

    }
}

