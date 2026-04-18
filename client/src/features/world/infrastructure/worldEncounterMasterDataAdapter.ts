import { mapEncounterPoolsData } from "../domain/mapEncounterPoolsData";
import { poiEncounterBindingsData } from "../domain/poiEncounterBindingsData";
import type { MapId } from "../domain/mapsData";
import type {
  MapEncounterPoolDefinition,
  PoiEncounterBinding,
} from "../domain/mapEncounterPoolTypes";

// Local master-data adapter for world encounter distribution.
// Later this can read server-authored map spawn tables and PoI bindings.
export function getMapEncounterPoolMasterData(
  mapId: MapId
): MapEncounterPoolDefinition | null {
  return mapEncounterPoolsData[mapId] ?? null;
}

export function getAllMapEncounterPoolMasterData(): Partial<
  Record<MapId, MapEncounterPoolDefinition | undefined>
> {
  return mapEncounterPoolsData;
}

export function getPoiEncounterBindingsForMap(mapId: MapId): PoiEncounterBinding[] {
  return poiEncounterBindingsData.filter((binding) => binding.mapId === mapId);
}

export function getAllPoiEncounterBindingsMasterData(): PoiEncounterBinding[] {
  return poiEncounterBindingsData;
}
