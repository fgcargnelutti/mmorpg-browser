import { getMapEncounterPool } from "../../../world/application/selectors/getMapEncounterPool";
export function pickRandomEncounterFromMap(mapData, randomValue = Math.random()) {
    const pool = getMapEncounterPool(mapData.id);
    if (pool.length === 0) {
        return null;
    }
    const index = Math.min(pool.length - 1, Math.floor(randomValue * pool.length));
    return pool[index] ?? null;
}
