import { convertTypeToNumericEnum } from "../lib/utils";
import { UnitMode } from "./models.gen";


// Create and export the numeric enum
export const EnumUnitMode = Object.freeze(convertTypeToNumericEnum({} as UnitMode));

// Create type for enum values (will be numbers)
export type UnitModeEnumNew = typeof EnumUnitMode[keyof typeof EnumUnitMode];