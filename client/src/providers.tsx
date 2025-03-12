import ControllerConnector from '@cartridge/connector/controller'
import { mainnet, sepolia } from '@starknet-react/chains'
import { Connector, StarknetConfig, starkscan } from '@starknet-react/core'
import { RpcProvider, constants } from 'starknet'

import { getNetworkConstants } from './constants'
import { Network } from './utils/nexus'

import type { Chain } from '@starknet-react/chains'
import type { PropsWithChildren } from 'react'
import { ColorMode, ControllerOptions, SessionPolicies } from '@cartridge/controller'

interface StarknetProviderProps extends PropsWithChildren {
  network: Network;
}

export function StarknetProvider({ children, network }: StarknetProviderProps) {
  // Get network constants based on the current network
  const networkConstants = getNetworkConstants(network);
  console.log("StarknetProvider using network:", network);
  
  // Define session policies
  const policies: SessionPolicies = {
    contracts: {
      [networkConstants.ARENA_ADDRESS]: {
        methods: [
          { entrypoint: "create" },
          { entrypoint: "join" },
          { entrypoint: "transfer" },
          { entrypoint: "leave" },
          { entrypoint: "start" },
          { entrypoint: "delete" },
          { entrypoint: "kick" },
        ],
      },
      [networkConstants.NEXUS_ADDRESS]: {
        methods: [
          { entrypoint: "deploy_forces" },
          { entrypoint: "patrol" },
          { entrypoint: "attack" },
          { entrypoint: "defend" },
          { entrypoint: "move_unit" },
          { entrypoint: "stealth" },
          { entrypoint: "heal" },
          { entrypoint: "recon" },
          { entrypoint: "force_end_player_turn" },
          { entrypoint: "capture_flag" },
          { entrypoint: "boost" },
        ],
      },
    },
  };
  
  const colorMode: ColorMode = "dark";
  const theme = "";
  const namespace = "command_nexus";
  
  const getChainIdForNetwork = (networkValue: Network) => {
    switch (networkValue) {
      case 'sepolia':
        return constants.StarknetChainId.SN_SEPOLIA;
      case 'mainnet':
        return constants.StarknetChainId.SN_MAIN;
      case 'katana':
      default:
        return constants.StarknetChainId.SN_MAIN;
    }
  };
  
  const options: ControllerOptions = {
    chains: [
      {
        rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
      },
      {
        rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
      },
    ],
    defaultChainId: getChainIdForNetwork(network),
    namespace,
    policies,
    theme,
    colorMode,
  };
  
  const cartridge = new ControllerConnector(
    options,
  ) as never as Connector;
  
  function provider(chain: Chain) {
    switch (chain) {
      case mainnet:
        return new RpcProvider({
          nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet',
        });
      case sepolia:
      default:
        return new RpcProvider({
          nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
        });
    }
  }
  
  return (
    <StarknetConfig
      autoConnect
      chains={[mainnet, sepolia]}
      connectors={[cartridge]}
      explorer={starkscan}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
}