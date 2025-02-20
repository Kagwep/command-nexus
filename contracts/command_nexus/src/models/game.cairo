use starknet::{ContractAddress, get_block_timestamp, get_tx_info};
use core::num::traits::Zero;
use core::pedersen;

use core::hash::HashStateTrait;
use core::poseidon::PoseidonTrait;

const MINIMUM_PLAYER_COUNT: u8 = 2;
const MAXIMUM_PLAYER_COUNT: u8 = 4;
const TURN_ADVANCE: u32 = 3;

use command_nexus::models::battlefield::{BattlefieldName};

#[derive(Drop, Copy, Serde, Introspect,Debug)]
pub struct HomeBasesTuple {
    pub base1: felt252,
    pub base2: felt252,
    pub base3: felt252,
    pub base4: felt252,
}


#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub game_id: u32,
    pub next_to_move: ContractAddress,
    pub minimum_moves: u8,
    pub over: bool,
    pub player_count: u8,
    pub unit_count: u32,
    pub nonce: u32,
    pub  price: u256,
    pub clock: u64,
    pub penalty: u64,
    pub limit: u32,
    pub winner: ContractAddress,
    pub arena_host: ContractAddress,
    pub seed: felt252,
    pub available_home_bases: HomeBasesTuple,
    pub player_name: felt252,


}


pub mod errors {
    pub const GAME_NOT_HOST: felt252 = 'Game: user is not the host';
    pub  const GAME_IS_HOST: felt252 = 'Game: user is the arena_host';
    pub  const GAME_TRANSFER_SAME_HOST: felt252 = 'Game: transfer to the same host';
    pub const GAME_TOO_MANY_PLAYERS: felt252 = 'Game: too many players';
    pub const GAME_TOO_FEW_PLAYERS: felt252 = 'Game: too few players';
    pub const GAME_IS_FULL: felt252 = 'Game: is full';
    pub const GAME_NOT_FULL: felt252 = 'Game: not full';
    pub const GAME_IS_EMPTY: felt252 = 'Game: is empty';
    pub const GAME_NOT_ONLY_ONE: felt252 = 'Game: not only one';
    pub const GAME_IS_OVER: felt252 = 'Game: is over';
    pub const GAME_NOT_OVER: felt252 = 'Game: not over';
    pub const GAME_NOT_STARTED: felt252 = 'Game: not started';
    pub const GAME_HAS_STARTED: felt252 = 'Game: has started';
    pub const GAME_NOT_EXISTS: felt252 = 'Game: does not exist';
    pub const GAME_DOES_EXIST: felt252 = 'Game: does exist';
    pub const GAME_INVALID_HOST: felt252 = 'Game: invalid arena_host';
}


#[generate_trait]
pub impl GameImpl of GameTrait {
    #[inline(always)]
    fn new(game_id: u32, arena_host: ContractAddress, price: u256, penalty: u64,player_name: felt252) -> Game {
        // [Check] Host is valid
        assert(arena_host != Zero::zero(), errors::GAME_INVALID_HOST);

        let home_bases = HomeBasesTuple {
            base1: 1,
            base2: 2,
            base3: 3,
            base4: 4,
        };
        // [Return] Default game
        Game {
            game_id: game_id,
            next_to_move: Zero::zero(),
            minimum_moves: 0,
            over: false,
            player_count: 0,
            unit_count: 0,
            nonce: 0,
            seed: 0,
            price,
            clock: 0,
            penalty,
            limit: 0,
            winner: Zero::zero(),
            arena_host,
            available_home_bases: home_bases,
            player_name,
        }
    }

    #[inline(always)]
    fn reward(self: Game) -> u256 {
        // [Check] Game is over
        self.assert_is_over();

        // [Return] Calculated reward
        self.price * (self.player_count).into()
    }

    #[inline(always)]
    fn player(self: Game) -> u32 {
        let index = self.nonce  % self.player_count.into();
        index.into()
    }

    #[inline(always)]
    fn next_player(self: Game) -> u32 {
        let index = (self.nonce  + 1) % self.player_count.into();
        index.into()
    }


