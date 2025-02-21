import ControllerConnector from '@cartridge/connector/controller'
import { mainnet, sepolia } from '@starknet-react/chains'
import { Connector, StarknetConfig, starkscan } from '@starknet-react/core'
import { RpcProvider,constants } from 'starknet'


import {  ARENA_ADDRESS, NEXUS_ADDRESS, TORII_RPC_URL } from './constants'

import type { Chain } from '@starknet-react/chains'
import type { PropsWithChildren } from 'react'
import { ColorMode, ControllerOptions, SessionPolicies } from '@cartridge/controller'

export function StarknetProvider({ children }: PropsWithChildren) {
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
  )
}

const policies: SessionPolicies = {
  contracts: {
    [ARENA_ADDRESS]: {
      methods: [
        {
          entrypoint: "create",
        },
        {
          entrypoint: "join",
        },
        {
          entrypoint: "transfer",
        },
        {
          entrypoint: "leave",
        },
        {
          entrypoint: "start",
        },
        {
          entrypoint: "delete",
        },
        {
          entrypoint: "kick",
        },
      ],
    },
    [NEXUS_ADDRESS]: {
      methods: [
        {
          entrypoint: "deploy_forces",
        },
        {
          entrypoint: "patrol",
        },
        {
          entrypoint: "attack",
        },
        {
          entrypoint: "defend",
        },
        {
          entrypoint: "move_unit",
        },
        {
          entrypoint: "stealth",
        },
        {
          entrypoint: "heal",
        },
        {
          entrypoint: "recon",
        },
        {
          entrypoint: "force_end_player_turn",
        },
        {
          entrypoint: "capture_flag",
        },
        {
          entrypoint: "boost",
        },
      ],
    },
  },
};

const colorMode: ColorMode = "dark";
const theme = "";
const namespace = "command_nexus";


const options: ControllerOptions = {
  chains: [
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    },
    {
      rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet",
    },
  ],
  defaultChainId: constants.StarknetChainId.SN_SEPOLIA,
  namespace,
  policies,
  theme,
  colorMode,
};


const cartridge = new ControllerConnector(
  options,
) as never as Connector

function provider(chain: Chain) {
  switch (chain) {
    case mainnet:
      return new RpcProvider({
        nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet',
      })
    case sepolia:
    default:
      return new RpcProvider({
        nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia',
      })
  }
}