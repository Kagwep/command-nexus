mod setup {


    use core::debug::PrintTrait;
    use starknet::ContractAddress;
    use starknet::testing::set_contract_address;
    use dojo_cairo_test::WorldStorageTestTrait;
    use dojo::model::{ModelStorage, ModelValueStorage, ModelStorageTest};
    use dojo::world::WorldStorageTrait;
    use dojo_cairo_test::{spawn_test_world, NamespaceDef, TestResource, ContractDefTrait, ContractDef};


    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use command_nexus::models::game::{Game,m_Game};
    use command_nexus::models::player::{Player,m_Player};
    use command_nexus::models::battlefield::{UrbanBattlefield,m_UrbanBattlefield};
    use command_nexus::models::units::unit_states::{UnitState,m_UnitState};
    use command_nexus::models::units::unit_states::{AbilityState,m_AbilityState};
    use command_nexus::systems::arena::{arena, IArenaDispatcher,IArenaDispatcherTrait};
    use command_nexus::systems::nexus::{nexus, INexusDispatcher, INexusDispatcherTrait};
    use command_nexus::models::units::infantry::{Infantry,m_Infantry};
    use command_nexus::models::units::armored::{Armored,m_Armored};

    use dojo::world::storage::WorldStorage;

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

    #[derive(Copy, Drop)]
    struct Systems {
        arena: IArenaDispatcher,
        nexus: INexusDispatcher,
    }

    fn namespace_def() -> NamespaceDef {
        let ndef = NamespaceDef {
            namespace: "command_nexus", resources: [
                TestResource::Model(m_Game::TEST_CLASS_HASH),
                TestResource::Model(m_Player::TEST_CLASS_HASH),
                TestResource::Model(m_UrbanBattlefield::TEST_CLASS_HASH),
                TestResource::Model(m_AbilityState::TEST_CLASS_HASH),
                TestResource::Model(m_UnitState::TEST_CLASS_HASH),
                TestResource::Model(m_Infantry::TEST_CLASS_HASH),
                TestResource::Model(m_Armored::TEST_CLASS_HASH),
                TestResource::Contract(arena::TEST_CLASS_HASH),
                TestResource::Contract(nexus::TEST_CLASS_HASH)
            ].span()
        };

        ndef
    }

    fn contract_defs() -> Span<ContractDef> {
        [
            ContractDefTrait::new(@"command_nexus", @"arena")
                .with_writer_of([dojo::utils::bytearray_hash(@"command_nexus")].span()),

            ContractDefTrait::new(@"command_nexus", @"nexus")
            .with_writer_of([dojo::utils::bytearray_hash(@"command_nexus")].span()),
        ].span()
    }


    fn spawn_game() -> (WorldStorage, Systems) {

        // Initialize test environment
        let ndef = namespace_def();

        // Register the resources.
        let mut world = spawn_test_world([ndef].span());
    
        // Ensures permissions and initializations are synced.
        world.sync_perms_and_inits(contract_defs());
        // [Setup] Systems
        let (arena_address,_) = world.dns(@"arena").unwrap();
        let (nexus_address,_) = world.dns(@"nexus").unwrap();

        let systems = Systems {
            arena: IArenaDispatcher { contract_address: arena_address },
            nexus: INexusDispatcher { contract_address: nexus_address },
        };

        // [Return]
        (world, systems)
    }
}
