mod setup {


    use core::debug::PrintTrait;

   

    use starknet::ContractAddress;
    use starknet::testing::set_contract_address;

   

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::test_utils::{spawn_test_world, deploy_contract};



    use contracts::models::game::{game, Game};
    use contracts::models::player::{player, Player};
    use contracts::models::battlefield::{urban_battlefield, UrbanBattlefield};
    use contracts::models::units::unit_states::{unit_state,UnitState};
    use contracts::models::units::unit_states::{ability_state,AbilityState};
    use contracts::systems::arena::{arena, IArenaDispatcher};
    use contracts::systems::nexus::{nexus, INexusDispatcher};



    

    fn ARENA_HOST() -> ContractAddress {
        starknet::contract_address_const::<'ARENA_HOST'>()
    }

    fn PLAYER() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER'>()
    }

    fn PLAYER_TWO() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER_TWO'>()
    }


    fn PLAYER_THREE() -> ContractAddress {
        starknet::contract_address_const::<'PLAYER_THREE'>()
    }


    // fn ANYONE() -> ContractAddress {
    //     starknet::contract_address_const::<'ANYONE'>()
    // }

    #[derive(Drop)]
    struct Systems {
        arena: IArenaDispatcher,
        nexus: INexusDispatcher,
    }


    fn spawn_game() -> (IWorldDispatcher, Systems) {

        // [Setup] World
        let mut models = core::array::ArrayTrait::new();

        models.append(game::TEST_CLASS_HASH);
        models.append(player::TEST_CLASS_HASH);
        models.append(urban_battlefield::TEST_CLASS_HASH);
        models.append(ability_state::TEST_CLASS_HASH);
        models.append(unit_state::TEST_CLASS_HASH);

        let world = spawn_test_world(models);
    
        // [Setup] Systems
        let arena_address = world.deploy_contract('salt',arena::TEST_CLASS_HASH.try_into().unwrap(), array![].span());
        let nexus_address = world.deploy_contract('salt_two',nexus::TEST_CLASS_HASH.try_into().unwrap(), array![].span());

        let systems = Systems {
            arena: IArenaDispatcher { contract_address: arena_address },
            nexus: INexusDispatcher { contract_address: nexus_address },
        };

        // [Return]
        (world, systems)
    }
}
