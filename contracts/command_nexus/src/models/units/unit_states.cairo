use starknet::ContractAddress;
use command_nexus::models::player::{UnitType};

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
    Retreating,
    Repairing,
    
}




#[derive(Copy, Drop, Serde, Introspect)]
enum TerrainType {
    UrbanStreet,
    UrbanBuilding,
    UrbanPark,
    Ocean,
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
    x: u256,
    y: u256,
    z: u256,
    mode: UnitMode,
    environment: EnvironmentInfo,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct EnvironmentInfo {
    terrain: TerrainType,
    cover_level: u8,   // 0-100, where 0 is fully exposed and 100 is maximum cover
    elevation: u8,     // 0-100, representing height within urban environment
}


#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum AbilityType {
    Move,
    Attack,
    Defend,
    Patrol,
    Stealth,
    Recon,
    Hack,
    Repair,
    Airlift,
    Bombard,
    Submerge,
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
    cooldown: u64,
    effectiveness: u32,  // 0-100, representing percentage
    unit: UnitType,
    units_abilities_state: UnitAbilities,
}

const MAX_ABILITY_LEVEL: u8 = 100;


#[generate_trait]
impl AbilityStateImpl of AbilityStateTrait {

    #[inline(always)]
    fn new(game_id: u32, unit_id: u32, unit_type: UnitType, player_id: u32) -> AbilityState{

        let units_abilities_state = UnitImpl::initialize_unit_abilities(unit_type);
        
        AbilityState {
            game_id,
            unit_id,
            player_id,
            is_active: true,
            cooldown: 0,
            effectiveness: 100,  // Start at 100% effectiveness
            unit: unit_type,
            units_abilities_state,
        }
    }

    fn ability_level(self: AbilityState, ability_type: AbilityType) -> u8 {
        match ability_type {
            AbilityType::Move => self.units_abilities_state.move_level,
            AbilityType::Attack => self.units_abilities_state.attack_level,
            AbilityType::Defend => self.units_abilities_state.defend_level,
            AbilityType::Patrol => self.units_abilities_state.patrol_level,
            AbilityType::Stealth => self.units_abilities_state.stealth_level,
            AbilityType::Recon => self.units_abilities_state.recon_level,
            AbilityType::Hack => self.units_abilities_state.hack_level,
            AbilityType::Repair => self.units_abilities_state.repair_level,
            AbilityType::Airlift => self.units_abilities_state.airlift_level,
            AbilityType::Bombard => self.units_abilities_state.bombard_level,
            AbilityType::Submerge => self.units_abilities_state.submerge_level,
        }
    }

    fn increase_ability_level(ref self: AbilityState, ability_type: AbilityType, amount: u8) {
        let current_level = self.ability_level(ability_type);
        let new_level = if current_level + amount > MAX_ABILITY_LEVEL {
            MAX_ABILITY_LEVEL
        } else {
            current_level + amount
        };
        self.set_ability_level(ability_type, new_level);
    }

    fn decrease_ability_level(ref self: AbilityState, ability_type: AbilityType, amount: u8) {
        let current_level = self.ability_level(ability_type);
        let new_level = if amount > current_level {
            0
        } else {
            current_level - amount
        };
        self.set_ability_level(ability_type, new_level);
    }

    fn set_ability_level(ref self: AbilityState, ability_type: AbilityType, level: u8) {
        match ability_type {
            AbilityType::Move => self.units_abilities_state.move_level = level,
            AbilityType::Attack => self.units_abilities_state.attack_level = level,
            AbilityType::Defend => self.units_abilities_state.defend_level = level,
            AbilityType::Patrol => self.units_abilities_state.patrol_level = level,
            AbilityType::Stealth => self.units_abilities_state.stealth_level = level,
            AbilityType::Recon => self.units_abilities_state.recon_level = level,
            AbilityType::Hack => self.units_abilities_state.hack_level = level,
            AbilityType::Repair => self.units_abilities_state.repair_level = level,
            AbilityType::Airlift => self.units_abilities_state.airlift_level = level,
            AbilityType::Bombard => self.units_abilities_state.bombard_level = level,
            AbilityType::Submerge => self.units_abilities_state.submerge_level = level,
        }
    }

    fn check_unit_available(self: AbilityState) -> bool {
        self.is_active
    }

    fn is_on_cooldown(self: AbilityState, current_time: u64) -> bool {
        self.cooldown > current_time
    }

    fn update_cooldown(ref self: AbilityState,current_time: u64, duration: u64) {
        self.cooldown = current_time + duration;
    }

