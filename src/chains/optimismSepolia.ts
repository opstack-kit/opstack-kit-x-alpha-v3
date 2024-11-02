import type { Addresses } from '../types/addresses.js'

export const optimismSepoliaAddresses: Addresses<11155111> = {
  portal: {
    address: '0x16Fc5058F25648194471939df75CF27A2fdC48BC',
    chainId: 11155111,
    blockCreated: 4071248,
  },
  l2OutputOracle: {
    address: '0x90E9c4f8a994a250F6aEfd61CAFb4F2e895D458F',
    chainId: 11155111,
    blockCreated: 4071248,
  },
  l1StandardBridge: {
    address: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
    chainId: 11155111,
    blockCreated: 4071248,
  },
  l1CrossDomainMessenger: {
    address: '0x58Cc85b8D04EA49cC6DBd3CbFFd00B4B8D6cb3ef',
    chainId: 11155111,
    blockCreated: 4071248,
  },
  l1Erc721Bridge: {
    address: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
    chainId: 11155111,
    blockCreated: 4071248,
  },
} as const