    fn assign_home_base(ref self: Game) -> BattlefieldName {
        // Get a random seed from the transaction hash
        let seed: u256 = get_tx_info().unbox().transaction_hash.into();
        
        // Create an array from the HomeBasesTuple fields
        let arr_home_bases = array![
            self.available_home_bases.base1,
            self.available_home_bases.base2,
            self.available_home_bases.base3,
            self.available_home_bases.base4
        ];
    
        // Count available bases and store their indices
        let mut available_bases = ArrayTrait::new();
        let mut count: usize = 0;
        loop {
            if count == 4 {
                break;
            }
            // If the base is available (non-zero), add its index (1-based) to available_indices
            if *arr_home_bases.at(count) != 0 {
                available_bases.append(*arr_home_bases[count]);
            }
            count += 1;
        };
    
        // Get the number of available bases
        let limit: u128 = available_bases.len().try_into().unwrap();
    
        // If no bases are available, return None
        if limit == 0 {
            return BattlefieldName::None;
        }
    
        // Select a random index from the available indices
        // Note: We add 1 to the modulo result to match 1-based indexing
        let result: usize = (seed.low % limit).try_into().unwrap();
        let selected_index = *available_bases.at(result) - 1;
    
        // Update available_home_bases and return the selected BattlefieldName
        match selected_index {
            0 => {
                self.available_home_bases.base1 = 0;
                BattlefieldName::RadiantShores
            },
            1 => {
                self.available_home_bases.base2 = 0;
                BattlefieldName::Ironforge
            },
            2 => {
                self.available_home_bases.base3 = 0;
                BattlefieldName::Skullcrag
            },
            3 => {
                self.available_home_bases.base4 = 0;
                BattlefieldName::NovaWarhound
            },
            _ => panic(array!['Invalid base index']),
        }
    }
    /// Joins a game and returns the player index.
    /// # Arguments
    /// * `self` - The Game.
    /// # Returns
    /// * The new index of the player.
    #[inline(always)]
    fn join_game(ref self: Game) -> u8 {
        self.assert_exists();
        self.assert_not_over();
        self.assert_not_started();
        self.assert_not_full();
        let index = self.player_count;
        self.player_count += 1;
        index
    }

    #[inline(always)]
    fn add_unit(ref self: Game) -> u32 {
        self.unit_count += 1;
        self.unit_count 
    }

    /// Leaves a game and returns the last player index.
    /// # Arguments
    /// * `self` - The Game.
    /// * `account` - The player address.
    /// # Returns
    /// * The last index of the last registered player.
    #[inline(always)]
    fn leave(ref self: Game, address: ContractAddress) -> u32 {
        self.assert_exists();
        self.assert_not_over();
        self.assert_not_started();
        self.assert_not_empty();
        self.assert_not_host(address);
        self.player_count -= 1;
        self.player_count.into()   
    }

    #[inline(always)]
    fn kick(ref self: Game, address: ContractAddress) -> u32 {
        self.assert_exists();
        self.assert_not_over();
        self.assert_not_started();
        self.assert_not_empty();
        self.assert_not_host(address);
        self.player_count -= 1;
        self.player_count.into()
    }

    #[inline(always)]
    fn delete(ref self: Game, address: ContractAddress) -> u32 {
        self.assert_exists();
        self.assert_not_over();
        self.assert_not_started();
        self.assert_only_one();
        self.assert_is_host(address);
        self.nullify();
        self.player_count.into()
    }

    #[inline(always)]
    fn transfer(ref self: Game, arena_host: ContractAddress) {
        assert(arena_host != Zero::zero(), errors::GAME_INVALID_HOST);
        self.assert_not_host(arena_host);
        self.arena_host = arena_host;
    }

    fn start(ref self: Game, time: u64, round_count: u32, mut players: Array<ContractAddress>) {
        // [Check] Game is valid
        self.assert_exists();
        self.assert_not_over();
        self.assert_not_started();
        self.assert_can_start();

        // [Effect] Compute seed
        let mut state = PoseidonTrait::new();
        state = state.update(self.game_id.into());
        loop {
            match players.pop_front() {
                Option::Some(player) => { state = state.update(player.into()); },
                Option::None => { break; },
            };
        };
        self.seed = state.finalize();
        self.clock = time;
        self.limit = self.player_count.into() * round_count * TURN_ADVANCE;
    }

