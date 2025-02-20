import { validateAndParseAddress } from 'starknet';
import { feltToStr, unpackU128toNumberArray } from './unpack';
import { Armored, Infantry,  } from './types';
import { Player } from '../dojogen/models.gen';

export const sanitizeGame = (game: any) => {
  return {
    ...game,
    arena: bigIntAddressToString(game.arena_host),
    player_count: game.player_count,
  };
};

export const sanitizePlayer = (player: any): Player => {
  return {
    ...player,
    address: bigIntAddressToString(player.address),
    name: feltToStr(player.name),
  };
};

export const sanitizeInfantry = (infantry: any): Infantry => {
  return infantry as Infantry; //add more santizing
};


export const sanitizeArmored = (armored: any): Armored => {
  return armored as Armored; //add more santizing
};


export const bigIntAddressToString = (address: bigint) => {
  return removeLeadingZeros(validateAndParseAddress(address));
};

export const shortAddress = (address: string, size = 4) => {
  return `${address.slice(0, size)}...${address.slice(-size)}`;
};

export const removeLeadingZeros = (address: string) => {
  // Check if the address starts with '0x' and then remove leading zeros from the hexadecimal part
  if (address.startsWith('0x')) {
    return '0x' + address.substring(2).replace(/^0+/, '');
  }
  // Return the original address if it doesn't start with '0x'
  return address;
};
