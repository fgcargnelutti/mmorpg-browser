import { encounterTemplatesData } from "../features/combat/domain/encounterTemplatesData";
import type { EncounterKey } from "../features/combat/domain/encounterTemplateTypes";
import { resolveEncounterTemplate } from "../features/combat/application/selectors/resolveEncounterData";
import type { CreatureSpeciesId } from "../features/creatures";
import type { LootTableId } from "../features/combat/domain/lootTypes";

export type { EncounterKey } from "../features/combat/domain/encounterTemplateTypes";

export type EncounterData = {
  key: EncounterKey;
  speciesId: CreatureSpeciesId;
  encounterType?: "creature" | "boss";
  lootTableKey?: LootTableId;
  enemyName: string;
  enemyTitle: string;
  enemyMaxHp: number;
  playerAttackDamage: number;
  enemyAttackDamage: number;
  rewardXp: number;
  enemyBaseInitiative: number;
  introText: string;
  victoryText: string;
  retreatText: string;
};

export const encountersData: Record<EncounterKey, EncounterData> = Object.fromEntries(
  Object.entries(encounterTemplatesData).map(([encounterKey, template]) => {
    const resolvedEncounter = resolveEncounterTemplate(template);

    if (!resolvedEncounter) {
      throw new Error(`Missing canonical species data for encounter ${encounterKey}.`);
    }

    return [encounterKey, resolvedEncounter];
  })
) as Record<EncounterKey, EncounterData>;
