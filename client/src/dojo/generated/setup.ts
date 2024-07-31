

import { getSyncEntities } from '@dojoengine/state';
import { DojoConfig, DojoProvider } from '@dojoengine/core';
import * as torii from '@dojoengine/torii-client';
import { createClientComponents } from '../createClientComponents';
import { defineContractComponents } from '../generated/contractComponents';
import { world } from './world';
import { setupWorld } from '../systems';
import { Account } from 'starknet';
import { BurnerManager } from '@dojoengine/create-burner';
import { createUpdates } from '../createUpdates';
import { TypedData, WeierstrassSignatureType } from 'starknet';

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    
  // torii client
  const toriiClient = await torii.createClient({
    rpcUrl: config.rpcUrl,
    toriiUrl: config.toriiUrl,
    relayUrl: '',
    worldAddress: config.manifest.world.address || '',
  });

  // create contract components
  const contractComponents = defineContractComponents(world);

  // create client components
  const clientComponents = createClientComponents({ contractComponents });

  // fetch all existing entities from torii
  const sync = await getSyncEntities(
    toriiClient,
    contractComponents as any,
    undefined
);

  // create dojo provider
  const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

  // setup world
  const client = await setupWorld(dojoProvider);

  // create updates manager
  const updates = await createUpdates(clientComponents);

  // create burner manager
  const burnerManager = new BurnerManager({
    masterAccount: new Account(dojoProvider.provider, config.masterAddress, config.masterPrivateKey),
    accountClassHash: config.accountClassHash,
    feeTokenAddress: config.feeTokenAddress,
    rpcProvider: dojoProvider.provider,
  });

  await burnerManager.init();

  if (burnerManager.list().length === 0) {
    try {
      await burnerManager.create();
    } catch (e) {
      console.error(e);
    }
  }

  return {
    client,
    clientComponents,
    contractComponents,
    publish: (typedData: string, signature: WeierstrassSignatureType) => {
      toriiClient.publishMessage(typedData, {
        r: signature.r.toString(),
        s: signature.s.toString(),
      });
    },
    config,
    dojoProvider,
    burnerManager,
    updates,
    world,
  };
}
