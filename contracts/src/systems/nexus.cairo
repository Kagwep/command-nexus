

// define the interface
#[dojo::interface]
trait INexus {
    fn deploy_forces(
        ref world: IWorldDispatcher, game_id: u32,battlefield_name: u8, unit: u8, supply: u32,
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
        battlefield::{BattlefieldName,UrbanBattlefield,},
 
    };


    #[abi(embed_v0)]
    impl NexusImpl of INexus<ContractState> {

        fn deploy_forces(
            ref world: IWorldDispatcher,
            game_id: u32,
            battlefield_name: u8,
            unit: u8,
            supply: u32,
            x: u32,
            y: u32,
            z: u32
        ) {

            let player = get_caller_address();

        }

        fn patrol(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, 
            start_x: u32, start_y: u32, start_z: u32,
            end_x: u32, end_y: u32, end_z: u32) {
            // Logic for unit patrolling between two points
            // Construct Vec3 inside if needed:
            // let start_pos = Vec3 { x: start_x, y: start_y, z: start_z };
            // let end_pos = Vec3 { x: end_x, y: end_y, z: end_z };
        }
        
        fn attack(ref world: IWorldDispatcher, game_id: u32, attacker_id: u32, target_id: u32) {
           
        }
        
        fn defend(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, x: u32, y: u32, z: u32) {
            // Logic for unit entering a defensive stance at a specific position
            // let position = Vec3 { x, y, z };
        }
        
        fn move(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, dest_x: u32, dest_y: u32, dest_z: u32) {
            // Logic for moving a unit to a new position
            // let destination = Vec3 { x: dest_x, y: dest_y, z: dest_z };
        }
        
        fn stealth(ref world: IWorldDispatcher, game_id: u32, unit_id: u32) {
            // This function doesn't need position, so it remains unchanged
        }
        
        fn recon(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, area_x: u32, area_y: u32, area_z: u32) {
            // Logic for unit performing reconnaissance in a specific area
            // let area = Vec3 { x: area_x, y: area_y, z: area_z };
        }
        
        fn heal(ref world: IWorldDispatcher, game_id: u32, healer_id: u32, target_id: u32) {
           
        }
        
        fn set_mode(ref world: IWorldDispatcher, game_id: u32, unit_id: u32, mode: u8) {
            
        }
    }
}

