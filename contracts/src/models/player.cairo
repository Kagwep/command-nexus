use core::zeroable::Zeroable;
use starknet::ContractAddress;
use contracts::models::battlefield::{BattlefieldName};

const INITIAL_MOVES: u8 = 8;
const ACTION_MOVES: u8 = 3;
const TURN_TIME_LIMIT_SECONDS: u64 = 200;

mod errors {
    const PLAYER_INVALID_RANK: felt252 = 'Player: invalid rank';
    const PLAYER_NOT_EXISTS: felt252 = 'Player: does not exist';
    const PLAYER_DOES_EXIST: felt252 = 'Player: does exist';
    const PLAYER_IS_DEAD: felt252 = 'Player: is dead';
    const NO_COMMANDS: felt252 = 'Player:  No Commands';
}

#[derive(Copy,Drop,Serde)]
#[dojo::model]
struct Player {
    #[key]
    game_id: u32,
    #[key]
    index: u32,
    address: starknet::ContractAddress,
    name: felt252,
    supply: UnitsSupply,
    last_action:u64,
    rank: u8,
    player_score: PlayerScore,
    home_base:BattlefieldName,
    commands_remaining: u8,
    turn_start_time: u64,
}


#[derive(Copy, Drop, Serde, Introspect)]
struct PlayerScore {
    score: u32,
    kills: u16,
    deaths: u16,
    assists: u16,
}

#[derive(Copy, Drop, Serde, PartialEq, Introspect)]
enum UnitType {
    None,
    Infantry,
    Armored,
    Air,
    Naval,
    Cyber,
}


#[derive(Copy, Drop, Serde, Introspect)]
struct UnitsSupply { 
    infantry: u32,
    armored: u32,
    air: u32,
    naval: u32,
    cyber: u32,
}

#[generate_trait]
impl PlayerImpl of PlayerTrait {
    #[inline(always)]
    fn new(game_id: u32, index: u32, address: ContractAddress, name: felt252, home_base: BattlefieldName) -> Player {
        Player { 
            game_id, index, address, name,
            supply: UnitsSupply { 
            infantry: 5,
            armored: 4,
            air: 2,
            naval: 3,
            cyber: 1,
        }, last_action: 0,
            rank: 0,
            player_score: PlayerScore {
            score: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
        },
        home_base,
        commands_remaining: INITIAL_MOVES,
        turn_start_time: 0,
    }
    }

    #[inline(always)]
    fn reset_moves(ref self: Player) {
        self.commands_remaining = ACTION_MOVES;
    }

    #[inline(always)]
    fn send_command(ref self: Player) -> u8 {
        assert(self.commands_remaining >= 0,'No Commands remaining.');
        self.commands_remaining -= 1;

        self.commands_remaining

    }

    #[inline(always)]
    fn is_turn_timed_out(self: Player, current_time: u64) -> bool {
        assert(self.turn_start_time != 0, 'Round not Initialized');
        current_time - self.turn_start_time > TURN_TIME_LIMIT_SECONDS
    }

    #[inline(always)]
    fn is_dead(self: Player) -> bool {
        self.rank > 0
    }

    #[inline(always)]
    fn rank(ref self: Player, rank: u8) {
        assert(self.rank == 0, errors::PLAYER_IS_DEAD);
        assert(rank != 0, errors::PLAYER_INVALID_RANK);
        self.rank = rank;
    }

    #[inline(always)]
    fn nullify(ref self: Player) {
        self.address = Zeroable::zero();
        self.name = 0;
        self.supply = UnitsSupply { 
            infantry: 0,
            armored: 0,
            air: 0,
            naval: 0,
            cyber: 0,
        };
        self.rank = 0;
        self.player_score =  PlayerScore {
            score: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
        };
        self.home_base = BattlefieldName::None;
        self.commands_remaining = 0;
        self.turn_start_time = 0;
    }

    #[inline(always)]
    fn get_unit_supply(ref self: Player, unit: UnitType) -> u32{

        match unit {
            UnitType::Infantry => self.supply.infantry,
            UnitType::Armored =>  self.supply.armored,
            UnitType::Air => self.supply.air,
            UnitType::Naval => self.supply.naval,
            UnitType::Cyber => self.supply.cyber,
            UnitType::None => 0,
            _=> panic(array!['Invalid Unit Type'])
        }


    }

    #[inline(always)]
    fn set_turn_start_time(ref self: Player, start_time: u64){
        self.turn_start_time = start_time;
    }


    #[inline(always)]
    fn unit_supply(ref self: Player, unit: UnitType){

        match unit {
            UnitType::Infantry => self.supply.infantry -= 1,
            UnitType::Armored =>  self.supply.armored -= 1,
            UnitType::Air => self.supply.air -= 1,
            UnitType::Naval => self.supply.naval -= 1,
            UnitType::Cyber => self.supply.cyber -= 1,
            _=> panic(array!['Invalid Unit Type'])
        }


    }

    
}

#[generate_trait]
impl PlayerAssert of AssertTrait {
    #[inline(always)]
    fn assert_exists(self: Player) {
        assert(self.is_non_zero(), errors::PLAYER_NOT_EXISTS);
    }

    #[inline(always)]
    fn assert_not_exists(self: Player) {
        assert(self.is_zero(), errors::PLAYER_DOES_EXIST);
    }

    #[inline(always)]
    fn assert_has_commands(self: Player){
        assert(self.commands_remaining !=0,errors::NO_COMMANDS);
    }
}

impl ZeroablePlayer of Zeroable<Player> {
    #[inline(always)]
    fn zero() -> Player {
        Player {
            game_id: 0,
            index: 0,
            address: Zeroable::zero(),
            name: 0,
            supply: UnitsSupply { 
                infantry: 0,
                armored: 0,
                air: 0,
                naval: 0,
                cyber: 0,
            },
            rank: 0,
            last_action: 0,
            player_score:  PlayerScore {
                score: 0,
                kills: 0,
                deaths: 0,
                assists: 0,
            },
            home_base: BattlefieldName::None,
            commands_remaining: 0,
            turn_start_time: 0,
        }
    }

    #[inline(always)]
    fn is_zero(self: Player) -> bool {
        self.address == Zeroable::zero()
    }


    #[inline(always)]
    fn is_non_zero(self: Player) -> bool {
        !self.is_zero()
    }
}


#[generate_trait]
impl UnitTypeImpl of UnitTypeTrait {
    fn to_int(self: UnitType) -> u8 {
        match self {
            UnitType::None => 0_u8,
            UnitType::Infantry => 1_u8,
            UnitType::Armored => 2_u8,
            UnitType::Air => 3_u8,
            UnitType::Naval => 4_u8,
            UnitType::Cyber => 5_u8,
        }
    }

    fn from_int(value: u8) -> Option<UnitType> {
        match value {
            0_u8 => Option::Some(UnitType::None),
            1_u8 => Option::Some(UnitType::Infantry),
            2_u8 => Option::Some(UnitType::Armored),
            3_u8 => Option::Some(UnitType::Air),
            4_u8 => Option::Some(UnitType::Naval),
            5_u8 => Option::Some(UnitType::Cyber),
            _ => Option::None,
        }
    }
}