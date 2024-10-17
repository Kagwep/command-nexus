
use core::debug::PrintTrait;

use starknet::testing::set_contract_address;

use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

use contracts::models::game::{Game, GameTrait};
use contracts::models::player::{Player,PlayerTrait};
use contracts::models::battlefield::{UrbanBattlefield,UrbanBattlefieldTrait,BattlefieldName,BattlefieldNameTrait};
use contracts::models::battlefield::{WeatherEffect,WeatherEffectTrait};
use contracts::models::units::unit_states::{UnitState,UnitStateTrait};
use contracts::models::units::unit_states::{AbilityState,AbilityStateTrait};
use contracts::systems::arena::IArenaDispatcherTrait;
use contracts::systems::nexus::INexusDispatcherTrait;
use contracts::tests::setup::{setup, setup::{Systems, ARENA_HOST, PLAYER,PLAYER_TWO,PLAYER_THREE}};

#[test]
#[available_gas(30000000)]
fn test_create() {


    let (world, systems) = setup::spawn_game();

    set_contract_address(ARENA_HOST());
    let game_id = systems.arena.create('felabs', 10000, 13);

    let game = get!(world, game_id, Game);

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

    let game = get!(world, game_id, Game);

    assert(game.player_count == 4, 'Game: wrong player count');
    assert(game.player() >= 0, 'Game: wrong player index');

    let mut player_index: u8 = 0;
    

    let player = get!(world,(game_id,player_index),Player);

    let battle_field = player.home_base;

    let player_two = get!(world,(game_id,player_index+1),Player);

    let battle_field_two = player_two.home_base;

    assert(battle_field_two != battle_field, 'Game: Unacceptable');


    let urban_battle_field_id = battle_field.to_battlefield_id();


    let urban_battle_field = get!(world,(game_id,urban_battle_field_id),UrbanBattlefield);

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

    let game = get!(world, game_id, Game);

    assert(game.player_count == 4, 'Game: wrong player count');
    assert(game.player() >= 0, 'Game: wrong player index');

    set_contract_address(PLAYER_THREE());
    systems.arena.leave(game_id);


    let mut player_index: u8 = 1;
    
    let player = get!(world,(game_id,player_index),Player);

    set_contract_address(ARENA_HOST());
    systems.arena.kick(game_id,player.index);

    let game = get!(world, game_id, Game);
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


    let game = get!(world,(game_id), (Game));

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

    set_contract_address(ARENA_HOST());
    systems.arena.start(game_id,3);


    let game = get!(world, (game_id), (Game));

    assert(game.limit != 0, 'Game: Did not Start');


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

    let game = get!(world, game_id, Game);
    assert(game.player_count == 1, 'Game: wrong player count');


}