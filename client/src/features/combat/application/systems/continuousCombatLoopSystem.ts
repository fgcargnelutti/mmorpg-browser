import type { EncounterKey } from "../../../../data/encountersData";
import type { MapData } from "../../../world/domain/mapsData";
import { getMapEncounterPool } from "../../../world/application/selectors/getMapEncounterPool";

export type ContinuousCombatLoopStatus = "idle" | "hunting" | "stopped";

export type ContinuousCombatLoopStopReason =
  | "manual"
  | "defeat"
  | "retreat"
  | "unavailable";

export function pickRandomEncounterFromMap(
  mapData: MapData,
  randomValue = Math.random()
): EncounterKey | null {
  const pool = getMapEncounterPool(mapData.id);

  if (pool.length === 0) {
    return null;
  }

  const index = Math.min(pool.length - 1, Math.floor(randomValue * pool.length));
  return pool[index] ?? null;
}
