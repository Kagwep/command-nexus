#[dojo::interface]
trait IUnitManager {
    fn get_unit_mode(self: @ContractState, game_id: u32, unit_id: u32) -> UnitMode;
    fn set_unit_mode(ref self: ContractState, game_id: u32, unit_id: u32, mode: UnitMode);
    fn update_unit_position(ref self: ContractState, game_id: u32, unit_id: u32, x: u32, y: u32, z: u32);
    fn get_player_supply(self: @ContractState, game_id: u32, player_id: u32) -> UnitsSupply;
    fn update_player_supply(ref self: ContractState, game_id: u32, player_id: u32, supply: UnitsSupply);
}

#[dojo::contract]
mod UnitManager {
    use super::{IUnitManager};
    use starknet::{ContractAddress, get_caller_address};

    use contracts::models::playerstate::{PlayerState, UnitsSupply};
    use contracts::models::unitsupply::{UnitState, UnitMode};

    #[generate_trait]
    impl UnitManagerImpl of IUnitManager<ContractState> {

        fn get_unit_mode(self: @ContractState, game_id: u32, unit_id: u32) -> UnitMode {
            let unit_state_key = (game_id, get_caller_address(), unit_id);
            let unit_state: UnitState = get!(self, unit_state_key.into(), (UnitState));
            unit_state.mode
        }

        fn set_unit_mode(ref self: ContractState, game_id: u32, unit_id: u32, mode: UnitMode) {
            let unit_state_key = (game_id, get_caller_address(), unit_id);
            let mut unit_state: UnitState = get!(self, unit_state_key.into(), (UnitState));
            unit_state.mode = mode;
            set!(self, unit_state_key.into(), unit_state);
        }

        fn update_unit_position(ref self: ContractState, game_id: u32, unit_id: u32, x: u32, y: u32, z: u32) {
            let unit_state_key = (game_id, get_caller_address(), unit_id);
            let mut unit_state: UnitState = get!(self, unit_state_key.into(), (UnitState));
            unit_state.x = x;
            unit_state.y = y;
            unit_state.z = z;
            set!(self, unit_state_key.into(), unit_state);
        }

        fn get_player_supply(self: @ContractState, game_id: u32, player_id: u32) -> UnitsSupply {
            let player_state_key = (game_id, player_id);
            let player_state: PlayerState = get!(self, player_state_key.into(), (PlayerState));
            player_state.supply
        }

        fn update_player_supply(ref self: ContractState, game_id: u32, player_id: u32, supply: UnitsSupply) {
            let player_state_key = (game_id, player_id);
            let mut player_state: PlayerState = get!(self, player_state_key.into(), (PlayerState));
            player_state.supply = supply;
            set!(self, player_state_key.into(), player_state);
        }
    }
}
