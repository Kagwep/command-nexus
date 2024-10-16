
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


    let mut player_index: u8 = 0;

    let mut unit_id: u32 = 0;
    

    let player = get!(world,(game_id,player_index),Player);

    let battle_field = player.home_base;

    let urban_battle_field_id = battle_field.to_battlefield_id();


    set_contract_address(ARENA_HOST());
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10,20,10,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10,20,10,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10,20,10,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10,20,10,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,1,1,10,20,10,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,2,1,10,20,10,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,2,1,10,20,10,1,10,10);
    systems.nexus.deploy_forces(game_id,urban_battle_field_id,2,1,10,20,10,1,10,10);
   


    let player = get!(world,(game_id,player_index),Player);

    assert(player.supply.infantry == 0, 'Player: Did not supply');

    assert(player.commands_remaining == 3, 'Player: Action Completed');

 
    let unit_state = get!(world,(game_id,player_index,unit_id,1),UnitState);

    assert(unit_state.mode == UnitMode::Idle,'Units: Mode note set');





}

