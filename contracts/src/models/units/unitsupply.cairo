use starknet::ContractAddress;
use contracts::models::player::{UnitType};

#[derive(Drop,Copy,Serde, PartialEq, Introspect)]
enum UnitMode {
    Idle,
    Moving,
    Attacking,
    Defending,
    Patrolling,
    Stealthed,
    Reconning,
    Healing,
    
}


#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct UnitState {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    unit_type: u8,  // 0: infantry, 1: armored, 2: air, 3: naval, 4: cyber
    x: u32,
    y: u32,
    z: u32,
    mode: UnitMode,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct UnitAbilities {
    move_level: u8,
    attack_level: u8,
    defend_level: u8,
    patrol_level: u8,
    stealth_level: u8,
    recon_level: u8,
    hack_level: u8,
    repair_level: u8,
    airlift_level: u8,
    bombard_level: u8,
    submerge_level: u8,
}

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct AbilityState {
    #[key]
    game_id:u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    is_active: bool,
    cooldown: u32,
    effectiveness: u32,  // 0-100, representing percentage
    unit: UnitType,
    cooldown_increase: u32,
    units_abilities_state: UnitAbilities,
}


#[generate_trait]
impl AbilityStateImpl of AbilityStateTrait {

    #[inline(always)]
    fn new(game_id: u32, unit_id: u32, unit_type: UnitType, player_id: u32) -> AbilityState{

        let units_abilities_state = UnitImpl::initialize_unit_abilities(unit_type);
        
        AbilityState {
            game_id,
            unit_id,
            player_id,
            is_active: false,
            cooldown: 0,
            effectiveness: 100,  // Start at 100% effectiveness
            unit: unit_type,
            cooldown_increase: 0,
            units_abilities_state,
        }
    }
    
}


#[generate_trait]
impl UnitImpl of UnitTrait {
    #[inline(always)]
    fn initialize_unit_abilities(unit_type: UnitType) -> UnitAbilities {
        match unit_type {
            UnitType::Infantry => UnitAbilities {
                move_level: 2, attack_level: 2, defend_level: 2,
                patrol_level: 1, stealth_level: 1, recon_level: 0,
                hack_level: 0, repair_level: 0, airlift_level: 0,
                bombard_level: 0, submerge_level: 0
            },
            UnitType::Armored => UnitAbilities {
                move_level: 1, attack_level: 3, defend_level: 3,
                patrol_level: 1, stealth_level: 0, recon_level: 0,
                hack_level: 0, repair_level: 1, airlift_level: 0,
                bombard_level: 2, submerge_level: 0
            },
            UnitType::Naval => UnitAbilities {
                move_level: 2, attack_level: 2, defend_level: 2,
                patrol_level: 2, stealth_level: 1, recon_level: 1,
                hack_level: 0, repair_level: 1, airlift_level: 0,
                bombard_level: 2, submerge_level: 1
            },
            UnitType::Air => UnitAbilities {
                move_level: 3, attack_level: 2, defend_level: 1,
                patrol_level: 2, stealth_level: 1, recon_level: 2,
                hack_level: 0, repair_level: 0, airlift_level: 2,
                bombard_level: 1, submerge_level: 0
            },
            UnitType::Cyber => UnitAbilities {
                move_level: 1, attack_level: 1, defend_level: 1,
                patrol_level: 0, stealth_level: 2, recon_level: 2,
                hack_level: 3, repair_level: 2, airlift_level: 0,
                bombard_level: 0, submerge_level: 0
            },
            _=> panic(array!['Invalid unit type'])
        }
    }
}