    #[inline(always)]
    fn advance_turn(ref self: Game) {
        self.nonce += 1;
    }

    #[inline(always)]
    fn pass(ref self: Game) {
        let turn = self.nonce % TURN_ADVANCE;
        self.nonce += TURN_ADVANCE - turn;
    }

    fn turns_remaining(self: Game) -> u32 {
        TURN_ADVANCE - (self.nonce % TURN_ADVANCE)
    }

    #[inline(always)]
    fn nullify(ref self: Game) {
        self.arena_host = Zero::zero();
        self.over = false;
        self.seed = 0;
        self.player_count = 0;
        self.nonce = 0;
        self.price = 0;
    }


}



#[generate_trait]
pub impl GameAssert of AssertTrait {
    #[inline(always)]
    fn assert_is_host(self: Game, address: ContractAddress) {
        assert(self.arena_host == address, errors::GAME_NOT_HOST);
    }

    #[inline(always)]
    fn assert_not_host(self: Game, address: ContractAddress) {
        assert(self.arena_host != address, errors::GAME_IS_HOST);
    }

    #[inline(always)]
    fn assert_is_over(self: Game) {
        assert(self.over, errors::GAME_NOT_OVER);
    }

    #[inline(always)]
    fn assert_not_over(self: Game) {
        assert(!self.over, errors::GAME_IS_OVER);
    }

    #[inline(always)]
    fn assert_has_started(self: Game) {
        assert(self.seed != 0, errors::GAME_NOT_STARTED);
    }

    #[inline(always)]
    fn assert_not_started(self: Game) {
        assert(self.seed == 0, errors::GAME_HAS_STARTED);
    }

    #[inline(always)]
    fn assert_exists(self: Game) {
        assert(self.is_non_zero(), errors::GAME_NOT_EXISTS);
    }

    #[inline(always)]
    fn assert_not_exists(self: Game) {
        assert(self.is_zero(), errors::GAME_DOES_EXIST);
    }

    #[inline(always)]
    fn assert_is_full(self: Game) {
        assert(MAXIMUM_PLAYER_COUNT == self.player_count.into(), errors::GAME_NOT_FULL);
    }

    #[inline(always)]
    fn assert_not_full(self: Game) {
        assert(MAXIMUM_PLAYER_COUNT != self.player_count.into(), errors::GAME_IS_FULL);
    }

    #[inline(always)]
    fn assert_not_empty(self: Game) {
        assert(0 != self.player_count.into(), errors::GAME_IS_EMPTY);
    }

    #[inline(always)]
    fn assert_only_one(self: Game) {
        assert(1 == self.player_count.into(), errors::GAME_NOT_ONLY_ONE);
    }

    #[inline(always)]
    fn assert_can_start(self: Game) {
        assert(self.player_count >= MINIMUM_PLAYER_COUNT, errors::GAME_TOO_FEW_PLAYERS);
        assert(self.player_count <= MAXIMUM_PLAYER_COUNT, errors::GAME_TOO_MANY_PLAYERS);
    }
}

pub impl ZeroableGame of Zero<Game> {
    #[inline(always)]
    fn zero() -> Game {
        let home_bases = HomeBasesTuple {
            base1: 1,
            base2: 2,
            base3: 3,
            base4: 4,
        };
        Game {
            game_id: 0,
            next_to_move: Zero::zero(),
            minimum_moves: 0,
            over: false,
            player_count: 0,
            unit_count: 0,
            seed: 0,
            nonce: 0,
            price: 0,
            clock: 0,
            penalty: 0,
            limit: 0,
            winner: Zero::zero(),
            arena_host: Zero::zero(),
            available_home_bases: home_bases,
            player_name: '',
        }
    }

    #[inline(always)]
    fn is_zero(self: @Game) -> bool {
        Zero::zero() == *self.arena_host
    }

    #[inline(always)]
    fn is_non_zero(self: @Game) -> bool {
        !self.is_zero()
    }
}
