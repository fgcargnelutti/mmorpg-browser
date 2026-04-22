"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreatureSpeciesMasterData = getCreatureSpeciesMasterData;
exports.getAllCreatureSpeciesMasterData = getAllCreatureSpeciesMasterData;
const creatureSpeciesData_1 = require("../domain/creatureSpeciesData");
// Local master-data adapter.
// Today it reads static frontend records; later it can be swapped for
// backend-provided species payloads without changing selectors or UI callers.
function getCreatureSpeciesMasterData(speciesId) {
    return creatureSpeciesData_1.creatureSpeciesData[speciesId] ?? null;
}
function getAllCreatureSpeciesMasterData() {
    return creatureSpeciesData_1.creatureSpeciesData;
}
