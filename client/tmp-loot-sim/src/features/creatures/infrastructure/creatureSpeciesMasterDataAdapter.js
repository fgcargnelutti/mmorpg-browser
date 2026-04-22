import { creatureSpeciesData } from "../domain/creatureSpeciesData";
// Local master-data adapter.
// Today it reads static frontend records; later it can be swapped for
// backend-provided species payloads without changing selectors or UI callers.
export function getCreatureSpeciesMasterData(speciesId) {
    return creatureSpeciesData[speciesId] ?? null;
}
export function getAllCreatureSpeciesMasterData() {
    return creatureSpeciesData;
}
