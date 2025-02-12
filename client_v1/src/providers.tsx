import ControllerConnector from '@cartridge/connector/controller'
import { mainnet, sepolia } from '@starknet-react/chains'
import { StarknetConfig, starkscan } from '@starknet-react/core'
import { RpcProvider } from 'starknet'

import {  ARENA_ADDRESS, NEXUS_ADDRESS, TORII_RPC_URL } from './constants'

import type { Chain } from '@starknet-react/chains'
import type { PropsWithChildren } from 'react'

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

const cartridge = new ControllerConnector({
   policies: [
    {
      target: ARENA_ADDRESS,
      method: 'create',
      description: 'Create new game',
    },
    {
      target: ARENA_ADDRESS,
      method: 'join', 
      description: 'Join existing game',
    },
    {
      target: ARENA_ADDRESS,
      method: 'transfer',
      description: 'Transfer game ownership',
    },
    {
      target: ARENA_ADDRESS,
      method: 'leave',
      description: 'Leave current game',
    },
    {
      target: ARENA_ADDRESS, 
      method: 'start',
      description: 'Start game',
    },
    {
      target: ARENA_ADDRESS,
      method: 'delete',
      description: 'Delete game',
    },
    {
      target: ARENA_ADDRESS,
      method: 'kick',
      description: 'Kick player from game',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'deploy_forces',
      description: 'Deploy units to battlefield',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'patrol',
      description: 'Set unit to patrol route',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'attack',
      description: 'Attack enemy unit',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'defend',
      description: 'Set unit to defend position',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'move_unit',
      description: 'Move unit to new position',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'stealth',
      description: 'Enter stealth mode',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'heal',
      description: 'Heal units in area',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'recon',
      description: 'Reconnaissance of area',
    },
    {
      target: NEXUS_ADDRESS,
      method: 'force_end_player_turn',
      description: 'Force end player turn',
    }
  ],
  url: 'https://x.cartridge.gg',
  rpc: TORII_RPC_URL,
  theme: '',
  // config: {
  //   presets: {
  //     flippyflop: {
  //       id: 'flippyflop',
  //       name: 'FlippyFlop',
  //       icon: '/whitelabel/flippyflop/icon.png',
  //       cover: '/whitelabel/flippyflop/cover.png',
  //       colors: {
  //         primary: '#F38332',
  //       },
  //     },
  //   },
  // },
  propagateSessionErrors: true,
})

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