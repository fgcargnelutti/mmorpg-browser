import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { consumeInventoryItemAmount } from "../../../systems/application/systems/playerStateMutationSystem";
import { combatActionBarOrder } from "../../domain/combatActionCatalog";
import { createCombatEncounterState } from "../systems/createCombatEncounterState";
import { executeCombatAction, resolveCombatActionAvailabilities, } from "../systems/executeCombatAction";
import { resolveCreatureNextAction } from "../systems/creatureActionDecisionSystem";
import { useCombatHotkeys } from "../../presentation/hooks/useCombatHotkeys";
export function useCombatEncounter({ activeEncounter, encounterData, playerSnapshot, playerClassKey, setPlayer, onCloseEncounter, onEventLogs, onGainEncounterXp, onRegisterVictory, onResolveVictoryRewards, onRecordTraining, onEncounterQuestProgress, }) {
    const [combatState, setCombatState] = useState(null);
    const initializedEncounterInstanceRef = useRef(null);
    const processedVictoryInstanceIdsRef = useRef(new Set());
    const enemyTurnTimeoutRef = useRef(null);
    const clearEnemyTurnTimeout = useCallback(() => {
        if (enemyTurnTimeoutRef.current) {
            clearTimeout(enemyTurnTimeoutRef.current);
            enemyTurnTimeoutRef.current = null;
        }
    }, []);
    useEffect(() => {
        if (!activeEncounter || !encounterData || !playerSnapshot) {
            setCombatState(null);
            initializedEncounterInstanceRef.current = null;
            clearEnemyTurnTimeout();
            return;
        }
        if (initializedEncounterInstanceRef.current === activeEncounter.instanceId) {
            return;
        }
        initializedEncounterInstanceRef.current = activeEncounter.instanceId;
        clearEnemyTurnTimeout();
        const nextCombatState = createCombatEncounterState({
            encounter: encounterData,
            player: playerSnapshot,
            playerClassKey,
        });
        setCombatState(nextCombatState);
        onEventLogs([
            `Initiative: ${nextCombatState.combatants[nextCombatState.turn.activeCombatantId].name} acts first.`,
        ]);
    }, [
        activeEncounter,
        clearEnemyTurnTimeout,
        encounterData,
        onEventLogs,
        playerClassKey,
        playerSnapshot,
    ]);
    const applyPlayerDelta = useCallback((delta) => {
        if (!delta || !playerSnapshot) {
            return;
        }
        setPlayer((previousPlayer) => {
            let nextPlayer = {
                ...previousPlayer,
                currentHp: Math.min(playerSnapshot.maxHp, Math.max(0, previousPlayer.currentHp + delta.hpDelta)),
                currentSp: Math.min(playerSnapshot.maxSp, Math.max(0, previousPlayer.currentSp + delta.spDelta)),
                stamina: delta.staminaDelta >= 0
                    ? Math.min(previousPlayer.maxStamina, previousPlayer.stamina + delta.staminaDelta)
                    : Math.max(0, previousPlayer.stamina + delta.staminaDelta),
            };
            if (delta.consumeItemKey) {
                const consumption = consumeInventoryItemAmount(nextPlayer, delta.consumeItemKey, 1);
                if (consumption.didConsume) {
                    nextPlayer = consumption.nextSnapshot;
                }
            }
            return nextPlayer;
        });
    }, [playerSnapshot, setPlayer]);
    const finalizeCombatOutcome = useCallback((outcome) => {
        if (!outcome || !encounterData || !activeEncounter) {
            return;
        }
        if (outcome === "victory") {
            if (processedVictoryInstanceIdsRef.current.has(activeEncounter.instanceId)) {
                return;
            }
            processedVictoryInstanceIdsRef.current.add(activeEncounter.instanceId);
            onGainEncounterXp(encounterData.rewardXp, `Defeated ${encounterData.enemyName}`);
            onRegisterVictory(encounterData.speciesId, encounterData.enemyName);
            onEncounterQuestProgress(encounterData.key);
            onEventLogs([
                `${encounterData.enemyName} defeated.`,
                ...onResolveVictoryRewards(encounterData),
            ]);
            return;
        }
        if (outcome === "defeat") {
            onEventLogs([`You were defeated by ${encounterData.enemyName}.`]);
        }
    }, [
        activeEncounter,
        encounterData,
        onEncounterQuestProgress,
        onEventLogs,
        onGainEncounterXp,
        onRegisterVictory,
        onResolveVictoryRewards,
    ]);
    const dispatchCombatAction = useCallback((actionId) => {
        if (!combatState || !encounterData || !playerSnapshot) {
            return;
        }
        if (combatState.status !== "active") {
            return;
        }
        const result = executeCombatAction({
            state: combatState,
            player: playerSnapshot,
            actionId,
            actorId: combatState.turn.activeCombatantId,
            encounter: encounterData,
        });
        applyPlayerDelta(result.playerDelta);
        if (result.triggeredTraining) {
            onRecordTraining({
                ...result.triggeredTraining,
                encounterKey: encounterData.key,
            });
        }
        setCombatState(result.nextState);
        if (result.eventMessages.length > 0) {
            onEventLogs(result.eventMessages);
        }
        finalizeCombatOutcome(result.outcome);
    }, [
        applyPlayerDelta,
        combatState,
        encounterData,
        finalizeCombatOutcome,
        onEventLogs,
        onRecordTraining,
        playerSnapshot,
    ]);
    useEffect(() => {
        if (!combatState || !encounterData || !playerSnapshot) {
            return;
        }
        if (combatState.status !== "active") {
            clearEnemyTurnTimeout();
            return;
        }
        const activeCombatant = combatState.combatants[combatState.turn.activeCombatantId];
        if (activeCombatant.entityType !== "enemy") {
            clearEnemyTurnTimeout();
            return;
        }
        clearEnemyTurnTimeout();
        enemyTurnTimeoutRef.current = setTimeout(() => {
            const enemyAction = resolveCreatureNextAction(combatState, combatState.turn.activeCombatantId);
            const result = executeCombatAction({
                state: combatState,
                player: playerSnapshot,
                actionId: enemyAction.id,
                actorId: combatState.turn.activeCombatantId,
                encounter: encounterData,
            });
            applyPlayerDelta(result.playerDelta);
            setCombatState(result.nextState);
            if (result.eventMessages.length > 0) {
                onEventLogs(result.eventMessages);
            }
            finalizeCombatOutcome(result.outcome);
        }, 420);
        return () => clearEnemyTurnTimeout();
    }, [
        applyPlayerDelta,
        clearEnemyTurnTimeout,
        combatState,
        encounterData,
        finalizeCombatOutcome,
        onEventLogs,
        playerSnapshot,
    ]);
    const actionAvailabilities = useMemo(() => {
        if (!combatState || !playerSnapshot) {
            return [];
        }
        return resolveCombatActionAvailabilities({
            state: combatState,
            player: playerSnapshot,
            actorId: combatState.playerCombatantId,
            actionIds: combatActionBarOrder,
        });
    }, [combatState, playerSnapshot]);
    const retreatEncounter = useCallback(() => {
        if (!activeEncounter || !encounterData || !playerSnapshot || !combatState) {
            return;
        }
        const retreatRoll = Math.random();
        const staminaPenalty = playerSnapshot.stamina > 0 ? 1 : 0;
        const damagePenalty = retreatRoll >= 0.35
            ? Math.min(encounterData.enemyAttackDamage, Math.max(0, playerSnapshot.currentHp - 1))
            : 0;
        const inflictInjury = retreatRoll >= 0.55 && !playerSnapshot.activeConditions.includes("injury");
        const inflictPoison = retreatRoll >= 0.8 && !playerSnapshot.activeConditions.includes("poison");
        setPlayer((previousPlayer) => ({
            ...previousPlayer,
            stamina: Math.max(0, previousPlayer.stamina - staminaPenalty),
            currentHp: Math.max(1, previousPlayer.currentHp - damagePenalty),
            activeConditions: Array.from(new Set([
                ...previousPlayer.activeConditions,
                ...(inflictInjury ? ["injury"] : []),
                ...(inflictPoison ? ["poison"] : []),
            ])),
        }));
        setCombatState({
            ...combatState,
            status: "resolved",
            resolution: "retreat",
        });
        onEventLogs([
            encounterData.retreatText,
            ...(staminaPenalty > 0 ? [`Retreat costs ${staminaPenalty} stamina.`] : []),
            ...(damagePenalty > 0
                ? [
                    `${encounterData.enemyName} catches you on the way out for ${damagePenalty} damage.`,
                ]
                : []),
            ...(inflictInjury ? ["You escape with an injury."] : []),
            ...(inflictPoison ? ["A final hit leaves poison in your system."] : []),
        ]);
        onCloseEncounter();
    }, [
        activeEncounter,
        combatState,
        encounterData,
        onCloseEncounter,
        onEventLogs,
        playerSnapshot,
        setPlayer,
    ]);
    const closeCombat = useCallback(() => {
        onCloseEncounter();
    }, [onCloseEncounter]);
    useCombatHotkeys({
        enabled: Boolean(combatState) &&
            combatState?.status === "active" &&
            combatState.turn.activeCombatantId === combatState.playerCombatantId,
        onAction: dispatchCombatAction,
    });
    return {
        combatState,
        actionAvailabilities,
        dispatchCombatAction,
        retreatEncounter,
        closeCombat,
    };
}
