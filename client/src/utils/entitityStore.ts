import { create, StoreApi, UseBoundStore } from 'zustand'
import { useCallback, useEffect, useRef } from 'react'
import { Game, Player } from '../dojogen/models.gen'


export type EntityStore<T> = UseBoundStore<StoreApi<EntityStoreState<T>>>

// Generic type for different entity stores
interface EntityStoreState<T> {
    entities: Record<string, T>
    isLoading: boolean
    offset: number
    setEntities: (entities: Record<string, T>) => void
    addEntities: (entities: T[], idKey?: keyof T) => void
    setLoading: (loading: boolean) => void
    setOffset: (offset: number) => void
    clearEntities: () => void
  }

// Create store factory function
const createEntityStore = <T,>() => {
    return create<EntityStoreState<T>>((set) => ({
      entities: {},
      isLoading: false,
      offset: 0,
      setEntities: (entities) => set({ entities }),
      addEntities: (newEntities, idKey = 'id' as keyof T) => 
        set((state) => ({
          entities: {
            ...state.entities,
            ...Object.fromEntries(
              newEntities.map(entity => [entity[idKey] as string, entity])
            )
          }
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setOffset: (offset) => set({ offset }),
      clearEntities: () => set({ entities: {}, offset: 0 }),
    }))
  }
  


export const usePlayerStore = createEntityStore<Player>()
export const useGameStore = createEntityStore<Game>()