import { Network } from './utils/nexus';
import { MANIFEST_DEV, MANIFEST_MAINNET, MANIFEST_SEPOLIA } from 'dojoConfig';


// Sepolia network constants
export const SEPOLIA = {
    TORII_RPC_URL: "https://api.cartridge.gg/x/starknet/sepolia",
    TORII_URL: "https://api.cartridge.gg/x/command-nexus-10/torii",
    NEXUS_ADDRESS: "0x5c50a92b3a9608da4fddc267438f705860a8921b5d7d228d1a2bb722e854b6c",
    ARENA_ADDRESS: "0x1e822ce8ed4b685dc790e5a93b42f7a3158a741cb9558a64347bd68432a7174",
    WORLD_ADDRESS: MANIFEST_SEPOLIA.world.address,
    MANIFEST: MANIFEST_SEPOLIA, 
  };
  
  // Mainnet network constants
  export const MAINNET = {
    TORII_RPC_URL: "https://api.cartridge.gg/x/starknet/mainnet", 
    TORII_URL: "https://api.cartridge.gg/x/command-nexus-1/torii", 
    NEXUS_ADDRESS: "0x661643d649a8c16bf5420dcc655476e2be87b26fec1d5ac5dc69550750bd1bb", 
    ARENA_ADDRESS: "0x2cf9980aa91cfe9acea13a7ee90d6897aede4923dffe55907a3342abb0bd54b", 
    WORLD_ADDRESS: MANIFEST_MAINNET.world.address,
    MANIFEST: MANIFEST_MAINNET, 
  };


  // Katana/local network constants
export const KATANA = {
    TORII_RPC_URL: "", // Default Katana RPC
    TORII_URL: "http://localhost:8080",
    NEXUS_ADDRESS: "0x0", 
    ARENA_ADDRESS: "0x0", 
    WORLD_ADDRESS: MANIFEST_DEV.world.address,
    MANIFEST: MANIFEST_DEV,  
  };
  
  // Helper function to get constants based on network
export const getNetworkConstants = (network: Network) => {
    switch (network) {
      case 'sepolia':
        return SEPOLIA;
      case 'mainnet':
        return MAINNET;
      case 'katana':
      default:
        return KATANA;
    }
  };