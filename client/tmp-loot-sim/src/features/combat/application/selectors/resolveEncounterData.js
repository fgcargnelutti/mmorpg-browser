import { getCreatureSpeciesSnapshot } from "../../../creatures";
import { getEncounterTemplateMasterData } from "../../infrastructure/combatMasterDataAdapter";
export function resolveEncounterData(encounterKey) {
    const template = getEncounterTemplateMasterData(encounterKey);
    if (!template) {
        return null;
    }
    return resolveEncounterTemplate(template);
}
export function resolveEncounterTemplate(template) {
    const species = getCreatureSpeciesSnapshot(template.speciesId);
    if (!species) {
        return null;
    }
    return {
        key: template.key,
        speciesId: template.speciesId,
        encounterType: template.encounterType,
        lootTableKey: template.lootTableKey,
        enemyName: template.enemyName,
        enemyTitle: template.enemyTitle,
        enemyMaxHp: template.statOverrides?.enemyMaxHp ?? species.combatDefaults.enemyMaxHp,
        playerAttackDamage: template.statOverrides?.playerAttackDamage ??
            species.combatDefaults.playerAttackDamage,
        enemyAttackDamage: template.statOverrides?.enemyAttackDamage ??
            species.combatDefaults.enemyAttackDamage,
        rewardXp: template.statOverrides?.rewardXp ?? species.combatDefaults.rewardXp,
        enemyBaseInitiative: template.statOverrides?.enemyBaseInitiative ??
            species.combatDefaults.enemyBaseInitiative,
        introText: template.introText,
        victoryText: template.victoryText,
        retreatText: template.retreatText,
    };
}
