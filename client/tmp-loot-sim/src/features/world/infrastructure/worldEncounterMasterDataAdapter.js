import { mapEncounterPoolsData } from "../domain/mapEncounterPoolsData";
import { poiEncounterBindingsData } from "../domain/poiEncounterBindingsData";
// Local master-data adapter for world encounter distribution.
// Later this can read server-authored map spawn tables and PoI bindings.
export function getMapEncounterPoolMasterData(mapId) {
    return mapEncounterPoolsData[mapId] ?? null;
}
export function getAllMapEncounterPoolMasterData() {
    return mapEncounterPoolsData;
}
export function getPoiEncounterBindingsForMap(mapId) {
    return poiEncounterBindingsData.filter((binding) => binding.mapId === mapId);
}
export function getAllPoiEncounterBindingsMasterData() {
    return poiEncounterBindingsData;
}
