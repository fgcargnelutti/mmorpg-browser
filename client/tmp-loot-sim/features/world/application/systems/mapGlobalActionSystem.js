import { getMapEncounterPool } from "../selectors/getMapEncounterPool";
export function getMapGlobalActions(mapData) {
    return mapData.globalActions ?? [];
}
export function isSearchForHuntAction(action) {
    return action.effect === "search-for-hunt";
}
export function canMapStartHunting(mapData) {
    return getMapEncounterPool(mapData.id).length > 0;
}
