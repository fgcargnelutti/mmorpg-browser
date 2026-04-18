import type { EncounterKey } from "../../../../data/encountersData";
import type { MapId } from "../../domain/mapsData";
import { getMapEncounterPoolMasterData } from "../../infrastructure/worldEncounterMasterDataAdapter";

export function getMapEncounterPool(mapId: MapId): EncounterKey[] {
  const pool = getMapEncounterPoolMasterData(mapId);

  if (!pool) {
    return [];
  }

  return pool.entries.flatMap((entry) =>
    entry.weight > 0 ? [entry.encounterKey] : []
  );
}
