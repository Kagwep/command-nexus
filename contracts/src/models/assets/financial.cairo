#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum FinancialStatus {
    Operational,
    UnderMaintenance,
    Compromised,
    Closed,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum FinancialType {
    Bank,
    StockExchange,
    Treasury,
    InvestmentFirm,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct Bank {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    bank_id: u32,
    bank_name: felt252,
    total_deposit: u32,
    total_withdrawals: u32,
    interest_rate: u32,
    status: FinancialStatus,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct StockExchange {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    exchange_id: u32,
    exchange_name: felt252,
    listed_companies: u32,
    trading_volume: u32,
    status: FinancialStatus,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct Treasury {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    treasury_id: u32,
    treasury_name: felt252,
    funds_available: u32,
    funds_reserved: u32,
    status: FinancialStatus,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct InvestmentFirm {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    firm_id: u32, 
    firm_name: felt252,
    assets_under_management: u32,
    active_investments: u32,
    status: FinancialStatus,
}