use contracts::models::battlefield::BattlefieldName;
use contracts::models::position::Position;

#[derive(Copy, Drop, Serde, Introspect)]
#[dojo::model]
struct CyberUnit {
    #[key]
    game_id: u32,
    #[key]
    unit_id: u32,
    #[key]
    player_id: u32,
    hacking_range: u64,
    encryption_strength: u32,
    stealth: u8,
    accessories: CyberUnitAccessories,
    health: CyberUnitHealth,
    position: Position,
    battlefield_name: BattlefieldName,
    bandwidth: u32,  // New field for cyber units
    processing_power: u32, // New field for cyber units
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct CyberUnitAccessories {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    malware: u32,
    firewalls: u32,
    vpn_tokens: u32,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
struct CyberUnitHealth {
    #[key]
    game_id: u32,
    #[key]
    player_id: u32,
    system_integrity: u32,
    anti_virus_strength: u32,
}