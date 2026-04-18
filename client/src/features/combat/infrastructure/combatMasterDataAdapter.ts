import { encounterTemplatesData } from "../domain/encounterTemplatesData";
import { lootTablesData } from "../domain/lootTablesData";
import { speciesLootTableBindings } from "../domain/speciesLootTableBindings";
import type {
  EncounterKey,
  EncounterTemplate,
} from "../domain/encounterTemplateTypes";
import type { LootTableDefinition, LootTableId } from "../domain/lootTypes";
import type { CreatureSpeciesId } from "../../creatures";

// Local master-data adapter for combat content.
// This is the backend migration boundary for encounter templates, loot tables,
// and species loot bindings.
export function getEncounterTemplateMasterData(
  encounterKey: EncounterKey
): EncounterTemplate | null {
  return encounterTemplatesData[encounterKey] ?? null;
}

export function getAllEncounterTemplateMasterData(): Record<
  EncounterKey,
  EncounterTemplate
> {
  return encounterTemplatesData;
}

export function getLootTableMasterData(
  lootTableId: LootTableId
): LootTableDefinition | null {
  return lootTablesData[lootTableId] ?? null;
}

export function getAllLootTableMasterData(): Record<
  LootTableId,
  LootTableDefinition
> {
  return lootTablesData;
}

export function getSpeciesLootTableBinding(
  speciesId: CreatureSpeciesId
): LootTableId | null {
  return speciesLootTableBindings[speciesId] ?? null;
}
