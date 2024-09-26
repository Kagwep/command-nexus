#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    // import test utils
    // use contracts::{
    //     systems::{actions::{actions, IActionsDispatcher, IActionsDispatcherTrait}},
    //     models::{position::{Position, Vec2, position}, moves::{Moves, Direction, moves}}
    // };


    use contracts::{
        systems::{arena::{Arena, IArenaDispatcher, IArenaDispatcherTrait}}, 
        models::{game::{Game, game}, player::{Player, player}}
    };

   


    fn player_one_address() -> starknet::ContractAddress {
        starknet::contract_address_const::<0x05c130461d09899fcc500ca2735a62d2bdae7f98b54d26b8522d3693ecc50c18>()
    }

    fn setup()->(IWorldDispatcher, IArenaDispatcher) {
        let mut models = array![player::TEST_CLASS_HASH, game::TEST_CLASS_HASH];
        let world = spawn_test_world(models);
        let contract_address = world.deploy_contract('salt', Arena::TEST_CLASS_HASH.try_into().unwrap(), array![].span());

        let arena_systems = IArenaDispatcher {contract_address};
        (world, arena_systems)
    }

    fn spawn() -> (IWorldDispatcher, IArenaDispatcher) {
        starknet::testing::set_contract_address(player_one_address());
        let (world, arena_systems) = setup();
        arena_systems.create('felabs', 10000, 13);
        (world, arena_systems)
    }

    #[test]
    #[available_gas(30000000)]
    fn test_spawn() {
        let (world, _) = spawn();
        let game = get!(world, 1, Game);
        assert(game.player_name == 'felabs', 'game not created');
        assert(game.price == 10000, 'game not created');

        // let player = get!(world, (player_one_address()), Player);
        // assert(player.address == player_one_address(), 'address is wrong')
    }

    
     
}