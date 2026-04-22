import { getMapEncounterPoolMasterData } from "../../infrastructure/worldEncounterMasterDataAdapter";
export function getMapEncounterPool(mapId) {
    const pool = getMapEncounterPoolMasterData(mapId);
    if (!pool) {
        return [];
    }
    return pool.entries.flatMap((entry) => entry.weight > 0 ? [entry.encounterKey] : []);
}
