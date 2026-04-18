import { creatureSpeciesData } from "../domain/creatureSpeciesData";
import type {
  CreatureSpeciesData,
  CreatureSpeciesId,
} from "../domain/creatureSpeciesTypes";

// Local master-data adapter.
// Today it reads static frontend records; later it can be swapped for
// backend-provided species payloads without changing selectors or UI callers.
export function getCreatureSpeciesMasterData(
  speciesId: CreatureSpeciesId
): CreatureSpeciesData | null {
  return creatureSpeciesData[speciesId] ?? null;
}

export function getAllCreatureSpeciesMasterData(): Partial<
  Record<CreatureSpeciesId, CreatureSpeciesData | undefined>
> {
  return creatureSpeciesData;
}
