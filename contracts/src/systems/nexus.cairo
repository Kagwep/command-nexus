

// define the interface
#[dojo::interface]
trait INexus {
    fn deploy_forces(
        ref world: IWorldDispatcher, 
        game_id: u32,
        battlefield_name: u8, 
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

    fn heal(ref world: IWorldDispatcher, game_id: u32, healer_id: u32, target_id: u32);

    fn set_mode(ref  world: IWorldDispatcher, game_id: u32, unit_id: u32, mode: u8);
}

// dojo decorator
#[dojo::contract]
mod nexus {
    use super::{INexus};
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{
        battlefield::{BattlefieldName,UrbanBattlefield,BattlefieldNameTrait},
        player::{UnitTypeTrait,UnitType}
 
    };

    #[generate_trait]
    impl InternalImpl of InternalTrait {

        fn process_client_battlefield(input: u8) -> BattlefieldName {
            match BattlefieldNameTrait::from_u8(input) {
                Option::Some(battlefield) => battlefield,
                Option::None => BattlefieldName::None, // Default to None for invalid inputs
            }
        }
    }


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

            let player = get_caller_address();

            let mut game = get!(world,game_id,(Game));

            let mut player = match self._find_player(world,game, caller) {
                Option::Some(player) => player,
                Option::None => panic(array![errors::HOST_PLAYER_NOT_IN_LOBBY]),
            };

            player.assert_exists();

            let battle_field = get!(world,(game_id, battlefield_id),(UrbanBattlefield));

            assert(battle_field.player_id == player.index, 'Not Player or Not Players Territory');

            let unit_type = UnitTypeTrait::from_int(unit);

            // Ensure supply contraints for unit type
            asser(supply > 0, "Insufficient supply for deployement"); // Added

            // Update game state with deployement
            game.deploy_units(caller, unit_type, supply, (x, y, z)); // Added

        }

        fn patrol(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, 
            start_x: u32, start_y: u32, start_z: u32,
            end_x: u32, end_y: u32, end_z: u32) {
            // Logic for unit patrolling between two points
            // Construct Vec3 inside if needed:
            // let start_pos = Vec3 { x: start_x, y: start_y, z: start_z };
            // let end_pos = Vec3 { x: end_x, y: end_y, z: end_z };

            let player = get_caller_address(); // Added
            let mut game = get!(world, game_id, (Game)); // Added

            let mut unit = match self._find_unit(world, game, unit_id) {
                Option::Some(unit) => unit, 
                Option::None => panic(array![errors::UNIT_NOT_FOUND]) 
            }; // Added

            // Logic to assign patrol movement between two points
            unit.set_patrol_route((start_x, start_y, start_z), (end_x, end_y, end_z)); // Added
            set!(world, (game_id, unit_id), unit); // Added
        }
        
        fn attack(ref world: IWorldDispatcher, game_id: u32, attacker_id: u32, target_id: u32) {
           let player = get_caller_address();
           let mut game = get!(world, game_id, (Game));

           let attacker = match self._find_unit(world, game, attacker_id) {
            Option::Some(attacker) attacker, 
            Option::None => panic(array![errors::ATTACKING_NOT_FOUND])
           }; 

           let target = match self._find_unit(world, game, target_id) {
            Option::Some(target) => target,
            Option::None => panic(array![errors::TARGET_NOT_FOUND])
           };

           // Logic to process combat between units
           let result = attacker.attack(target);
           if result.success {
            target.decrease_health(result.damage);
           }
           set!(world, (game_id, target_id), target);
        }
        
        fn defend(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, x: u32, y: u32, z: u32) {
            // Logic for unit entering a defensive stance at a specific position
            // let position = Vec3 { x, y, z };

            let mut unit = get!(world, (game_id, unit_id), (UnitState));

            // Logic to set unit in defensive mode
            unit.set_defensive_position(x, y, z);
            set!(world, (game_id, unit_id), unit);
        }
        
        fn move(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, dest_x: u32, dest_y: u32, dest_z: u32) {
            // Logic for moving a unit to a new position
            // let destination = Vec3 { x: dest_x, y: dest_y, z: dest_z };

            let mut unit = get!(world, (game_id, unit_id), (UnitState));

            // Logic to move unit to new position 
            unit.set_position(dest_x, dest_y, dest_z);
            set!(world, (game_id, unit_id), unit);
        }
        
        fn stealth(ref world: IWorldDispatcher, game_id: u32, unit_id: u32) {
            // This function doesn't need position, so it remains unchanged

            let mut unit = get!(world, (game_id, unit_id), (UnitState));

            // Logic to set unit to stealth mode
            unit.set_mode(UnitMode::Stealthed);
            set!(world, (game_id, unit_id), unit);
        }
        
        fn recon(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, area_x: u32, area_y: u32, area_z: u32) {
            // Logic for unit performing reconnaissance in a specific area
            // let area = Vec3 { x: area_x, y: area_y, z: area_z };

            let mut unit = get!(world, (game_id, unit_id), (UnitState));

            // Logic for recconnaissance in a specific area
            unit.recon_area(area_x, area_y, area_z);
            set!(world, (game_id, unit_id), unit);
        }
        
        fn heal(ref world: IWorldDispatcher, game_id: u32, healer_id: u32, target_id: u32) {
           let mut healer = get!(world, (game_id, healer_id), (UnitState));
           let mut target = get!(world, (game_id, healer_id), (UnitState));

           // Logic to heal target unit
           healer.perform_heal(&mut target);
           set!(world, (game_id, target_id), target);
        }
        
        fn set_mode(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, mode: u8) {
            let mut unit = get!(world, (game_id, unit_id), (UnitState));
            let mode_enum = UnitMode::from_u8(mode).unwrap_or(UnitMode::Idle);

            // Logic to change the mode of the unit
            unit.set_mode(mode_enum);
            set!(world, (game_id, unit_id), unit);
        }
    }
}

