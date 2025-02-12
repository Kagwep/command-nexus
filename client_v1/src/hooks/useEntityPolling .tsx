import { Game, Player } from "@/dojogen/models.gen"
import { EntityStore, useGameStore, usePlayerStore } from "../utils/entitityStore"
import { useCallback, useEffect, useRef } from "react"
import { parseEntity } from "../lib/utils"

const createEntityPolling = <T,>(
    modelName: string,
    useStore: EntityStore<T>,
    idKey: keyof T = 'id' as keyof T
  ) => {
    return (client: any) => {
      const { addEntities } = useStore()


      const fetchEntities = useCallback(async () => {
        if (!client) return
        const PAGE_SIZE = 4
        try {

          const response = await client.getEntities({
            clause: {
              Member: {
                member: 'address',
                model: modelName,
                operator: 'Neq',
                value: {
                  Primitive: {
                    ContractAddress: '0x0',
                  },
                },
              },
            },
            limit: PAGE_SIZE,
            dont_include_hashed_keys: true,
            offset: 0
          })
          console.log("this is the respose", response)

          if (response && response.length > 0) {
            // const parsedEntity = parseEntity<T>(modelName, entity[modelName])
            // console.log(parsedEntity)
            // addEntities([parsedEntity], idKey)
            
          }

          return response && response.length === PAGE_SIZE
        } catch (error) {
          console.error('Error fetching entities:', error)
          return false
        } finally {
          
        }
      }, [client, addEntities])
  
      // Handle real-time entity updates
      const handleEntityUpdate = useCallback(async (hashed_keys: string, entity: any) => {
        if (entity[modelName]) {
          console.log(`${modelName} entity updated:`, entity[modelName])
          const parsedEntity = parseEntity<T>(modelName, entity[modelName])
          console.log(parsedEntity)
          addEntities([parsedEntity], idKey)
          //fetchEntities()
        }
      }, [addEntities])
  
      useEffect(() => {
        if (!client) return
  
        client.onEntityUpdated(
          [{
            Keys: {
              keys: [],
              pattern_matching: 'VariableLen',
              models: [modelName],
            },
          }],
          handleEntityUpdate,
        )
        fetchEntities();
      }, [client, handleEntityUpdate])
  
      return {}
    }
  }
  // Create specific polling hooks
  export const usePlayerPolling = createEntityPolling<Player>(
    'command_nexus-Player',
    usePlayerStore,
    'address'
  )


  export const useGamePolling = createEntityPolling<Game>(
    'command_nexus-Game',
    useGameStore,
    'game_id'
  )