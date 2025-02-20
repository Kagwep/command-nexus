import { CommandNexusSchemaType } from '../dojogen/models.gen';
import { ClauseBuilder, ParsedEntity, ToriiQueryBuilder } from '@dojoengine/sdk';
import { useDojoSDK } from '@dojoengine/sdk/react';
import { useEffect } from 'react';
import { useGameStore } from './nexusstore';
import { hexToUtf8 } from './unpack';
import { abilityStringToEnum } from './nexus';

// Helper to extract primitive value
const getPrimitiveValue = (field: any) => {
   
    if (field?.type === 'primitive') {
       
        switch (field.type_name) {
            case 'ContractAddress':
                return field.value;
            case 'u256':
            case 'u64':
                return BigInt(field.value).toString();
            case 'felt252':
                const utf8Value = hexToUtf8(field.value);
                if (utf8Value) return utf8Value;
                
                // If it's not a string, convert the hex to a number
                // Remove '0x' prefix and convert from hex to decimal
                return BigInt(field.value).toString();
            case 'bool':
                return field.value;
            default:
                return Number(field.value);
        }
    }

    // Handle struct types
    if (field?.type === 'struct') {
        // If the struct has a nested value object, process each field recursively
        console.log(field.value)
        if (typeof field.value === 'object') {
            console.log(".mlknkl")
            const result: Record<string, any> = {};
            for (const [key, value] of Object.entries(field.value)) {
                console.log(key, value)
                result[key] = getPrimitiveValue(value);
            }
            return result;
        }
        // If it's a simple struct, process it like a primitive
        return getPrimitiveValue({
            type: 'primitive',
            type_name: field.type_name,
            value: field.value
        });
    }

    if (field?.type === 'enum') {
        return field.value.option;
    }
    return field;
};

// Transform functions
const transformGame = (rawData: any) => {
    const gameData = rawData['command_nexus-Game'];
    if (!gameData) return null;

    //console.log(gameData)

    return {
        fieldOrder: [],
        game_id: getPrimitiveValue(gameData.game_id),
        next_to_move: getPrimitiveValue(gameData.next_to_move),
        minimum_moves: getPrimitiveValue(gameData.minimum_moves),
        over: getPrimitiveValue(gameData.over),
        player_count: getPrimitiveValue(gameData.player_count),
        unit_count: getPrimitiveValue(gameData.unit_count),
        nonce: getPrimitiveValue(gameData.nonce),
        price: getPrimitiveValue(gameData.price),
        clock: getPrimitiveValue(gameData.clock),
        penalty: getPrimitiveValue(gameData.penalty),
        limit: getPrimitiveValue(gameData.limit),
        winner: getPrimitiveValue(gameData.winner),
        arena_host: getPrimitiveValue(gameData.arena_host),
        seed: getPrimitiveValue(gameData.seed),
        available_home_bases : {
            fieldOrder: [],
            base1: getPrimitiveValue(gameData.available_home_bases.value.base1),
			base2: getPrimitiveValue(gameData.available_home_bases.value.base2),
			base3: getPrimitiveValue(gameData.available_home_bases.value.base3),
			base4: getPrimitiveValue(gameData.available_home_bases.value.base4),
        },
        player_name: getPrimitiveValue(gameData.player_name)
    };
};


const transformPlayer = (rawData: any) => {
    const playerData = rawData['command_nexus-Player'];
    if (!playerData) return null;

    return {
      fieldOrder: [],
        game_id: getPrimitiveValue(playerData.game_id),
        index: getPrimitiveValue(playerData.index),
        address: getPrimitiveValue(playerData.address),
        name: getPrimitiveValue(playerData.name),
        supply:{
            
                fieldOrder: [],
                infantry: getPrimitiveValue(playerData.supply.value.infantry),
                armored: getPrimitiveValue(playerData.supply.value.armored),
                air: getPrimitiveValue(playerData.supply.value.air),
                naval: getPrimitiveValue(playerData.supply.value.naval),
                cyber: getPrimitiveValue(playerData.supply.value.cyber),
                game_id: getPrimitiveValue(playerData.supply.value.game_id),
                player_id: getPrimitiveValue(playerData.supply.value.player_id),

            },
        last_action: getPrimitiveValue(playerData.last_action),
        rank: getPrimitiveValue(playerData.rank),
        player_score: {
            fieldOrder: [],
            score: getPrimitiveValue(playerData.player_score.value.score),
			kills: getPrimitiveValue(playerData.player_score.value.deaths),
			deaths: getPrimitiveValue(playerData.player_score.value.kills),
			assists: getPrimitiveValue(playerData.player_score.value.score),
        },
        home_base:getPrimitiveValue(playerData.home_base),
        commands_remaining: getPrimitiveValue(playerData.commands_remaining),
        turn_start_time: getPrimitiveValue(playerData.turn_start_time),
        flags_captured: getPrimitiveValue(playerData.flags_captured),
        booster:getPrimitiveValue(playerData.booster),
    };
};


const transformInfantry = (rawData: any) => {
    const infantryData = rawData['command_nexus-Infantry'];
    if (!infantryData) return null;

    return {
        fieldOrder: [],
        game_id: getPrimitiveValue(infantryData.game_id),
        unit_id: getPrimitiveValue(infantryData.unit_id),
        player_id: getPrimitiveValue(infantryData.player_id),
        range: getPrimitiveValue(infantryData.range),
        energy: getPrimitiveValue(infantryData.energy),
        accuracy: getPrimitiveValue(infantryData.accuracy),
        ammunition: getPrimitiveValue(infantryData.ammunition),
        accessories: {
			fieldOrder: [],
			ammunition: getPrimitiveValue(infantryData.accessories.value.ammunition),
			first_aid_kit: getPrimitiveValue(infantryData.accessories.value.first_aid_kit),
        },
        health: {
			fieldOrder: [],
			current: getPrimitiveValue(infantryData.health.value.current),
			max: getPrimitiveValue(infantryData.health.value.max),
        },
        position: {
            fieldOrder: [],
            coord: {
                fieldOrder: [],
                x: getPrimitiveValue(infantryData.position.value.coord.value.x),
                y: getPrimitiveValue(infantryData.position.value.coord.value.y),
                z: getPrimitiveValue(infantryData.position.value.coord.value.z),
            }
        },
        battlefield_name: getPrimitiveValue(infantryData.battlefield_name),
    };
};



