
import { useDojoSDK } from "@dojoengine/sdk/react";
import { CommandNexusSchemaType } from "../dojogen/models.gen";
import { ParsedEntity } from "@dojoengine/sdk";
/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
function useModels<N extends keyof CommandNexusSchemaType, M extends keyof CommandNexusSchemaType[N] & string>(
): Record<string, ParsedEntity<CommandNexusSchemaType>> {

    const { useDojoStore} = useDojoSDK();
    // Select only the specific model data for the given entityId
    const modelsData = useDojoStore(
        (state) =>  state.entities
    );

    return modelsData as Record<string, ParsedEntity<CommandNexusSchemaType>>;
}

export default useModels;