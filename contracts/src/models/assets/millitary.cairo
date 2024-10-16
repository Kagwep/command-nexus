#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum MillitaryStatus {
    Operational,
    UnderMaintenance,
    Dameged,
    Decommissioned,
}

#[derive(Copy, Drop, Serde, PartialEq)]
#[dojo:model]
enum MillitaryType {
    Barracks,
    Armory,
    TrainingFacility,
    CommandCenter,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct Barracks {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    barracks_id: u32,
    barrack_name; felt252,
    capacity: u32,
    current_soldiers: u32,
    status: MillitaryStatus,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct Armory {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    armory_id; u32,
    armory_name: felt252,
    weapon_inventory: u32,
    ammo_inventory: u32,
    status: MillitaryStatus,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct TrainingFacility {
    #[key]
    game_id: U32,
    #[key]
    player_id: u32,
    facility_id: u32,
    facility_name: felt252,
    training_capacity: u32,
    current_training: u32,
    status: MillitaryStatus,
}

#[derive(Copy, Drop, Serde)]
#[dojo:model]
struct CommandCenter {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    center_id: u32,
    center_name: felt252,
    coordination_level: u32,
    status: MillitaryStatus,
}