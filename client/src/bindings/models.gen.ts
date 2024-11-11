import type { SchemaType } from "@dojoengine/sdk";

// Type definition for `command_nexus::models::units::unit_states::AbilityStateValue` struct
export interface AbilityStateValue {
	fieldOrder: string[];
	is_active: boolean;
	cooldown: number;
	effectiveness: number;
	unit: UnitType;
	units_abilities_state: UnitAbilities;
}

// Type definition for `command_nexus::models::units::unit_states::AbilityState` struct
export interface AbilityState {
	fieldOrder: string[];
	game_id: number;
	unit_id: number;
	player_id: number;
	is_active: boolean;
	cooldown: number;
	effectiveness: number;
	unit: UnitType;
	units_abilities_state: UnitAbilities;
}

// Type definition for `command_nexus::models::units::unit_states::UnitAbilities` struct
export interface UnitAbilities {
	fieldOrder: string[];
	move_level: number;
	attack_level: number;
	defend_level: number;
	patrol_level: number;
	stealth_level: number;
	recon_level: number;
	hack_level: number;
	repair_level: number;
	airlift_level: number;
	bombard_level: number;
	submerge_level: number;
}

// Type definition for `command_nexus::models::position::Position` struct
export interface Position {
	fieldOrder: string[];
	coord: Vec3;
}

// Type definition for `command_nexus::models::units::air::AirUnitHealth` struct
export interface AirUnitHealth {
	fieldOrder: string[];
	current: number;
	max: number;
}

// Type definition for `command_nexus::models::units::air::AirUnitValue` struct
export interface AirUnitValue {
	fieldOrder: string[];
	range: number;
	firepower: number;
	accuracy: number;
	energy: number;
	accessories: AirUnitAccessories;
	health: AirUnitHealth;
	position: Position;
	battlefield_name: BattlefieldName;
	altitude: number;
	max_speed: number;
}

// Type definition for `command_nexus::models::position::Vec3` struct
export interface Vec3 {
	fieldOrder: string[];
	x: number;
	y: number;
	z: number;
}

// Type definition for `command_nexus::models::units::air::AirUnit` struct
export interface AirUnit {
	fieldOrder: string[];
	game_id: number;
	unit_id: number;
	player_id: number;
	range: number;
	firepower: number;
	accuracy: number;
	energy: number;
	accessories: AirUnitAccessories;
	health: AirUnitHealth;
	position: Position;
	battlefield_name: BattlefieldName;
	altitude: number;
	max_speed: number;
}

// Type definition for `command_nexus::models::units::air::AirUnitAccessories` struct
export interface AirUnitAccessories {
	fieldOrder: string[];
	missiles: number;
	repair_kits: number;
}

