import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { CairoCustomEnum, BigNumberish } from 'starknet';

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `command_nexus::models::assets::communication::Cable` struct
export interface Cable {
	game_id: BigNumberish;
	player_id: BigNumberish;
	cable_id: BigNumberish;
	cable_name: BigNumberish;
	length: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::CableValue` struct
export interface CableValue {
	cable_id: BigNumberish;
	cable_name: BigNumberish;
	length: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::Communication` struct
export interface Communication {
	game_id: BigNumberish;
	player_id: BigNumberish;
	cable: Cable;
	communication_tower: CommunicationTower;
	satellite_dish: SatelliteDish;
	relay_station: RelayStation;
	control_center: ControlCenter;
}

// Type definition for `command_nexus::models::assets::communication::CommunicationTower` struct
export interface CommunicationTower {
	game_id: BigNumberish;
	player_id: BigNumberish;
	tower_id: BigNumberish;
	tower_name: BigNumberish;
	height: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::CommunicationTowerValue` struct
export interface CommunicationTowerValue {
	tower_id: BigNumberish;
	tower_name: BigNumberish;
	height: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::CommunicationValue` struct
export interface CommunicationValue {
	cable: Cable;
	communication_tower: CommunicationTower;
	satellite_dish: SatelliteDish;
	relay_station: RelayStation;
	control_center: ControlCenter;
}

// Type definition for `command_nexus::models::assets::communication::ControlCenter` struct
export interface ControlCenter {
	game_id: BigNumberish;
	player_id: BigNumberish;
	center_id: BigNumberish;
	center_name: BigNumberish;
	location: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::ControlCenterValue` struct
export interface ControlCenterValue {
	center_id: BigNumberish;
	center_name: BigNumberish;
	location: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::RelayStation` struct
export interface RelayStation {
	game_id: BigNumberish;
	player_id: BigNumberish;
	station_id: BigNumberish;
	station_name: BigNumberish;
	capacity: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::RelayStationValue` struct
export interface RelayStationValue {
	station_id: BigNumberish;
	station_name: BigNumberish;
	capacity: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::SatelliteDish` struct
export interface SatelliteDish {
	game_id: BigNumberish;
	player_id: BigNumberish;
	dish_id: BigNumberish;
	dish_name: BigNumberish;
	diameter: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::communication::SatelliteDishValue` struct
export interface SatelliteDishValue {
	dish_id: BigNumberish;
	dish_name: BigNumberish;
	diameter: BigNumberish;
	status: BigNumberish;
}

// Type definition for `command_nexus::models::assets::energy::GasStation` struct
export interface GasStation {
	game_id: BigNumberish;
	player_id: BigNumberish;
	station_id: BigNumberish;
	station_name: BigNumberish;
	fuel_available: BigNumberish;
	fuel_price: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::GasStationValue` struct
export interface GasStationValue {
	station_id: BigNumberish;
	station_name: BigNumberish;
	fuel_available: BigNumberish;
	fuel_price: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::GasStorage` struct
export interface GasStorage {
	game_id: BigNumberish;
	player_id: BigNumberish;
	storage_id: BigNumberish;
	storage_name: BigNumberish;
	capacity: BigNumberish;
	current_storage: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::GasStorageValue` struct
export interface GasStorageValue {
	storage_id: BigNumberish;
	storage_name: BigNumberish;
	capacity: BigNumberish;
	current_storage: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::NuclearPowerStation` struct
export interface NuclearPowerStation {
	game_id: BigNumberish;
	player_id: BigNumberish;
	station_id: BigNumberish;
	station_name: BigNumberish;
	power_output: BigNumberish;
	fuel_level: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::NuclearPowerStationValue` struct
export interface NuclearPowerStationValue {
	station_id: BigNumberish;
	station_name: BigNumberish;
	power_output: BigNumberish;
	fuel_level: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::OilDepot` struct
export interface OilDepot {
	game_id: BigNumberish;
	player_id: BigNumberish;
	depot_id: BigNumberish;
	depot_name: BigNumberish;
	capacity: BigNumberish;
	current_storage: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::OilDepotValue` struct
export interface OilDepotValue {
	depot_id: BigNumberish;
	depot_name: BigNumberish;
	capacity: BigNumberish;
	current_storage: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::SolarPowerPlant` struct
export interface SolarPowerPlant {
	game_id: BigNumberish;
	player_id: BigNumberish;
	plant_id: BigNumberish;
	plant_name: BigNumberish;
	power_output: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::energy::SolarPowerPlantValue` struct
export interface SolarPowerPlantValue {
	plant_id: BigNumberish;
	plant_name: BigNumberish;
	power_output: BigNumberish;
	status: EnergyStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::Bank` struct
export interface Bank {
	game_id: BigNumberish;
	player_id: BigNumberish;
	bank_id: BigNumberish;
	bank_name: BigNumberish;
	total_deposit: BigNumberish;
	total_withdrawals: BigNumberish;
	interest_rate: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::BankValue` struct
export interface BankValue {
	bank_id: BigNumberish;
	bank_name: BigNumberish;
	total_deposit: BigNumberish;
	total_withdrawals: BigNumberish;
	interest_rate: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::InvestmentFirm` struct
export interface InvestmentFirm {
	game_id: BigNumberish;
	player_id: BigNumberish;
	firm_id: BigNumberish;
	firm_name: BigNumberish;
	assets_under_management: BigNumberish;
	active_investments: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::InvestmentFirmValue` struct
export interface InvestmentFirmValue {
	firm_id: BigNumberish;
	firm_name: BigNumberish;
	assets_under_management: BigNumberish;
	active_investments: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::StockExchange` struct
export interface StockExchange {
	game_id: BigNumberish;
	player_id: BigNumberish;
	exchange_id: BigNumberish;
	exchange_name: BigNumberish;
	listed_companies: BigNumberish;
	trading_volume: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::StockExchangeValue` struct
export interface StockExchangeValue {
	exchange_id: BigNumberish;
	exchange_name: BigNumberish;
	listed_companies: BigNumberish;
	trading_volume: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::Treasury` struct
export interface Treasury {
	game_id: BigNumberish;
	player_id: BigNumberish;
	treasury_id: BigNumberish;
	treasury_name: BigNumberish;
	funds_available: BigNumberish;
	funds_reserved: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::financial::TreasuryValue` struct
export interface TreasuryValue {
	treasury_id: BigNumberish;
	treasury_name: BigNumberish;
	funds_available: BigNumberish;
	funds_reserved: BigNumberish;
	status: FinancialStatusEnum;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceAgency` struct
export interface IntelligenceAgency {
	game_id: BigNumberish;
	player_id: BigNumberish;
	agency_id: BigNumberish;
	agency_name: BigNumberish;
	agency_type: AgencyTypeEnum;
	resource_allocation: BigNumberish;
	status: AgencyStatusEnum;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceAgencyValue` struct
export interface IntelligenceAgencyValue {
	agency_id: BigNumberish;
	agency_name: BigNumberish;
	agency_type: AgencyTypeEnum;
	resource_allocation: BigNumberish;
	status: AgencyStatusEnum;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceReport` struct
export interface IntelligenceReport {
	game_id: BigNumberish;
	player_id: BigNumberish;
	report_id: BigNumberish;
	source_agency_id: BigNumberish;
	target_player_id: BigNumberish;
	intelligence_data: BigNumberish;
	reliability_score: BigNumberish;
	timestamp: BigNumberish;
	status: AgencyStatusEnum;
}

// Type definition for `command_nexus::models::assets::intelligence::IntelligenceReportValue` struct
export interface IntelligenceReportValue {
	report_id: BigNumberish;
	source_agency_id: BigNumberish;
	target_player_id: BigNumberish;
	intelligence_data: BigNumberish;
	reliability_score: BigNumberish;
	timestamp: BigNumberish;
	status: AgencyStatusEnum;
}

// Type definition for `command_nexus::models::assets::intelligence::SpyNetwork` struct
export interface SpyNetwork {
	game_id: BigNumberish;
	player_id: BigNumberish;
	network_id: BigNumberish;
	network_name: BigNumberish;
	number_of_spies: BigNumberish;
	intel_reliability: BigNumberish;
	status: AgencyStatusEnum;
}

// Type definition for `command_nexus::models::assets::intelligence::SpyNetworkValue` struct
export interface SpyNetworkValue {
	network_id: BigNumberish;
	network_name: BigNumberish;
	number_of_spies: BigNumberish;
	intel_reliability: BigNumberish;
	status: AgencyStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::Armory` struct
export interface Armory {
	game_id: BigNumberish;
	player_id: BigNumberish;
	armory_id: BigNumberish;
	armory_name: BigNumberish;
	weapon_inventory: BigNumberish;
	ammo_inventory: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::ArmoryValue` struct
export interface ArmoryValue {
	armory_id: BigNumberish;
	armory_name: BigNumberish;
	weapon_inventory: BigNumberish;
	ammo_inventory: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::Barracks` struct
export interface Barracks {
	game_id: BigNumberish;
	player_id: BigNumberish;
	barracks_id: BigNumberish;
	barrack_name: BigNumberish;
	capacity: BigNumberish;
	current_soldiers: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::BarracksValue` struct
export interface BarracksValue {
	barracks_id: BigNumberish;
	barrack_name: BigNumberish;
	capacity: BigNumberish;
	current_soldiers: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::CommandCenter` struct
export interface CommandCenter {
	game_id: BigNumberish;
	player_id: BigNumberish;
	center_id: BigNumberish;
	center_name: BigNumberish;
	coordination_level: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::CommandCenterValue` struct
export interface CommandCenterValue {
	center_id: BigNumberish;
	center_name: BigNumberish;
	coordination_level: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::TrainingFacility` struct
export interface TrainingFacility {
	game_id: BigNumberish;
	player_id: BigNumberish;
	facility_id: BigNumberish;
	facility_name: BigNumberish;
	training_capacity: BigNumberish;
	current_training: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::millitary::TrainingFacilityValue` struct
export interface TrainingFacilityValue {
	facility_id: BigNumberish;
	facility_name: BigNumberish;
	training_capacity: BigNumberish;
	current_training: BigNumberish;
	status: MillitaryStatusEnum;
}

// Type definition for `command_nexus::models::assets::research::InnovationCenter` struct
export interface InnovationCenter {
	game_id: BigNumberish;
	player_id: BigNumberish;
	center_id: BigNumberish;
	center_name: BigNumberish;
	innovation_points: BigNumberish;
	status: ResearchStatusEnum;
}

// Type definition for `command_nexus::models::assets::research::InnovationCenterValue` struct
export interface InnovationCenterValue {
	center_id: BigNumberish;
	center_name: BigNumberish;
	innovation_points: BigNumberish;
	status: ResearchStatusEnum;
}

// Type definition for `command_nexus::models::assets::research::Laboratory` struct
export interface Laboratory {
	game_id: BigNumberish;
	player_id: BigNumberish;
	lab_id: BigNumberish;
	lab_name: BigNumberish;
	research_capacity: BigNumberish;
	ongoing_projects: BigNumberish;
	status: ResearchStatusEnum;
}

// Type definition for `command_nexus::models::assets::research::LaboratoryValue` struct
export interface LaboratoryValue {
	lab_id: BigNumberish;
	lab_name: BigNumberish;
	research_capacity: BigNumberish;
	ongoing_projects: BigNumberish;
	status: ResearchStatusEnum;
}

// Type definition for `command_nexus::models::assets::research::TestingGround` struct
export interface TestingGround {
	game_id: BigNumberish;
	player_id: BigNumberish;
	ground_id: BigNumberish;
	ground_name: BigNumberish;
	test_capacity: BigNumberish;
	ongiong_tests: BigNumberish;
	status: ResearchStatusEnum;
}

// Type definition for `command_nexus::models::assets::research::TestingGroundValue` struct
export interface TestingGroundValue {
	ground_id: BigNumberish;
	ground_name: BigNumberish;
	test_capacity: BigNumberish;
	ongiong_tests: BigNumberish;
	status: ResearchStatusEnum;
}

// Type definition for `command_nexus::models::assets::transportation::Airport` struct
export interface Airport {
	game_id: BigNumberish;
	player_id: BigNumberish;
	airport_id: BigNumberish;
	airport_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::AirportValue` struct
export interface AirportValue {
	airport_id: BigNumberish;
	airport_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::Depot` struct
export interface Depot {
	game_id: BigNumberish;
	player_id: BigNumberish;
	depot_id: BigNumberish;
	depot_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::DepotValue` struct
export interface DepotValue {
	depot_id: BigNumberish;
	depot_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::RailwayStation` struct
export interface RailwayStation {
	game_id: BigNumberish;
	player_id: BigNumberish;
	station_id: BigNumberish;
	station_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::RailwayStationValue` struct
export interface RailwayStationValue {
	station_id: BigNumberish;
	station_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::Seaport` struct
export interface Seaport {
	game_id: BigNumberish;
	player_id: BigNumberish;
	seaport_id: BigNumberish;
	seaport_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::SeaportValue` struct
export interface SeaportValue {
	seaport_id: BigNumberish;
	seaport_name: BigNumberish;
}

// Type definition for `command_nexus::models::assets::transportation::Transportation` struct
export interface Transportation {
	game_id: BigNumberish;
	player_id: BigNumberish;
	airport: Airport;
	seaport: Seaport;
	railway_station: RailwayStation;
	depot: Depot;
}

// Type definition for `command_nexus::models::assets::transportation::TransportationValue` struct
export interface TransportationValue {
	airport: Airport;
	seaport: Seaport;
	railway_station: RailwayStation;
	depot: Depot;
}

// Type definition for `command_nexus::models::battlefield::BattlefieldFlag` struct
export interface BattlefieldFlag {
	game_id: BigNumberish;
	flag_id: BigNumberish;
	player: string;
	position: Vec3;
	captured: boolean;
}

// Type definition for `command_nexus::models::battlefield::BattlefieldFlagValue` struct
export interface BattlefieldFlagValue {
	player: string;
	position: Vec3;
	captured: boolean;
}

// Type definition for `command_nexus::models::battlefield::Scoreboard` struct
export interface Scoreboard {
	game_id: BigNumberish;
	player_id: BigNumberish;
	player_count: BigNumberish;
	top_score: BigNumberish;
	last_updated: BigNumberish;
}

// Type definition for `command_nexus::models::battlefield::ScoreboardValue` struct
export interface ScoreboardValue {
	player_count: BigNumberish;
	top_score: BigNumberish;
	last_updated: BigNumberish;
}

// Type definition for `command_nexus::models::battlefield::UrbanBattlefield` struct
export interface UrbanBattlefield {
	game_id: BigNumberish;
	battlefield_id: BigNumberish;
	player_id: BigNumberish;
	size: BigNumberish;
	weather: WeatherEffect;
	control: BigNumberish;
}

// Type definition for `command_nexus::models::battlefield::UrbanBattlefieldValue` struct
export interface UrbanBattlefieldValue {
	player_id: BigNumberish;
	size: BigNumberish;
	weather: WeatherEffect;
	control: BigNumberish;
}

// Type definition for `command_nexus::models::battlefield::WeatherEffect` struct
export interface WeatherEffect {
	weather_condition: WeatherConditionEnum;
	visibility: BigNumberish;
	movement_penalty: BigNumberish;
	comms_interference: BigNumberish;
}

// Type definition for `command_nexus::models::game::Game` struct
export interface Game {
	game_id: BigNumberish;
	next_to_move: string;
	minimum_moves: BigNumberish;
	over: boolean;
	player_count: BigNumberish;
	unit_count: BigNumberish;
	nonce: BigNumberish;
	price: BigNumberish;
	clock: BigNumberish;
	penalty: BigNumberish;
	limit: BigNumberish;
	winner: string;
	arena_host: string;
	seed: BigNumberish;
	available_home_bases: HomeBasesTuple;
	player_name: BigNumberish;
}

// Type definition for `command_nexus::models::game::GameValue` struct
export interface GameValue {
	next_to_move: string;
	minimum_moves: BigNumberish;
	over: boolean;
	player_count: BigNumberish;
	unit_count: BigNumberish;
	nonce: BigNumberish;
	price: BigNumberish;
	clock: BigNumberish;
	penalty: BigNumberish;
	limit: BigNumberish;
	winner: string;
	arena_host: string;
	seed: BigNumberish;
	available_home_bases: HomeBasesTuple;
	player_name: BigNumberish;
}

// Type definition for `command_nexus::models::game::HomeBasesTuple` struct
export interface HomeBasesTuple {
	base1: BigNumberish;
	base2: BigNumberish;
	base3: BigNumberish;
	base4: BigNumberish;
}

// Type definition for `command_nexus::models::player::Player` struct
export interface Player {
	game_id: BigNumberish;
	index: BigNumberish;
	address: string;
	name: BigNumberish;
	supply: UnitsSupply;
	last_action: BigNumberish;
	rank: BigNumberish;
	player_score: PlayerScore;
	home_base: BattlefieldNameEnum;
	commands_remaining: BigNumberish;
	turn_start_time: BigNumberish;
	flags_captured: BigNumberish;
	booster: BigNumberish;
}

// Type definition for `command_nexus::models::player::PlayerScore` struct
export interface PlayerScore {
	score: BigNumberish;
	kills: BigNumberish;
	deaths: BigNumberish;
}

// Type definition for `command_nexus::models::player::PlayerValue` struct
export interface PlayerValue {
	address: string;
	name: BigNumberish;
	supply: UnitsSupply;
	last_action: BigNumberish;
	rank: BigNumberish;
	player_score: PlayerScore;
	home_base: BattlefieldNameEnum;
	commands_remaining: BigNumberish;
	turn_start_time: BigNumberish;
	flags_captured: BigNumberish;
	booster: BigNumberish;
}

// Type definition for `command_nexus::models::player::UnitsSupply` struct
export interface UnitsSupply {
	infantry: BigNumberish;
	armored: BigNumberish;
	air: BigNumberish;
	naval: BigNumberish;
	cyber: BigNumberish;
}

// Type definition for `command_nexus::models::position::Position` struct
export interface Position {
	coord: Vec3;
}

// Type definition for `command_nexus::models::position::Vec3` struct
export interface Vec3 {
	x: BigNumberish;
	y: BigNumberish;
	z: BigNumberish;
}

// Type definition for `command_nexus::models::units::air::AirUnit` struct
export interface AirUnit {
	game_id: BigNumberish;
	unit_id: BigNumberish;
	player_id: BigNumberish;
	range: BigNumberish;
	firepower: BigNumberish;
	accuracy: BigNumberish;
	energy: BigNumberish;
	accessories: AirUnitAccessories;
	health: AirUnitHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
	altitude: BigNumberish;
	max_speed: BigNumberish;
}

// Type definition for `command_nexus::models::units::air::AirUnitAccessories` struct
export interface AirUnitAccessories {
	missiles: BigNumberish;
	repair_kits: BigNumberish;
}

// Type definition for `command_nexus::models::units::air::AirUnitHealth` struct
export interface AirUnitHealth {
	current: BigNumberish;
	max: BigNumberish;
}

// Type definition for `command_nexus::models::units::air::AirUnitValue` struct
export interface AirUnitValue {
	range: BigNumberish;
	firepower: BigNumberish;
	accuracy: BigNumberish;
	energy: BigNumberish;
	accessories: AirUnitAccessories;
	health: AirUnitHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
	altitude: BigNumberish;
	max_speed: BigNumberish;
}

// Type definition for `command_nexus::models::units::armored::Armored` struct
export interface Armored {
	game_id: BigNumberish;
	unit_id: BigNumberish;
	player_id: BigNumberish;
	accuracy: BigNumberish;
	firepower: BigNumberish;
	range: BigNumberish;
	energy: BigNumberish;
	accessories: ArmoredAccessories;
	armored_health: ArmoredHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
}

// Type definition for `command_nexus::models::units::armored::ArmoredAccessories` struct
export interface ArmoredAccessories {
	ammunition: BigNumberish;
	repair_kits: BigNumberish;
}

// Type definition for `command_nexus::models::units::armored::ArmoredHealth` struct
export interface ArmoredHealth {
	current: BigNumberish;
	max: BigNumberish;
}

// Type definition for `command_nexus::models::units::armored::ArmoredValue` struct
export interface ArmoredValue {
	accuracy: BigNumberish;
	firepower: BigNumberish;
	range: BigNumberish;
	energy: BigNumberish;
	accessories: ArmoredAccessories;
	armored_health: ArmoredHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnit` struct
export interface CyberUnit {
	game_id: BigNumberish;
	unit_id: BigNumberish;
	player_id: BigNumberish;
	hacking_range: BigNumberish;
	encryption_strength: BigNumberish;
	stealth: BigNumberish;
	range: BigNumberish;
	accessories: CyberUnitAccessories;
	health: CyberUnitHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
	energy: BigNumberish;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnitAccessories` struct
export interface CyberUnitAccessories {
	malware: BigNumberish;
	repair_kits: BigNumberish;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnitHealth` struct
export interface CyberUnitHealth {
	current: BigNumberish;
	max: BigNumberish;
}

// Type definition for `command_nexus::models::units::cyber::CyberUnitValue` struct
export interface CyberUnitValue {
	hacking_range: BigNumberish;
	encryption_strength: BigNumberish;
	stealth: BigNumberish;
	range: BigNumberish;
	accessories: CyberUnitAccessories;
	health: CyberUnitHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
	energy: BigNumberish;
}

// Type definition for `command_nexus::models::units::infantry::Infantry` struct
export interface Infantry {
	game_id: BigNumberish;
	unit_id: BigNumberish;
	player_id: BigNumberish;
	range: BigNumberish;
	energy: BigNumberish;
	accuracy: BigNumberish;
	accessories: InfantryAccessories;
	health: InfantryHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
}

// Type definition for `command_nexus::models::units::infantry::InfantryAccessories` struct
export interface InfantryAccessories {
	ammunition: BigNumberish;
	first_aid_kit: BigNumberish;
}

// Type definition for `command_nexus::models::units::infantry::InfantryHealth` struct
export interface InfantryHealth {
	current: BigNumberish;
	max: BigNumberish;
}

// Type definition for `command_nexus::models::units::infantry::InfantryValue` struct
export interface InfantryValue {
	range: BigNumberish;
	energy: BigNumberish;
	accuracy: BigNumberish;
	accessories: InfantryAccessories;
	health: InfantryHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
}

// Type definition for `command_nexus::models::units::naval::Ship` struct
export interface Ship {
	game_id: BigNumberish;
	unit_id: BigNumberish;
	player_id: BigNumberish;
	range: BigNumberish;
	firepower: BigNumberish;
	accuracy: BigNumberish;
	ship_accessories: ShipAccessories;
	ship_health: ShipHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
	energy: BigNumberish;
}

// Type definition for `command_nexus::models::units::naval::ShipAccessories` struct
export interface ShipAccessories {
	gun_ammunition: BigNumberish;
	missile_ammunition: BigNumberish;
	repair_kits: BigNumberish;
}

// Type definition for `command_nexus::models::units::naval::ShipHealth` struct
export interface ShipHealth {
	current: BigNumberish;
	max: BigNumberish;
}

// Type definition for `command_nexus::models::units::naval::ShipValue` struct
export interface ShipValue {
	range: BigNumberish;
	firepower: BigNumberish;
	accuracy: BigNumberish;
	ship_accessories: ShipAccessories;
	ship_health: ShipHealth;
	position: Position;
	battlefield_name: BattlefieldNameEnum;
	energy: BigNumberish;
}

// Type definition for `command_nexus::models::units::unit_states::AbilityState` struct
export interface AbilityState {
	game_id: BigNumberish;
	unit_id: BigNumberish;
	player_id: BigNumberish;
	is_active: boolean;
	cooldown: BigNumberish;
	effectiveness: BigNumberish;
	unit: UnitTypeEnum;
	units_abilities_state: UnitAbilities;
}

// Type definition for `command_nexus::models::units::unit_states::AbilityStateValue` struct
export interface AbilityStateValue {
	is_active: boolean;
	cooldown: BigNumberish;
	effectiveness: BigNumberish;
	unit: UnitTypeEnum;
	units_abilities_state: UnitAbilities;
}

// Type definition for `command_nexus::models::units::unit_states::EnvironmentInfo` struct
export interface EnvironmentInfo {
	terrain: TerrainTypeEnum;
	cover_level: BigNumberish;
	elevation: BigNumberish;
}

// Type definition for `command_nexus::models::units::unit_states::UnitAbilities` struct
export interface UnitAbilities {
	move_level: BigNumberish;
	attack_level: BigNumberish;
	defend_level: BigNumberish;
	patrol_level: BigNumberish;
	stealth_level: BigNumberish;
	recon_level: BigNumberish;
	hack_level: BigNumberish;
	repair_level: BigNumberish;
	airlift_level: BigNumberish;
	bombard_level: BigNumberish;
	submerge_level: BigNumberish;
}

// Type definition for `command_nexus::models::units::unit_states::UnitState` struct
export interface UnitState {
	game_id: BigNumberish;
	player_id: BigNumberish;
	unit_id: BigNumberish;
	x: BigNumberish;
	y: BigNumberish;
	z: BigNumberish;
	mode: UnitModeEnum;
	environment: EnvironmentInfo;
}

// Type definition for `command_nexus::models::units::unit_states::UnitStateValue` struct
export interface UnitStateValue {
	x: BigNumberish;
	y: BigNumberish;
	z: BigNumberish;
	mode: UnitModeEnum;
	environment: EnvironmentInfo;
}

// Type definition for `command_nexus::models::assets::energy::EnergyStatus` enum
export type EnergyStatus = {
	Active: string;
	UnderMaintenance: string;
	Dameged: string;
	offline: string;
}
export type EnergyStatusEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::assets::financial::FinancialStatus` enum
export type FinancialStatus = {
	Operational: string;
	UnderMaintenance: string;
	Compromised: string;
	Closed: string;
}
export type FinancialStatusEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::assets::intelligence::AgencyStatus` enum
export type AgencyStatus = {
	Active: string;
	UnderOperation: string;
	Suspended: string;
	Compromised: string;
}
export type AgencyStatusEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::assets::intelligence::AgencyType` enum
export type AgencyType = {
	Domestic: string;
	Foreign: string;
	Cyber: string;
	CounterIntelligence: string;
}
export type AgencyTypeEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::assets::millitary::MillitaryStatus` enum
export type MillitaryStatus = {
	Operational: string;
	UnderMaintenance: string;
	Dameged: string;
	Decommissioned: string;
}
export type MillitaryStatusEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::assets::research::ResearchStatus` enum
export type ResearchStatus = {
	Active: string;
	UnderDevelopment: string;
	Maintenance: string;
	Decommissioned: string;
}
export type ResearchStatusEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::battlefield::BattlefieldName` enum
export type BattlefieldName = {
	None: string;
	RadiantShores: string;
	Ironforge: string;
	Skullcrag: string;
	NovaWarhound: string;
	SavageCoast: string;
}
export type BattlefieldNameEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::battlefield::WeatherCondition` enum
export type WeatherCondition = {
	None: string;
	Clear: string;
	Rainy: string;
	Foggy: string;
	Stormy: string;
}
export type WeatherConditionEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::player::UnitType` enum
export type UnitType = {
	None: string;
	Infantry: string;
	Armored: string;
	Air: string;
	Naval: string;
	Cyber: string;
}
export type UnitTypeEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::units::unit_states::TerrainType` enum
export type TerrainType = {
	UrbanStreet: string;
	UrbanBuilding: string;
	UrbanPark: string;
	Ocean: string;
}
export type TerrainTypeEnum = CairoCustomEnum;

// Type definition for `command_nexus::models::units::unit_states::UnitMode` enum
export type UnitMode = {
	Idle: string;
	Moving: string;
	Attacking: string;
	Defending: string;
	Patrolling: string;
	Stealthed: string;
	Reconning: string;
	Healing: string;
	Retreating: string;
	Repairing: string;
}
export type UnitModeEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
	command_nexus: {
		Cable: WithFieldOrder<Cable>,
		CableValue: WithFieldOrder<CableValue>,
		Communication: WithFieldOrder<Communication>,
		CommunicationTower: WithFieldOrder<CommunicationTower>,
		CommunicationTowerValue: WithFieldOrder<CommunicationTowerValue>,
		CommunicationValue: WithFieldOrder<CommunicationValue>,
		ControlCenter: WithFieldOrder<ControlCenter>,
		ControlCenterValue: WithFieldOrder<ControlCenterValue>,
		RelayStation: WithFieldOrder<RelayStation>,
		RelayStationValue: WithFieldOrder<RelayStationValue>,
		SatelliteDish: WithFieldOrder<SatelliteDish>,
		SatelliteDishValue: WithFieldOrder<SatelliteDishValue>,
		GasStation: WithFieldOrder<GasStation>,
		GasStationValue: WithFieldOrder<GasStationValue>,
		GasStorage: WithFieldOrder<GasStorage>,
		GasStorageValue: WithFieldOrder<GasStorageValue>,
		NuclearPowerStation: WithFieldOrder<NuclearPowerStation>,
		NuclearPowerStationValue: WithFieldOrder<NuclearPowerStationValue>,
		OilDepot: WithFieldOrder<OilDepot>,
		OilDepotValue: WithFieldOrder<OilDepotValue>,
		SolarPowerPlant: WithFieldOrder<SolarPowerPlant>,
		SolarPowerPlantValue: WithFieldOrder<SolarPowerPlantValue>,
		Bank: WithFieldOrder<Bank>,
		BankValue: WithFieldOrder<BankValue>,
		InvestmentFirm: WithFieldOrder<InvestmentFirm>,
		InvestmentFirmValue: WithFieldOrder<InvestmentFirmValue>,
		StockExchange: WithFieldOrder<StockExchange>,
		StockExchangeValue: WithFieldOrder<StockExchangeValue>,
		Treasury: WithFieldOrder<Treasury>,
		TreasuryValue: WithFieldOrder<TreasuryValue>,
		IntelligenceAgency: WithFieldOrder<IntelligenceAgency>,
		IntelligenceAgencyValue: WithFieldOrder<IntelligenceAgencyValue>,
		IntelligenceReport: WithFieldOrder<IntelligenceReport>,
		IntelligenceReportValue: WithFieldOrder<IntelligenceReportValue>,
		SpyNetwork: WithFieldOrder<SpyNetwork>,
		SpyNetworkValue: WithFieldOrder<SpyNetworkValue>,
		Armory: WithFieldOrder<Armory>,
		ArmoryValue: WithFieldOrder<ArmoryValue>,
		Barracks: WithFieldOrder<Barracks>,
		BarracksValue: WithFieldOrder<BarracksValue>,
		CommandCenter: WithFieldOrder<CommandCenter>,
		CommandCenterValue: WithFieldOrder<CommandCenterValue>,
		TrainingFacility: WithFieldOrder<TrainingFacility>,
		TrainingFacilityValue: WithFieldOrder<TrainingFacilityValue>,
		InnovationCenter: WithFieldOrder<InnovationCenter>,
		InnovationCenterValue: WithFieldOrder<InnovationCenterValue>,
		Laboratory: WithFieldOrder<Laboratory>,
		LaboratoryValue: WithFieldOrder<LaboratoryValue>,
		TestingGround: WithFieldOrder<TestingGround>,
		TestingGroundValue: WithFieldOrder<TestingGroundValue>,
		Airport: WithFieldOrder<Airport>,
		AirportValue: WithFieldOrder<AirportValue>,
		Depot: WithFieldOrder<Depot>,
		DepotValue: WithFieldOrder<DepotValue>,
		RailwayStation: WithFieldOrder<RailwayStation>,
		RailwayStationValue: WithFieldOrder<RailwayStationValue>,
		Seaport: WithFieldOrder<Seaport>,
		SeaportValue: WithFieldOrder<SeaportValue>,
		Transportation: WithFieldOrder<Transportation>,
		TransportationValue: WithFieldOrder<TransportationValue>,
		BattlefieldFlag: WithFieldOrder<BattlefieldFlag>,
		BattlefieldFlagValue: WithFieldOrder<BattlefieldFlagValue>,
		Scoreboard: WithFieldOrder<Scoreboard>,
		ScoreboardValue: WithFieldOrder<ScoreboardValue>,
		UrbanBattlefield: WithFieldOrder<UrbanBattlefield>,
		UrbanBattlefieldValue: WithFieldOrder<UrbanBattlefieldValue>,
		WeatherEffect: WithFieldOrder<WeatherEffect>,
		Game: WithFieldOrder<Game>,
		GameValue: WithFieldOrder<GameValue>,
		HomeBasesTuple: WithFieldOrder<HomeBasesTuple>,
		Player: WithFieldOrder<Player>,
		PlayerScore: WithFieldOrder<PlayerScore>,
		PlayerValue: WithFieldOrder<PlayerValue>,
		UnitsSupply: WithFieldOrder<UnitsSupply>,
		Position: WithFieldOrder<Position>,
		Vec3: WithFieldOrder<Vec3>,
		AirUnit: WithFieldOrder<AirUnit>,
		AirUnitAccessories: WithFieldOrder<AirUnitAccessories>,
		AirUnitHealth: WithFieldOrder<AirUnitHealth>,
		AirUnitValue: WithFieldOrder<AirUnitValue>,
		Armored: WithFieldOrder<Armored>,
		ArmoredAccessories: WithFieldOrder<ArmoredAccessories>,
		ArmoredHealth: WithFieldOrder<ArmoredHealth>,
		ArmoredValue: WithFieldOrder<ArmoredValue>,
		CyberUnit: WithFieldOrder<CyberUnit>,
		CyberUnitAccessories: WithFieldOrder<CyberUnitAccessories>,
		CyberUnitHealth: WithFieldOrder<CyberUnitHealth>,
		CyberUnitValue: WithFieldOrder<CyberUnitValue>,
		Infantry: WithFieldOrder<Infantry>,
		InfantryAccessories: WithFieldOrder<InfantryAccessories>,
		InfantryHealth: WithFieldOrder<InfantryHealth>,
		InfantryValue: WithFieldOrder<InfantryValue>,
		Ship: WithFieldOrder<Ship>,
		ShipAccessories: WithFieldOrder<ShipAccessories>,
		ShipHealth: WithFieldOrder<ShipHealth>,
		ShipValue: WithFieldOrder<ShipValue>,
		AbilityState: WithFieldOrder<AbilityState>,
		AbilityStateValue: WithFieldOrder<AbilityStateValue>,
		EnvironmentInfo: WithFieldOrder<EnvironmentInfo>,
		UnitAbilities: WithFieldOrder<UnitAbilities>,
		UnitState: WithFieldOrder<UnitState>,
		UnitStateValue: WithFieldOrder<UnitStateValue>,
	},
}
export const schema: SchemaType = {
	command_nexus: {
		Cable: {
			fieldOrder: ['game_id', 'player_id', 'cable_id', 'cable_name', 'length', 'status'],
			game_id: 0,
			player_id: 0,
			cable_id: 0,
			cable_name: 0,
			length: 0,
			status: 0,
		},
		CableValue: {
			fieldOrder: ['cable_id', 'cable_name', 'length', 'status'],
			cable_id: 0,
			cable_name: 0,
			length: 0,
			status: 0,
		},
		Communication: {
			fieldOrder: ['game_id', 'player_id', 'cable', 'communication_tower', 'satellite_dish', 'relay_station', 'control_center'],
			game_id: 0,
			player_id: 0,
		cable: { game_id: 0, player_id: 0, cable_id: 0, cable_name: 0, length: 0, status: 0, },
		communication_tower: { game_id: 0, player_id: 0, tower_id: 0, tower_name: 0, height: 0, status: 0, },
		satellite_dish: { game_id: 0, player_id: 0, dish_id: 0, dish_name: 0, diameter: 0, status: 0, },
		relay_station: { game_id: 0, player_id: 0, station_id: 0, station_name: 0, capacity: 0, status: 0, },
		control_center: { game_id: 0, player_id: 0, center_id: 0, center_name: 0, location: 0, status: 0, },
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
		CommunicationTowerValue: {
			fieldOrder: ['tower_id', 'tower_name', 'height', 'status'],
			tower_id: 0,
			tower_name: 0,
			height: 0,
			status: 0,
		},
		CommunicationValue: {
			fieldOrder: ['cable', 'communication_tower', 'satellite_dish', 'relay_station', 'control_center'],
		cable: { game_id: 0, player_id: 0, cable_id: 0, cable_name: 0, length: 0, status: 0, },
		communication_tower: { game_id: 0, player_id: 0, tower_id: 0, tower_name: 0, height: 0, status: 0, },
		satellite_dish: { game_id: 0, player_id: 0, dish_id: 0, dish_name: 0, diameter: 0, status: 0, },
		relay_station: { game_id: 0, player_id: 0, station_id: 0, station_name: 0, capacity: 0, status: 0, },
		control_center: { game_id: 0, player_id: 0, center_id: 0, center_name: 0, location: 0, status: 0, },
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
		ControlCenterValue: {
			fieldOrder: ['center_id', 'center_name', 'location', 'status'],
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
		RelayStationValue: {
			fieldOrder: ['station_id', 'station_name', 'capacity', 'status'],
			station_id: 0,
			station_name: 0,
			capacity: 0,
			status: 0,
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
		SatelliteDishValue: {
			fieldOrder: ['dish_id', 'dish_name', 'diameter', 'status'],
			dish_id: 0,
			dish_name: 0,
			diameter: 0,
			status: 0,
		},
		GasStation: {
			fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name', 'fuel_available', 'fuel_price', 'status'],
			game_id: 0,
			player_id: 0,
			station_id: 0,
			station_name: 0,
			fuel_available: 0,
			fuel_price: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		GasStationValue: {
			fieldOrder: ['station_id', 'station_name', 'fuel_available', 'fuel_price', 'status'],
			station_id: 0,
			station_name: 0,
			fuel_available: 0,
			fuel_price: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		GasStorage: {
			fieldOrder: ['game_id', 'player_id', 'storage_id', 'storage_name', 'capacity', 'current_storage', 'status'],
			game_id: 0,
			player_id: 0,
			storage_id: 0,
			storage_name: 0,
			capacity: 0,
			current_storage: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		GasStorageValue: {
			fieldOrder: ['storage_id', 'storage_name', 'capacity', 'current_storage', 'status'],
			storage_id: 0,
			storage_name: 0,
			capacity: 0,
			current_storage: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		NuclearPowerStation: {
			fieldOrder: ['game_id', 'player_id', 'station_id', 'station_name', 'power_output', 'fuel_level', 'status'],
			game_id: 0,
			player_id: 0,
			station_id: 0,
			station_name: 0,
			power_output: 0,
			fuel_level: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		NuclearPowerStationValue: {
			fieldOrder: ['station_id', 'station_name', 'power_output', 'fuel_level', 'status'],
			station_id: 0,
			station_name: 0,
			power_output: 0,
			fuel_level: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		OilDepot: {
			fieldOrder: ['game_id', 'player_id', 'depot_id', 'depot_name', 'capacity', 'current_storage', 'status'],
			game_id: 0,
			player_id: 0,
			depot_id: 0,
			depot_name: 0,
			capacity: 0,
			current_storage: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		OilDepotValue: {
			fieldOrder: ['depot_id', 'depot_name', 'capacity', 'current_storage', 'status'],
			depot_id: 0,
			depot_name: 0,
			capacity: 0,
			current_storage: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		SolarPowerPlant: {
			fieldOrder: ['game_id', 'player_id', 'plant_id', 'plant_name', 'power_output', 'status'],
			game_id: 0,
			player_id: 0,
			plant_id: 0,
			plant_name: 0,
			power_output: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
		},
		SolarPowerPlantValue: {
			fieldOrder: ['plant_id', 'plant_name', 'power_output', 'status'],
			plant_id: 0,
			plant_name: 0,
			power_output: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				offline: undefined, }),
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
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		BankValue: {
			fieldOrder: ['bank_id', 'bank_name', 'total_deposit', 'total_withdrawals', 'interest_rate', 'status'],
			bank_id: 0,
			bank_name: 0,
			total_deposit: 0,
			total_withdrawals: 0,
			interest_rate: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		InvestmentFirm: {
			fieldOrder: ['game_id', 'player_id', 'firm_id', 'firm_name', 'assets_under_management', 'active_investments', 'status'],
			game_id: 0,
			player_id: 0,
			firm_id: 0,
			firm_name: 0,
			assets_under_management: 0,
			active_investments: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		InvestmentFirmValue: {
			fieldOrder: ['firm_id', 'firm_name', 'assets_under_management', 'active_investments', 'status'],
			firm_id: 0,
			firm_name: 0,
			assets_under_management: 0,
			active_investments: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		StockExchange: {
			fieldOrder: ['game_id', 'player_id', 'exchange_id', 'exchange_name', 'listed_companies', 'trading_volume', 'status'],
			game_id: 0,
			player_id: 0,
			exchange_id: 0,
			exchange_name: 0,
			listed_companies: 0,
			trading_volume: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		StockExchangeValue: {
			fieldOrder: ['exchange_id', 'exchange_name', 'listed_companies', 'trading_volume', 'status'],
			exchange_id: 0,
			exchange_name: 0,
			listed_companies: 0,
			trading_volume: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		Treasury: {
			fieldOrder: ['game_id', 'player_id', 'treasury_id', 'treasury_name', 'funds_available', 'funds_reserved', 'status'],
			game_id: 0,
			player_id: 0,
			treasury_id: 0,
			treasury_name: 0,
			funds_available: 0,
			funds_reserved: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		TreasuryValue: {
			fieldOrder: ['treasury_id', 'treasury_name', 'funds_available', 'funds_reserved', 'status'],
			treasury_id: 0,
			treasury_name: 0,
			funds_available: 0,
			funds_reserved: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Compromised: undefined,
				Closed: undefined, }),
		},
		IntelligenceAgency: {
			fieldOrder: ['game_id', 'player_id', 'agency_id', 'agency_name', 'agency_type', 'resource_allocation', 'status'],
			game_id: 0,
			player_id: 0,
			agency_id: 0,
			agency_name: 0,
		agency_type: new CairoCustomEnum({ 
					Domestic: "",
				Foreign: undefined,
				Cyber: undefined,
				CounterIntelligence: undefined, }),
			resource_allocation: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderOperation: undefined,
				Suspended: undefined,
				Compromised: undefined, }),
		},
		IntelligenceAgencyValue: {
			fieldOrder: ['agency_id', 'agency_name', 'agency_type', 'resource_allocation', 'status'],
			agency_id: 0,
			agency_name: 0,
		agency_type: new CairoCustomEnum({ 
					Domestic: "",
				Foreign: undefined,
				Cyber: undefined,
				CounterIntelligence: undefined, }),
			resource_allocation: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderOperation: undefined,
				Suspended: undefined,
				Compromised: undefined, }),
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
		status: new CairoCustomEnum({ 
					Active: "",
				UnderOperation: undefined,
				Suspended: undefined,
				Compromised: undefined, }),
		},
		IntelligenceReportValue: {
			fieldOrder: ['report_id', 'source_agency_id', 'target_player_id', 'intelligence_data', 'reliability_score', 'timestamp', 'status'],
			report_id: 0,
			source_agency_id: 0,
			target_player_id: 0,
			intelligence_data: 0,
			reliability_score: 0,
			timestamp: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderOperation: undefined,
				Suspended: undefined,
				Compromised: undefined, }),
		},
		SpyNetwork: {
			fieldOrder: ['game_id', 'player_id', 'network_id', 'network_name', 'number_of_spies', 'intel_reliability', 'status'],
			game_id: 0,
			player_id: 0,
			network_id: 0,
			network_name: 0,
			number_of_spies: 0,
			intel_reliability: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderOperation: undefined,
				Suspended: undefined,
				Compromised: undefined, }),
		},
		SpyNetworkValue: {
			fieldOrder: ['network_id', 'network_name', 'number_of_spies', 'intel_reliability', 'status'],
			network_id: 0,
			network_name: 0,
			number_of_spies: 0,
			intel_reliability: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderOperation: undefined,
				Suspended: undefined,
				Compromised: undefined, }),
		},
		Armory: {
			fieldOrder: ['game_id', 'player_id', 'armory_id', 'armory_name', 'weapon_inventory', 'ammo_inventory', 'status'],
			game_id: 0,
			player_id: 0,
			armory_id: 0,
			armory_name: 0,
			weapon_inventory: 0,
			ammo_inventory: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		ArmoryValue: {
			fieldOrder: ['armory_id', 'armory_name', 'weapon_inventory', 'ammo_inventory', 'status'],
			armory_id: 0,
			armory_name: 0,
			weapon_inventory: 0,
			ammo_inventory: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		Barracks: {
			fieldOrder: ['game_id', 'player_id', 'barracks_id', 'barrack_name', 'capacity', 'current_soldiers', 'status'],
			game_id: 0,
			player_id: 0,
			barracks_id: 0,
			barrack_name: 0,
			capacity: 0,
			current_soldiers: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		BarracksValue: {
			fieldOrder: ['barracks_id', 'barrack_name', 'capacity', 'current_soldiers', 'status'],
			barracks_id: 0,
			barrack_name: 0,
			capacity: 0,
			current_soldiers: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		CommandCenter: {
			fieldOrder: ['game_id', 'player_id', 'center_id', 'center_name', 'coordination_level', 'status'],
			game_id: 0,
			player_id: 0,
			center_id: 0,
			center_name: 0,
			coordination_level: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		CommandCenterValue: {
			fieldOrder: ['center_id', 'center_name', 'coordination_level', 'status'],
			center_id: 0,
			center_name: 0,
			coordination_level: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		TrainingFacility: {
			fieldOrder: ['game_id', 'player_id', 'facility_id', 'facility_name', 'training_capacity', 'current_training', 'status'],
			game_id: 0,
			player_id: 0,
			facility_id: 0,
			facility_name: 0,
			training_capacity: 0,
			current_training: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		TrainingFacilityValue: {
			fieldOrder: ['facility_id', 'facility_name', 'training_capacity', 'current_training', 'status'],
			facility_id: 0,
			facility_name: 0,
			training_capacity: 0,
			current_training: 0,
		status: new CairoCustomEnum({ 
					Operational: "",
				UnderMaintenance: undefined,
				Dameged: undefined,
				Decommissioned: undefined, }),
		},
		InnovationCenter: {
			fieldOrder: ['game_id', 'player_id', 'center_id', 'center_name', 'innovation_points', 'status'],
			game_id: 0,
			player_id: 0,
			center_id: 0,
			center_name: 0,
			innovation_points: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderDevelopment: undefined,
				Maintenance: undefined,
				Decommissioned: undefined, }),
		},
		InnovationCenterValue: {
			fieldOrder: ['center_id', 'center_name', 'innovation_points', 'status'],
			center_id: 0,
			center_name: 0,
			innovation_points: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderDevelopment: undefined,
				Maintenance: undefined,
				Decommissioned: undefined, }),
		},
		Laboratory: {
			fieldOrder: ['game_id', 'player_id', 'lab_id', 'lab_name', 'research_capacity', 'ongoing_projects', 'status'],
			game_id: 0,
			player_id: 0,
			lab_id: 0,
			lab_name: 0,
			research_capacity: 0,
			ongoing_projects: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderDevelopment: undefined,
				Maintenance: undefined,
				Decommissioned: undefined, }),
		},
		LaboratoryValue: {
			fieldOrder: ['lab_id', 'lab_name', 'research_capacity', 'ongoing_projects', 'status'],
			lab_id: 0,
			lab_name: 0,
			research_capacity: 0,
			ongoing_projects: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderDevelopment: undefined,
				Maintenance: undefined,
				Decommissioned: undefined, }),
		},
		TestingGround: {
			fieldOrder: ['game_id', 'player_id', 'ground_id', 'ground_name', 'test_capacity', 'ongiong_tests', 'status'],
			game_id: 0,
			player_id: 0,
			ground_id: 0,
			ground_name: 0,
			test_capacity: 0,
			ongiong_tests: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderDevelopment: undefined,
				Maintenance: undefined,
				Decommissioned: undefined, }),
		},
		TestingGroundValue: {
			fieldOrder: ['ground_id', 'ground_name', 'test_capacity', 'ongiong_tests', 'status'],
			ground_id: 0,
			ground_name: 0,
			test_capacity: 0,
			ongiong_tests: 0,
		status: new CairoCustomEnum({ 
					Active: "",
				UnderDevelopment: undefined,
				Maintenance: undefined,
				Decommissioned: undefined, }),
		},
		Airport: {
			fieldOrder: ['game_id', 'player_id', 'airport_id', 'airport_name'],
			game_id: 0,
			player_id: 0,
			airport_id: 0,
			airport_name: 0,
		},
		AirportValue: {
			fieldOrder: ['airport_id', 'airport_name'],
			airport_id: 0,
			airport_name: 0,
		},
		Depot: {
			fieldOrder: ['game_id', 'player_id', 'depot_id', 'depot_name'],
			game_id: 0,
			player_id: 0,
			depot_id: 0,
			depot_name: 0,
		},
		DepotValue: {
			fieldOrder: ['depot_id', 'depot_name'],
			depot_id: 0,
			depot_name: 0,
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
		Transportation: {
			fieldOrder: ['game_id', 'player_id', 'airport', 'seaport', 'railway_station', 'depot'],
			game_id: 0,
			player_id: 0,
		airport: { game_id: 0, player_id: 0, airport_id: 0, airport_name: 0, },
		seaport: { game_id: 0, player_id: 0, seaport_id: 0, seaport_name: 0, },
		railway_station: { game_id: 0, player_id: 0, station_id: 0, station_name: 0, },
		depot: { game_id: 0, player_id: 0, depot_id: 0, depot_name: 0, },
		},
		TransportationValue: {
			fieldOrder: ['airport', 'seaport', 'railway_station', 'depot'],
		airport: { game_id: 0, player_id: 0, airport_id: 0, airport_name: 0, },
		seaport: { game_id: 0, player_id: 0, seaport_id: 0, seaport_name: 0, },
		railway_station: { game_id: 0, player_id: 0, station_id: 0, station_name: 0, },
		depot: { game_id: 0, player_id: 0, depot_id: 0, depot_name: 0, },
		},
		BattlefieldFlag: {
			fieldOrder: ['game_id', 'flag_id', 'player', 'position', 'captured'],
			game_id: 0,
			flag_id: 0,
			player: "",
		position: { x: 0, y: 0, z: 0, },
			captured: false,
		},
		BattlefieldFlagValue: {
			fieldOrder: ['player', 'position', 'captured'],
			player: "",
		position: { x: 0, y: 0, z: 0, },
			captured: false,
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
		UrbanBattlefield: {
			fieldOrder: ['game_id', 'battlefield_id', 'player_id', 'size', 'weather', 'control'],
			game_id: 0,
			battlefield_id: 0,
			player_id: 0,
			size: 0,
		weather: { weather_condition: new CairoCustomEnum({ 
					None: "",
				Clear: undefined,
				Rainy: undefined,
				Foggy: undefined,
				Stormy: undefined, }), visibility: 0, movement_penalty: 0, comms_interference: 0, },
			control: 0,
		},
		UrbanBattlefieldValue: {
			fieldOrder: ['player_id', 'size', 'weather', 'control'],
			player_id: 0,
			size: 0,
		weather: { weather_condition: new CairoCustomEnum({ 
					None: "",
				Clear: undefined,
				Rainy: undefined,
				Foggy: undefined,
				Stormy: undefined, }), visibility: 0, movement_penalty: 0, comms_interference: 0, },
			control: 0,
		},
		WeatherEffect: {
			fieldOrder: ['weather_condition', 'visibility', 'movement_penalty', 'comms_interference'],
		weather_condition: new CairoCustomEnum({ 
					None: "",
				Clear: undefined,
				Rainy: undefined,
				Foggy: undefined,
				Stormy: undefined, }),
			visibility: 0,
			movement_penalty: 0,
			comms_interference: 0,
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
		available_home_bases: { base1: 0, base2: 0, base3: 0, base4: 0, },
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
		available_home_bases: { base1: 0, base2: 0, base3: 0, base4: 0, },
			player_name: 0,
		},
		HomeBasesTuple: {
			fieldOrder: ['base1', 'base2', 'base3', 'base4'],
			base1: 0,
			base2: 0,
			base3: 0,
			base4: 0,
		},
		Player: {
			fieldOrder: ['game_id', 'index', 'address', 'name', 'supply', 'last_action', 'rank', 'player_score', 'home_base', 'commands_remaining', 'turn_start_time', 'flags_captured', 'booster'],
			game_id: 0,
			index: 0,
			address: "",
			name: 0,
		supply: { infantry: 0, armored: 0, air: 0, naval: 0, cyber: 0, },
			last_action: 0,
			rank: 0,
		player_score: { score: 0, kills: 0, deaths: 0, },
		home_base: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			commands_remaining: 0,
			turn_start_time: 0,
			flags_captured: 0,
			booster: 0,
		},
		PlayerScore: {
			fieldOrder: ['score', 'kills', 'deaths'],
			score: 0,
			kills: 0,
			deaths: 0,
		},
		PlayerValue: {
			fieldOrder: ['address', 'name', 'supply', 'last_action', 'rank', 'player_score', 'home_base', 'commands_remaining', 'turn_start_time', 'flags_captured', 'booster'],
			address: "",
			name: 0,
		supply: { infantry: 0, armored: 0, air: 0, naval: 0, cyber: 0, },
			last_action: 0,
			rank: 0,
		player_score: { score: 0, kills: 0, deaths: 0, },
		home_base: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			commands_remaining: 0,
			turn_start_time: 0,
			flags_captured: 0,
			booster: 0,
		},
		UnitsSupply: {
			fieldOrder: ['infantry', 'armored', 'air', 'naval', 'cyber'],
			infantry: 0,
			armored: 0,
			air: 0,
			naval: 0,
			cyber: 0,
		},
		Position: {
			fieldOrder: ['coord'],
		coord: { x: 0, y: 0, z: 0, },
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
		accessories: { missiles: 0, repair_kits: 0, },
		health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			altitude: 0,
			max_speed: 0,
		},
		AirUnitAccessories: {
			fieldOrder: ['missiles', 'repair_kits'],
			missiles: 0,
			repair_kits: 0,
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
		accessories: { missiles: 0, repair_kits: 0, },
		health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			altitude: 0,
			max_speed: 0,
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
		accessories: { ammunition: 0, repair_kits: 0, },
		armored_health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
		},
		ArmoredAccessories: {
			fieldOrder: ['ammunition', 'repair_kits'],
			ammunition: 0,
			repair_kits: 0,
		},
		ArmoredHealth: {
			fieldOrder: ['current', 'max'],
			current: 0,
			max: 0,
		},
		ArmoredValue: {
			fieldOrder: ['accuracy', 'firepower', 'range', 'energy', 'accessories', 'armored_health', 'position', 'battlefield_name'],
			accuracy: 0,
			firepower: 0,
		range: 0,
			energy: 0,
		accessories: { ammunition: 0, repair_kits: 0, },
		armored_health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
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
		accessories: { malware: 0, repair_kits: 0, },
		health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			energy: 0,
		},
		CyberUnitAccessories: {
			fieldOrder: ['malware', 'repair_kits'],
			malware: 0,
			repair_kits: 0,
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
		accessories: { malware: 0, repair_kits: 0, },
		health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			energy: 0,
		},
		Infantry: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'range', 'energy', 'accuracy', 'accessories', 'health', 'position', 'battlefield_name'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
		range: 0,
			energy: 0,
			accuracy: 0,
		accessories: { ammunition: 0, first_aid_kit: 0, },
		health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
		},
		InfantryAccessories: {
			fieldOrder: ['ammunition', 'first_aid_kit'],
			ammunition: 0,
			first_aid_kit: 0,
		},
		InfantryHealth: {
			fieldOrder: ['current', 'max'],
			current: 0,
			max: 0,
		},
		InfantryValue: {
			fieldOrder: ['range', 'energy', 'accuracy', 'accessories', 'health', 'position', 'battlefield_name'],
		range: 0,
			energy: 0,
			accuracy: 0,
		accessories: { ammunition: 0, first_aid_kit: 0, },
		health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
		},
		Ship: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'range', 'firepower', 'accuracy', 'ship_accessories', 'ship_health', 'position', 'battlefield_name', 'energy'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
		range: 0,
			firepower: 0,
			accuracy: 0,
		ship_accessories: { gun_ammunition: 0, missile_ammunition: 0, repair_kits: 0, },
		ship_health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			energy: 0,
		},
		ShipAccessories: {
			fieldOrder: ['gun_ammunition', 'missile_ammunition', 'repair_kits'],
			gun_ammunition: 0,
			missile_ammunition: 0,
			repair_kits: 0,
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
		ship_accessories: { gun_ammunition: 0, missile_ammunition: 0, repair_kits: 0, },
		ship_health: { current: 0, max: 0, },
		position: { coord: { x: 0, y: 0, z: 0, }, },
		battlefield_name: new CairoCustomEnum({ 
					None: "",
				RadiantShores: undefined,
				Ironforge: undefined,
				Skullcrag: undefined,
				NovaWarhound: undefined,
				SavageCoast: undefined, }),
			energy: 0,
		},
		AbilityState: {
			fieldOrder: ['game_id', 'unit_id', 'player_id', 'is_active', 'cooldown', 'effectiveness', 'unit', 'units_abilities_state'],
			game_id: 0,
			unit_id: 0,
			player_id: 0,
			is_active: false,
			cooldown: 0,
			effectiveness: 0,
		unit: new CairoCustomEnum({ 
					None: "",
				Infantry: undefined,
				Armored: undefined,
				Air: undefined,
				Naval: undefined,
				Cyber: undefined, }),
		units_abilities_state: { move_level: 0, attack_level: 0, defend_level: 0, patrol_level: 0, stealth_level: 0, recon_level: 0, hack_level: 0, repair_level: 0, airlift_level: 0, bombard_level: 0, submerge_level: 0, },
		},
		AbilityStateValue: {
			fieldOrder: ['is_active', 'cooldown', 'effectiveness', 'unit', 'units_abilities_state'],
			is_active: false,
			cooldown: 0,
			effectiveness: 0,
		unit: new CairoCustomEnum({ 
					None: "",
				Infantry: undefined,
				Armored: undefined,
				Air: undefined,
				Naval: undefined,
				Cyber: undefined, }),
		units_abilities_state: { move_level: 0, attack_level: 0, defend_level: 0, patrol_level: 0, stealth_level: 0, recon_level: 0, hack_level: 0, repair_level: 0, airlift_level: 0, bombard_level: 0, submerge_level: 0, },
		},
		EnvironmentInfo: {
			fieldOrder: ['terrain', 'cover_level', 'elevation'],
		terrain: new CairoCustomEnum({ 
					UrbanStreet: "",
				UrbanBuilding: undefined,
				UrbanPark: undefined,
				Ocean: undefined, }),
			cover_level: 0,
			elevation: 0,
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
		UnitState: {
			fieldOrder: ['game_id', 'player_id', 'unit_id', 'x', 'y', 'z', 'mode', 'environment'],
			game_id: 0,
			player_id: 0,
			unit_id: 0,
		x: 0,
		y: 0,
		z: 0,
		mode: new CairoCustomEnum({ 
					Idle: "",
				Moving: undefined,
				Attacking: undefined,
				Defending: undefined,
				Patrolling: undefined,
				Stealthed: undefined,
				Reconning: undefined,
				Healing: undefined,
				Retreating: undefined,
				Repairing: undefined, }),
		environment: { terrain: new CairoCustomEnum({ 
					UrbanStreet: "",
				UrbanBuilding: undefined,
				UrbanPark: undefined,
				Ocean: undefined, }), cover_level: 0, elevation: 0, },
		},
		UnitStateValue: {
			fieldOrder: ['x', 'y', 'z', 'mode', 'environment'],
		x: 0,
		y: 0,
		z: 0,
		mode: new CairoCustomEnum({ 
					Idle: "",
				Moving: undefined,
				Attacking: undefined,
				Defending: undefined,
				Patrolling: undefined,
				Stealthed: undefined,
				Reconning: undefined,
				Healing: undefined,
				Retreating: undefined,
				Repairing: undefined, }),
		environment: { terrain: new CairoCustomEnum({ 
					UrbanStreet: "",
				UrbanBuilding: undefined,
				UrbanPark: undefined,
				Ocean: undefined, }), cover_level: 0, elevation: 0, },
		},
	},
};
export enum ModelsMapping {
	Cable = 'command_nexus-Cable',
	CableValue = 'command_nexus-CableValue',
	Communication = 'command_nexus-Communication',
	CommunicationTower = 'command_nexus-CommunicationTower',
	CommunicationTowerValue = 'command_nexus-CommunicationTowerValue',
	CommunicationValue = 'command_nexus-CommunicationValue',
	ControlCenter = 'command_nexus-ControlCenter',
	ControlCenterValue = 'command_nexus-ControlCenterValue',
	RelayStation = 'command_nexus-RelayStation',
	RelayStationValue = 'command_nexus-RelayStationValue',
	SatelliteDish = 'command_nexus-SatelliteDish',
	SatelliteDishValue = 'command_nexus-SatelliteDishValue',
	EnergyStatus = 'command_nexus-EnergyStatus',
	GasStation = 'command_nexus-GasStation',
	GasStationValue = 'command_nexus-GasStationValue',
	GasStorage = 'command_nexus-GasStorage',
	GasStorageValue = 'command_nexus-GasStorageValue',
	NuclearPowerStation = 'command_nexus-NuclearPowerStation',
	NuclearPowerStationValue = 'command_nexus-NuclearPowerStationValue',
	OilDepot = 'command_nexus-OilDepot',
	OilDepotValue = 'command_nexus-OilDepotValue',
	SolarPowerPlant = 'command_nexus-SolarPowerPlant',
	SolarPowerPlantValue = 'command_nexus-SolarPowerPlantValue',
	Bank = 'command_nexus-Bank',
	BankValue = 'command_nexus-BankValue',
	FinancialStatus = 'command_nexus-FinancialStatus',
	InvestmentFirm = 'command_nexus-InvestmentFirm',
	InvestmentFirmValue = 'command_nexus-InvestmentFirmValue',
	StockExchange = 'command_nexus-StockExchange',
	StockExchangeValue = 'command_nexus-StockExchangeValue',
	Treasury = 'command_nexus-Treasury',
	TreasuryValue = 'command_nexus-TreasuryValue',
	AgencyStatus = 'command_nexus-AgencyStatus',
	AgencyType = 'command_nexus-AgencyType',
	IntelligenceAgency = 'command_nexus-IntelligenceAgency',
	IntelligenceAgencyValue = 'command_nexus-IntelligenceAgencyValue',
	IntelligenceReport = 'command_nexus-IntelligenceReport',
	IntelligenceReportValue = 'command_nexus-IntelligenceReportValue',
	SpyNetwork = 'command_nexus-SpyNetwork',
	SpyNetworkValue = 'command_nexus-SpyNetworkValue',
	Armory = 'command_nexus-Armory',
	ArmoryValue = 'command_nexus-ArmoryValue',
	Barracks = 'command_nexus-Barracks',
	BarracksValue = 'command_nexus-BarracksValue',
	CommandCenter = 'command_nexus-CommandCenter',
	CommandCenterValue = 'command_nexus-CommandCenterValue',
	MillitaryStatus = 'command_nexus-MillitaryStatus',
	TrainingFacility = 'command_nexus-TrainingFacility',
	TrainingFacilityValue = 'command_nexus-TrainingFacilityValue',
	InnovationCenter = 'command_nexus-InnovationCenter',
	InnovationCenterValue = 'command_nexus-InnovationCenterValue',
	Laboratory = 'command_nexus-Laboratory',
	LaboratoryValue = 'command_nexus-LaboratoryValue',
	ResearchStatus = 'command_nexus-ResearchStatus',
	TestingGround = 'command_nexus-TestingGround',
	TestingGroundValue = 'command_nexus-TestingGroundValue',
	Airport = 'command_nexus-Airport',
	AirportValue = 'command_nexus-AirportValue',
	Depot = 'command_nexus-Depot',
	DepotValue = 'command_nexus-DepotValue',
	RailwayStation = 'command_nexus-RailwayStation',
	RailwayStationValue = 'command_nexus-RailwayStationValue',
	Seaport = 'command_nexus-Seaport',
	SeaportValue = 'command_nexus-SeaportValue',
	Transportation = 'command_nexus-Transportation',
	TransportationValue = 'command_nexus-TransportationValue',
	BattlefieldFlag = 'command_nexus-BattlefieldFlag',
	BattlefieldFlagValue = 'command_nexus-BattlefieldFlagValue',
	BattlefieldName = 'command_nexus-BattlefieldName',
	Scoreboard = 'command_nexus-Scoreboard',
	ScoreboardValue = 'command_nexus-ScoreboardValue',
	UrbanBattlefield = 'command_nexus-UrbanBattlefield',
	UrbanBattlefieldValue = 'command_nexus-UrbanBattlefieldValue',
	WeatherCondition = 'command_nexus-WeatherCondition',
	WeatherEffect = 'command_nexus-WeatherEffect',
	Game = 'command_nexus-Game',
	GameValue = 'command_nexus-GameValue',
	HomeBasesTuple = 'command_nexus-HomeBasesTuple',
	Player = 'command_nexus-Player',
	PlayerScore = 'command_nexus-PlayerScore',
	PlayerValue = 'command_nexus-PlayerValue',
	UnitType = 'command_nexus-UnitType',
	UnitsSupply = 'command_nexus-UnitsSupply',
	Position = 'command_nexus-Position',
	Vec3 = 'command_nexus-Vec3',
	AirUnit = 'command_nexus-AirUnit',
	AirUnitAccessories = 'command_nexus-AirUnitAccessories',
	AirUnitHealth = 'command_nexus-AirUnitHealth',
	AirUnitValue = 'command_nexus-AirUnitValue',
	Armored = 'command_nexus-Armored',
	ArmoredAccessories = 'command_nexus-ArmoredAccessories',
	ArmoredHealth = 'command_nexus-ArmoredHealth',
	ArmoredValue = 'command_nexus-ArmoredValue',
	CyberUnit = 'command_nexus-CyberUnit',
	CyberUnitAccessories = 'command_nexus-CyberUnitAccessories',
	CyberUnitHealth = 'command_nexus-CyberUnitHealth',
	CyberUnitValue = 'command_nexus-CyberUnitValue',
	Infantry = 'command_nexus-Infantry',
	InfantryAccessories = 'command_nexus-InfantryAccessories',
	InfantryHealth = 'command_nexus-InfantryHealth',
	InfantryValue = 'command_nexus-InfantryValue',
	Ship = 'command_nexus-Ship',
	ShipAccessories = 'command_nexus-ShipAccessories',
	ShipHealth = 'command_nexus-ShipHealth',
	ShipValue = 'command_nexus-ShipValue',
	AbilityState = 'command_nexus-AbilityState',
	AbilityStateValue = 'command_nexus-AbilityStateValue',
	EnvironmentInfo = 'command_nexus-EnvironmentInfo',
	TerrainType = 'command_nexus-TerrainType',
	UnitAbilities = 'command_nexus-UnitAbilities',
	UnitMode = 'command_nexus-UnitMode',
	UnitState = 'command_nexus-UnitState',
	UnitStateValue = 'command_nexus-UnitStateValue',
}