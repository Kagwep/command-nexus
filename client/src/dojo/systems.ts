/* previously called generated.ts */

import { DojoProvider } from '@dojoengine/core';
import { AccountInterface, RevertedTransactionReceiptResponse, cairo } from 'starknet';

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
    const ret = await provider.execute(account, contractName, methodName, args);
    const receipt = await account.waitForTransaction(ret.transaction_hash, {
      retryInterval: 100,
    });

    // Add any additional checks or logic here based on the receipt
    if (receipt.status === 'REJECTED') {
      console.log('Transaction Rejected');
      throw new Error('[Tx REJECTED] ');
    }

    if ('execution_status' in receipt) {
      // The receipt is of a type that includes execution_status
      if (receipt.execution_status === 'REVERTED') {
        const errorMessage = tryBetterErrorMsg(
          (receipt as RevertedTransactionReceiptResponse).revert_reason || 'Transaction Reverted'
        );
        console.log('ERROR KATANA', errorMessage);
        throw new Error('[Tx REVERTED] ' + errorMessage);
      }
    }

    return receipt;
  };

  function host() {
    const contractName = 'contracts::systems::host::host';
    const create = async (account: AccountInterface, playerName: string, price: bigint, penalty: number) => {
      try {
        return await executeAndCheck(account, contractName, 'create', [
          provider.getWorldAddress(),
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
        return await executeAndCheck(account, contractName, 'join', [provider.getWorldAddress(), gameId, playerName]);
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
        return await executeAndCheck(account, contractName, 'kick', [provider.getWorldAddress(), gameId, playerIndex]);
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
      join,
      leave,
      kick,
      delete_game,
    };
  }

  return {
    host: host(),
  };
}