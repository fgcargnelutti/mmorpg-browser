"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encountersData = void 0;
const encounterTemplatesData_1 = require("../features/combat/domain/encounterTemplatesData");
const resolveEncounterData_1 = require("../features/combat/application/selectors/resolveEncounterData");
exports.encountersData = Object.fromEntries(Object.entries(encounterTemplatesData_1.encounterTemplatesData).map(([encounterKey, template]) => {
    const resolvedEncounter = (0, resolveEncounterData_1.resolveEncounterTemplate)(template);
    if (!resolvedEncounter) {
        throw new Error(`Missing canonical species data for encounter ${encounterKey}.`);
    }
    return [encounterKey, resolvedEncounter];
}));
