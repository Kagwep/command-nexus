import { CommandNexusSchemaType, Player } from "@/dojogen/models.gen";
import { sanitizePlayer } from "../utils/sanitizer";
import { createDojoStore } from "@dojoengine/sdk";
import { ToriiClient } from "@dojoengine/torii-client";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatCurrency(value: number): string {
  return (value / 10 ** 18).toFixed(4);
}


export const useDojoStore = createDojoStore<CommandNexusSchemaType>();


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