// Type definition for `command_nexus::models::assets::transportation::AirportValue` struct
export interface AirportValue {
	fieldOrder: string[];
	airport_id: number;
	airport_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::Airport` struct
export interface Airport {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	airport_id: number;
	airport_name: number;
}

// Type definition for `command_nexus::models::units::armored::ArmoredAccessories` struct
export interface ArmoredAccessories {
	fieldOrder: string[];
	ammunition: number;
	repair_kits: number;
}

// Type definition for `command_nexus::models::units::armored::ArmoredValue` struct
export interface ArmoredValue {
	fieldOrder: string[];
	accuracy: number;
	firepower: number;
	range: number;
	energy: number;
	accessories: ArmoredAccessories;
	armored_health: ArmoredHealth;
	position: Position;
	battlefield_name: BattlefieldName;
}

// Type definition for `command_nexus::models::units::armored::ArmoredHealth` struct
export interface ArmoredHealth {
	fieldOrder: string[];
	current: number;
	max: number;
}

// Type definition for `command_nexus::models::position::Vec3` struct
export interface Vec3 {
	fieldOrder: string[];
	x: number;
	y: number;
	z: number;
}

// Type definition for `command_nexus::models::position::Position` struct
export interface Position {
	fieldOrder: string[];
	coord: Vec3;
}

// Type definition for `command_nexus::models::units::armored::Armored` struct
export interface Armored {
	fieldOrder: string[];
	game_id: number;
	unit_id: number;
	player_id: number;
	accuracy: number;
	firepower: number;
	range: number;
	energy: number;
	accessories: ArmoredAccessories;
	armored_health: ArmoredHealth;
	position: Position;
	battlefield_name: BattlefieldName;
}

// Type definition for `command_nexus::models::assets::millitary::ArmoryValue` struct
export interface ArmoryValue {
	fieldOrder: string[];
	armory_id: number;
	armory_name: number;
	weapon_inventory: number;
	ammo_inventory: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::millitary::Armory` struct
export interface Armory {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	armory_id: number;
	armory_name: number;
	weapon_inventory: number;
	ammo_inventory: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::financial::BankValue` struct
export interface BankValue {
	fieldOrder: string[];
	bank_id: number;
	bank_name: number;
	total_deposit: number;
	total_withdrawals: number;
	interest_rate: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::assets::financial::Bank` struct
export interface Bank {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	bank_id: number;
	bank_name: number;
	total_deposit: number;
	total_withdrawals: number;
	interest_rate: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::assets::millitary::Barracks` struct
export interface Barracks {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	barracks_id: number;
	barrack_name: number;
	capacity: number;
	current_soldiers: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::millitary::BarracksValue` struct
export interface BarracksValue {
	fieldOrder: string[];
	barracks_id: number;
	barrack_name: number;
	capacity: number;
	current_soldiers: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::communication::CableValue` struct
export interface CableValue {
	fieldOrder: string[];
	cable_id: number;
	cable_name: number;
	length: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::Cable` struct
export interface Cable {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	cable_id: number;
	cable_name: number;
	length: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::millitary::CommandCenterValue` struct
export interface CommandCenterValue {
	fieldOrder: string[];
	center_id: number;
	center_name: number;
	coordination_level: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::millitary::CommandCenter` struct
export interface CommandCenter {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	center_id: number;
	center_name: number;
	coordination_level: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::communication::Communication` struct
export interface Communication {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	cable: Cable;
	communication_tower: CommunicationTower;
	satellite_dish: SatelliteDish;
	relay_station: RelayStation;
	control_center: ControlCenter;
}

// Type definition for `command_nexus::models::assets::communication::CommunicationTower` struct
export interface CommunicationTower {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	tower_id: number;
	tower_name: number;
	height: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::ControlCenter` struct
export interface ControlCenter {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	center_id: number;
	center_name: number;
	location: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::RelayStation` struct
export interface RelayStation {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	station_id: number;
	station_name: number;
	capacity: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::Cable` struct
export interface Cable {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	cable_id: number;
	cable_name: number;
	length: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::CommunicationValue` struct
export interface CommunicationValue {
	fieldOrder: string[];
	cable: Cable;
	communication_tower: CommunicationTower;
	satellite_dish: SatelliteDish;
	relay_station: RelayStation;
	control_center: ControlCenter;
}

// Type definition for `command_nexus::models::assets::communication::SatelliteDish` struct
export interface SatelliteDish {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	dish_id: number;
	dish_name: number;
	diameter: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::CommunicationTowerValue` struct
export interface CommunicationTowerValue {
	fieldOrder: string[];
	tower_id: number;
	tower_name: number;
	height: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::CommunicationTower` struct
export interface CommunicationTower {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	tower_id: number;
	tower_name: number;
	height: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::ControlCenter` struct
export interface ControlCenter {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	center_id: number;
	center_name: number;
	location: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::ControlCenterValue` struct
export interface ControlCenterValue {
	fieldOrder: string[];
	center_id: number;
	center_name: number;
	location: number;
	status: number;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnitHealth` struct
export interface CyberUnitHealth {
	fieldOrder: string[];
	current: number;
	max: number;
}

// Type definition for `command_nexus::models::position::Position` struct
export interface Position {
	fieldOrder: string[];
	coord: Vec3;
}

// Type definition for `command_nexus::models::position::Vec3` struct
export interface Vec3 {
	fieldOrder: string[];
	x: number;
	y: number;
	z: number;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnitValue` struct
export interface CyberUnitValue {
	fieldOrder: string[];
	hacking_range: number;
	encryption_strength: number;
	stealth: number;
	range: number;
	accessories: CyberUnitAccessories;
	health: CyberUnitHealth;
	position: Position;
	battlefield_name: BattlefieldName;
	energy: number;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnit` struct
export interface CyberUnit {
	fieldOrder: string[];
	game_id: number;
	unit_id: number;
	player_id: number;
	hacking_range: number;
	encryption_strength: number;
	stealth: number;
	range: number;
	accessories: CyberUnitAccessories;
	health: CyberUnitHealth;
	position: Position;
	battlefield_name: BattlefieldName;
	energy: number;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnitAccessories` struct
export interface CyberUnitAccessories {
	fieldOrder: string[];
	malware: number;
	repair_kits: number;
}

// Type definition for `command_nexus::models::assets::transportation::DepotValue` struct
export interface DepotValue {
	fieldOrder: string[];
	depot_id: number;
	depot_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::Depot` struct
export interface Depot {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	depot_id: number;
	depot_name: number;
}

// Type definition for `command_nexus::models::game::HomeBasesTuple` struct
export interface HomeBasesTuple {
	fieldOrder: string[];
	base1: number;
	base2: number;
	base3: number;
	base4: number;
}

// Type definition for `command_nexus::models::game::Game` struct
export interface Game {
	fieldOrder: string[];
	game_id: number;
	next_to_move: string;
	minimum_moves: number;
	over: boolean;
	player_count: number;
	unit_count: number;
	nonce: number;
	price: number;
	clock: number;
	penalty: number;
	limit: number;
	winner: string;
	arena_host: string;
	seed: number;
	available_home_bases: HomeBasesTuple;
	player_name: number;
}

// Type definition for `command_nexus::models::game::GameValue` struct
export interface GameValue {
	fieldOrder: string[];
	next_to_move: string;
	minimum_moves: number;
	over: boolean;
	player_count: number;
	unit_count: number;
	nonce: number;
	price: number;
	clock: number;
	penalty: number;
	limit: number;
	winner: string;
	arena_host: string;
	seed: number;
	available_home_bases: HomeBasesTuple;
	player_name: number;
}

// Type definition for `command_nexus::models::assets::energy::GasStation` struct
export interface GasStation {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	station_id: number;
	station_name: number;
	fuel_available: number;
	fuel_price: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::energy::GasStationValue` struct
export interface GasStationValue {
	fieldOrder: string[];
	station_id: number;
	station_name: number;
	fuel_available: number;
	fuel_price: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::energy::GasStorage` struct
export interface GasStorage {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	storage_id: number;
	storage_name: number;
	capacity: number;
	current_storage: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::energy::GasStorageValue` struct
export interface GasStorageValue {
	fieldOrder: string[];
	storage_id: number;
	storage_name: number;
	capacity: number;
	current_storage: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::position::Vec3` struct
export interface Vec3 {
	fieldOrder: string[];
	x: number;
	y: number;
	z: number;
}

// Type definition for `command_nexus::models::units::infantry::InfantryValue` struct
export interface InfantryValue {
	fieldOrder: string[];
	range: number;
	energy: number;
	accuracy: number;
	accessories: InfantryAccessories;
	health: InfantryHealth;
	position: Position;
	battlefield_name: BattlefieldName;
}

// Type definition for `command_nexus::models::units::infantry::InfantryHealth` struct
export interface InfantryHealth {
	fieldOrder: string[];
	current: number;
	max: number;
}

// Type definition for `command_nexus::models::units::infantry::InfantryAccessories` struct
export interface InfantryAccessories {
	fieldOrder: string[];
	ammunition: number;
	first_aid_kit: number;
}

// Type definition for `command_nexus::models::position::Position` struct
export interface Position {
	fieldOrder: string[];
	coord: Vec3;
}

// Type definition for `command_nexus::models::units::infantry::Infantry` struct
export interface Infantry {
	fieldOrder: string[];
	game_id: number;
	unit_id: number;
	player_id: number;
	range: number;
	energy: number;
	accuracy: number;
	accessories: InfantryAccessories;
	health: InfantryHealth;
	position: Position;
	battlefield_name: BattlefieldName;
}

// Type definition for `command_nexus::models::assets::research::InnovationCenter` struct
export interface InnovationCenter {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	center_id: number;
	center_name: number;
	innovation_points: number;
	status: ResearchStatus;
}

// Type definition for `command_nexus::models::assets::research::InnovationCenterValue` struct
export interface InnovationCenterValue {
	fieldOrder: string[];
	center_id: number;
	center_name: number;
	innovation_points: number;
	status: ResearchStatus;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceAgencyValue` struct
export interface IntelligenceAgencyValue {
	fieldOrder: string[];
	agency_id: number;
	agency_name: number;
	agency_type: AgencyType;
	resource_allocation: number;
	status: AgencyStatus;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceAgency` struct
export interface IntelligenceAgency {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	agency_id: number;
	agency_name: number;
	agency_type: AgencyType;
	resource_allocation: number;
	status: AgencyStatus;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceReport` struct
export interface IntelligenceReport {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	report_id: number;
	source_agency_id: number;
	target_player_id: number;
	intelligence_data: number;
	reliability_score: number;
	timestamp: number;
	status: AgencyStatus;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceReportValue` struct
export interface IntelligenceReportValue {
	fieldOrder: string[];
	report_id: number;
	source_agency_id: number;
	target_player_id: number;
	intelligence_data: number;
	reliability_score: number;
	timestamp: number;
	status: AgencyStatus;
}

// Type definition for `command_nexus::models::assets::financial::InvestmentFirmValue` struct
export interface InvestmentFirmValue {
	fieldOrder: string[];
	firm_id: number;
	firm_name: number;
	assets_under_management: number;
	active_investments: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::assets::financial::InvestmentFirm` struct
export interface InvestmentFirm {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	firm_id: number;
	firm_name: number;
	assets_under_management: number;
	active_investments: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::assets::research::Laboratory` struct
export interface Laboratory {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	lab_id: number;
	lab_name: number;
	research_capacity: number;
	ongoing_projects: number;
	status: ResearchStatus;
}

// Type definition for `command_nexus::models::assets::research::LaboratoryValue` struct
export interface LaboratoryValue {
	fieldOrder: string[];
	lab_id: number;
	lab_name: number;
	research_capacity: number;
	ongoing_projects: number;
	status: ResearchStatus;
}

// Type definition for `command_nexus::models::assets::energy::NuclearPowerStation` struct
export interface NuclearPowerStation {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	station_id: number;
	station_name: number;
	power_output: number;
	fuel_level: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::energy::NuclearPowerStationValue` struct
export interface NuclearPowerStationValue {
	fieldOrder: string[];
	station_id: number;
	station_name: number;
	power_output: number;
	fuel_level: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::energy::OilDepot` struct
export interface OilDepot {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	depot_id: number;
	depot_name: number;
	capacity: number;
	current_storage: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::energy::OilDepotValue` struct
export interface OilDepotValue {
	fieldOrder: string[];
	depot_id: number;
	depot_name: number;
	capacity: number;
	current_storage: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::player::UnitsSupply` struct
export interface UnitsSupply {
	fieldOrder: string[];
	infantry: number;
	armored: number;
	air: number;
	naval: number;
	cyber: number;
}

// Type definition for `command_nexus::models::player::PlayerScore` struct
export interface PlayerScore {
	fieldOrder: string[];
	score: number;
	kills: number;
	deaths: number;
	assists: number;
}

// Type definition for `command_nexus::models::player::Player` struct
export interface Player {
	fieldOrder: string[];
	game_id: number;
	index: number;
	address: string;
	name: number;
	supply: UnitsSupply;
	last_action: number;
	rank: number;
	player_score: PlayerScore;
	home_base: BattlefieldName;
	commands_remaining: number;
	turn_start_time: number;
}

// Type definition for `command_nexus::models::player::PlayerValue` struct
export interface PlayerValue {
	fieldOrder: string[];
	address: string;
	name: number;
	supply: UnitsSupply;
	last_action: number;
	rank: number;
	player_score: PlayerScore;
	home_base: BattlefieldName;
	commands_remaining: number;
	turn_start_time: number;
}

// Type definition for `command_nexus::models::units::playerstate::PlayerState` struct
export interface PlayerState {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	supply: UnitsSupply;
}

// Type definition for `command_nexus::models::units::playerstate::PlayerStateValue` struct
export interface PlayerStateValue {
	fieldOrder: string[];
	supply: UnitsSupply;
}

// Type definition for `command_nexus::models::units::playerstate::UnitsSupply` struct
export interface UnitsSupply {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	infantry: number;
	armored: number;
	air: number;
	naval: number;
	cyber: number;
}

// Type definition for `command_nexus::models::assets::transportation::RailwayStation` struct
export interface RailwayStation {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	station_id: number;
	station_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::RailwayStationValue` struct
export interface RailwayStationValue {
	fieldOrder: string[];
	station_id: number;
	station_name: number;
}

// Type definition for `command_nexus::models::assets::communication::RelayStation` struct
export interface RelayStation {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	station_id: number;
	station_name: number;
	capacity: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::RelayStationValue` struct
export interface RelayStationValue {
	fieldOrder: string[];
	station_id: number;
	station_name: number;
	capacity: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::SatelliteDish` struct
export interface SatelliteDish {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	dish_id: number;
	dish_name: number;
	diameter: number;
	status: number;
}

// Type definition for `command_nexus::models::assets::communication::SatelliteDishValue` struct
export interface SatelliteDishValue {
	fieldOrder: string[];
	dish_id: number;
	dish_name: number;
	diameter: number;
	status: number;
}

// Type definition for `command_nexus::models::battlefield::Scoreboard` struct
export interface Scoreboard {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	player_count: number;
	top_score: number;
	last_updated: number;
}

// Type definition for `command_nexus::models::battlefield::ScoreboardValue` struct
export interface ScoreboardValue {
	fieldOrder: string[];
	player_count: number;
	top_score: number;
	last_updated: number;
}

// Type definition for `command_nexus::models::assets::transportation::Seaport` struct
export interface Seaport {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	seaport_id: number;
	seaport_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::SeaportValue` struct
export interface SeaportValue {
	fieldOrder: string[];
	seaport_id: number;
	seaport_name: number;
}

// Type definition for `command_nexus::models::position::Position` struct
export interface Position {
	fieldOrder: string[];
	coord: Vec3;
}

// Type definition for `command_nexus::models::units::naval::ShipHealth` struct
export interface ShipHealth {
	fieldOrder: string[];
	current: number;
	max: number;
}

// Type definition for `command_nexus::models::position::Vec3` struct
export interface Vec3 {
	fieldOrder: string[];
	x: number;
	y: number;
	z: number;
}

// Type definition for `command_nexus::models::units::naval::ShipValue` struct
export interface ShipValue {
	fieldOrder: string[];
	range: number;
	firepower: number;
	accuracy: number;
	ship_accessories: ShipAccessories;
	ship_health: ShipHealth;
	position: Position;
	battlefield_name: BattlefieldName;
	energy: number;
}

// Type definition for `command_nexus::models::units::naval::Ship` struct
export interface Ship {
	fieldOrder: string[];
	game_id: number;
	unit_id: number;
	player_id: number;
	range: number;
	firepower: number;
	accuracy: number;
	ship_accessories: ShipAccessories;
	ship_health: ShipHealth;
	position: Position;
	battlefield_name: BattlefieldName;
	energy: number;
}

// Type definition for `command_nexus::models::units::naval::ShipAccessories` struct
export interface ShipAccessories {
	fieldOrder: string[];
	gun_ammunition: number;
	missile_ammunition: number;
	repair_kits: number;
}

// Type definition for `command_nexus::models::assets::energy::SolarPowerPlantValue` struct
export interface SolarPowerPlantValue {
	fieldOrder: string[];
	plant_id: number;
	plant_name: number;
	power_output: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::energy::SolarPowerPlant` struct
export interface SolarPowerPlant {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	plant_id: number;
	plant_name: number;
	power_output: number;
	status: EnergyStatus;
}

// Type definition for `command_nexus::models::assets::intelligence::SpyNetwork` struct
export interface SpyNetwork {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	network_id: number;
	network_name: number;
	number_of_spies: number;
	intel_reliability: number;
	status: AgencyStatus;
}

// Type definition for `command_nexus::models::assets::intelligence::SpyNetworkValue` struct
export interface SpyNetworkValue {
	fieldOrder: string[];
	network_id: number;
	network_name: number;
	number_of_spies: number;
	intel_reliability: number;
	status: AgencyStatus;
}

// Type definition for `command_nexus::models::assets::financial::StockExchange` struct
export interface StockExchange {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	exchange_id: number;
	exchange_name: number;
	listed_companies: number;
	trading_volume: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::assets::financial::StockExchangeValue` struct
export interface StockExchangeValue {
	fieldOrder: string[];
	exchange_id: number;
	exchange_name: number;
	listed_companies: number;
	trading_volume: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::assets::research::TestingGroundValue` struct
export interface TestingGroundValue {
	fieldOrder: string[];
	ground_id: number;
	ground_name: number;
	test_capacity: number;
	ongiong_tests: number;
	status: ResearchStatus;
}

// Type definition for `command_nexus::models::assets::research::TestingGround` struct
export interface TestingGround {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	ground_id: number;
	ground_name: number;
	test_capacity: number;
	ongiong_tests: number;
	status: ResearchStatus;
}

// Type definition for `command_nexus::models::assets::millitary::TrainingFacility` struct
export interface TrainingFacility {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	facility_id: number;
	facility_name: number;
	training_capacity: number;
	current_training: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::millitary::TrainingFacilityValue` struct
export interface TrainingFacilityValue {
	fieldOrder: string[];
	facility_id: number;
	facility_name: number;
	training_capacity: number;
	current_training: number;
	status: MillitaryStatus;
}

// Type definition for `command_nexus::models::assets::transportation::Airport` struct
export interface Airport {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	airport_id: number;
	airport_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::TransportationValue` struct
export interface TransportationValue {
	fieldOrder: string[];
	airport: Airport;
	seaport: Seaport;
	railway_station: RailwayStation;
	depot: Depot;
}

// Type definition for `command_nexus::models::assets::transportation::RailwayStation` struct
export interface RailwayStation {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	station_id: number;
	station_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::Depot` struct
export interface Depot {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	depot_id: number;
	depot_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::Seaport` struct
export interface Seaport {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	seaport_id: number;
	seaport_name: number;
}

// Type definition for `command_nexus::models::assets::transportation::Transportation` struct
export interface Transportation {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	airport: Airport;
	seaport: Seaport;
	railway_station: RailwayStation;
	depot: Depot;
}

// Type definition for `command_nexus::models::assets::financial::TreasuryValue` struct
export interface TreasuryValue {
	fieldOrder: string[];
	treasury_id: number;
	treasury_name: number;
	funds_available: number;
	funds_reserved: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::assets::financial::Treasury` struct
export interface Treasury {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	treasury_id: number;
	treasury_name: number;
	funds_available: number;
	funds_reserved: number;
	status: FinancialStatus;
}

// Type definition for `command_nexus::models::units::unit_states::UnitStateValue` struct
export interface UnitStateValue {
	fieldOrder: string[];
	x: number;
	y: number;
	z: number;
	mode: UnitMode;
	environment: EnvironmentInfo;
}

// Type definition for `command_nexus::models::units::unit_states::UnitState` struct
export interface UnitState {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	unit_id: number;
	x: number;
	y: number;
	z: number;
	mode: UnitMode;
	environment: EnvironmentInfo;
}

// Type definition for `command_nexus::models::units::unit_states::EnvironmentInfo` struct
export interface EnvironmentInfo {
	fieldOrder: string[];
	terrain: TerrainType;
	cover_level: number;
	elevation: number;
}

// Type definition for `command_nexus::models::units::playerstate::UnitsSupply` struct
export interface UnitsSupply {
	fieldOrder: string[];
	game_id: number;
	player_id: number;
	infantry: number;
	armored: number;
	air: number;
	naval: number;
	cyber: number;
}

// Type definition for `command_nexus::models::units::playerstate::UnitsSupplyValue` struct
export interface UnitsSupplyValue {
	fieldOrder: string[];
	infantry: number;
	armored: number;
	air: number;
	naval: number;
	cyber: number;
}

// Type definition for `command_nexus::models::battlefield::UrbanBattlefield` struct
export interface UrbanBattlefield {
	fieldOrder: string[];
	game_id: number;
	battlefield_id: number;
	player_id: number;
	size: number;
	weather: WeatherEffect;
	control: number;
}

// Type definition for `command_nexus::models::battlefield::WeatherEffect` struct
export interface WeatherEffect {
	fieldOrder: string[];
	weather_condition: WeatherCondition;
	visibility: number;
	movement_penalty: number;
	comms_interference: number;
}

// Type definition for `command_nexus::models::battlefield::UrbanBattlefieldValue` struct
export interface UrbanBattlefieldValue {
	fieldOrder: string[];
	player_id: number;
	size: number;
	weather: WeatherEffect;
	control: number;
}

// Type definition for `command_nexus::models::player::UnitType` enum
export enum UnitType {
	None,
	Infantry,
	Armored,
	Air,
	Naval,
	Cyber,
}

// Type definition for `command_nexus::models::battlefield::BattlefieldName` enum
export enum BattlefieldName {
	None,
	RadiantShores,
	Ironforge,
	Skullcrag,
	NovaWarhound,
	SavageCoast,
}

// Type definition for `command_nexus::models::assets::millitary::MillitaryStatus` enum
export enum MillitaryStatus {
	Operational,
	UnderMaintenance,
	Dameged,
	Decommissioned,
}

// Type definition for `command_nexus::models::assets::financial::FinancialStatus` enum
export enum FinancialStatus {
	Operational,
	UnderMaintenance,
	Compromised,
	Closed,
}

// Type definition for `command_nexus::models::assets::energy::EnergyStatus` enum
export enum EnergyStatus {
	Active,
	UnderMaintenance,
	Dameged,
	offline,
}

// Type definition for `command_nexus::models::assets::research::ResearchStatus` enum
export enum ResearchStatus {
	Active,
	UnderDevelopment,
	Maintenance,
	Decommissioned,
}

// Type definition for `command_nexus::models::assets::intelligence::AgencyType` enum
export enum AgencyType {
	Domestic,
	Foreign,
	Cyber,
	CounterIntelligence,
}

// Type definition for `command_nexus::models::assets::intelligence::AgencyStatus` enum
export enum AgencyStatus {
	Active,
	UnderOperation,
	Suspended,
	Compromised,
}

// Type definition for `command_nexus::models::units::unit_states::TerrainType` enum
export enum TerrainType {
	UrbanStreet,
	UrbanBuilding,
	UrbanPark,
	Ocean,
}

// Type definition for `command_nexus::models::units::unit_states::UnitMode` enum
export enum UnitMode {
	Idle,
	Moving,
	Attacking,
	Defending,
	Patrolling,
	Stealthed,
	Reconning,
	Healing,
	Retreating,
	Repairing,
}

// Type definition for `command_nexus::models::battlefield::WeatherCondition` enum
export enum WeatherCondition {
	None,
	Clear,
	Rainy,
	Foggy,
	Stormy,
}

export interface CommandNexusSchemaType extends SchemaType {
	command_nexus: {
		AbilityStateValue: AbilityStateValue,
		AbilityState: AbilityState,
		UnitAbilities: UnitAbilities,
		Position: Position,
		AirUnitHealth: AirUnitHealth,
		AirUnitValue: AirUnitValue,
		Vec3: Vec3,
		AirUnit: AirUnit,
		AirUnitAccessories: AirUnitAccessories,
		AirportValue: AirportValue,
		Airport: Airport,
		ArmoredAccessories: ArmoredAccessories,
		ArmoredValue: ArmoredValue,
		ArmoredHealth: ArmoredHealth,
		Armored: Armored,
		ArmoryValue: ArmoryValue,
		Armory: Armory,
		BankValue: BankValue,
		Bank: Bank,
		Barracks: Barracks,
		BarracksValue: BarracksValue,
		CableValue: CableValue,
		Cable: Cable,
		CommandCenterValue: CommandCenterValue,
		CommandCenter: CommandCenter,
		Communication: Communication,
		CommunicationTower: CommunicationTower,
		ControlCenter: ControlCenter,
		RelayStation: RelayStation,
		CommunicationValue: CommunicationValue,
		SatelliteDish: SatelliteDish,
		CommunicationTowerValue: CommunicationTowerValue,
		ControlCenterValue: ControlCenterValue,
		CyberUnitHealth: CyberUnitHealth,
		CyberUnitValue: CyberUnitValue,
		CyberUnit: CyberUnit,
		CyberUnitAccessories: CyberUnitAccessories,
		DepotValue: DepotValue,
		Depot: Depot,
		HomeBasesTuple: HomeBasesTuple,
		Game: Game,
		GameValue: GameValue,
		GasStation: GasStation,
		GasStationValue: GasStationValue,
		GasStorage: GasStorage,
		GasStorageValue: GasStorageValue,
		InfantryValue: InfantryValue,
		InfantryHealth: InfantryHealth,
		InfantryAccessories: InfantryAccessories,
		Infantry: Infantry,
		InnovationCenter: InnovationCenter,
		InnovationCenterValue: InnovationCenterValue,
		IntelligenceAgencyValue: IntelligenceAgencyValue,
		IntelligenceAgency: IntelligenceAgency,
		IntelligenceReport: IntelligenceReport,
		IntelligenceReportValue: IntelligenceReportValue,
		InvestmentFirmValue: InvestmentFirmValue,
		InvestmentFirm: InvestmentFirm,
		Laboratory: Laboratory,
		LaboratoryValue: LaboratoryValue,
		NuclearPowerStation: NuclearPowerStation,
		NuclearPowerStationValue: NuclearPowerStationValue,
		OilDepot: OilDepot,
		OilDepotValue: OilDepotValue,
		UnitsSupply: UnitsSupply,
		PlayerScore: PlayerScore,
		Player: Player,
		PlayerValue: PlayerValue,
		PlayerState: PlayerState,
		PlayerStateValue: PlayerStateValue,
		RailwayStation: RailwayStation,
		RailwayStationValue: RailwayStationValue,
		RelayStationValue: RelayStationValue,
		SatelliteDishValue: SatelliteDishValue,
		Scoreboard: Scoreboard,
		ScoreboardValue: ScoreboardValue,
		Seaport: Seaport,
		SeaportValue: SeaportValue,
		ShipHealth: ShipHealth,
		ShipValue: ShipValue,
		Ship: Ship,
		ShipAccessories: ShipAccessories,
		SolarPowerPlantValue: SolarPowerPlantValue,
		SolarPowerPlant: SolarPowerPlant,
		SpyNetwork: SpyNetwork,
		SpyNetworkValue: SpyNetworkValue,
		StockExchange: StockExchange,
		StockExchangeValue: StockExchangeValue,
		TestingGroundValue: TestingGroundValue,
		TestingGround: TestingGround,
		TrainingFacility: TrainingFacility,
		TrainingFacilityValue: TrainingFacilityValue,
		TransportationValue: TransportationValue,
		Transportation: Transportation,
		TreasuryValue: TreasuryValue,
		Treasury: Treasury,
		UnitStateValue: UnitStateValue,
		UnitState: UnitState,
		EnvironmentInfo: EnvironmentInfo,
		UnitsSupplyValue: UnitsSupplyValue,
		UrbanBattlefield: UrbanBattlefield,
		WeatherEffect: WeatherEffect,
		UrbanBattlefieldValue: UrbanBattlefieldValue,
		ERC__Balance: ERC__Balance,
		ERC__Token: ERC__Token,
		ERC__Transfer: ERC__Transfer,
	},
}
export const schema: CommandNexusSchemaType = {
	command_nexus: {
		AbilityStateValue: {
			fieldOrder: ['is_active', 'cooldown', 'effectiveness', 'unit', 'units_abilities_state'],
			is_active: false,
			cooldown: 0,
			effectiveness: 0,
			unit: UnitType.None,
			units_abilities_state: { fieldOrder: ['move_level', 'attack_level', 'defend_level', 'patrol_level', 'stealth_level', 'recon_level', 'hack_level', 'repair_level', 'airlift_level', 'bombard_level', 'submerge_level'], move_level: 0, attack_level: 0, defend_level: 0, patrol_level: 0, stealth_level: 0, recon_level: 0, hack_level: 0, repair_level: 0, airlift_level: 0, bombard_level: 0, submerge_level: 0, },
		},
		AbilityState: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'is_active', 'cooldown', 'effectiveness', 'unit', 'units_abilities_state'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
			is_active: false,
			cooldown: 0,
			effectiveness: 0,
			unit: UnitType.None,
			units_abilities_state: { fieldOrder: ['move_level', 'attack_level', 'defend_level', 'patrol_level', 'stealth_level', 'recon_level', 'hack_level', 'repair_level', 'airlift_level', 'bombard_level', 'submerge_level'], move_level: 0, attack_level: 0, defend_level: 0, patrol_level: 0, stealth_level: 0, recon_level: 0, hack_level: 0, repair_level: 0, airlift_level: 0, bombard_level: 0, submerge_level: 0, },
		},
		UnitAbilities: {
			fieldOrder: ['move_level', 'attack_level', 'defend_level', 'patrol_level', 'stealth_level', 'recon_level', 'hack_level', 'repair_level', 'airlift_level', 'bombard_level', 'submerge_level'],
			move_level: 0,
			attack_level: 0,
			defend_level: 0,
			patrol_level: 0,
			stealth_level: 0,
			recon_level: 0,
			hack_level: 0,
			repair_level: 0,
			airlift_level: 0,
			bombard_level: 0,
			submerge_level: 0,
		},
		Position: {
			fieldOrder: ['coord'],
			coord: { fieldOrder: ['x', 'y', 'z'], x: 0, y: 0, z: 0, },
		},
		AirUnitHealth: {
			fieldOrder: ['current', 'max'],
			current: 0,
			max: 0,
		},
		AirUnitValue: {
			fieldOrder: ['range', 'firepower', 'accuracy', 'energy', 'accessories', 'health', 'position', 'battlefield_name', 'altitude', 'max_speed'],
			range: 0,
			firepower: 0,
			accuracy: 0,
			energy: 0,
			accessories: { fieldOrder: ['missiles', 'repair_kits'], missiles: 0, repair_kits: 0, },
			health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
			altitude: 0,
			max_speed: 0,
		},
		Vec3: {
			fieldOrder: ['x', 'y', 'z'],
			x: 0,
			y: 0,
			z: 0,
		},
		AirUnit: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'range', 'firepower', 'accuracy', 'energy', 'accessories', 'health', 'position', 'battlefield_name', 'altitude', 'max_speed'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
			range: 0,
			firepower: 0,
			accuracy: 0,
			energy: 0,
			accessories: { fieldOrder: ['missiles', 'repair_kits'], missiles: 0, repair_kits: 0, },
			health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
			altitude: 0,
			max_speed: 0,
		},
		AirUnitAccessories: {
			fieldOrder: ['missiles', 'repair_kits'],
			missiles: 0,
			repair_kits: 0,
		},
		AirportValue: {
			fieldOrder: ['airport_id', 'airport_name'],
			airport_id: 0,
			airport_name: 0,
		},
		Airport: {
			fieldOrder: ['game_id', 'player_id', 'airport_id', 'airport_name'],
			game_id: 0,
			player_id: 0,
			airport_id: 0,
			airport_name: 0,
		},
		ArmoredAccessories: {
			fieldOrder: ['ammunition', 'repair_kits'],
			ammunition: 0,
			repair_kits: 0,
		},
		ArmoredValue: {
			fieldOrder: ['accuracy', 'firepower', 'range', 'energy', 'accessories', 'armored_health', 'position', 'battlefield_name'],
			accuracy: 0,
			firepower: 0,
			range: 0,
			energy: 0,
			accessories: { fieldOrder: ['ammunition', 'repair_kits'], ammunition: 0, repair_kits: 0, },
			armored_health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
		},
		ArmoredHealth: {
			fieldOrder: ['current', 'max'],
			current: 0,
			max: 0,
		},
		Armored: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'accuracy', 'firepower', 'range', 'energy', 'accessories', 'armored_health', 'position', 'battlefield_name'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
			accuracy: 0,
			firepower: 0,
			range: 0,
			energy: 0,
			accessories: { fieldOrder: ['ammunition', 'repair_kits'], ammunition: 0, repair_kits: 0, },
			armored_health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
		},
		ArmoryValue: {
			fieldOrder: ['armory_id', 'armory_name', 'weapon_inventory', 'ammo_inventory', 'status'],
			armory_id: 0,
			armory_name: 0,
			weapon_inventory: 0,
			ammo_inventory: 0,
			status: MillitaryStatus.Operational,
		},
		Armory: {
			fieldOrder: ['game_id', 'player_id', 'armory_id', 'armory_name', 'weapon_inventory', 'ammo_inventory', 'status'],
			game_id: 0,
			player_id: 0,
			armory_id: 0,
			armory_name: 0,
			weapon_inventory: 0,
			ammo_inventory: 0,
			status: MillitaryStatus.Operational,
		},
		BankValue: {
			fieldOrder: ['bank_id', 'bank_name', 'total_deposit', 'total_withdrawals', 'interest_rate', 'status'],
			bank_id: 0,
			bank_name: 0,
			total_deposit: 0,
			total_withdrawals: 0,
			interest_rate: 0,
			status: FinancialStatus.Operational,
		},
		Bank: {
			fieldOrder: ['game_id', 'player_id', 'bank_id', 'bank_name', 'total_deposit', 'total_withdrawals', 'interest_rate', 'status'],
			game_id: 0,
			player_id: 0,
			bank_id: 0,
			bank_name: 0,
			total_deposit: 0,
			total_withdrawals: 0,
			interest_rate: 0,
			status: FinancialStatus.Operational,
		},
		Barracks: {
			fieldOrder: ['game_id', 'player_id', 'barracks_id', 'barrack_name', 'capacity', 'current_soldiers', 'status'],
			game_id: 0,
			player_id: 0,
			barracks_id: 0,
			barrack_name: 0,
			capacity: 0,
			current_soldiers: 0,
			status: MillitaryStatus.Operational,
		},
		BarracksValue: {
			fieldOrder: ['barracks_id', 'barrack_name', 'capacity', 'current_soldiers', 'status'],
			barracks_id: 0,
			barrack_name: 0,
			capacity: 0,
			current_soldiers: 0,
			status: MillitaryStatus.Operational,
		},
		CableValue: {
			fieldOrder: ['cable_id', 'cable_name', 'length', 'status'],
			cable_id: 0,
			cable_name: 0,
			length: 0,
			status: 0,
		},
		Cable: {
			fieldOrder: ['game_id', 'player_id', 'cable_id', 'cable_name', 'length', 'status'],
			game_id: 0,
			player_id: 0,
			cable_id: 0,
			cable_name: 0,
			length: 0,
			status: 0,
		},
		CommandCenterValue: {
			fieldOrder: ['center_id', 'center_name', 'coordination_level', 'status'],
			center_id: 0,
			center_name: 0,
			coordination_level: 0,
			status: MillitaryStatus.Operational,
		},
		CommandCenter: {
			fieldOrder: ['game_id', 'player_id', 'center_id', 'center_name', 'coordination_level', 'status'],
			game_id: 0,
			player_id: 0,
			center_id: 0,
			center_name: 0,
			coordination_level: 0,
			status: MillitaryStatus.Operational,
		},
		Communication: {
			fieldOrder: ['game_id', 'player_id', 'cable', 'communication_tower', 'satellite_dish', 'relay_station', 'control_center'],
			game_id: 0,
			player_id: 0,
			cable: { fieldOrder: ['game_id', 'player_id', 'cable_id', 'cable_name', 'length', 'status'], game_id: 0, player_id: 0, cable_id: 0, cable_name: 0, length: 0, status: 0, },
			communication_tower: { fieldOrder: ['game_id', 'player_id', 'tower_id', 'tower_name', 'height', 'status'], game_id: 0, player_id: 0, tower_id: 0, tower_name: 0, height: 0, status: 0, },
			satellite_dish: { fieldOrder: ['game_id', 'player_id', 'dish_id', 'dish_name', 'diameter', 'status'], game_id: 0, player_id: 0, dish_id: 0, dish_name: 0, diameter: 0, status: 0, },
			relay_station: { fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name', 'capacity', 'status'], game_id: 0, player_id: 0, station_id: 0, station_name: 0, capacity: 0, status: 0, },
			control_center: { fieldOrder: ['game_id', 'player_id', 'center_id', 'center_name', 'location', 'status'], game_id: 0, player_id: 0, center_id: 0, center_name: 0, location: 0, status: 0, },
		},
		CommunicationTower: {
			fieldOrder: ['game_id', 'player_id', 'tower_id', 'tower_name', 'height', 'status'],
			game_id: 0,
			player_id: 0,
			tower_id: 0,
			tower_name: 0,
			height: 0,
			status: 0,
		},
		ControlCenter: {
			fieldOrder: ['game_id', 'player_id', 'center_id', 'center_name', 'location', 'status'],
			game_id: 0,
			player_id: 0,
			center_id: 0,
			center_name: 0,
			location: 0,
			status: 0,
		},
		RelayStation: {
			fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name', 'capacity', 'status'],
			game_id: 0,
			player_id: 0,
			station_id: 0,
			station_name: 0,
			capacity: 0,
			status: 0,
		},
		CommunicationValue: {
			fieldOrder: ['cable', 'communication_tower', 'satellite_dish', 'relay_station', 'control_center'],
			cable: { fieldOrder: ['game_id', 'player_id', 'cable_id', 'cable_name', 'length', 'status'], game_id: 0, player_id: 0, cable_id: 0, cable_name: 0, length: 0, status: 0, },
			communication_tower: { fieldOrder: ['game_id', 'player_id', 'tower_id', 'tower_name', 'height', 'status'], game_id: 0, player_id: 0, tower_id: 0, tower_name: 0, height: 0, status: 0, },
			satellite_dish: { fieldOrder: ['game_id', 'player_id', 'dish_id', 'dish_name', 'diameter', 'status'], game_id: 0, player_id: 0, dish_id: 0, dish_name: 0, diameter: 0, status: 0, },
			relay_station: { fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name', 'capacity', 'status'], game_id: 0, player_id: 0, station_id: 0, station_name: 0, capacity: 0, status: 0, },
			control_center: { fieldOrder: ['game_id', 'player_id', 'center_id', 'center_name', 'location', 'status'], game_id: 0, player_id: 0, center_id: 0, center_name: 0, location: 0, status: 0, },
		},
		SatelliteDish: {
			fieldOrder: ['game_id', 'player_id', 'dish_id', 'dish_name', 'diameter', 'status'],
			game_id: 0,
			player_id: 0,
			dish_id: 0,
			dish_name: 0,
			diameter: 0,
			status: 0,
		},
		CommunicationTowerValue: {
			fieldOrder: ['tower_id', 'tower_name', 'height', 'status'],
			tower_id: 0,
			tower_name: 0,
			height: 0,
			status: 0,
		},
		ControlCenterValue: {
			fieldOrder: ['center_id', 'center_name', 'location', 'status'],
			center_id: 0,
			center_name: 0,
			location: 0,
			status: 0,
		},
		CyberUnitHealth: {
			fieldOrder: ['current', 'max'],
			current: 0,
			max: 0,
		},
		CyberUnitValue: {
			fieldOrder: ['hacking_range', 'encryption_strength', 'stealth', 'range', 'accessories', 'health', 'position', 'battlefield_name', 'energy'],
			hacking_range: 0,
			encryption_strength: 0,
			stealth: 0,
			range: 0,
			accessories: { fieldOrder: ['malware', 'repair_kits'], malware: 0, repair_kits: 0, },
			health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
			energy: 0,
		},
		CyberUnit: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'hacking_range', 'encryption_strength', 'stealth', 'range', 'accessories', 'health', 'position', 'battlefield_name', 'energy'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
			hacking_range: 0,
			encryption_strength: 0,
			stealth: 0,
			range: 0,
			accessories: { fieldOrder: ['malware', 'repair_kits'], malware: 0, repair_kits: 0, },
			health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
			energy: 0,
		},
		CyberUnitAccessories: {
			fieldOrder: ['malware', 'repair_kits'],
			malware: 0,
			repair_kits: 0,
		},
		DepotValue: {
			fieldOrder: ['depot_id', 'depot_name'],
			depot_id: 0,
			depot_name: 0,
		},
		Depot: {
			fieldOrder: ['game_id', 'player_id', 'depot_id', 'depot_name'],
			game_id: 0,
			player_id: 0,
			depot_id: 0,
			depot_name: 0,
		},
		HomeBasesTuple: {
			fieldOrder: ['base1', 'base2', 'base3', 'base4'],
			base1: 0,
			base2: 0,
			base3: 0,
			base4: 0,
		},
		Game: {
			fieldOrder: ['game_id', 'next_to_move', 'minimum_moves', 'over', 'player_count', 'unit_count', 'nonce', 'price', 'clock', 'penalty', 'limit', 'winner', 'arena_host', 'seed', 'available_home_bases', 'player_name'],
			game_id: 0,
			next_to_move: "",
			minimum_moves: 0,
			over: false,
			player_count: 0,
			unit_count: 0,
			nonce: 0,
			price: 0,
			clock: 0,
			penalty: 0,
			limit: 0,
			winner: "",
			arena_host: "",
			seed: 0,
			available_home_bases: { fieldOrder: ['base1', 'base2', 'base3', 'base4'], base1: 0, base2: 0, base3: 0, base4: 0, },
			player_name: 0,
		},
		GameValue: {
			fieldOrder: ['next_to_move', 'minimum_moves', 'over', 'player_count', 'unit_count', 'nonce', 'price', 'clock', 'penalty', 'limit', 'winner', 'arena_host', 'seed', 'available_home_bases', 'player_name'],
			next_to_move: "",
			minimum_moves: 0,
			over: false,
			player_count: 0,
			unit_count: 0,
			nonce: 0,
			price: 0,
			clock: 0,
			penalty: 0,
			limit: 0,
			winner: "",
			arena_host: "",
			seed: 0,
			available_home_bases: { fieldOrder: ['base1', 'base2', 'base3', 'base4'], base1: 0, base2: 0, base3: 0, base4: 0, },
			player_name: 0,
		},
		GasStation: {
			fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name', 'fuel_available', 'fuel_price', 'status'],
			game_id: 0,
			player_id: 0,
			station_id: 0,
			station_name: 0,
			fuel_available: 0,
			fuel_price: 0,
			status: EnergyStatus.Active,
		},
		GasStationValue: {
			fieldOrder: ['station_id', 'station_name', 'fuel_available', 'fuel_price', 'status'],
			station_id: 0,
			station_name: 0,
			fuel_available: 0,
			fuel_price: 0,
			status: EnergyStatus.Active,
		},
		GasStorage: {
			fieldOrder: ['game_id', 'player_id', 'storage_id', 'storage_name', 'capacity', 'current_storage', 'status'],
			game_id: 0,
			player_id: 0,
			storage_id: 0,
			storage_name: 0,
			capacity: 0,
			current_storage: 0,
			status: EnergyStatus.Active,
		},
		GasStorageValue: {
			fieldOrder: ['storage_id', 'storage_name', 'capacity', 'current_storage', 'status'],
			storage_id: 0,
			storage_name: 0,
			capacity: 0,
			current_storage: 0,
			status: EnergyStatus.Active,
		},
		InfantryValue: {
			fieldOrder: ['range', 'energy', 'accuracy', 'accessories', 'health', 'position', 'battlefield_name'],
			range: 0,
			energy: 0,
			accuracy: 0,
			accessories: { fieldOrder: ['ammunition', 'first_aid_kit'], ammunition: 0, first_aid_kit: 0, },
			health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
		},
		InfantryHealth: {
			fieldOrder: ['current', 'max'],
			current: 0,
			max: 0,
		},
		InfantryAccessories: {
			fieldOrder: ['ammunition', 'first_aid_kit'],
			ammunition: 0,
			first_aid_kit: 0,
		},
		Infantry: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'range', 'energy', 'accuracy', 'accessories', 'health', 'position', 'battlefield_name'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
			range: 0,
			energy: 0,
			accuracy: 0,
			accessories: { fieldOrder: ['ammunition', 'first_aid_kit'], ammunition: 0, first_aid_kit: 0, },
			health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
		},
		InnovationCenter: {
			fieldOrder: ['game_id', 'player_id', 'center_id', 'center_name', 'innovation_points', 'status'],
			game_id: 0,
			player_id: 0,
			center_id: 0,
			center_name: 0,
			innovation_points: 0,
			status: ResearchStatus.Active,
		},
		InnovationCenterValue: {
			fieldOrder: ['center_id', 'center_name', 'innovation_points', 'status'],
			center_id: 0,
			center_name: 0,
			innovation_points: 0,
			status: ResearchStatus.Active,
		},
		IntelligenceAgencyValue: {
			fieldOrder: ['agency_id', 'agency_name', 'agency_type', 'resource_allocation', 'status'],
			agency_id: 0,
			agency_name: 0,
			agency_type: AgencyType.Domestic,
			resource_allocation: 0,
			status: AgencyStatus.Active,
		},
		IntelligenceAgency: {
			fieldOrder: ['game_id', 'player_id', 'agency_id', 'agency_name', 'agency_type', 'resource_allocation', 'status'],
			game_id: 0,
			player_id: 0,
			agency_id: 0,
			agency_name: 0,
			agency_type: AgencyType.Domestic,
			resource_allocation: 0,
			status: AgencyStatus.Active,
		},
		IntelligenceReport: {
			fieldOrder: ['game_id', 'player_id', 'report_id', 'source_agency_id', 'target_player_id', 'intelligence_data', 'reliability_score', 'timestamp', 'status'],
			game_id: 0,
			player_id: 0,
			report_id: 0,
			source_agency_id: 0,
			target_player_id: 0,
			intelligence_data: 0,
			reliability_score: 0,
			timestamp: 0,
			status: AgencyStatus.Active,
		},
		IntelligenceReportValue: {
			fieldOrder: ['report_id', 'source_agency_id', 'target_player_id', 'intelligence_data', 'reliability_score', 'timestamp', 'status'],
			report_id: 0,
			source_agency_id: 0,
			target_player_id: 0,
			intelligence_data: 0,
			reliability_score: 0,
			timestamp: 0,
			status: AgencyStatus.Active,
		},
		InvestmentFirmValue: {
			fieldOrder: ['firm_id', 'firm_name', 'assets_under_management', 'active_investments', 'status'],
			firm_id: 0,
			firm_name: 0,
			assets_under_management: 0,
			active_investments: 0,
			status: FinancialStatus.Operational,
		},
		InvestmentFirm: {
			fieldOrder: ['game_id', 'player_id', 'firm_id', 'firm_name', 'assets_under_management', 'active_investments', 'status'],
			game_id: 0,
			player_id: 0,
			firm_id: 0,
			firm_name: 0,
			assets_under_management: 0,
			active_investments: 0,
			status: FinancialStatus.Operational,
		},
		Laboratory: {
			fieldOrder: ['game_id', 'player_id', 'lab_id', 'lab_name', 'research_capacity', 'ongoing_projects', 'status'],
			game_id: 0,
			player_id: 0,
			lab_id: 0,
			lab_name: 0,
			research_capacity: 0,
			ongoing_projects: 0,
			status: ResearchStatus.Active,
		},
		LaboratoryValue: {
			fieldOrder: ['lab_id', 'lab_name', 'research_capacity', 'ongoing_projects', 'status'],
			lab_id: 0,
			lab_name: 0,
			research_capacity: 0,
			ongoing_projects: 0,
			status: ResearchStatus.Active,
		},
		NuclearPowerStation: {
			fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name', 'power_output', 'fuel_level', 'status'],
			game_id: 0,
			player_id: 0,
			station_id: 0,
			station_name: 0,
			power_output: 0,
			fuel_level: 0,
			status: EnergyStatus.Active,
		},
		NuclearPowerStationValue: {
			fieldOrder: ['station_id', 'station_name', 'power_output', 'fuel_level', 'status'],
			station_id: 0,
			station_name: 0,
			power_output: 0,
			fuel_level: 0,
			status: EnergyStatus.Active,
		},
		OilDepot: {
			fieldOrder: ['game_id', 'player_id', 'depot_id', 'depot_name', 'capacity', 'current_storage', 'status'],
			game_id: 0,
			player_id: 0,
			depot_id: 0,
			depot_name: 0,
			capacity: 0,
			current_storage: 0,
			status: EnergyStatus.Active,
		},
		OilDepotValue: {
			fieldOrder: ['depot_id', 'depot_name', 'capacity', 'current_storage', 'status'],
			depot_id: 0,
			depot_name: 0,
			capacity: 0,
			current_storage: 0,
			status: EnergyStatus.Active,
		},
		UnitsSupply: {
			fieldOrder: ['infantry', 'armored', 'air', 'naval', 'cyber'],
			infantry: 0,
			armored: 0,
			air: 0,
			naval: 0,
			cyber: 0,
		},
		PlayerScore: {
			fieldOrder: ['score', 'kills', 'deaths', 'assists'],
			score: 0,
			kills: 0,
			deaths: 0,
			assists: 0,
		},
		Player: {
			fieldOrder: ['game_id', 'index', 'address', 'name', 'supply', 'last_action', 'rank', 'player_score', 'home_base', 'commands_remaining', 'turn_start_time'],
			game_id: 0,
			index: 0,
			address: "",
			name: 0,
			supply: { fieldOrder: ['infantry', 'armored', 'air', 'naval', 'cyber'], infantry: 0, armored: 0, air: 0, naval: 0, cyber: 0, },
			last_action: 0,
			rank: 0,
			player_score: { fieldOrder: ['score', 'kills', 'deaths', 'assists'], score: 0, kills: 0, deaths: 0, assists: 0, },
			home_base: BattlefieldName.None,
			commands_remaining: 0,
			turn_start_time: 0,
		},
		PlayerValue: {
			fieldOrder: ['address', 'name', 'supply', 'last_action', 'rank', 'player_score', 'home_base', 'commands_remaining', 'turn_start_time'],
			address: "",
			name: 0,
			supply: { fieldOrder: ['infantry', 'armored', 'air', 'naval', 'cyber'], infantry: 0, armored: 0, air: 0, naval: 0, cyber: 0, },
			last_action: 0,
			rank: 0,
			player_score: { fieldOrder: ['score', 'kills', 'deaths', 'assists'], score: 0, kills: 0, deaths: 0, assists: 0, },
			home_base: BattlefieldName.None,
			commands_remaining: 0,
			turn_start_time: 0,
		},
		PlayerState: {
			fieldOrder: ['game_id', 'player_id', 'supply'],
			game_id: 0,
			player_id: 0,
			supply: { fieldOrder: ['game_id', 'player_id', 'infantry', 'armored', 'air', 'naval', 'cyber'], game_id: 0, player_id: 0, infantry: 0, armored: 0, air: 0, naval: 0, cyber: 0, },
		},
		PlayerStateValue: {
			fieldOrder: ['supply'],
			supply: { fieldOrder: ['game_id', 'player_id', 'infantry', 'armored', 'air', 'naval', 'cyber'], game_id: 0, player_id: 0, infantry: 0, armored: 0, air: 0, naval: 0, cyber: 0, },
		},
		UnitsSupply: {
			fieldOrder: ['game_id', 'player_id', 'infantry', 'armored', 'air', 'naval', 'cyber'],
			game_id: 0,
			player_id: 0,
			infantry: 0,
			armored: 0,
			air: 0,
			naval: 0,
			cyber: 0,
		},
		RailwayStation: {
			fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name'],
			game_id: 0,
			player_id: 0,
			station_id: 0,
			station_name: 0,
		},
		RailwayStationValue: {
			fieldOrder: ['station_id', 'station_name'],
			station_id: 0,
			station_name: 0,
		},
		RelayStationValue: {
			fieldOrder: ['station_id', 'station_name', 'capacity', 'status'],
			station_id: 0,
			station_name: 0,
			capacity: 0,
			status: 0,
		},
		SatelliteDishValue: {
			fieldOrder: ['dish_id', 'dish_name', 'diameter', 'status'],
			dish_id: 0,
			dish_name: 0,
			diameter: 0,
			status: 0,
		},
		Scoreboard: {
			fieldOrder: ['game_id', 'player_id', 'player_count', 'top_score', 'last_updated'],
			game_id: 0,
			player_id: 0,
			player_count: 0,
			top_score: 0,
			last_updated: 0,
		},
		ScoreboardValue: {
			fieldOrder: ['player_count', 'top_score', 'last_updated'],
			player_count: 0,
			top_score: 0,
			last_updated: 0,
		},
		Seaport: {
			fieldOrder: ['game_id', 'player_id', 'seaport_id', 'seaport_name'],
			game_id: 0,
			player_id: 0,
			seaport_id: 0,
			seaport_name: 0,
		},
		SeaportValue: {
			fieldOrder: ['seaport_id', 'seaport_name'],
			seaport_id: 0,
			seaport_name: 0,
		},
		ShipHealth: {
			fieldOrder: ['current', 'max'],
			current: 0,
			max: 0,
		},
		ShipValue: {
			fieldOrder: ['range', 'firepower', 'accuracy', 'ship_accessories', 'ship_health', 'position', 'battlefield_name', 'energy'],
			range: 0,
			firepower: 0,
			accuracy: 0,
			ship_accessories: { fieldOrder: ['gun_ammunition', 'missile_ammunition', 'repair_kits'], gun_ammunition: 0, missile_ammunition: 0, repair_kits: 0, },
			ship_health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
			energy: 0,
		},
		Ship: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'range', 'firepower', 'accuracy', 'ship_accessories', 'ship_health', 'position', 'battlefield_name', 'energy'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
			range: 0,
			firepower: 0,
			accuracy: 0,
			ship_accessories: { fieldOrder: ['gun_ammunition', 'missile_ammunition', 'repair_kits'], gun_ammunition: 0, missile_ammunition: 0, repair_kits: 0, },
			ship_health: { fieldOrder: ['current', 'max'], current: 0, max: 0, },
			position: { fieldOrder: ['coord'], coord: Vec3, },
			battlefield_name: BattlefieldName.None,
			energy: 0,
		},
		ShipAccessories: {
			fieldOrder: ['gun_ammunition', 'missile_ammunition', 'repair_kits'],
			gun_ammunition: 0,
			missile_ammunition: 0,
			repair_kits: 0,
		},
		SolarPowerPlantValue: {
			fieldOrder: ['plant_id', 'plant_name', 'power_output', 'status'],
			plant_id: 0,
			plant_name: 0,
			power_output: 0,
			status: EnergyStatus.Active,
		},
		SolarPowerPlant: {
			fieldOrder: ['game_id', 'player_id', 'plant_id', 'plant_name', 'power_output', 'status'],
			game_id: 0,
			player_id: 0,
			plant_id: 0,
			plant_name: 0,
			power_output: 0,
			status: EnergyStatus.Active,
		},
		SpyNetwork: {
			fieldOrder: ['game_id', 'player_id', 'network_id', 'network_name', 'number_of_spies', 'intel_reliability', 'status'],
			game_id: 0,
			player_id: 0,
			network_id: 0,
			network_name: 0,
			number_of_spies: 0,
			intel_reliability: 0,
			status: AgencyStatus.Active,
		},
		SpyNetworkValue: {
			fieldOrder: ['network_id', 'network_name', 'number_of_spies', 'intel_reliability', 'status'],
			network_id: 0,
			network_name: 0,
			number_of_spies: 0,
			intel_reliability: 0,
			status: AgencyStatus.Active,
		},
		StockExchange: {
			fieldOrder: ['game_id', 'player_id', 'exchange_id', 'exchange_name', 'listed_companies', 'trading_volume', 'status'],
			game_id: 0,
			player_id: 0,
			exchange_id: 0,
			exchange_name: 0,
			listed_companies: 0,
			trading_volume: 0,
			status: FinancialStatus.Operational,
		},
		StockExchangeValue: {
			fieldOrder: ['exchange_id', 'exchange_name', 'listed_companies', 'trading_volume', 'status'],
			exchange_id: 0,
			exchange_name: 0,
			listed_companies: 0,
			trading_volume: 0,
			status: FinancialStatus.Operational,
		},
		TestingGroundValue: {
			fieldOrder: ['ground_id', 'ground_name', 'test_capacity', 'ongiong_tests', 'status'],
			ground_id: 0,
			ground_name: 0,
			test_capacity: 0,
			ongiong_tests: 0,
			status: ResearchStatus.Active,
		},
		TestingGround: {
			fieldOrder: ['game_id', 'player_id', 'ground_id', 'ground_name', 'test_capacity', 'ongiong_tests', 'status'],
			game_id: 0,
			player_id: 0,
			ground_id: 0,
			ground_name: 0,
			test_capacity: 0,
			ongiong_tests: 0,
			status: ResearchStatus.Active,
		},
		TrainingFacility: {
			fieldOrder: ['game_id', 'player_id', 'facility_id', 'facility_name', 'training_capacity', 'current_training', 'status'],
			game_id: 0,
			player_id: 0,
			facility_id: 0,
			facility_name: 0,
			training_capacity: 0,
			current_training: 0,
			status: MillitaryStatus.Operational,
		},
		TrainingFacilityValue: {
			fieldOrder: ['facility_id', 'facility_name', 'training_capacity', 'current_training', 'status'],
			facility_id: 0,
			facility_name: 0,
			training_capacity: 0,
			current_training: 0,
			status: MillitaryStatus.Operational,
		},
		TransportationValue: {
			fieldOrder: ['airport', 'seaport', 'railway_station', 'depot'],
			airport: { fieldOrder: ['game_id', 'player_id', 'airport_id', 'airport_name'], game_id: 0, player_id: 0, airport_id: 0, airport_name: 0, },
			seaport: { fieldOrder: ['game_id', 'player_id', 'seaport_id', 'seaport_name'], game_id: 0, player_id: 0, seaport_id: 0, seaport_name: 0, },
			railway_station: { fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name'], game_id: 0, player_id: 0, station_id: 0, station_name: 0, },
			depot: { fieldOrder: ['game_id', 'player_id', 'depot_id', 'depot_name'], game_id: 0, player_id: 0, depot_id: 0, depot_name: 0, },
		},
		Transportation: {
			fieldOrder: ['game_id', 'player_id', 'airport', 'seaport', 'railway_station', 'depot'],
			game_id: 0,
			player_id: 0,
			airport: { fieldOrder: ['game_id', 'player_id', 'airport_id', 'airport_name'], game_id: 0, player_id: 0, airport_id: 0, airport_name: 0, },
			seaport: { fieldOrder: ['game_id', 'player_id', 'seaport_id', 'seaport_name'], game_id: 0, player_id: 0, seaport_id: 0, seaport_name: 0, },
			railway_station: { fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name'], game_id: 0, player_id: 0, station_id: 0, station_name: 0, },
			depot: { fieldOrder: ['game_id', 'player_id', 'depot_id', 'depot_name'], game_id: 0, player_id: 0, depot_id: 0, depot_name: 0, },
		},
		TreasuryValue: {
			fieldOrder: ['treasury_id', 'treasury_name', 'funds_available', 'funds_reserved', 'status'],
			treasury_id: 0,
			treasury_name: 0,
			funds_available: 0,
			funds_reserved: 0,
			status: FinancialStatus.Operational,
		},
		Treasury: {
			fieldOrder: ['game_id', 'player_id', 'treasury_id', 'treasury_name', 'funds_available', 'funds_reserved', 'status'],
			game_id: 0,
			player_id: 0,
			treasury_id: 0,
			treasury_name: 0,
			funds_available: 0,
			funds_reserved: 0,
			status: FinancialStatus.Operational,
		},
		UnitStateValue: {
			fieldOrder: ['x', 'y', 'z', 'mode', 'environment'],
			x: 0,
			y: 0,
			z: 0,
			mode: UnitMode.Idle,
			environment: { fieldOrder: ['terrain', 'cover_level', 'elevation'], terrain: TerrainType, cover_level: 0, elevation: 0, },
		},
		UnitState: {
			fieldOrder: ['game_id', 'player_id', 'unit_id', 'x', 'y', 'z', 'mode', 'environment'],
			game_id: 0,
			player_id: 0,
			unit_id: 0,
			x: 0,
			y: 0,
			z: 0,
			mode: UnitMode.Idle,
			environment: { fieldOrder: ['terrain', 'cover_level', 'elevation'], terrain: TerrainType, cover_level: 0, elevation: 0, },
		},
		EnvironmentInfo: {
			fieldOrder: ['terrain', 'cover_level', 'elevation'],
			terrain: TerrainType.UrbanStreet,
			cover_level: 0,
			elevation: 0,
		},
		UnitsSupplyValue: {
			fieldOrder: ['infantry', 'armored', 'air', 'naval', 'cyber'],
			infantry: 0,
			armored: 0,
			air: 0,
			naval: 0,
			cyber: 0,
		},
		UrbanBattlefield: {
			fieldOrder: ['game_id', 'battlefield_id', 'player_id', 'size', 'weather', 'control'],
			game_id: 0,
			battlefield_id: 0,
			player_id: 0,
			size: 0,
			weather: { fieldOrder: ['weather_condition', 'visibility', 'movement_penalty', 'comms_interference'], weather_condition: WeatherCondition, visibility: 0, movement_penalty: 0, comms_interference: 0, },
			control: 0,
		},
		WeatherEffect: {
			fieldOrder: ['weather_condition', 'visibility', 'movement_penalty', 'comms_interference'],
			weather_condition: WeatherCondition.None,
			visibility: 0,
			movement_penalty: 0,
			comms_interference: 0,
		},
		UrbanBattlefieldValue: {
			fieldOrder: ['player_id', 'size', 'weather', 'control'],
			player_id: 0,
			size: 0,
			weather: { fieldOrder: ['weather_condition', 'visibility', 'movement_penalty', 'comms_interference'], weather_condition: WeatherCondition, visibility: 0, movement_penalty: 0, comms_interference: 0, },
			control: 0,
		},
		ERC__Balance: {
			fieldOrder: ['balance', 'type', 'tokenmetadata'],
			balance: '',
			type: 'ERC20',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
		},
		ERC__Token: {
			fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
			name: '',
			symbol: '',
			tokenId: '',
			decimals: '',
			contractAddress: '',
		},
		ERC__Transfer: {
			fieldOrder: ['from', 'to', 'amount', 'type', 'executed', 'tokenMetadata'],
			from: '',
			to: '',
			amount: '',
			type: 'ERC20',
			executedAt: '',
			tokenMetadata: {
				fieldOrder: ['name', 'symbol', 'tokenId', 'decimals', 'contractAddress'],
				name: '',
				symbol: '',
				tokenId: '',
				decimals: '',
				contractAddress: '',
			},
			transactionHash: '',
		},

	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
export interface ERC__Balance {
    fieldOrder: string[];
    balance: string;
    type: string;
    tokenMetadata: ERC__Token;
}
export interface ERC__Token {
    fieldOrder: string[];
    name: string;
    symbol: string;
    tokenId: string;
    decimals: string;
    contractAddress: string;
}
export interface ERC__Transfer {
    fieldOrder: string[];
    from: string;
    to: string;
    amount: string;
    type: string;
    executedAt: string;
    tokenMetadata: ERC__Token;
    transactionHash: string;
}