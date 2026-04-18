import type { MapData, MapGlobalAction } from "../../domain/mapsData";
import { getMapEncounterPool } from "../selectors/getMapEncounterPool";

export function getMapGlobalActions(mapData: MapData): MapGlobalAction[] {
  return mapData.globalActions ?? [];
}

export function isSearchForHuntAction(action: MapGlobalAction): boolean {
  return action.effect === "search-for-hunt";
}

export function canMapStartHunting(mapData: MapData): boolean {
  return getMapEncounterPool(mapData.id).length > 0;
}
