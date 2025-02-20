import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_nexus_attack_calldata = (gameId: BigNumberish, playerTargetId: BigNumberish, attackerId: BigNumberish, targetId: BigNumberish, unitId: BigNumberish, attackerUnitType: BigNumberish, targetUnitType: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "attack",
			calldata: [gameId, playerTargetId, attackerId, targetId, unitId, attackerUnitType, targetUnitType, x, y, z],
		};
	};

	const nexus_attack = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playerTargetId: BigNumberish, attackerId: BigNumberish, targetId: BigNumberish, unitId: BigNumberish, attackerUnitType: BigNumberish, targetUnitType: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_attack_calldata(gameId, playerTargetId, attackerId, targetId, unitId, attackerUnitType, targetUnitType, x, y, z),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_boost_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, areaX: BigNumberish, areaY: BigNumberish, areaZ: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "boost",
			calldata: [gameId, unitId, unitType, areaX, areaY, areaZ],
		};
	};

	const nexus_boost = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, areaX: BigNumberish, areaY: BigNumberish, areaZ: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_boost_calldata(gameId, unitId, unitType, areaX, areaY, areaZ),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_captureFlag_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, flagId: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "capture_flag",
			calldata: [gameId, unitId, unitType, flagId, x, y, z],
		};
	};

	const nexus_captureFlag = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, flagId: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_captureFlag_calldata(gameId, unitId, unitType, flagId, x, y, z),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_arena_create_calldata = (playerName: BigNumberish, price: BigNumberish, penalty: BigNumberish): DojoCall => {
		return {
			contractName: "arena",
			entrypoint: "create",
			calldata: [playerName, price, penalty],
		};
	};

	const arena_create = async (snAccount: Account | AccountInterface, playerName: BigNumberish, price: BigNumberish, penalty: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_arena_create_calldata(playerName, price, penalty),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_defend_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "defend",
			calldata: [gameId, unitId, unitType, x, y, z],
		};
	};

	const nexus_defend = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_defend_calldata(gameId, unitId, unitType, x, y, z),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_arena_delete_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "arena",
			entrypoint: "delete",
			calldata: [gameId],
		};
	};

	const arena_delete = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_arena_delete_calldata(gameId),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_deployForces_calldata = (gameId: BigNumberish, battlefieldId: BigNumberish, unit: BigNumberish, supply: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish, terrainNum: BigNumberish, coverLevel: BigNumberish, elevation: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "deploy_forces",
			calldata: [gameId, battlefieldId, unit, supply, x, y, z, terrainNum, coverLevel, elevation],
		};
	};

	const nexus_deployForces = async (snAccount: Account | AccountInterface, gameId: BigNumberish, battlefieldId: BigNumberish, unit: BigNumberish, supply: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish, terrainNum: BigNumberish, coverLevel: BigNumberish, elevation: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_deployForces_calldata(gameId, battlefieldId, unit, supply, x, y, z, terrainNum, coverLevel, elevation),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_forceEndPlayerTurn_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "force_end_player_turn",
			calldata: [gameId],
		};
	};

	const nexus_forceEndPlayerTurn = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_forceEndPlayerTurn_calldata(gameId),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_heal_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, areaX: BigNumberish, areaY: BigNumberish, areaZ: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "heal",
			calldata: [gameId, unitId, unitType, areaX, areaY, areaZ],
		};
	};

	const nexus_heal = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, areaX: BigNumberish, areaY: BigNumberish, areaZ: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_heal_calldata(gameId, unitId, unitType, areaX, areaY, areaZ),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_arena_join_calldata = (gameId: BigNumberish, playerName: BigNumberish): DojoCall => {
		return {
			contractName: "arena",
			entrypoint: "join",
			calldata: [gameId, playerName],
		};
	};

	const arena_join = async (snAccount: Account | AccountInterface, gameId: BigNumberish, playerName: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_arena_join_calldata(gameId, playerName),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_arena_kick_calldata = (gameId: BigNumberish, index: BigNumberish): DojoCall => {
		return {
			contractName: "arena",
			entrypoint: "kick",
			calldata: [gameId, index],
		};
	};

	const arena_kick = async (snAccount: Account | AccountInterface, gameId: BigNumberish, index: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_arena_kick_calldata(gameId, index),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_arena_leave_calldata = (gameId: BigNumberish): DojoCall => {
		return {
			contractName: "arena",
			entrypoint: "leave",
			calldata: [gameId],
		};
	};

	const arena_leave = async (snAccount: Account | AccountInterface, gameId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_arena_leave_calldata(gameId),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_moveUnit_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, destX: BigNumberish, destY: BigNumberish, destZ: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "move_unit",
			calldata: [gameId, unitId, unitType, destX, destY, destZ],
		};
	};

	const nexus_moveUnit = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, destX: BigNumberish, destY: BigNumberish, destZ: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_moveUnit_calldata(gameId, unitId, unitType, destX, destY, destZ),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_patrol_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, startX: BigNumberish, startY: BigNumberish, startZ: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "patrol",
			calldata: [gameId, unitId, unitType, startX, startY, startZ],
		};
	};

	const nexus_patrol = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, startX: BigNumberish, startY: BigNumberish, startZ: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_patrol_calldata(gameId, unitId, unitType, startX, startY, startZ),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_recon_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, areaX: BigNumberish, areaY: BigNumberish, areaZ: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "recon",
			calldata: [gameId, unitId, unitType, areaX, areaY, areaZ],
		};
	};

	const nexus_recon = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, areaX: BigNumberish, areaY: BigNumberish, areaZ: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_recon_calldata(gameId, unitId, unitType, areaX, areaY, areaZ),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_arena_start_calldata = (gameId: BigNumberish, roundCount: BigNumberish): DojoCall => {
		return {
			contractName: "arena",
			entrypoint: "start",
			calldata: [gameId, roundCount],
		};
	};

	const arena_start = async (snAccount: Account | AccountInterface, gameId: BigNumberish, roundCount: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_arena_start_calldata(gameId, roundCount),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_nexus_stealth_calldata = (gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish): DojoCall => {
		return {
			contractName: "nexus",
			entrypoint: "stealth",
			calldata: [gameId, unitId, unitType, x, y, z],
		};
	};

	const nexus_stealth = async (snAccount: Account | AccountInterface, gameId: BigNumberish, unitId: BigNumberish, unitType: BigNumberish, x: BigNumberish, y: BigNumberish, z: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_nexus_stealth_calldata(gameId, unitId, unitType, x, y, z),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_arena_transfer_calldata = (gameId: BigNumberish, index: BigNumberish): DojoCall => {
		return {
			contractName: "arena",
			entrypoint: "transfer",
			calldata: [gameId, index],
		};
	};

	const arena_transfer = async (snAccount: Account | AccountInterface, gameId: BigNumberish, index: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_arena_transfer_calldata(gameId, index),
				"command_nexus",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		nexus: {
			attack: nexus_attack,
			buildAttackCalldata: build_nexus_attack_calldata,
			boost: nexus_boost,
			buildBoostCalldata: build_nexus_boost_calldata,
			captureFlag: nexus_captureFlag,
			buildCaptureFlagCalldata: build_nexus_captureFlag_calldata,
			defend: nexus_defend,
			buildDefendCalldata: build_nexus_defend_calldata,
			deployForces: nexus_deployForces,
			buildDeployForcesCalldata: build_nexus_deployForces_calldata,
			forceEndPlayerTurn: nexus_forceEndPlayerTurn,
			buildForceEndPlayerTurnCalldata: build_nexus_forceEndPlayerTurn_calldata,
			heal: nexus_heal,
			buildHealCalldata: build_nexus_heal_calldata,
			moveUnit: nexus_moveUnit,
			buildMoveUnitCalldata: build_nexus_moveUnit_calldata,
			patrol: nexus_patrol,
			buildPatrolCalldata: build_nexus_patrol_calldata,
			recon: nexus_recon,
			buildReconCalldata: build_nexus_recon_calldata,
			stealth: nexus_stealth,
			buildStealthCalldata: build_nexus_stealth_calldata,
		},
		arena: {
			create: arena_create,
			buildCreateCalldata: build_arena_create_calldata,
			delete: arena_delete,
			buildDeleteCalldata: build_arena_delete_calldata,
			join: arena_join,
			buildJoinCalldata: build_arena_join_calldata,
			kick: arena_kick,
			buildKickCalldata: build_arena_kick_calldata,
			leave: arena_leave,
			buildLeaveCalldata: build_arena_leave_calldata,
			start: arena_start,
			buildStartCalldata: build_arena_start_calldata,
			transfer: arena_transfer,
			buildTransferCalldata: build_arena_transfer_calldata,
		},
	};
}