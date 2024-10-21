/* previously called generated.ts */

import { DojoProvider } from '@dojoengine/core';
import { AccountInterface, GetTransactionReceiptResponse, cairo, num } from 'starknet';


const tryBetterErrorMsg = (msg: string): string => {
  const failureReasonIndex = msg.indexOf('Failure reason');
  if (failureReasonIndex > 0) {
    let betterMsg = msg.substring(failureReasonIndex);
    const cairoTracebackIndex = betterMsg.indexOf('Cairo traceback');
    betterMsg = betterMsg.substring(0, cairoTracebackIndex);

    const regex = /Failure reason:.*?\('([^']+)'\)/;
    const matches = betterMsg.match(regex);

    if (matches && matches.length > 1) {
      return matches[1];
    } else {
      return betterMsg;
    }
  }

  return msg;
};

export async function setupWorld(provider: DojoProvider) {
  // Transaction execution and checking wrapper
  const executeAndCheck = async (account: AccountInterface, contractName: string, methodName: string, args: any[]) => {

    console.log("called ........", account);
    console.log("called ........", {contractName, entrypoint: methodName, calldata: args});
    
    const ret = await provider.execute(account, {contractName, entrypoint: methodName, calldata: args});

    console.log(ret.transaction_hash);

    const receipt = await account.waitForTransaction(ret.transaction_hash, {
      retryInterval: 100,
    });

   

    // Add any additional checks or logic here based on the receipt
    if (receipt.revert_reason === 'REJECTED') {
      console.log('Transaction Rejected');
      throw new Error('[Tx REJECTED] ');
    }

    if ('execution_status' in receipt) {
      // The receipt is of a type that includes execution_status
      if (receipt.execution_status === 'REVERTED') {
        const errorMessage = tryBetterErrorMsg(
          (receipt as GetTransactionReceiptResponse).revert_reason || 'Transaction Reverted'
        );
        console.log('ERROR KATANA', errorMessage);
        throw new Error('[Tx REVERTED] ' + errorMessage);
      }
    }

    return receipt;
  };

  function arena() {
    const contractName = 'arena';
    const create = async (account: AccountInterface, playerName: string, price: bigint, penalty: number) => {
      
      try {
        return await executeAndCheck(account, contractName, 'create', [
          playerName,
          cairo.uint256(price),
          penalty,
        ]);
      } catch (error) {
        console.error('Error executing create:', error.message);
        throw error;
      }
    };

    const join = async (account: AccountInterface, gameId: number, playerName: string) => {
      try {
        return await executeAndCheck(account, contractName, 'join', [ gameId, playerName]);
      } catch (error) {
        console.error('Error executing join:', error);
        throw error;
      }
    };

    const leave = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'leave', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing leave:', error);
        throw error;
      }
    };

    const start = async (account: AccountInterface, gameId: number, roundLimit: number) => {
      try {
        return await executeAndCheck(account, contractName, 'start', [gameId, roundLimit]);
      } catch (error) {
        console.error('Error executing start:', error);
        throw error;
      }
    };

    const kick = async (account: AccountInterface, gameId: number, playerIndex: number) => {
      try {
        return await executeAndCheck(account, contractName, 'kick', [gameId, playerIndex]);
      } catch (error) {
        console.error('Error executing kick:', error);
        throw error;
      }
    };

    const transfer = async (account: AccountInterface, gameId: number, playerIndex: number) => {
      try {
        return await executeAndCheck(account, contractName, 'transfer', [
          provider.getWorldAddress(),
          gameId,
          playerIndex,
        ]);
      } catch (error) {
        console.error('Error executing kick:', error);
        throw error;
      }
    };

    const delete_game = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'delete', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing delete:', error);
        throw error;
      }
    };

    const claim = async (account: AccountInterface, gameId: number) => {
      try {
        return await executeAndCheck(account, contractName, 'claim', [provider.getWorldAddress(), gameId]);
      } catch (error) {
        console.error('Error executing claim:', error);
        throw error;
      }
    };

    return {
      create,
      start,
      join,
      leave,
      kick,
      delete_game,
      transfer,
    };
  }

  function nexus() {
    const contractName = 'nexus';
    const deploy_forces = async (account: AccountInterface,gameId: number,battleFieldId:number,unit:number,supply:number, x: number, y: number,z:number, terrainNum: number,coverLevel: number,elevation: number) => {
      
      try {
        return await executeAndCheck(account, contractName, 'deploy_forces', [
          gameId,
          battleFieldId,
          unit,
          supply,
          x,
          y,
          z,
          terrainNum,
          coverLevel,
          elevation
        ]);
      } catch (error) {
        console.error('Error executing deploy forces:', error.message);
        return error;
      }
    };

    const patrol = async (account: AccountInterface, gameId: number, unitId: number, unitType: number, startX: number, startY: number, startZ: number) => {
      try {
        return await executeAndCheck(account, contractName, 'patrol', [ gameId, unitId, unitType,startX, startY,startZ]);
      } catch (error) {
        console.error('Error executing patrol:', error);
        return error;
      }
    };

    const attack = async (account: AccountInterface, gameId: number, attackerId: number, targetId: number, unitId: number, unitAction: number, unitType: number, x: number, y: number, z: number) => {
      try {
        return await executeAndCheck(account, contractName, 'attack', [gameId, attackerId,targetId, unitId,unitAction, unitType,x,y,z]);
      } catch (error) {
        console.error('Error executing attack:', error);
        throw error;
      }
    };

    const defend = async (account: AccountInterface, gameId: number,  unitId: number, unitType: number, x: number, y: number, z: number) => {
      try {
        return await executeAndCheck(account, contractName, 'defend', [gameId, unitId, unitType,x,y,z]);
      } catch (error) {
        console.error('Error executing defend:', error);
        throw error;
      }
    };

    const move_unit = async (account: AccountInterface,gameId: number, unitId: number, unitType: number, destX: number, destY: number, destZ: number) => {
      try {
        return await executeAndCheck(account, contractName, 'move_unit', [gameId,  unitId, unitType,destX, destY,destZ]);
      } catch (error) {
        console.error('Error executing move_unit:', error);
        throw error;
      }
    };

    const stealth = async (account: AccountInterface,gameId: number, unitId: number, unitType: number, x: number, y: number, z: number) => {
      try {
        return await executeAndCheck(account, contractName, 'stealth', [gameId, unitId, unitType,x,y,z]);
      } catch (error) {
        console.error('Error executing stealth:', error);
        throw error;
      }
    };

    const recon = async (account: AccountInterface, gameId: number, unitId: number, unitType: number, areaX: number, areaY: number, areaZ: number) => {
      try {
        return await executeAndCheck(account, contractName, 'recon', [ gameId, unitId, unitType,areaX,areaZ,areaZ]);
      } catch (error) {
        console.error('Error executing recon:', error);
        throw error;
      }
    };

    const heal = async (account: AccountInterface, gameId: number, unitId: number, unitType: number, areaX: number, areaY: number, areaZ: number) => {
      try {
        return await executeAndCheck(account, contractName, 'heal', [ gameId, unitId, unitType,areaX,areaZ,areaZ]);
      } catch (error) {
        console.error('Error executing heal:', error);
        throw error;
      }
    };

    return {
      deploy_forces,
      patrol,
      attack,
      defend,
      move_unit,
      stealth,
      recon,
      heal
    };
  }

  return {
    arena: arena(),
    nexus: nexus()
  };
}
