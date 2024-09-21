// define the interface
#[dojo::interface]
trait INexus {
    fn deploy_forces(
        ref world: IWorldDispatcher, 
        game_id: u32,
        battlefield_id: u8,
        unit: u8, 
        supply: u32,
        x: u32,
        y: u32,
        z: u32
    );
    fn patrol(
        ref world: IWorldDispatcher,
        game_id: u32,
        unit_id: u32,
        start_x: u32,
        start_y: u32,
        start_z: u32,
        end_x: u32,
        end_y: u32,
        end_z: u32
    );

    fn attack(ref world: IWorldDispatcher, game_id: u32, attacker_id: u32, target_id: u32);

    fn defend(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, x: u32, y: u32, z: u32);

    fn move_unit(
        ref world: IWorldDispatcher,
        game_id: u32,
        unit_id: u32,
        dest_x: u32,
        dest_y: u32,
        dest_z: u32
    );

    fn stealth(ref world: IWorldDispatcher, game_id: u32, unit_id: u32);

    fn recon(
        ref world: IWorldDispatcher,
        game_id: u32,
        unit_id: u32,
        area_x: u32,
        area_y: u32,
        area_z: u32
    );

    fn update_unit_state(
        ref world: IWorldDispatcher,
        game_id: u32,
        player_index: u32,
        unit_id: u32,
        unit_type: u8,
        start_x: u32,
        start_y: u32,
        start_z: u32
    );

    fn handle_unit_type_operation(
        ref world: IWorldDispatcher,
        game_id: u32,
        player_index: u32,
        unit_id: u32,
        unit_type: UnitType,
        operation: UnitOperation,
    );


}

// dojo decorator
#[dojo::contract]
mod nexus {
    use super::{INexus};
    use starknet::{ContractAddress, get_caller_address};
    use contracts::models::{
        battlefield::{BattlefieldName,UrbanBattlefield,BattlefieldNameTrait},
        player::{UnitTypeTrait,UnitType},
        units::unitsupply::{UnitMode,UnitState},
        game::{Game},
        
    };

    

