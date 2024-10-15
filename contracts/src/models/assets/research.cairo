#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum ResearchStatus {
    Active,
    UnderDevelopment,
    Maintenance,
    Decommissioned,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum ResearchType {
    Laboratory,
    TestingGround,
    InnovationCenter,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct Laboratory {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    lab_id: u32,
    lab_name: felt252,
    research_capacity: u32,
    ongoing_projects: u32<
    status: ResearchStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct TestingGround {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    ground_id: u32,
    ground_name: felt252,
    test_capacity: u32,
    ongiong_tests: u32,
    status: ResearchStatus,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
struct InnovationCenter {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    center_id: u32,
    center_name: felt252,
    innovation_points: u32,
    status: ResearchStatus,
}