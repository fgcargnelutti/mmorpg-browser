"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEncounterTemplateMasterData = getEncounterTemplateMasterData;
exports.getAllEncounterTemplateMasterData = getAllEncounterTemplateMasterData;
exports.getLootTableMasterData = getLootTableMasterData;
exports.getAllLootTableMasterData = getAllLootTableMasterData;
exports.getSpeciesLootTableBinding = getSpeciesLootTableBinding;
const encounterTemplatesData_1 = require("../domain/encounterTemplatesData");
const lootTablesData_1 = require("../domain/lootTablesData");
const speciesLootTableBindings_1 = require("../domain/speciesLootTableBindings");
// Local master-data adapter for combat content.
// This is the backend migration boundary for encounter templates, loot tables,
// and species loot bindings.
function getEncounterTemplateMasterData(encounterKey) {
    return encounterTemplatesData_1.encounterTemplatesData[encounterKey] ?? null;
}
function getAllEncounterTemplateMasterData() {
    return encounterTemplatesData_1.encounterTemplatesData;
}
function getLootTableMasterData(lootTableId) {
    return lootTablesData_1.lootTablesData[lootTableId] ?? null;
}
function getAllLootTableMasterData() {
    return lootTablesData_1.lootTablesData;
}
function getSpeciesLootTableBinding(speciesId) {
    return speciesLootTableBindings_1.speciesLootTableBindings[speciesId] ?? null;
}