const transformAbilityState = (rawData: any) => {
    const abilityStateData = rawData['command_nexus-AbilityState'];
    if (!abilityStateData) return null;

    return {
        fieldOrder: [],
        game_id: getPrimitiveValue(abilityStateData.game_id),
        unit_id: getPrimitiveValue(abilityStateData.unit_id),
        player_id: getPrimitiveValue(abilityStateData.player_id),
        is_active: getPrimitiveValue(abilityStateData.is_active),
        cooldown: getPrimitiveValue(abilityStateData.cooldown),
        effectiveness: getPrimitiveValue(abilityStateData.effectiveness),
        unit: getPrimitiveValue(abilityStateData.unit),
        units_abilities_state: {
            fieldOrder: [],
            move_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.move_level),
            attack_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.attack_level),
            defend_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.defend_level),
            patrol_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.patrol_level),
            stealth_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.stealth_level),
            recon_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.recon_level),
            hack_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.hack_level),
            repair_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.repair_level),
            airlift_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.airlift_level),
            bombard_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.bombard_level),
            submerge_level: getPrimitiveValue(abilityStateData.units_abilities_state.value.submerge_level),
        },
    };
}



const transformUnitState = (rawData: any) => {
    const unitStateData = rawData['command_nexus-UnitState'];
    if (!unitStateData) return null;
  
    return {

        fieldOrder: [],
        game_id: getPrimitiveValue(unitStateData.game_id),
        unit_id: getPrimitiveValue(unitStateData.unit_id),
        player_id: getPrimitiveValue(unitStateData.player_id),
        x: getPrimitiveValue(unitStateData.x),
        y: getPrimitiveValue(unitStateData.y),
        z: getPrimitiveValue(unitStateData.z),
        mode: getPrimitiveValue(unitStateData.mode),
        environment: {
            fieldOrder: [],
            terrain: getPrimitiveValue(unitStateData.environment.value.terrain),
            cover_level: getPrimitiveValue(unitStateData.environment.value.cover_level),
            elevation: getPrimitiveValue(unitStateData.environment.value.elevation),
        }
  
  }
  }

const transformEntities = (rawEntities: any[], transformFn: (data: any) => any) => {
    return rawEntities
        .map(entity => transformFn(entity))
        .filter(entity => entity !== null);
};


export const useAllEntities = (pollInterval = 5000) => {
    const { useDojoStore, client, sdk } = useDojoSDK();
    const state = useDojoStore((state) => state);
    const { setGame, setPlayer, setAbilityState, setInfantry,setUnitState} = useGameStore();

    const fetchAllEntities = async () => {
        try {
            const res = await sdk.client.getEntities(
                new ToriiQueryBuilder()
                    .withClause(
                        new ClauseBuilder()
                            .keys([], [undefined], "VariableLen")
                            .build()
                    )
                    .build()
            );
            
            console.log("Raw entities:", res);

            // Group entities by type
            const entities = {
                games: [],
                players: [],
                infantrys: [],
                abilityStates: [],
                unitStates: []
            };

              // Convert object to array if it's not already
              const entityArray = Array.isArray(res) ? res : Object.values(res);
                          
              entityArray.forEach((entity) => {
                if ('command_nexus-Game' in entity) {
                    const game = transformGame(entity);
                    if (game) setGame(game);
                }
                if ('command_nexus-Player' in entity) {
                    const player = transformPlayer(entity);
                    if (player) setPlayer(player);
                }
                if ('command_nexus-Infantry' in entity) {
                    const infantry = transformInfantry(entity);
                    if (infantry) setInfantry(infantry);
                }
                if ('command_nexus-AbilityState' in entity) {
                    const abilityState = transformAbilityState(entity);
                    if (abilityState) setAbilityState(abilityState);
                }
                if ('command_nexus-UnitState' in entity) {
                    const unitState = transformUnitState(entity);
                    if (unitState) setUnitState(unitState);
                }
            });

            // Transform each type of entity
            const transformed = {
                games: transformEntities(entities.games, transformGame),
                players: transformEntities(entities.players, transformPlayer),
                abilitySates: transformEntities(entities.abilityStates, transformAbilityState),
                infantrys: transformEntities(entities.infantrys, transformInfantry),
                unitStates: transformEntities(entities.unitStates, transformUnitState),
               
            };

            console.log(transformed)


            return transformed;
        } catch (error) {
            console.error("Error fetching entities:", error);
        }
    };

    useEffect(() => {
      let isMounted = true;
      let intervalId: NodeJS.Timeout;

      const startPolling = async () => {
          if (!sdk?.client) return;
          
          // Initial fetch
          await fetchAllEntities();

          // Set up polling only if component is still mounted
          if (isMounted) {
              intervalId = setInterval(fetchAllEntities, pollInterval);
          }
      };

      startPolling();

      // Cleanup
      return () => {
          isMounted = false;
          if (intervalId) {
              clearInterval(intervalId);
          }
      };
  }, [pollInterval]); // Only depend on sdk.client and pollInterval

    return {
      state: useGameStore(),
        refetch: fetchAllEntities
    };
};