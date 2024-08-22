/* previously called generated.ts */

import { DojoProvider } from '@dojoengine/core';
import { AccountInterface, GetTransactionReceiptResponse, cairo } from 'starknet';


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
    
    const ret = await provider.execute(account, {contractName, entrypoint: methodName, calldata: args});


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
        console.error('Error executing create:', error);
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
        return await executeAndCheck(account, contractName, 'start', [provider.getWorldAddress(), gameId, roundLimit]);
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

  return {
    arena: arena(),
  };
}
