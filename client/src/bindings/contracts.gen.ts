import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {

	const arena_create = async (snAccount: Account, playerName: number, price: number, penalty: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "arena",
					entrypoint: "create",
					calldata: [playerName, price, penalty],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const arena_join = async (snAccount: Account, gameId: number, playerName: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "arena",
					entrypoint: "join",
					calldata: [gameId, playerName],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const arena_transfer = async (snAccount: Account, gameId: number, index: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "arena",
					entrypoint: "transfer",
					calldata: [gameId, index],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const arena_leave = async (snAccount: Account, gameId: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "arena",
					entrypoint: "leave",
					calldata: [gameId],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const arena_start = async (snAccount: Account, gameId: number, roundCount: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "arena",
					entrypoint: "start",
					calldata: [gameId, roundCount],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const arena_delete = async (snAccount: Account, gameId: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "arena",
					entrypoint: "delete",
					calldata: [gameId],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const arena_kick = async (snAccount: Account, gameId: number, index: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "arena",
					entrypoint: "kick",
					calldata: [gameId, index],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_deployForces = async (snAccount: Account, gameId: number, battlefieldId: number, unit: number, supply: number, x: number, y: number, z: number, terrainNum: number, coverLevel: number, elevation: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "deploy_forces",
					calldata: [gameId, battlefieldId, unit, supply, x, y, z, terrainNum, coverLevel, elevation],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_patrol = async (snAccount: Account, gameId: number, unitId: number, unitType: number, startX: number, startY: number, startZ: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "patrol",
					calldata: [gameId, unitId, unitType, startX, startY, startZ],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_attack = async (snAccount: Account, gameId: number, playerTargetId: number, attackerId: number, targetId: number, unitId: number, attackerUnitType: number, targetUnitType: number, x: number, y: number, z: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "attack",
					calldata: [gameId, playerTargetId, attackerId, targetId, unitId, attackerUnitType, targetUnitType, x, y, z],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_defend = async (snAccount: Account, gameId: number, unitId: number, unitType: number, x: number, y: number, z: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "defend",
					calldata: [gameId, unitId, unitType, x, y, z],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_moveUnit = async (snAccount: Account, gameId: number, unitId: number, unitType: number, destX: number, destY: number, destZ: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "move_unit",
					calldata: [gameId, unitId, unitType, destX, destY, destZ],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_stealth = async (snAccount: Account, gameId: number, unitId: number, unitType: number, x: number, y: number, z: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "stealth",
					calldata: [gameId, unitId, unitType, x, y, z],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_heal = async (snAccount: Account, gameId: number, unitId: number, unitType: number, areaX: number, areaY: number, areaZ: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "heal",
					calldata: [gameId, unitId, unitType, areaX, areaY, areaZ],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_recon = async (snAccount: Account, gameId: number, unitId: number, unitType: number, areaX: number, areaY: number, areaZ: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "recon",
					calldata: [gameId, unitId, unitType, areaX, areaY, areaZ],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	const nexus_forceEndPlayerTurn = async (snAccount: Account, gameId: number, targetPlayerIndex: number) => {
		try {
			return await provider.execute(
				snAccount,
				{
					contractName: "nexus",
					entrypoint: "force_end_player_turn",
					calldata: [gameId, targetPlayerIndex],
				},
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		arena: {
			create: arena_create,
			join: arena_join,
			transfer: arena_transfer,
			leave: arena_leave,
			start: arena_start,
			delete: arena_delete,
			kick: arena_kick,
		},
		nexus: {
			deployForces: nexus_deployForces,
			patrol: nexus_patrol,
			attack: nexus_attack,
			defend: nexus_defend,
			moveUnit: nexus_moveUnit,
			stealth: nexus_stealth,
			heal: nexus_heal,
			recon: nexus_recon,
			forceEndPlayerTurn: nexus_forceEndPlayerTurn,
		},
	};
}