    use contracts::utils::helper::{HelperTrait};

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
            x: u32,
            y: u32,
            z: u32
        ) {

            let caller = get_caller_address();

            let mut game = get!(world,game_id,(Game));

            // get the player
            let mut player = match utils.find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };

            player.assert_exists();

            let battle_field = get!(world,(game_id, battlefield_id),(UrbanBattlefield));

            assert(battle_field.player_id == player.index, 'Not Player or Not Players Territory');

            let unit_type = UnitTypeTrait::from_int(unit);


            let unit_supply = match unit_type {
                Some(unit) => {
                    player.get_unit_supply(unit)
                },
                None => {
                    panic!("Invalid unit type")
                }
            };

            // Ensure supply contraints for unit type
            asser(supply > 0, "Invalid deployment: supply must be greater than zero"); // Added

            assert(unit_supply >= supply, "Insufficient supply for deployement")

            // Update game state with deployement
            game.deploy_units(caller, unit_type, supply, (x, y, z)); // Added

            set!(world, (game));

        }
        // Function to handle unit type-specific operations
        fn handle_unit_type_operation(
            ref world: IWorldDispatcher,
            game_id: u32,
            player_index: u32,
            unit_id: u32,
            unit_type: UnitType,
        )  {
            match unit_type {
                UnitType::Infantry => {
                    assert(attacker.supply.infantry > 0, 'No Infantry Units Available');
                    let _infantry_unit = HelperTrait::find_unit_infantry(game.game_id, attacker.index, unit_id);
                },
                UnitType::Armored => {
                    assert(attacker.supply.armored > 0, 'No Armored Units Available');
                    let _armored_unit = HelperTrait::find_unit_armored(game.game_id, attacker.index, unit_id);
                },
                UnitType::Air => {
                    assert(attacker.supply.air > 0, 'No Air Units Available');
                    let _air_unit = HelperTrait::find_unit_air(game.game_id, attacker.index, unit_id);
                },
                UnitType::Naval => {
                    assert(attacker.supply.naval > 0, 'No Naval Units Available');
                    let _naval_unit = HelperTrait::find_unit_naval(game.game_id, attacker.index, unit_id);
                },
                _ => panic(array!['Invalid Unit Type'])
            }
        }

        // Function to update unit state
        fn update_unit_state(
            ref world: IWorldDispatcher,
            game_id: u32,
            player_index: u32,
            unit_id: u32,
            unit_type: UnitType,
            new_mode: UnitMode,
            x: u32,
            y: u32,
            z: u32
        ) {
            let mut unit_state = HelperTrait::unit_mode(game_id, unit_id, player_index, unit_type);
            assert(unit_state.mode != new_mode, 'Unit already in this mode');

            unit_state.mode = new_mode;
            unit_state.x = x;
            unit_state.y = y;
            unit_state.z = z;

            set!(world, (unit_state));
        }

        fn patrol(
            ref world: IWorldDispatcher,
            game_id: u32,
            unit_id: u32,
            unit_type: u8,
            start_x: u32,
            start_y: u32,
            start_z: u32,
        ) {
            let player = get_caller_address();
            let mut game = get!(world, game_id, (Game));
            let mut attacker = HelperTrait::current_player(world, game);

            assert(player == attacker.address, errors::INVALID_PLAYER);

            let unit_type = UnitType::from_u8(unit_type);

            // Handle unit type-specific operations
            self.handle_unit_type_operation(
                ref world,
                game.game_id,
                attacker.index,
                unit_id,
                unit_type,
            );

            // Update the unit state to patrolling mode
            self.update_unit_state(
                ref world,
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
        
        fn attack(ref world: IWorldDispatcher, game_id: u32, attacker_id: u32, target_id: u32,unit_id: u32,unit_type: u8,x:u32,y:u32,z:u32) {
           let player_address = get_caller_address();
           let mut game = get!(world, game_id, (Game));

           let mut attacker = HelperTrait::current_player(world, game);

           assert(player == attacker.address, errors::INVALID_PLAYER);

           let unit_type = UnitType::from_u8(unit_type);

            // Handle unit type-specific operations
            self.handle_unit_type_operation(
            ref world,
            game.game_id,
            attacker.index,
            unit_id,
            unit_type,
        );

        // Update the unit state to patrolling mode
        self.update_unit_state(
            ref world,
            game.game_id,
            attacker.index,
            unit_id,
            unit_type,
            UnitMode::Attacking,
            x,
            y,
            z
        );

        }
        
        fn defend(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type: u8, x: u32, y: u32, z: u32) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player == attacker.address, errors::INVALID_PLAYER);
 
            let unit_type = UnitType::from_u8(unit_type);
 
             // Handle unit type-specific operations
             self.handle_unit_type_operation(
             ref world,
             game.game_id,
             player.index,
             unit_id,
             unit_type,
         );
 
         // Update the unit state to patrolling mode
         self.update_unit_state(
             ref world,
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
        
        fn move_unit(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type: u8, dest_x: u32, dest_y: u32, dest_z: u32) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player == attacker.address, errors::INVALID_PLAYER);
 
            let unit_type = UnitType::from_u8(unit_type);
 
             // Handle unit type-specific operations
             self.handle_unit_type_operation(
             ref world,
             game.game_id,
             attacker.index,
             unit_id,
             unit_type,
           );
 
         // Update the unit state to patrolling mode
         self.update_unit_state(
             ref world,
             game.game_id,
             attacker.index,
             unit_id,
             unit_type,
             UnitMode::Moving,
             dest_x,
             dest_y,
             dest_z
         );
        }
        
        fn stealth(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type:u8,x:u32,y:u32,z:u32) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player == attacker.address, errors::INVALID_PLAYER);
 
            let unit_type = UnitType::from_u8(unit_type);
 
             // Handle unit type-specific operations
             self.handle_unit_type_operation(
             ref world,
             game.game_id,
             player.index,
             unit_id,
             unit_type,
           );
 
         // Update the unit state to patrolling mode
         self.update_unit_state(
             ref world,
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
        
        fn recon(ref world: IWorldDispatcher, game_id: u32, unit_id: u32,unit_type:u8, area_x: u32, area_y: u32, area_z: u32) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player == player.address, errors::INVALID_PLAYER);
 
            let unit_type = UnitType::from_u8(unit_type);
 
             // Handle unit type-specific operations
             self.handle_unit_type_operation(
             ref world,
             game.game_id,
             player.index,
             unit_id,
             unit_type,
           );
 
         // Update the unit state to patrolling mode
         self.update_unit_state(
             ref world,
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
        
        fn heal(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, unit_type:u8) {
            let player_address = get_caller_address();
            let mut game = get!(world, game_id, (Game));
 
            let mut player = HelperTrait::current_player(world, game);
 
            assert(player == player.address, errors::INVALID_PLAYER);
 
            let unit_type = UnitType::from_u8(unit_type);
 
             // Handle unit type-specific operations
             self.handle_unit_type_operation(
             ref world,
             game.game_id,
             player.index,
             unit_id,
             unit_type,
           );
 
         // Update the unit state to patrolling mode
         self.update_unit_state(
             ref world,
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
        

    }
}

