import { useState, useEffect, useRef } from "react";
import useModel from "./useModel";
import { useEntityStore } from "./useEntityStore";

export const useGameInfantry = () => {
    const [infantry, setInfantry] = useState([]);
    const infantryIds = useEntityStore(state => state.modelEntityIds["Infantry"] || []);
    const previousInfantryRef = useRef([]); // Ref to store previous infantry data

    useEffect(() => {
        const fetchInfantry = () => {
            const newInfantry = infantryIds.map(id => useModel(id, "command_nexus-Infantry"));

            // Check if the new infantry data is different
            if (!arraysAreEqual(previousInfantryRef.current, newInfantry)) {
                previousInfantryRef.current = newInfantry; // Update reference
                setInfantry(newInfantry); // Update state only if there's a change
            }
        };

        fetchInfantry();

        const interval = setInterval(fetchInfantry, 1000); // Poll every 1 second
        return () => clearInterval(interval);
    }, [infantryIds]);

    const activeInfantry = infantry.filter(unit => unit?.health?.current > 0);

    return { infantry, activeInfantry };
};

// Helper function for deep equality check
const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return false; // Deep comparison
    }
    return true;
};
