import { encounterTemplatesData } from "../domain/encounterTemplatesData";
import { lootTablesData } from "../domain/lootTablesData";
import { speciesLootTableBindings } from "../domain/speciesLootTableBindings";
// Local master-data adapter for combat content.
// This is the backend migration boundary for encounter templates, loot tables,
// and species loot bindings.
export function getEncounterTemplateMasterData(encounterKey) {
    return encounterTemplatesData[encounterKey] ?? null;
}
export function getAllEncounterTemplateMasterData() {
    return encounterTemplatesData;
}
export function getLootTableMasterData(lootTableId) {
    return lootTablesData[lootTableId] ?? null;
}
export function getAllLootTableMasterData() {
    return lootTablesData;
}
export function getSpeciesLootTableBinding(speciesId) {
    return speciesLootTableBindings[speciesId] ?? null;
}
