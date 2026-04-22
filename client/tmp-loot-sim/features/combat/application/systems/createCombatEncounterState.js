import {} from "../../domain/combatEngineTypes";
import { playerCombatProfiles } from "../../domain/playerCombatProfiles";
import { resolveInitiativeState, resolveCombatTurnOrder } from "./initiativeResolver";
export function createCombatLogEntry(message) {
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message,
    };
}
export function createCombatEncounterState(params) {
    const { encounter, player, playerClassKey } = params;
    const playerProfile = playerCombatProfiles[playerClassKey];
    const playerCombatant = {
        id: "player-1",
        entityType: "player",
        teamId: "players",
        name: player.name,
        title: "Adventurer",
        currentHp: player.currentHp,
        maxHp: player.maxHp,
        currentSp: player.currentSp,
        maxSp: player.maxSp,
        attackDamage: encounter.playerAttackDamage,
        initiative: resolveInitiativeState(playerProfile.baseInitiative),
        actionEconomy: {
            baseActionsPerTurn: playerProfile.baseActionsPerTurn,
            bonusActions: 0,
            actionsRemaining: playerProfile.baseActionsPerTurn,
        },
        isAlive: player.currentHp > 0,
        dodgePrepared: false,
    };
    const enemyCombatant = {
        id: `enemy-${encounter.key}`,
        entityType: "enemy",
        teamId: "enemies",
        name: encounter.enemyName,
        title: encounter.enemyTitle,
        currentHp: encounter.enemyMaxHp,
        maxHp: encounter.enemyMaxHp,
        currentSp: 0,
        maxSp: 0,
        attackDamage: encounter.enemyAttackDamage,
        initiative: resolveInitiativeState(encounter.enemyBaseInitiative),
        actionEconomy: {
            baseActionsPerTurn: 1,
            bonusActions: 0,
            actionsRemaining: 1,
        },
        isAlive: encounter.enemyMaxHp > 0,
        dodgePrepared: false,
    };
    const turnOrder = resolveCombatTurnOrder([playerCombatant, enemyCombatant]);
    return {
        encounterKey: encounter.key,
        status: "active",
        combatants: {
            [playerCombatant.id]: playerCombatant,
            [enemyCombatant.id]: enemyCombatant,
        },
        playerCombatantId: playerCombatant.id,
        enemyCombatantIds: [enemyCombatant.id],
        turn: {
            round: 1,
            activeCombatantId: turnOrder[0],
            turnOrder,
        },
        combatLog: [createCombatLogEntry(encounter.introText)],
        resolution: null,
    };
}
