import { CommandNexusSchemaType, Game, HomeBasesTuple, Player, PlayerScore, UnitsSupply } from "@/dojogen/models.gen";
import { sanitizePlayer } from "../utils/sanitizer";
//import { createDojoStore } from "@dojoengine/sdk";
import { ToriiClient } from "@dojoengine/torii-client";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RawEntity, StructValue } from "../utils/types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCurrency(value: number): string {
  return (value / 10 ** 18).toFixed(4);
}


//export const useDojoStore = createDojoStore<CommandNexusSchemaType>();


export async function fetchAllEntitiesPlayer(
  client: ToriiClient,
  updatePlayers?: (players: Record<string, Player>) => void,
): Promise<Record<string, Player>> {
  let allPlayers: Record<string, Player> = {}
  let cursor = 0
  let hasMore = true
  const size = 4

  while (hasMore) {
    const entities = await client.getEntities({
      clause: {
        Member: {
          member: 'address',
          model: "command_nexus-Player",
          operator: 'Neq',
          value: {
            Primitive: {
              ContractAddress: '0x0',
            },
          },
        },
      },
      limit: size,
      dont_include_hashed_keys: true,
      offset: 0
    })

    const fetchedPlayers = Object.values(entities).reduce(
      (acc, entity) => {
        if (!entity['command_nexus-Player']) {
          return acc
        }

        const player = sanitizePlayer(entity['command_nexus-Player'])
        acc[`${player.address}`] = player
        return acc
      },
      {} as Record<string, Player>,
    )

    allPlayers = { ...allPlayers, ...fetchedPlayers }

    if (updatePlayers) {
      updatePlayers(fetchedPlayers)
    }

    const fetchedCount = Object.keys(entities).length
    cursor += fetchedCount
    hasMore = fetchedCount === size
  }

  return allPlayers
}

const parseEnum = (enumValue: any) => {
  return enumValue.value.option

};

const parseUnitsSupply = (raw: StructValue): UnitsSupply => {
  const supply = raw.value;
  return {
    fieldOrder:['infantry', 'armored', 'air', 'naval', 'cyber'],
    cyber: Number(supply.cyber.value),
    armored: Number(supply.armored.value),
    air: Number(supply.air.value),
    infantry: Number(supply.infantry.value),
    naval: Number(supply.naval.value)
  } as UnitsSupply;
};

const parsePlayerScore = (raw: StructValue): PlayerScore => {
  const score = raw.value;
  return {
    fieldOrder:[],
    deaths: Number(score.deaths.value),
    assists: Number(score.assists.value),
    score: Number(score.score.value),
    kills: Number(score.kills.value)
  };
};


const parseHexValue = (hex: string) => {
  if (typeof hex !== 'string') return hex;
  return BigInt(hex).toString();
}

const parseHomeBasesTuple = (raw: StructValue): HomeBasesTuple => {
  const bases = raw.value;
  return {
    fieldOrder: [],
    base1: parseHexValue(bases.base1.value as string) as unknown as number,
    base2: parseHexValue(bases.base2.value as string) as unknown as number,
    base3: parseHexValue(bases.base3.value as string) as unknown as number,
    base4: parseHexValue(bases.base4.value as string) as unknown as number,
  };
};

// Main parser function
export const parseEntity = <T>(modelName: string, rawEntity: RawEntity): T => {
  switch (modelName) {
    case 'command_nexus-Game': {
      const parsedGame: Game = {
        game_id: Number(rawEntity.game_id.value),
        next_to_move: parseHexValue(rawEntity.next_to_move.value as string),
        minimum_moves: Number(rawEntity.minimum_moves.value),
        over: rawEntity.over.value as boolean,
        player_count: Number(rawEntity.player_count.value),
        unit_count: Number(rawEntity.unit_count.value),
        nonce: Number(rawEntity.nonce.value),
        price: Number(parseHexValue(rawEntity.price.value as string)),
        clock: Number(parseHexValue(rawEntity.clock.value as string)),
        penalty: Number(parseHexValue(rawEntity.penalty.value as string)),
        limit: Number(rawEntity.limit.value),
        winner: rawEntity.winner.value as string,
        arena_host: rawEntity.arena_host.value as string,
        seed: Number(parseHexValue(rawEntity.seed.value as string)),
        available_home_bases: parseHomeBasesTuple(rawEntity.available_home_bases as StructValue),
        player_name: Number(parseHexValue(rawEntity.player_name.value as string)),
        fieldOrder: Object.keys(rawEntity),
      };
      return parsedGame as T;
    }

    case 'command_nexus-Player': {
      const parsedPlayer: Player = {
        index: Number(rawEntity.index.value),
        commands_remaining: Number(rawEntity.commands_remaining.value),
        game_id: Number(rawEntity.game_id.value),
        home_base: parseEnum(rawEntity.home_base),
        turn_start_time: parseHexValue(rawEntity.turn_start_time.value as string) as unknown as number,
        supply: parseUnitsSupply(rawEntity.supply as StructValue),
        address: rawEntity.address.value as string,
        last_action: parseHexValue(rawEntity.last_action.value as string) as unknown as number,
        name: rawEntity.name.value as string,
        rank: Number(rawEntity.rank.value),
        player_score: parsePlayerScore(rawEntity.player_score as StructValue),
        fieldOrder:Object.keys(rawEntity),
      };
      return parsedPlayer as T;
    }
    // Add other entity types here
    // case 'command_nexus-Player': {
    //   return parsePlayer(rawEntity) as T;
    // }
    default:
      console.error(`Unknown model type: ${modelName}`);
      return rawEntity as T;
  }
};


export   const getGame = (gameId: number, nstate: Record<string, Game>): Game | undefined => {
  if (gameId === undefined || gameId === null) return undefined;
  return Object.values(nstate).find(game => game.game_id === gameId);
};