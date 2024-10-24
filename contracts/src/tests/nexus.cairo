
use core::debug::PrintTrait;

use starknet::testing::{set_contract_address,set_block_timestamp};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use contracts::models::game::{Game, GameTrait};
use contracts::models::player::{Player,PlayerTrait};
use contracts::models::battlefield::{UrbanBattlefield,UrbanBattlefieldTrait,BattlefieldName,BattlefieldNameTrait};
use contracts::models::battlefield::{WeatherEffect,WeatherEffectTrait};
use contracts::models::units::unit_states::{UnitState,UnitStateTrait};
use contracts::models::units::unit_states::{UnitMode};
use contracts::models::units::unit_states::{AbilityState,AbilityStateTrait};
use contracts::systems::arena::IArenaDispatcherTrait;
use contracts::systems::nexus::INexusDispatcherTrait;
use contracts::tests::setup::{setup, setup::{Systems, ARENA_HOST, PLAYER,PLAYER_TWO,PLAYER_THREE}};
use contracts::models::units::infantry::{Infantry,InfantryTrait};

#[test]
#[available_gas(1_000_000_000)]
fn test_deploy_forces_change_player() {

    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(PLAYER());
    systems.arena.join(game_id,'musa');

    set_contract_address(PLAYER_TWO());
    systems.arena.join(game_id,'diabby');

    // Set a non-zero timestamp
    set_block_timestamp(1634325678);
    set_contract_address(ARENA_HOST());
    systems.arena.start(game_id,3);


    let mut player_index: u32 = 0;

    let mut unit_id: u32 = 1;
    
    set_contract_address(ARENA_HOST());
    deploy_forces_in_test(world,game_id,1, systems, 0);
   

    let player = get!(world,(game_id,player_index),Player);

    assert(player.supply.infantry == 0, 'Player: Did not supply');

    assert(player.commands_remaining == 3, 'Player: Action Completed');

    let unit_state = get!(world,(game_id,player_index,unit_id),UnitState);

    assert(unit_state.mode == UnitMode::Idle,'Units: Mode note set');

    let game = get!(world, (game_id), (Game));

    let current_player = game.player();

    assert( player_index !=  current_player, 'Game: Player Switch failed');

}


#[test]
#[available_gas(3_000_000_000)]
fn test_deploy_forces_swich_turn() {

    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(PLAYER());
    systems.arena.join(game_id,'musa');

    set_contract_address(PLAYER_TWO());
    systems.arena.join(game_id,'diabby');

    // Set a non-zero timestamp
    set_block_timestamp(1634325678);
    set_contract_address(ARENA_HOST());
    systems.arena.start(game_id,3);

    set_contract_address(ARENA_HOST());
    deploy_forces_in_test(world,game_id,2, systems, 0);

    set_contract_address(PLAYER());
    deploy_forces_in_test(world,game_id,3, systems, 1);

    set_contract_address(PLAYER_TWO());
    deploy_forces_in_test(world,game_id,4, systems, 2);

    let game = get!(world, (game_id), (Game));

    let current_player = game.player();

    assert( current_player ==  0, 'Game: Player Switch failed'); // back to host 
}

#[test]
#[available_gas(3_000_000_000)]
fn test_deploy_forces_move_unit() {

    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(PLAYER());
    systems.arena.join(game_id,'musa');

    set_contract_address(PLAYER_TWO());
    systems.arena.join(game_id,'diabby');

    // Set a non-zero timestamp
    set_block_timestamp(1634325678);
    set_contract_address(ARENA_HOST());
    systems.arena.start(game_id,3);

    set_contract_address(ARENA_HOST());
    deploy_forces_in_test(world,game_id,2, systems, 0);

    set_contract_address(PLAYER());
    deploy_forces_in_test(world,game_id,3, systems, 1);

    set_contract_address(PLAYER_TWO());
    deploy_forces_in_test(world,game_id,4, systems, 2);

    // let game = get!(world, (game_id), (Game));

    let mut unit_id: u32 = 1;

    let mut unit = get!(world, (game_id,unit_id,0), Infantry);

    assert(unit.range == 300, 'Unit: Wrong range');

    set_contract_address(ARENA_HOST());
    systems.nexus.move_unit(game_id, unit_id,1,300,15212354,48445);

    let mut unit = get!(world, (game_id,unit_id,0), Infantry);

    assert(unit.position.coord.x == 300, 'Infantry: No Movement')

}

fn deploy_forces_in_test(world: IWorldDispatcher,game_id: u32, position_factor: u256, systems: Systems, player_index: u32){

    let player = get!(world,(game_id,player_index),Player);

    let battle_field = player.home_base;

    let urban_battle_field_id = battle_field.to_battlefield_id();

    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10*position_factor,20*position_factor,10*position_factor,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10*position_factor,20*position_factor,10*position_factor,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10*position_factor,20*position_factor,10*position_factor,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10*position_factor,20*position_factor,10*position_factor,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,110*position_factor,20*position_factor,10*position_factor,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,2,1,10*position_factor,20*position_factor,10*position_factor,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,2,1,10*position_factor,20*position_factor,10*position_factor,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,2,1,10*position_factor,20*position_factor,10*position_factor,1,10,10);

}