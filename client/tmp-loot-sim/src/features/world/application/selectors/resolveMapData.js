import { mapsData } from "../../domain/mapsData";
import { getPoiEncounterBindingsForMap } from "../../infrastructure/worldEncounterMasterDataAdapter";
function resolvePoiActionEncounterBinding(mapId, poiId, action) {
    if (action.effect !== "trigger_encounter" || action.encounterKey) {
        return action;
    }
    const binding = getPoiEncounterBindingsForMap(mapId).find((entry) => entry.poiId === poiId &&
        entry.actionId === action.id);
    if (!binding) {
        return action;
    }
    return {
        ...action,
        encounterKey: binding.encounterKey,
    };
}
function resolveMapPoi(mapId, poi) {
    if (!poi.actions || poi.actions.length === 0) {
        return poi;
    }
    return {
        ...poi,
        actions: poi.actions.map((action) => resolvePoiActionEncounterBinding(mapId, poi.id, action)),
    };
}
export function resolveMapData(mapId) {
    const mapData = mapsData[mapId];
    return {
        ...mapData,
        pois: mapData.pois.map((poi) => resolveMapPoi(mapId, poi)),
    };
}
