"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEncounterData = resolveEncounterData;
exports.resolveEncounterTemplate = resolveEncounterTemplate;
const creatures_1 = require("../../../creatures");
const combatMasterDataAdapter_1 = require("../../infrastructure/combatMasterDataAdapter");
function resolveEncounterData(encounterKey) {
    const template = (0, combatMasterDataAdapter_1.getEncounterTemplateMasterData)(encounterKey);
    if (!template) {
        return null;
    }
    return resolveEncounterTemplate(template);
}
function resolveEncounterTemplate(template) {
    const species = (0, creatures_1.getCreatureSpeciesSnapshot)(template.speciesId);
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
