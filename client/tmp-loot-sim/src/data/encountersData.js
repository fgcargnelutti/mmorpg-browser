import { encounterTemplatesData } from "../features/combat/domain/encounterTemplatesData";
import { resolveEncounterTemplate } from "../features/combat/application/selectors/resolveEncounterData";
export const encountersData = Object.fromEntries(Object.entries(encounterTemplatesData).map(([encounterKey, template]) => {
    const resolvedEncounter = resolveEncounterTemplate(template);
    if (!resolvedEncounter) {
        throw new Error(`Missing canonical species data for encounter ${encounterKey}.`);
    }
    return [encounterKey, resolvedEncounter];
}));
