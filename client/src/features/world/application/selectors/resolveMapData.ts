import type { ContextAction } from "../../domain/locations";
import { mapsData, type MapData, type MapId, type MapPoi } from "../../domain/mapsData";
import { getPoiEncounterBindingsForMap } from "../../infrastructure/worldEncounterMasterDataAdapter";

function resolvePoiActionEncounterBinding(
  mapId: MapId,
  poiId: string,
  action: ContextAction
): ContextAction {
  if (action.effect !== "trigger_encounter" || action.encounterKey) {
    return action;
  }

  const binding = getPoiEncounterBindingsForMap(mapId).find(
    (entry) =>
      entry.poiId === poiId &&
      entry.actionId === action.id
  );

  if (!binding) {
    return action;
  }

  return {
    ...action,
    encounterKey: binding.encounterKey,
  };
}

function resolveMapPoi(mapId: MapId, poi: MapPoi): MapPoi {
  if (!poi.actions || poi.actions.length === 0) {
    return poi;
  }

  return {
    ...poi,
    actions: poi.actions.map((action) =>
      resolvePoiActionEncounterBinding(mapId, poi.id, action)
    ),
  };
}

export function resolveMapData(mapId: MapId): MapData {
  const mapData = mapsData[mapId];

  return {
    ...mapData,
    pois: mapData.pois.map((poi) => resolveMapPoi(mapId, poi)),
  };
}