    // Comprehensive validation before ability use
    fn validate_for_use(self: AbilityState, ability_type: AbilityType, current_time: u64) {
        // Check if unit is active

        
        assert(self.check_unit_available(), 'Unit is not active');
        
        // Check if ability is off cooldown
        assert(!self.is_on_cooldown(current_time), 'Ability is on cooldown');

        // Check ability level based on type
        match ability_type {
            AbilityType::Move => {
                assert(self.units_abilities_state.move_level > 0, 'Unit: Out of movement');
            },
            AbilityType::Attack => {
                assert(self.units_abilities_state.attack_level > 0, 'Unit: Cannot attack');
            },
            AbilityType::Defend => {
                assert(self.units_abilities_state.defend_level > 0, 'Unit: Cannot defend');
            },
            AbilityType::Patrol => {
                assert(self.units_abilities_state.patrol_level > 0, 'Unit: Cannot patrol');
            },
            AbilityType::Stealth => {
                assert(self.units_abilities_state.stealth_level > 0, 'Unit: Cannot stealth');
            },
            AbilityType::Recon => {
                assert(self.units_abilities_state.recon_level > 0, 'Unit: Cannot recon');
            },
            AbilityType::Hack => {
                assert(self.units_abilities_state.hack_level > 0, 'Unit: Cannot hack');
            },
            AbilityType::Repair => {
                assert(self.units_abilities_state.repair_level > 0, 'Unit: Cannot repair');
            },
            AbilityType::Airlift => {
                assert(self.units_abilities_state.airlift_level > 0, 'Unit: Cannot airlift');
            },
            AbilityType::Bombard => {
                assert(self.units_abilities_state.bombard_level > 0, 'Unit: Cannot bombard');
            },
            AbilityType::Submerge => {
                assert(self.units_abilities_state.submerge_level > 0, 'Unit: Cannot submerge');
            },
        }
    }
    
}


#[generate_trait]
impl UnitImpl of UnitTrait {
    #[inline(always)]
    fn initialize_unit_abilities(unit_type: UnitType) -> UnitAbilities {
        match unit_type {
            UnitType::Infantry => UnitAbilities {
                move_level: 100, attack_level: 50, defend_level: 50,
                patrol_level: 100, stealth_level: 20, recon_level: 40,
                hack_level: 0, repair_level: 0, airlift_level: 0,
                bombard_level: 0, submerge_level: 0
            },
            UnitType::Armored => UnitAbilities {
                move_level: 100, attack_level: 100, defend_level: 70,
                patrol_level: 10, stealth_level: 0, recon_level: 0,
                hack_level: 0, repair_level: 50, airlift_level: 0,
                bombard_level: 50, submerge_level: 0
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


#[generate_trait]
impl UnitStateImpl of UnitStateTrait {
    
    fn new(game_id: u32,player_id: u32,unit_id: u32, x: u256,y: u256,z: u256,environment:EnvironmentInfo) -> UnitState {
        UnitState {
            game_id,
            player_id,
            unit_id,
            x,
            y,
            z,
            mode: UnitMode::Idle,
            environment,
        }
    }

    fn update_unit_mode(ref self: UnitState, unit_mode: UnitMode){
        self.mode  = unit_mode;
    }

    fn update_enviroment(ref self: UnitState, enviroment:EnvironmentInfo){
        self.environment = enviroment;
    }

    fn update_position(ref self: UnitState, x: u256,y: u256,z: u256){
        self.x =x;
        self.y = y;
        self.z = z;
    }

    fn attack_bonus(self: UnitState) -> u8 {
        match self.mode {
            UnitMode::Attacking => 10,
            UnitMode::Stealthed => 15,
            UnitMode::Reconning => 5,
            _ => 0,
        }
    }

    fn defense_bonus(self: UnitState) -> u8 {
        match self.mode {
            UnitMode::Defending => 15,
            UnitMode::Patrolling => 5,
            UnitMode::Stealthed => 10,
            _ => 0,
        }
    }


    fn attacked_mode_points (self: UnitState) -> u32 {
        match self.mode {
            UnitMode::Idle => 0,      // No bonus for idle targets
            UnitMode::Moving => 25,    // Moving targets are challenging
            UnitMode::Attacking => 30, // Engaged in combat
            UnitMode::Defending => 35, // Well protected
            UnitMode::Patrolling => 15, // Regular movement
            UnitMode::Stealthed => 40, // Highest reward
            UnitMode::Reconning => 20, // Aware and mobile
            UnitMode::Healing => 20,   // Vulnerable but aware
            UnitMode::Retreating => 15, // Predictable movement
            UnitMode::Repairing => 10, // Stationary but defensive
        }
    }

    fn attacking_mode_points(self: UnitState) -> u32 {
        match self.mode {
            UnitMode::Idle => 25,      // Bonus for quick reaction from idle
            UnitMode::Moving => 15,     // Shooting while moving is harder
            UnitMode::Attacking => 10,  // Already in combat stance
            UnitMode::Defending => 20,  // Breaking defensive position to attack
            UnitMode::Patrolling => 20, // Transitioning from patrol to combat
            UnitMode::Stealthed => 40,  // Highest reward for stealth attack
            UnitMode::Reconning => 30,  // Good position for ambush
            UnitMode::Healing => 5,     // Difficult to attack while healing
            UnitMode::Retreating => 5,  // Difficult to attack while retreating
            UnitMode::Repairing => 5,   // Difficult to attack while repairing
        }
    }
    

    
}



#[generate_trait]
impl TerrainTypeImpl of TerrainTypeTrait {
    fn from_u8(value: u8) -> Option<TerrainType> {
        match value {
            0 => Option::Some(TerrainType::UrbanStreet),
            1 => Option::Some(TerrainType::UrbanBuilding),
            2 => Option::Some(TerrainType::UrbanPark),
            3 => Option::Some(TerrainType::Ocean),
            _ => Option::None,
        }
    }

    fn to_u8(self: TerrainType) -> u8 {
        match self {
            TerrainType::UrbanStreet => 0,
            TerrainType::UrbanBuilding => 1,
            TerrainType::UrbanPark => 2,
            TerrainType::Ocean => 3,
        }
    }
}