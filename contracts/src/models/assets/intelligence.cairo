#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum AgencyType {
    Domestic,
    Foreign,
    Cyber,
    CounterIntelligence,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum AgencyStatus {
    Active,
    UnderOperation,
    Suspended,
    Compromised,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct IntelligenceAgency {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    agency_id: u32,
    agency_name: felt252,
    agency_type: AgencyType,
    resource_allocation: u32,
    status: AgencyStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct SpyNetwork {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    network_id: u32,
    network_name: felt252,
    number_of_spies: u32,
    intel_reliability: u32,
    status: AgencyStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct IntelligenceReport {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    report_id: u32,
    source_agency_id: u32,
    target_player_id: u32,
    intelligence_data: felt252,
    reliability_score: u32,
    timestamp: u64,
    status: AgencyStatus,
}