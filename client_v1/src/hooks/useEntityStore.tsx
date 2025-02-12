import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type EntityStore = {
  entities: Record<string, {
    entityId: string;
    models: any; // Type this based on your schema
  }>;
  modelEntityIds: Record<string, string[]>; // e.g., "Infantry" -> [entityId1, entityId2]
  addEntity: (data: { entityId: string; models: any }) => void;
};

export const useEntityStore = create<EntityStore>()(
  subscribeWithSelector((set) => ({
    entities: {},
    modelEntityIds: {},
    addEntity: (data) => set((state) => {
      const modelTypes = Object.keys(data.models.command_nexus);
      const newModelEntityIds = { ...state.modelEntityIds };

      modelTypes.forEach(modelType => {
        if (!newModelEntityIds[modelType]) {
          newModelEntityIds[modelType] = [];
        }
        if (!newModelEntityIds[modelType].includes(data.entityId)) {
          newModelEntityIds[modelType].push(data.entityId);
        }
      });

      return {
        entities: { ...state.entities, [data.entityId]: data },
        modelEntityIds: newModelEntityIds
      };
    })
  }))
);