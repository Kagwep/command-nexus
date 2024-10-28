use contracts::models::battlefield::BattlefieldName;
use contracts::models::position::{Position,Vec3};
use contracts::models::units::unit_states::AbilityState;

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
    bandwidth: u32,
    processing_power: u32,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct CyberUnitAccessories {
    malware: u32,
    firewalls: u32,
    vpn_tokens: u32,
    encryption_keys: u32,
    decryption_tools: u32,
}

#[derive(Copy, Drop, Serde, Introspect)]
struct CyberUnitHealth {
    system_integrity: u32,
    anti_virus_strength: u32,
}

#[derive(Drop, Copy, Serde, PartialEq, Introspect)]
enum CyberUnitAction {
    Attack,
    DeployMalware, 
    ExecuteHack,   
    StrengthenFirewall,
    UseVPN,
}



#[generate_trait]
impl CyberUnitImpl of CyberUnitTrait {
    fn new(game_id: u32, unit_id: u32, player_id: u32, x: u256, y: u256, z: u256, battlefield_name: BattlefieldName) -> CyberUnit {
        CyberUnit {
            game_id,
            unit_id,
            player_id,
            hacking_range: 1000,  // Global range for cyber units
            encryption_strength: 100,
            stealth: 90,
            accessories: CyberUnitAccessories {
                malware: 50,
                firewalls: 3,
                vpn_tokens: 10,
                encryption_keys: 20,
                decryption_tools: 15,
            },
            health: CyberUnitHealth {
                current: 100,
                max: 100,
            },
            position: Position { coord: Vec3{x, y, z} },
            battlefield_name,
            processing_power: 100,
        }
    }

    fn update_accessories(ref self: CyberUnit, new_accessories: CyberUnitAccessories) {
        self.accessories = new_accessories;
    }

    fn deploy_malware(ref self: CyberUnit, ref ability_state: AbilityState) -> bool {
        if ability_state.is_active && self.accessories.malware > 0 {
            self.accessories.malware -= 1;
            // Add malware deployment logic here
            true
        } else {
            false
        }
    }

    fn strengthen_firewall(ref self: CyberUnit, ref ability_state: AbilityState) -> bool {
        if ability_state.is_active && self.accessories.firewalls > 0 {
            self.accessories.firewalls -= 1;
            let new_integrity = self.health.system_integrity + 20;
            if new_integrity > 100 {
                self.health.system_integrity = 100;
            } else {
                self.health.system_integrity = new_integrity;
            }
            true
        } else {
            false
        }
    }

    fn use_vpn(ref self: CyberUnit, ref ability_state: AbilityState) -> bool {
        if ability_state.is_active && self.accessories.vpn_tokens > 0 {
            self.accessories.vpn_tokens -= 1;
            let new_stealth = self.stealth + 10;
            if new_stealth > 100 {
                self.stealth = 100;
            } else {
                self.stealth = new_stealth;
            }
            true
        } else {
            false
        }
    }

    fn encrypt_data(ref self: CyberUnit, ref ability_state: AbilityState) -> bool {
        if ability_state.is_active && self.accessories.encryption_keys > 0 {
            self.accessories.encryption_keys -= 1;
            let new_strength = self.encryption_strength + 10;
            if new_strength > 200 {
                self.encryption_strength = 200;
            } else {
                self.encryption_strength = new_strength;
            }
            true
        } else {
            false
        }
    }

    fn decrypt_data(ref self: CyberUnit, ref ability_state: AbilityState) -> bool {
        if ability_state.is_active && self.accessories.decryption_tools > 0 {
            self.accessories.decryption_tools -= 1;
            // Add decryption logic here
            true
        } else {
            false
        }
    }

    fn take_cyber_damage(ref self: CyberUnit, system_damage: u32, anti_virus_damage: u32, ref ability_state: AbilityState) {
        if ability_state.is_active {
            if system_damage >= self.health.system_integrity {
                self.health.system_integrity = 0;
                ability_state.is_active = false;  // Cyber unit is compromised
            } else {
                self.health.system_integrity -= system_damage;
            }

            if anti_virus_damage >= self.health.anti_virus_strength {
                self.health.anti_virus_strength = 0;
            } else {
                self.health.anti_virus_strength -= anti_virus_damage;
            }
        }
    }

    fn move_to(ref self: CyberUnit, new_position: Position, ref ability_state: AbilityState) -> bool {
        if ability_state.is_active {
            self.position = new_position;
            true
        } else {
            false
        }
    }

    fn calculate_hacking_success_chance(self: CyberUnit, target_encryption: u32) -> u8 {
        let base_chance: u8 = 50;
        
        // Calculate encryption difference bonus
        let encryption_diff: u8 = if self.encryption_strength > target_encryption {
            let diff = (self.encryption_strength - target_encryption) / 10;
            if diff > 40 {
                40
            } else {
                diff.try_into().unwrap()
            }
        } else {
            0
        };

        // Calculate stealth bonus
        let stealth_bonus: u8 = (self.stealth / 5).try_into().unwrap();

        // Calculate total chance
        let total_chance = base_chance + encryption_diff + stealth_bonus;

        // Ensure the result doesn't exceed 95
        if total_chance > 95 {
            95
        } else {
            total_chance
        }
    }

    fn can_hack(self: @CyberUnit, target_position: Position) -> bool {
        // Cyber units can hack globally, so we always return true
        true
    }

    fn consume_bandwidth(ref self: CyberUnit, amount: u32, ref ability_state: AbilityState) -> bool {
        if ability_state.is_active && self.bandwidth >= amount {
            self.bandwidth -= amount;
            true
        } else {
            if self.bandwidth < amount {
                ability_state.is_active = false;  // Cyber unit runs out of bandwidth and becomes inactive
            }
            false
        }
    }
}