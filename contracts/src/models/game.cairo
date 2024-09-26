use starknet::{ContractAddress, get_block_timestamp, get_tx_info};
use core::Zeroable;
use core::pedersen;

use core::hash::HashStateTrait;
use core::poseidon::PoseidonTrait;

const MINIMUM_PLAYER_COUNT: u8 = 2;
const MAXIMUM_PLAYER_COUNT: u8 = 4;
const TURN_COUNT: u32 = 3;

use contracts::models::battlefield::{BattlefieldName};

#[derive(Copy, Drop,Serde, SerdeLen,Introspect)]
struct HomeBasesTuple {
    base1: felt252,
    base2: felt252,
    base3: felt252,
    base4: felt252,
    base5: felt252,
}


#[derive(Component, Copy, Drop, Serde, SerdeLen)]
#[dojo::model]
struct Game {
    #[key]
    game_id: u32,
    next_to_move: ContractAddress,
    minimum_moves: u8,
    over: bool,
    player_count: u8,
    unit_count: u32,
    nonce: u32,
    price: u256,
    clock: u64,
    penalty: u64,
    limit: u32,
    winner: ContractAddress,
    arena_host: ContractAddress,
    seed: felt252,
    available_home_bases: HomeBasesTuple,
    player_name: felt252,


}

#[derive(Drop, PartialEq)]
enum Turn {
    Supply,
    Attack,
    Transfer,
}

#[derive(Model, Copy, Drop, Serde)]
struct GameData {
    #[key]
    game_id: u32,
    number_of_players: u8,
    clock: u64,
    over: bool
}

mod errors {
    const GAME_NOT_HOST: felt252 = 'Game: user is not the host';
    const GAME_IS_HOST: felt252 = 'Game: user is the arena_host';
    const GAME_TRANSFER_SAME_HOST: felt252 = 'Game: transfer to the same host';
    const GAME_TOO_MANY_PLAYERS: felt252 = 'Game: too many players';
    const GAME_TOO_FEW_PLAYERS: felt252 = 'Game: too few players';
    const GAME_IS_FULL: felt252 = 'Game: is full';
    const GAME_NOT_FULL: felt252 = 'Game: not full';
    const GAME_IS_EMPTY: felt252 = 'Game: is empty';
    const GAME_NOT_ONLY_ONE: felt252 = 'Game: not only one';
    const GAME_IS_OVER: felt252 = 'Game: is over';
    const GAME_NOT_OVER: felt252 = 'Game: not over';
    const GAME_NOT_STARTED: felt252 = 'Game: not started';
    const GAME_HAS_STARTED: felt252 = 'Game: has started';
    const GAME_NOT_EXISTS: felt252 = 'Game: does not exist';
    const GAME_DOES_EXIST: felt252 = 'Game: does exist';
    const GAME_INVALID_HOST: felt252 = 'Game: invalid arena_host';
}


#[generate_trait]
impl GameImpl of GameTrait {
    #[inline(always)]
    fn new(game_id: u32, arena_host: ContractAddress, price: u256, penalty: u64,player_name: felt252) -> Game {
        // [Check] Host is valid
        assert(arena_host != Zeroable::zero(), errors::GAME_INVALID_HOST);

        let home_bases = HomeBasesTuple {
            base1: 1,
            base2: 2,
            base3: 3,
            base4: 4,
            base5: 5,
        };
        // [Return] Default game
        Game {
            game_id: game_id,
            next_to_move: Zeroable::zero(),
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
            winner: Zeroable::zero(),
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
        let index = self.nonce / TURN_COUNT % self.player_count.into();
        index.into()
    }

    #[inline(always)]
    fn turn(self: Game) -> Turn {
        let turn_id = self.nonce % TURN_COUNT;
        turn_id.into()
    }

    #[inline(always)]
    fn next_player(self: Game) -> u32 {
        let index = (self.nonce / TURN_COUNT + 1) % self.player_count.into();
        index.into()
    }

    #[inline(always)]
    fn next_turn(self: Game) -> Turn {
        let turn_id = (self.nonce + 1) % TURN_COUNT;
        turn_id.into()
    }



    fn assign_home_base(ref self: Game) -> BattlefieldName {
        // Get a random seed from the transaction hash
        let seed: u256 = get_tx_info().unbox().transaction_hash.into();
        
        // Create an array from the HomeBasesTuple fields
        let arr_home_bases = array![
            self.available_home_bases.base1,
            self.available_home_bases.base2,
            self.available_home_bases.base3,
            self.available_home_bases.base4,
            self.available_home_bases.base5
        ];
    
        // Count available bases and store their indices
        let mut available_indices = ArrayTrait::new();
        let mut count: usize = 0;
        loop {
            if count == 5 {
                break;
            }
            // If the base is available (non-zero), add its index (1-based) to available_indices
            if *arr_home_bases.at(count) != 0 {
                available_indices.append(count + 1);
            }
            count += 1;
        };
    
        // Get the number of available bases
        let limit: u128 = available_indices.len().try_into().unwrap();
    
        // If no bases are available, return None
        if limit == 0 {
            return BattlefieldName::None;
        }
    
        // Select a random index from the available indices
        // Note: We add 1 to the modulo result to match 1-based indexing
        let result: usize = (seed.low % limit + 1).try_into().unwrap();
        let selected_index = *available_indices.at(result - 1);
    
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
            4 => {
                self.available_home_bases.base5 = 0;
                BattlefieldName::SavageCoast
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
        let new_unit_count = self.unit_count + 1;
        new_unit_count  
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
        assert(arena_host != Zeroable::zero(), errors::GAME_INVALID_HOST);
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
        self.limit = self.player_count.into() * round_count * TURN_COUNT;
    }

    #[inline(always)]
    fn increment(ref self: Game) {
        self.nonce += 1;
    }

    #[inline(always)]
    fn pass(ref self: Game) {
        let turn = self.nonce % TURN_COUNT;
        self.nonce += TURN_COUNT - turn;
    }

    #[inline(always)]
    fn nullify(ref self: Game) {
        self.arena_host = Zeroable::zero();
        self.over = false;
        self.seed = 0;
        self.player_count = 0;
        self.nonce = 0;
        self.price = 0;
    }


}


impl U32IntoTurn of Into<u32, Turn> {
    #[inline(always)]
    fn into(self: u32) -> Turn {
        assert(self < 3, 'U8IntoTurn: invalid turn');
        if self == 0 {
            Turn::Supply
        } else if self == 1 {
            Turn::Attack
        } else {
            Turn::Transfer
        }
    }
}

impl TurnIntoU32 of Into<Turn, u32> {
    #[inline(always)]
    fn into(self: Turn) -> u32 {
        match self {
            Turn::Supply => 0,
            Turn::Attack => 1,
            Turn::Transfer => 2,
        }
    }
}

#[generate_trait]
impl GameAssert of AssertTrait {
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

impl ZeroableGame of core::Zeroable<Game> {
    #[inline(always)]
    fn zero() -> Game {
        let home_bases = HomeBasesTuple {
            base1: 1,
            base2: 2,
            base3: 3,
            base4: 4,
            base5: 5,
        };
        Game {
            game_id: 0,
            next_to_move: Zeroable::zero(),
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
            winner: Zeroable::zero(),
            arena_host: Zeroable::zero(),
            available_home_bases: home_bases,
            player_name: '',
        }
    }

    #[inline(always)]
    fn is_zero(self: Game) -> bool {
        Zeroable::zero() == self.arena_host
    }

    #[inline(always)]
    fn is_non_zero(self: Game) -> bool {
        !self.is_zero()
    }
}
