
use core::debug::PrintTrait;

use starknet::testing::{set_contract_address,set_block_timestamp};

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use command_nexus::models::game::{Game, GameTrait};
use command_nexus::models::player::{Player,PlayerTrait};
use command_nexus::models::battlefield::{UrbanBattlefield,UrbanBattlefieldTrait,BattlefieldName,BattlefieldNameTrait};
use command_nexus::models::battlefield::{WeatherEffect,WeatherEffectTrait};
use command_nexus::models::units::unit_states::{UnitState,UnitStateTrait};
use command_nexus::models::units::unit_states::{AbilityState,AbilityStateTrait};
use command_nexus::systems::arena::IArenaDispatcherTrait;
use command_nexus::systems::nexus::INexusDispatcherTrait;
use command_nexus::tests::setup::{setup, setup::{Systems, ARENA_HOST, PLAYER,PLAYER_TWO,PLAYER_THREE}};
use dojo::model::{ModelStorage, ModelValueStorage, ModelStorageTest};
use dojo::world::WorldStorageTrait;
use dojo_cairo_test::{spawn_test_world, NamespaceDef, TestResource, ContractDefTrait};
use dojo::world::storage::WorldStorage;

#[test]
#[available_gas(1_000_000_000)]
fn test_create() {


    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());

    let game_id = systems.arena.create('felabs', 10000, 13);


    let game: Game = world.read_model(game_id);

    assert(game.game_id == 0, 'Game: wrong id');
    assert(game.player_name == 'felabs', 'Not name of Creator');
    assert(game.price == 10000, 'Wrong price');
    assert(game.player_count == 1, 'Game: wrong player count');


}


#[test]
#[available_gas(1_000_000_000)]
fn test_join() {


    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(PLAYER());
    systems.arena.join(game_id,'musa');

    set_contract_address(PLAYER_TWO());
    systems.arena.join(game_id,'diabby');

    set_contract_address(PLAYER_THREE());
    systems.arena.join(game_id,'jo');

    let game: Game = world.read_model(game_id);

    assert(game.player_count == 4, 'Game: wrong player count');
    assert(game.player() >= 0, 'Game: wrong player index');

    let mut player_index: u32 = 0;
    

    let player: Player = world.read_model((game_id,player_index));

    let battle_field = player.home_base;

    let player_two: Player = world.read_model((game_id,player_index+1));

    let battle_field_two = player_two.home_base;

    assert(battle_field_two != battle_field, 'Game: Unacceptable');


    let urban_battle_field_id = battle_field.to_battlefield_id();

    let urban_battle_field: UrbanBattlefield = world.read_model((game_id,urban_battle_field_id));

    assert(urban_battle_field.player_id == player.index,'Game: not player battlefield');

}


#[test]
#[available_gas(1_000_000_000)]
fn test_leave_kick() {

    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(PLAYER());
    systems.arena.join(game_id,'musa');

    set_contract_address(PLAYER_TWO());
    systems.arena.join(game_id,'diabby');

    set_contract_address(PLAYER_THREE());
    systems.arena.join(game_id,'jo');

    let game: Game = world.read_model(game_id);

    assert(game.player_count == 4, 'Game: wrong player count');
    assert(game.player() >= 0, 'Game: wrong player index');

    set_contract_address(PLAYER_THREE());
    systems.arena.leave(game_id);


    let mut player_index: u32 = 1;
    
    let player: Player = world.read_model((game_id,player_index));

    set_contract_address(ARENA_HOST());
    systems.arena.kick(game_id,player.index);

    let game: Game = world.read_model(game_id);
    assert(game.player_count == 2, 'Game: wrong player count');



}


#[test]
#[available_gas(1_000_000_000)]
fn test_delete() {

    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(ARENA_HOST());
    systems.arena.delete(game_id);


    let game: Game = world.read_model(game_id);

    assert(game.player_count == 0, 'Game: wrong player count');
}

#[test]
#[available_gas(1_000_000_000)]
fn test_start() {

    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(PLAYER());
    systems.arena.join(game_id,'musa');

    set_block_timestamp(1634325678);
    set_contract_address(ARENA_HOST());
    systems.arena.start(game_id,3);


    let game: Game = world.read_model(game_id);

    assert(game.limit != 0, 'Game: Did not Start');

    let mut player_index: u32 = 0;
    
    let player: Player = world.read_model((game_id,player_index));

    assert(player.turn_start_time != 0, 'Player time not initialized');


}

#[test]
#[available_gas(1_000_000_000)]
fn test_transfer_kick_host() {

    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    set_contract_address(PLAYER());
    systems.arena.join(game_id,'musa');

    set_contract_address(ARENA_HOST());
    systems.arena.transfer(game_id,1);

    set_contract_address(PLAYER());
    systems.arena.kick(game_id,0);

    let game: Game = world.read_model(game_id);
    assert(game.player_count == 1, 'Game: wrong player count');


}