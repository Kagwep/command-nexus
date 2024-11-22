import { Game } from "@/dojogen/models.gen";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import useModel from "./useModel";
import { useSDK } from "../context/SDKContext";
import { useEffect } from "react";
import { useDojoStore } from "../lib/utils";
import { useEntityStore } from "./useEntityStore";

export const useGameInfantry = () => {
    // Get all known infantry IDs first
    const infantryIds = useEntityStore(state => state.modelEntityIds["Infantry"] || []);
    
    // Always call useModel the same number of times each render
    const infantry = infantryIds.map(id => useModel(id, "command_nexus-Infantry"));
  
  
    const activeInfantry = infantry.filter(unit => unit?.health?.current > 0);
  
    return { infantry: infantry, activeInfantry };
  };