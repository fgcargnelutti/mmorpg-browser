import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import "../App.css";
import "../components/CharacterPanel.css";
import "../components/EquipmentPanel.css";
import "../components/InventoryPanel.css";
import "../components/EventLogPanel.css";
import "../components/ChatPanel.css";
import "../components/TopPanel.css";
import "../components/GameDialog.css";
import "../components/NpcDialog.css";
import "../components/CombatDialog.css";
import "../components/SideNavRail.css";
import SkillsPanel from "../components/SkillsPanel";
import InventoryPanel from "../components/InventoryPanel";
import CharacterPanel from "../components/CharacterPanel";
import EquipmentPanel from "../components/EquipmentPanel";
import EventLogPanel from "../components/EventLogPanel";
import ChatPanel from "../components/ChatPanel";
import TopPanel from "../components/TopPanel";
import RegionPlayersIndicator from "../components/RegionPlayersIndicator";
import SideNavRail, { sideNavIcons } from "../components/SideNavRail";
import { useCombatEncounter } from "../features/combat/application/hooks/useCombatEncounter";
import { WorldMap, WorldMapDialog, discoverablePoisData, resolveMapData, npcProfilesData, resolveWorldFastTravelReport, worldMapPoisData, } from "../features/world";
import { useContinuousCombatLoop } from "../features/combat/application/hooks/useContinuousCombatLoop";
import { FishingDialog, fishingConfigs, } from "../features/fishing";
import { MiningDialog, miningConfigs, } from "../features/mining";
import { HideoutDialog, consumeHideoutUpgradeCosts, useHideout, } from "../features/hideout";
import { QuestLogDialog, createQuestEventsFromDiscoveryResolution, mergeQuestProgressEvents, questsData, useQuestLog, useQuestProgression, } from "../features/quests";
import { BestiaryDialog, useBestiary } from "../features/bestiary";
import { SkillTreeDialog, useTalentTree } from "../features/specializations";
import {} from "../data/encountersData";
import { resolveEncounterData } from "../features/combat/application/selectors/resolveEncounterData";
import { getItemDefinition, resolveInventoryItemView, resolveInventoryItemViews, } from "../features/items";
import { inventoryCatalog } from "../data/inventoryCatalog";
import { equipmentRows } from "../data/equipmentData";
import { conditionsData } from "../data/conditionsData";
import { buffsData } from "../data/buffsData";
import { collectRewardMessages } from "../features/systems/application/systems/rewardResolutionSystem";
import { applyRewardsToPlayerSnapshot } from "../features/systems/application/systems/playerRewardStateSystem";
import { applyConditionActionWear, resolveConditionAdjustedStaminaCost, } from "../features/systems/application/systems/playerConditionSystem";
import { countInventoryItem, countInventoryItemsByKeys, canSpendPlayerStamina, consumeInventoryItemsByPriority, consumeInventoryItemAmount, removeInventoryItemsByPredicate, replacePlayerInventory, spendPlayerStamina, } from "../features/systems/application/systems/playerStateMutationSystem";
import { resolveBattleVictoryRewards } from "../features/combat/application/systems/battleRewardSystem";
import { createActionPerformedMessage, createConversationStartedMessage, createDirectMessagePlaceholder, createEncounterStartedMessage, createHideoutReasonMessage, createHideoutStorageMessage, createHideoutUpgradeMessage, createHuntInvitePlaceholder, createInsufficientStaminaMessage, createItemObtainedMessage, createNoSellableResourcesMessage, createPanelOpenedMessage, createPurchaseSuccessMessage, createStaminaRecoveredMessage, createSystemMessage, createTravelMessage, createUnavailableDestinationMessage, createSellResourcesMessage, } from "../features/systems/application/systems/eventLogMessageSystem";
import { useCharacterProgression } from "../features/progression";
import { useNotifications } from "../features/notifications";
import { useGameOverlayState } from "./hooks/useGameOverlayState";
import { resolveCharacterAvatarByClassKey } from "../data/characterAvatarCatalog";
function formatChatTimestamp(date = new Date()) {
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}
function createChatMessage(content, date = new Date()) {
    return {
        content,
        timestamp: formatChatTimestamp(date),
    };
}
const fastTravelFoodItemKeys = ["cookie", "fruit", "fish", "rabbit-meat"];
const alwaysVisibleConditionKeys = new Set(["cold", "hunger"]);
function resolveInventoryDisplayItem(itemKey, count) {
    const catalogItem = inventoryCatalog[itemKey] ?? {
        key: itemKey,
        name: itemKey,
        icon: "📦",
        weight: 1,
        description: "An unidentified item recovered from the wasteland.",
        stats: ["Unknown properties"],
    };
    return {
        key: catalogItem.key,
        itemKey: catalogItem.key,
        name: catalogItem.name,
        icon: catalogItem.icon,
        count,
        weight: catalogItem.weight,
        description: catalogItem.description,
        stats: catalogItem.stats,
    };
}
void resolveInventoryDisplayItem;
export default function GameScreen({ selectedCharacter, onDisconnect, }) {
    const selectedCharacterAvatar = resolveCharacterAvatarByClassKey(selectedCharacter.classKey);
    const { notifyError, notifySuccess, notifyInfo } = useNotifications();
    const [eventLogs, setEventLogs] = useState([
        "System: The wasteland is silent today.",
        "System: You feel the cold wind across the ruins.",
    ]);
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        createChatMessage("NPC Mara: Keep your hood on. The wind cuts deep near the river."),
        createChatMessage("Ronan: Anyone heading to Blackwood?"),
    ]);
    const [triggeredEncounters, setTriggeredEncounters] = useState([]);
    const [activeWorldFastTravel, setActiveWorldFastTravel] = useState(null);
    const [completedWorldFastTravelReport, setCompletedWorldFastTravelReport] = useState(null);
    const [worldMapOverlayToast, setWorldMapOverlayToast] = useState(null);
    const [pendingWorldFastTravelArrivalMapId, setPendingWorldFastTravelArrivalMapId] = useState(null);
    // Temporary continent-position override used by the world-map prototype/testing flow.
    // This lets the pin and highlighted continent PoI move even when a destination does not
    // yet have a fully mapped local playable map. It must not be treated as the same source
    // of truth as `currentMap` for future gameplay systems.
    const [currentWorldMapPoiOverrideId, setCurrentWorldMapPoiOverrideId] = useState("belagard");
    const fastTravelRecoveryRef = useRef({
        travelKey: null,
        recoveredMinutesApplied: 0,
    });
    const fastTravelCompletionRef = useRef(null);
    const worldMapOverlayToastTimeoutRef = useRef(null);
    const continuousCombatLoopStopRef = useRef(null);
    const [currentMap, setCurrentMap] = useState("belagard");
    const { contextState, setContextState, npcDialogOpen, activeNpcProfileKey, npcDialogueLines, setNpcDialogueLines, activeEncounter, setActiveEncounter, activeFishingSession, activeMiningSession, bestiaryDialogOpen, skillTreeDialogOpen, hideoutDialogOpen, questLogDialogOpen, worldMapDialogOpen, closeWorldActivityOverlays, openNpcDialog: openNpcOverlay, closeNpcDialog: closeNpcOverlay, openEncounter: openEncounterOverlay, openFishingSession: openFishingOverlay, closeFishingSession: closeFishingOverlay, openMiningSession: openMiningOverlay, closeMiningSession: closeMiningOverlay, openHideoutDialog: openHideoutOverlay, closeHideoutDialog: closeHideoutOverlay, openBestiaryDialog: openBestiaryOverlay, closeBestiaryDialog: closeBestiaryOverlay, openSkillTreeDialog: openSkillTreeOverlay, closeSkillTreeDialog: closeSkillTreeOverlay, openQuestLogDialog: openQuestLogOverlay, closeQuestLogDialog: closeQuestLogOverlay, openWorldMapDialog: openWorldMapOverlay, closeWorldMapDialog: closeWorldMapOverlay, } = useGameOverlayState();
    const { player, setPlayer, selectedClass, currentLocation, computedLevel, computedHp, computedMaxHp, computedSp, computedCarryWeight, xpProgress, skills, handleTravel, tryTriggerLoreDiscovery, gainCharacterXp, learnRumor, discoverPoi, recordSkillTraining, registerBestiaryKill, spendTalentPoint, selectSkillSpecialization, } = useCharacterProgression({
        selectedCharacter,
        setEventLogs,
    });
    const { entries: bestiaryEntries } = useBestiary({
        progress: player?.bestiaryProgress ?? {},
    });
    const { trees: talentTrees, pointsEarned: talentPointsEarned, pointsSpent: talentPointsSpent, pointsAvailable: talentPointsAvailable, } = useTalentTree({
        progress: player?.talentProgress ?? { unlockedNodeKeys: [] },
        characterLevel: computedLevel,
    });
    const questDefinitions = Object.values(questsData);
    const { progressStates: questProgressStates, activateQuestByKey, applyEvent: applyQuestEvent, applyEvents: applyQuestEvents, claimQuestRewardsByKey, } = useQuestProgression({
        quests: questDefinitions,
    });
    const currentMapData = resolveMapData(currentMap);
    const linkedCurrentMapPoi = worldMapPoisData.find((poi) => poi.linkedMapIds?.includes(currentMap)) ?? null;
    // Prefer the prototype/testing continent override when present; otherwise fall back
    // to the continent PoI inferred from the current local playable map.
    const currentWorldMapPoiId = currentWorldMapPoiOverrideId ?? linkedCurrentMapPoi?.id ?? null;
    const currentWorldMapPoi = worldMapPoisData.find((poi) => poi.id === currentWorldMapPoiId) ??
        linkedCurrentMapPoi ??
        null;
    const activeNpcProfile = npcProfilesData[activeNpcProfileKey];
    const sewerRumorLearned = player?.learnedRumors.includes("jane-sewer-rumor") ?? false;
    const npcDialogueOptions = activeNpcProfile.dialogueOptions.map((option) => {
        if (activeNpcProfileKey === "jane" && option.id === "any-rumors") {
            return {
                ...option,
                state: sewerRumorLearned ? "completed" : "new",
            };
        }
        return option;
    });
    const npcLoreNotes = activeNpcProfile.loreNotes;
    const activeEncounterData = activeEncounter
        ? resolveEncounterData(activeEncounter.key)
        : null;
    const activeFishingConfig = activeFishingSession
        ? fishingConfigs[activeFishingSession.configKey]
        : null;
    const activeMiningConfig = activeMiningSession
        ? miningConfigs[activeMiningSession.configKey]
        : null;
    const { hideoutState, structures: hideoutStructures, storageEntries, upgradeStructure, depositItem, withdrawItem, } = useHideout({
        inventory: player?.inventory ?? [],
        playerLevel: computedLevel,
    });
    const questLog = useQuestLog({
        quests: questDefinitions,
        progressStates: questProgressStates,
        context: {
            inventoryItemCounts: (player?.inventory ?? []).reduce((counts, itemKey) => {
                counts[itemKey] = (counts[itemKey] ?? 0) + 1;
                return counts;
            }, {}),
            revealedPoiKeys: player?.revealedPois ?? [],
            completedQuestKeys: questProgressStates
                .filter((entry) => entry.state === "completed")
                .map((entry) => entry.questKey),
        },
    });
    const resolvedCharacterConditions = conditionsData.map((condition) => ({
        ...condition,
        active: alwaysVisibleConditionKeys.has(condition.key) ||
            (player?.activeConditions.includes(condition.key) ?? false),
    }));
    const hasInjury = player?.activeConditions.includes("injury") ?? false;
    const hasPoison = player?.activeConditions.includes("poison") ?? false;
    const logQuestUpdates = useCallback((updates) => {
        if (updates.length === 0) {
            return;
        }
        const questByKey = new Map(questDefinitions.map((quest) => [quest.key, quest]));
        const messages = updates.flatMap((update) => {
            const quest = questByKey.get(update.questKey);
            if (!quest || update.previousState === update.nextState) {
                return [];
            }
            if (update.nextState === "completed") {
                return [`Quest completed: ${quest.title}. Return to the source for your reward.`];
            }
            if (update.previousState === "available" && update.nextState === "active") {
                return [`Quest accepted: ${quest.title}.`];
            }
            return [`Quest updated: ${quest.title} is now ${update.nextState}.`];
        });
        if (messages.length > 0) {
            setEventLogs((prev) => [...prev, ...messages]);
        }
    }, [questDefinitions]);
    const dismissWorldMapOverlayToast = useCallback(() => {
        if (worldMapOverlayToastTimeoutRef.current) {
            clearTimeout(worldMapOverlayToastTimeoutRef.current);
            worldMapOverlayToastTimeoutRef.current = null;
        }
        setWorldMapOverlayToast(null);
    }, []);
    const showWorldMapOverlayToast = useCallback((toast) => {
        dismissWorldMapOverlayToast();
        setWorldMapOverlayToast(toast);
        worldMapOverlayToastTimeoutRef.current = setTimeout(() => {
            setWorldMapOverlayToast(null);
            worldMapOverlayToastTimeoutRef.current = null;
        }, 3200);
    }, [dismissWorldMapOverlayToast]);
    const handleMapTravel = (destinationMapId) => {
        if (!destinationMapId)
            return;
        setCurrentMap(destinationMapId);
        const destinationWorldPoi = worldMapPoisData.find((poi) => poi.linkedMapIds?.includes(destinationMapId)) ?? null;
        setCurrentWorldMapPoiOverrideId(destinationWorldPoi?.id ?? null);
        closeWorldActivityOverlays();
        setContextState("expanded");
        const destinationMap = resolveMapData(destinationMapId);
        const travelResolution = destinationMap.entryLocationKey
            ? handleTravel(destinationMap.entryLocationKey)
            : null;
        logQuestUpdates(applyQuestEvents(mergeQuestProgressEvents([{ type: "map", mapId: destinationMapId }], travelResolution
            ? createQuestEventsFromDiscoveryResolution(travelResolution)
            : [])));
        setEventLogs((prev) => [
            ...prev,
            createTravelMessage(destinationMap.name),
        ]);
    };
    const handleTravelAndOpenContext = (location) => {
        closeWorldActivityOverlays();
        setContextState("expanded");
        const travelResolution = handleTravel(location);
        logQuestUpdates(applyQuestEvents(mergeQuestProgressEvents([{ type: "poi", poiKey: location }], travelResolution
            ? createQuestEventsFromDiscoveryResolution(travelResolution)
            : [])));
    };
    const handleOpenNpcDialog = (profileKey = "jane") => {
        const profile = npcProfilesData[profileKey];
        openNpcOverlay({
            profileKey,
            dialogueLines: profile.initialDialogueLines,
        });
        setEventLogs((prev) => [
            ...prev,
            createConversationStartedMessage(profile.name),
        ]);
        logQuestUpdates(applyQuestEvents([{ type: "npc", npcKey: profileKey }]));
    };
    const handleCloseNpcDialog = () => {
        closeNpcOverlay();
    };
    useEffect(() => {
        if (!activeWorldFastTravel) {
            fastTravelRecoveryRef.current = {
                travelKey: null,
                recoveredMinutesApplied: 0,
            };
            fastTravelCompletionRef.current = null;
            return;
        }
        const travelKey = [
            activeWorldFastTravel.startedAt,
            activeWorldFastTravel.originPoiId,
            activeWorldFastTravel.destinationPoiId,
        ].join(":");
        if (fastTravelRecoveryRef.current.travelKey !== travelKey) {
            fastTravelRecoveryRef.current = {
                travelKey,
                recoveredMinutesApplied: activeWorldFastTravel.recoveredStaminaMinutes,
            };
            fastTravelCompletionRef.current = null;
        }
        const tick = () => {
            const now = Date.now();
            const totalDuration = activeWorldFastTravel.completesAt - activeWorldFastTravel.startedAt;
            const elapsed = now - activeWorldFastTravel.startedAt;
            const progressPercent = totalDuration <= 0 ? 100 : Math.min(100, (elapsed / totalDuration) * 100);
            const recoveredStaminaMinutes = Math.min(activeWorldFastTravel.durationMinutes, Math.floor(Math.max(0, elapsed) / 60000));
            const alreadyAppliedRecovery = fastTravelRecoveryRef.current.travelKey === travelKey
                ? fastTravelRecoveryRef.current.recoveredMinutesApplied
                : 0;
            const staminaDelta = Math.max(0, recoveredStaminaMinutes - alreadyAppliedRecovery);
            if (staminaDelta > 0) {
                setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot(previousPlayer, [
                    {
                        type: "stamina",
                        amount: staminaDelta,
                    },
                ]));
                fastTravelRecoveryRef.current = {
                    travelKey,
                    recoveredMinutesApplied: recoveredStaminaMinutes,
                };
            }
            if (progressPercent >= 100) {
                if (fastTravelCompletionRef.current === travelKey) {
                    setActiveWorldFastTravel(null);
                    return;
                }
                fastTravelCompletionRef.current = travelKey;
                const originPoi = worldMapPoisData.find((poi) => poi.id === activeWorldFastTravel.originPoiId) ??
                    null;
                const destinationPoi = worldMapPoisData.find((poi) => poi.id === activeWorldFastTravel.destinationPoiId) ?? null;
                const destinationMapId = destinationPoi?.linkedMapIds?.[0];
                const report = resolveWorldFastTravelReport(activeWorldFastTravel, originPoi, destinationPoi, recoveredStaminaMinutes);
                setPlayer((previousPlayer) => {
                    const withRewards = report.rewards.length > 0
                        ? applyRewardsToPlayerSnapshot(previousPlayer, report.rewards)
                        : previousPlayer;
                    return {
                        ...withRewards,
                        currentHp: Math.max(1, withRewards.currentHp - report.hpLoss),
                        currentSp: Math.max(0, withRewards.currentSp - report.spLoss),
                        activeConditions: Array.from(new Set([
                            ...withRewards.activeConditions,
                            ...report.inflictedConditions,
                        ])),
                    };
                });
                const rewardQuestEvents = report.rewards.flatMap((reward) => reward.type === "item"
                    ? [
                        {
                            type: "item",
                            itemKey: reward.itemKey,
                            amount: reward.amount,
                        },
                    ]
                    : []);
                if (rewardQuestEvents.length > 0) {
                    logQuestUpdates(applyQuestEvents(rewardQuestEvents));
                }
                if (destinationMapId) {
                    setPendingWorldFastTravelArrivalMapId(destinationMapId);
                }
                if (destinationPoi) {
                    setCurrentWorldMapPoiOverrideId(destinationPoi.id);
                }
                setEventLogs((prev) => [
                    ...prev,
                    createSystemMessage(`You arrive at ${destinationPoi?.label ?? "your destination"} after recovering ${recoveredStaminaMinutes} stamina during the journey. Planned activity: ${activeWorldFastTravel.activity.label}.`),
                ]);
                setCompletedWorldFastTravelReport(report);
                setActiveWorldFastTravel(null);
                return;
            }
            setActiveWorldFastTravel((currentTravel) => {
                if (!currentTravel || currentTravel.startedAt !== activeWorldFastTravel.startedAt) {
                    return currentTravel;
                }
                return {
                    ...currentTravel,
                    progressPercent,
                    recoveredStaminaMinutes,
                };
            });
        };
        tick();
        const intervalId = window.setInterval(tick, 1000);
        return () => {
            window.clearInterval(intervalId);
        };
    }, [
        activeWorldFastTravel,
        applyQuestEvents,
        closeWorldActivityOverlays,
        handleTravel,
        logQuestUpdates,
        setContextState,
        setPlayer,
    ]);
    const openEncounter = useCallback((encounterKey) => {
        const encounter = resolveEncounterData(encounterKey);
        if (!encounter) {
            notifyError("Encounter configuration is unavailable.", {
                title: "Combat unavailable",
            });
            return;
        }
        setTriggeredEncounters((prev) => prev.includes(encounterKey) ? prev : [...prev, encounterKey]);
        openEncounterOverlay({
            encounterKey,
        });
        setEventLogs((prev) => [
            ...prev,
            createEncounterStartedMessage(encounter.enemyName),
        ]);
    }, [openEncounterOverlay]);
    const closeEncounterOverlayState = useCallback(() => {
        setActiveEncounter(null);
        setContextState("expanded");
    }, [setActiveEncounter, setContextState]);
    const { combatState, actionAvailabilities: combatActionAvailabilities, dispatchCombatAction, retreatEncounter, closeCombat, } = useCombatEncounter({
        activeEncounter,
        encounterData: activeEncounterData,
        playerSnapshot: player
            ? {
                ...player,
                maxHp: computedMaxHp,
                maxSp: computedSp,
            }
            : null,
        playerClassKey: selectedCharacter.classKey,
        setPlayer,
        onCloseEncounter: closeEncounterOverlayState,
        onEventLogs: (messages) => {
            setEventLogs((prev) => [...prev, ...messages]);
        },
        onGainEncounterXp: gainCharacterXp,
        onRegisterVictory: (speciesId, enemyName) => {
            registerBestiaryKill(speciesId, enemyName);
        },
        onResolveVictoryRewards: (encounter) => {
            const victoryRewards = resolveBattleVictoryRewards(encounter);
            if (victoryRewards.rewards.length > 0) {
                setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot(previousPlayer, victoryRewards.rewards));
            }
            return victoryRewards.eventLogMessages;
        },
        onRecordTraining: (event) => {
            recordSkillTraining(event);
        },
        onEncounterQuestProgress: (encounterKey) => {
            logQuestUpdates(applyQuestEvent({
                type: "encounter",
                encounterKey,
            }));
        },
    });
    const combatLoopEncounterState = activeEncounter
        ? {
            key: activeEncounter.key,
            isResolved: combatState?.status === "resolved",
            resolution: combatState?.resolution === "victory" || combatState?.resolution === "defeat"
                ? combatState.resolution
                : null,
        }
        : null;
    const { loopState: continuousCombatLoopState, activeLoopActionLabel, isHunting, startGlobalAction, stopLoop, resetLoop, } = useContinuousCombatLoop({
        mapData: currentMapData,
        activeEncounter: combatLoopEncounterState,
        onOpenEncounter: openEncounter,
        onCloseEncounter: closeEncounterOverlayState,
    });
    const handleRetreatEncounter = useCallback(() => {
        if (isHunting) {
            stopLoop("retreat");
        }
        retreatEncounter();
    }, [isHunting, retreatEncounter, stopLoop]);
    const handleCloseEncounter = useCallback(() => {
        if (combatState && combatState.status === "active" && isHunting) {
            stopLoop("manual");
        }
        closeCombat();
    }, [closeCombat, combatState, isHunting, stopLoop]);
    const handleGlobalMapAction = useCallback((action) => {
        const result = startGlobalAction(action);
        if (!result.ok) {
            if (result.reason === "already-active") {
                notifyInfo("A continuous hunt is already active.", {
                    title: "Hunt already running",
                });
                return;
            }
            if (result.reason === "combat-active") {
                notifyInfo("Finish the current combat before starting a hunt.", {
                    title: "Combat already active",
                });
                return;
            }
            if (result.reason === "no-encounters") {
                notifyInfo("This map does not have a hunting pool configured yet.", {
                    title: "No hunt targets",
                });
                return;
            }
            notifyError("This global map action is not available yet.", {
                title: "Action unavailable",
            });
            return;
        }
        setEventLogs((prev) => [
            ...prev,
            createSystemMessage(`${action.label} begins in ${currentMapData.name}. New encounters will chain automatically until the hunt is stopped or interrupted.`),
        ]);
        setContextState("expanded");
    }, [currentMapData.name, notifyError, notifyInfo, setContextState, startGlobalAction]);
    const handleStopGlobalMapAction = useCallback(() => {
        if (!isHunting) {
            return;
        }
        stopLoop("manual");
        closeCombat();
    }, [closeCombat, isHunting, stopLoop]);
    useEffect(() => {
        if (continuousCombatLoopState.status !== "stopped") {
            continuousCombatLoopStopRef.current = null;
            return;
        }
        const stopKey = `${continuousCombatLoopState.stopReason}:${continuousCombatLoopState.completedEncounters}:${continuousCombatLoopState.activeMapId}`;
        if (continuousCombatLoopStopRef.current === stopKey) {
            return;
        }
        continuousCombatLoopStopRef.current = stopKey;
        const reasonMessage = continuousCombatLoopState.stopReason === "defeat"
            ? "The hunt ends because you were defeated."
            : continuousCombatLoopState.stopReason === "retreat"
                ? "The hunt ends after you retreat from the encounter."
                : continuousCombatLoopState.stopReason === "unavailable"
                    ? "The hunt ends because no further encounters are available on this map."
                    : "You stop searching for new prey.";
        window.setTimeout(() => {
            setEventLogs((prev) => [
                ...prev,
                createSystemMessage(`${reasonMessage} ${continuousCombatLoopState.completedEncounters} encounter(s) were cleared in this run.`),
            ]);
            resetLoop();
        }, 0);
    }, [
        continuousCombatLoopState.activeMapId,
        continuousCombatLoopState.completedEncounters,
        continuousCombatLoopState.status,
        continuousCombatLoopState.stopReason,
        resetLoop,
    ]);
    const handleOpenFishing = (action) => {
        if (!player || !action.fishingSpotKey)
            return;
        const attemptCost = resolveConditionAdjustedStaminaCost(player, action.staminaCost ?? 0);
        if (!canSpendPlayerStamina(player, attemptCost)) {
            setEventLogs((prev) => [
                ...prev,
                createInsufficientStaminaMessage(action.label),
            ]);
            return;
        }
        setPlayer((previousPlayer) => applyConditionActionWear(spendPlayerStamina(previousPlayer, attemptCost)));
        openFishingOverlay({
            action,
            configKey: action.fishingSpotKey,
        });
        setEventLogs((prev) => [
            ...prev,
            createSystemMessage(`You start fishing at ${currentMapData.name}.`),
            ...(hasInjury
                ? [createSystemMessage("Injury makes the effort cost 1 extra stamina.")]
                : []),
            ...(hasPoison
                ? [createSystemMessage("Poison drains 1 HP and 1 SP as you exert yourself.")]
                : []),
        ]);
    };
    const handleCloseFishing = () => {
        closeFishingOverlay();
    };
    const handleFishingSuccess = () => {
        if (!player || !activeFishingSession || !activeFishingConfig)
            return;
        setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot(previousPlayer, [
            {
                type: "item",
                itemKey: activeFishingConfig.rewardItemKey,
                amount: activeFishingConfig.rewardAmount,
            },
        ]));
        recordSkillTraining({
            type: "world.action.completed",
            action: {
                id: activeFishingSession.action.id,
                label: activeFishingSession.action.label,
                rewardItem: activeFishingConfig.rewardItemKey,
                amount: activeFishingConfig.rewardAmount,
                effect: activeFishingSession.action.effect,
            },
        });
        setEventLogs((prev) => [
            ...prev,
            activeFishingConfig.successLog,
            createItemObtainedMessage(activeFishingConfig.rewardItemKey, activeFishingConfig.rewardAmount),
        ]);
        logQuestUpdates(applyQuestEvents([
            {
                type: "action",
                actionId: activeFishingSession.action.id,
            },
            {
                type: "item",
                itemKey: activeFishingConfig.rewardItemKey,
                amount: activeFishingConfig.rewardAmount,
            },
        ]));
    };
    const handleFishingFailure = () => {
        if (!activeFishingConfig)
            return;
        setEventLogs((prev) => [...prev, activeFishingConfig.failureLog]);
    };
    const handleOpenMining = (action) => {
        if (!player || !action.miningSpotKey)
            return;
        const attemptCost = resolveConditionAdjustedStaminaCost(player, action.staminaCost ?? 0);
        if (!canSpendPlayerStamina(player, attemptCost)) {
            setEventLogs((prev) => [
                ...prev,
                createInsufficientStaminaMessage(action.label),
            ]);
            return;
        }
        setPlayer((previousPlayer) => applyConditionActionWear(spendPlayerStamina(previousPlayer, attemptCost)));
        openMiningOverlay({
            action,
            configKey: action.miningSpotKey,
        });
        setEventLogs((prev) => [
            ...prev,
            createSystemMessage(`You begin mining at ${currentMapData.name}.`),
            ...(hasInjury
                ? [createSystemMessage("Injury makes the effort cost 1 extra stamina.")]
                : []),
            ...(hasPoison
                ? [createSystemMessage("Poison drains 1 HP and 1 SP as you exert yourself.")]
                : []),
        ]);
    };
    const handleCloseMining = () => {
        closeMiningOverlay();
    };
    const handleMiningSuccess = () => {
        if (!player || !activeMiningSession || !activeMiningConfig)
            return;
        setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot(previousPlayer, [
            {
                type: "item",
                itemKey: activeMiningConfig.rewardItemKey,
                amount: activeMiningConfig.rewardAmount,
            },
        ]));
        recordSkillTraining({
            type: "world.action.completed",
            action: {
                id: activeMiningSession.action.id,
                label: activeMiningSession.action.label,
                rewardItem: activeMiningConfig.rewardItemKey,
                amount: activeMiningConfig.rewardAmount,
                effect: activeMiningSession.action.effect,
            },
        });
        setEventLogs((prev) => [
            ...prev,
            activeMiningConfig.successLog,
            createItemObtainedMessage(activeMiningConfig.rewardItemKey, activeMiningConfig.rewardAmount),
        ]);
        logQuestUpdates(applyQuestEvents([
            {
                type: "action",
                actionId: activeMiningSession.action.id,
            },
            {
                type: "item",
                itemKey: activeMiningConfig.rewardItemKey,
                amount: activeMiningConfig.rewardAmount,
            },
        ]));
    };
    const handleMiningFailure = () => {
        if (!activeMiningConfig)
            return;
        setEventLogs((prev) => [...prev, activeMiningConfig.failureLog]);
    };
    const handleOpenHideout = () => {
        openHideoutOverlay();
        setEventLogs((prev) => [
            ...prev,
            createSystemMessage("You step into your hideout and review the camp."),
        ]);
    };
    const handleOpenWorldMap = () => {
        openWorldMapOverlay();
        setEventLogs((prev) => [
            ...prev,
            createPanelOpenedMessage("World Map", "You unfold a wider view of Belegard and the surrounding frontier."),
        ]);
    };
    const handleDismissWorldFastTravelReport = () => {
        const arrivalMapId = pendingWorldFastTravelArrivalMapId;
        setCompletedWorldFastTravelReport(null);
        setPendingWorldFastTravelArrivalMapId(null);
        closeWorldMapOverlay();
        if (!arrivalMapId) {
            return;
        }
        setCurrentMap(arrivalMapId);
        setCurrentWorldMapPoiOverrideId(null);
        closeWorldActivityOverlays();
        setContextState("expanded");
        const destinationMap = resolveMapData(arrivalMapId);
        const travelResolution = destinationMap.entryLocationKey
            ? handleTravel(destinationMap.entryLocationKey)
            : null;
        logQuestUpdates(applyQuestEvents(mergeQuestProgressEvents([{ type: "map", mapId: arrivalMapId }], travelResolution
            ? createQuestEventsFromDiscoveryResolution(travelResolution)
            : [])));
    };
    const handleCloseWorldMap = () => {
        if (completedWorldFastTravelReport) {
            handleDismissWorldFastTravelReport();
            return;
        }
        dismissWorldMapOverlayToast();
        closeWorldMapOverlay();
    };
    const handleSelectWorldMapPoi = (poi) => {
        setEventLogs((prev) => {
            const message = createSystemMessage(`${poi.label} selected on the continent map. Fast travel and region actions will connect here later.`);
            if (prev[prev.length - 1] === message) {
                return prev;
            }
            return [...prev, message];
        });
    };
    const handleConfirmWorldMapFastTravel = (poi, cost, activity) => {
        const originPoiId = currentWorldMapPoi?.id;
        if (!player || !originPoiId || originPoiId === poi.id) {
            return;
        }
        if (currentMapData.tier !== "primary") {
            showWorldMapOverlayToast({
                tone: "warning",
                title: "Fast travel blocked",
                message: "You can't fast travel from here. Go to a city or another relevant point of interest.",
            });
            setEventLogs((prev) => [
                ...prev,
                createSystemMessage("You can't fast travel from here. Go to a city or another relevant point of interest."),
            ]);
            return;
        }
        const availableFood = countInventoryItemsByKeys(player.inventory, fastTravelFoodItemKeys);
        if (availableFood < cost.foodCost) {
            showWorldMapOverlayToast({
                tone: "error",
                title: "Fast travel blocked",
                message: "Not enough food for fast travel",
            });
            setEventLogs((prev) => [
                ...prev,
                createSystemMessage(`You need ${cost.foodCost} food to travel to ${poi.label}, but only have ${availableFood}.`),
            ]);
            return;
        }
        const foodConsumption = consumeInventoryItemsByPriority(player, fastTravelFoodItemKeys, cost.foodCost);
        if (!foodConsumption.didConsume) {
            showWorldMapOverlayToast({
                tone: "error",
                title: "Fast travel blocked",
                message: "Fast travel food consumption failed",
            });
            return;
        }
        setPlayer(foodConsumption.nextSnapshot);
        setCompletedWorldFastTravelReport(null);
        setPendingWorldFastTravelArrivalMapId(null);
        const now = Date.now();
        const durationMs = cost.durationMinutes * 60 * 1000;
        setActiveWorldFastTravel({
            originPoiId,
            destinationPoiId: poi.id,
            foodCost: cost.foodCost,
            durationMinutes: cost.durationMinutes,
            startedAt: now,
            completesAt: now + durationMs,
            progressPercent: 0,
            recoveredStaminaMinutes: 0,
            activity,
        });
        setEventLogs((prev) => [
            ...prev,
            createSystemMessage(`Fast travel to ${poi.label} begins. Travel cost: ${cost.foodCost} food, ${cost.durationMinutes} minute(s). Planned activity: ${activity.label}.`),
        ]);
    };
    const handleCloseHideout = () => {
        closeHideoutOverlay();
    };
    const handleOpenBestiary = () => {
        openBestiaryOverlay();
        setEventLogs((prev) => [
            ...prev,
            createPanelOpenedMessage("Bestiary", "You review the creatures documented so far."),
        ]);
    };
    const handleCloseBestiary = () => {
        closeBestiaryOverlay();
    };
    const handleOpenSkillTree = () => {
        openSkillTreeOverlay();
        setEventLogs((prev) => [
            ...prev,
            createPanelOpenedMessage("Skill Tree", "You open the full progression window."),
        ]);
    };
    const handleCloseSkillTree = () => {
        closeSkillTreeOverlay();
    };
    const handleOpenQuestLog = () => {
        openQuestLogOverlay();
        setEventLogs((prev) => [
            ...prev,
            createPanelOpenedMessage("Quest Log", "You review the active mission categories and future contracts."),
        ]);
    };
    const handleCloseQuestLog = () => {
        closeQuestLogOverlay();
    };
    const applyQuestRewards = (questKey) => {
        const questEntry = questLog.entries.find((entry) => entry.quest.key === questKey);
        if (!questEntry || !questEntry.canClaimRewards || !questEntry.quest.rewards?.length) {
            return false;
        }
        const rewards = questEntry.quest.rewards;
        const rewardMessages = collectRewardMessages(rewards);
        setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot({
            ...previousPlayer,
        }, rewards));
        const didClaim = claimQuestRewardsByKey(questKey);
        if (!didClaim) {
            return false;
        }
        setEventLogs((prev) => [...prev, ...rewardMessages]);
        return true;
    };
    const handleQuestInteraction = (questKey) => {
        const questEntry = questLog.entries.find((entry) => entry.quest.key === questKey);
        if (!questEntry) {
            setEventLogs((prev) => [...prev, "Quest data is not available for this interaction."]);
            return;
        }
        if (questEntry.state === "available") {
            const didActivate = activateQuestByKey(questKey);
            if (didActivate) {
                setEventLogs((prev) => [
                    ...prev,
                    `Maria: Clear the goblin out of the ruins in North Forest, then come back to me.`,
                    `Quest accepted: ${questEntry.quest.title}.`,
                ]);
            }
            return;
        }
        if (questEntry.state === "active") {
            const nextObjective = questEntry.quest.objectives.find((objective) => {
                const progress = questEntry.progressState?.objectiveProgress[objective.key];
                return !progress || progress.state !== "completed";
            });
            setEventLogs((prev) => [
                ...prev,
                nextObjective
                    ? `Quest reminder: ${nextObjective.description}`
                    : `Quest reminder: ${questEntry.quest.title} is still in progress.`,
            ]);
            return;
        }
        if (questEntry.state === "completed") {
            if (questEntry.isRewardClaimed) {
                setEventLogs((prev) => [
                    ...prev,
                    "Maria: You've already been paid for that goblin hunt.",
                ]);
                return;
            }
            const didClaim = applyQuestRewards(questKey);
            if (didClaim) {
                setEventLogs((prev) => [
                    ...prev,
                    `Quest reward claimed: ${questEntry.quest.title}.`,
                ]);
            }
        }
    };
    const handleHideoutUpgrade = (structureKey) => {
        const targetStructure = hideoutStructures.find((entry) => entry.definition.key === structureKey);
        if (!player || !targetStructure || !targetStructure.eligibility.nextTier) {
            return;
        }
        if (!targetStructure.eligibility.canUpgrade) {
            setEventLogs((prev) => [
                ...prev,
                ...targetStructure.eligibility.reasons.map((reason) => createHideoutReasonMessage(reason)),
            ]);
            return;
        }
        const nextInventory = consumeHideoutUpgradeCosts(player.inventory, targetStructure.eligibility.nextTier.buildCosts);
        setPlayer((previousPlayer) => replacePlayerInventory(previousPlayer, nextInventory));
        upgradeStructure(structureKey);
        setEventLogs((prev) => [
            ...prev,
            createHideoutUpgradeMessage(targetStructure.definition.name, targetStructure.eligibility.nextTier?.level),
        ]);
    };
    const handleDepositToHideoutStorage = (itemKey) => {
        if (!player)
            return;
        const { didTransfer, nextInventory } = depositItem(itemKey, player.inventory);
        if (!didTransfer) {
            return;
        }
        setPlayer((previousPlayer) => replacePlayerInventory(previousPlayer, nextInventory));
        const itemLabel = getItemDefinition(itemKey)?.name ?? itemKey;
        notifyInfo(itemKey === "gold" ? "Gold stored" : `${itemLabel} stored`, {
            title: "Hideout chest",
        });
        setEventLogs((prev) => [
            ...prev,
            createHideoutStorageMessage(itemKey === "gold" ? "Gold" : itemLabel, "stored"),
        ]);
    };
    const handleWithdrawFromHideoutStorage = (itemKey) => {
        if (!player)
            return;
        const { didTransfer, nextInventory } = withdrawItem(itemKey, player.inventory);
        if (!didTransfer) {
            return;
        }
        setPlayer((previousPlayer) => replacePlayerInventory(previousPlayer, nextInventory));
        const itemLabel = getItemDefinition(itemKey)?.name ?? itemKey;
        notifyInfo(itemKey === "gold" ? "Gold returned to inventory" : `${itemLabel} returned`, {
            title: "Hideout chest",
        });
        setEventLogs((prev) => [
            ...prev,
            createHideoutStorageMessage(itemKey === "gold" ? "Gold" : itemLabel, "returned"),
        ]);
    };
    const handleSellResources = (action) => {
        if (!player)
            return;
        const sellableItems = action?.sellableItemKeys ?? ["stone", "wood", "herb", "fish", "rope", "paper"];
        const saleResult = removeInventoryItemsByPredicate(player, (itemKey) => sellableItems.includes(itemKey));
        const soldItems = saleResult.removedItems;
        if (soldItems.length === 0) {
            setEventLogs((prev) => [
                ...prev,
                createNoSellableResourcesMessage(),
            ]);
            return;
        }
        const goldEarned = soldItems.length * (action?.goldPerItem ?? 2);
        setPlayer(applyRewardsToPlayerSnapshot(saleResult.nextSnapshot, [
            {
                type: "gold",
                amount: goldEarned,
            },
        ]));
        notifySuccess(`${goldEarned} Gold received`, {
            title: "Resources sold",
        });
        setEventLogs((prev) => [
            ...prev,
            createSellResourcesMessage(soldItems.length, goldEarned),
        ]);
    };
    const handleNpcBuyItem = (offer) => {
        if (!player)
            return;
        const availableGold = countInventoryItem(player.inventory, "gold");
        if (availableGold < offer.priceGold) {
            notifyError("Insufficient gold", {
                title: "Purchase failed",
            });
            return;
        }
        setPlayer((previousPlayer) => {
            const goldConsumption = consumeInventoryItemAmount(previousPlayer, "gold", offer.priceGold);
            if (!goldConsumption.didConsume) {
                return previousPlayer;
            }
            return applyRewardsToPlayerSnapshot(goldConsumption.nextSnapshot, [
                {
                    type: "item",
                    itemKey: offer.itemKey,
                    amount: 1,
                },
            ]);
        });
        notifySuccess(`1x ${offer.label}`, {
            title: "Purchased",
        });
        setEventLogs((prev) => [
            ...prev,
            createPurchaseSuccessMessage(offer.label, 1, offer.priceGold),
        ]);
    };
    const handleNpcSellItems = (items) => {
        if (!player || items.length === 0) {
            return false;
        }
        const goldPerItem = activeNpcProfile.sellPriceGoldPerItem ?? 2;
        const totalItemCount = items.reduce((total, entry) => total + entry.count, 0);
        let nextSnapshot = player;
        for (const entry of items) {
            const availableCount = countInventoryItem(nextSnapshot.inventory, entry.itemKey);
            if (availableCount < entry.count) {
                return false;
            }
            const consumption = consumeInventoryItemAmount(nextSnapshot, entry.itemKey, entry.count);
            if (!consumption.didConsume) {
                return false;
            }
            nextSnapshot = consumption.nextSnapshot;
        }
        const goldEarned = totalItemCount * goldPerItem;
        setPlayer(applyRewardsToPlayerSnapshot(nextSnapshot, [
            {
                type: "gold",
                amount: goldEarned,
            },
        ]));
        notifySuccess(`${goldEarned} Gold received`, {
            title: "Trade completed",
        });
        setEventLogs((prev) => [
            ...prev,
            createSellResourcesMessage(totalItemCount, goldEarned),
        ]);
        return true;
    };
    const handleNpcOptionSelect = (optionId) => {
        if (activeNpcProfileKey === "jane") {
            if (optionId === "who-are-you") {
                setNpcDialogueLines((prev) => [
                    ...prev,
                    "Jane: I trade what still has value. In this town, that is already rare.",
                ]);
                return;
            }
            if (optionId === "what-do-you-sell") {
                setNpcDialogueLines((prev) => [
                    ...prev,
                    "Jane: Tools, scraps, and whatever still keeps a traveler alive one more night.",
                ]);
                return;
            }
            if (optionId === "any-rumors") {
                setNpcDialogueLines((prev) => [
                    ...prev,
                    "Jane: The sewer is not as empty as it sounds. And the temple still attracts desperate souls.",
                ]);
                if (player && !player.learnedRumors.includes("jane-sewer-rumor")) {
                    const resolution = learnRumor("jane-sewer-rumor");
                    logQuestUpdates(applyQuestEvents(mergeQuestProgressEvents([{ type: "rumor", rumorKey: "jane-sewer-rumor" }], resolution
                        ? createQuestEventsFromDiscoveryResolution(resolution)
                        : [])));
                    gainCharacterXp(10, "Learned a useful rumor from Jane");
                }
                return;
            }
        }
        if (activeNpcProfileKey === "maria") {
            if (optionId === "who-are-you") {
                setNpcDialogueLines((prev) => [
                    ...prev,
                    "Maria: I keep medicines, tinctures, and old field remedies alive for anyone who can still pay.",
                ]);
                return;
            }
            if (optionId === "what-do-you-sell") {
                setNpcDialogueLines((prev) => [
                    ...prev,
                    "Maria: Potions, herbs, and stranger mixtures. The stock is small for now, but it will grow.",
                ]);
                return;
            }
            if (optionId === "why-live-here") {
                setNpcDialogueLines((prev) => [
                    ...prev,
                    "Maria: The city forgot these farms. That means rare roots still grow here, and fewer people ask dangerous questions.",
                ]);
            }
        }
    };
    const handleAction = (action) => {
        if (!player)
            return;
        if (action.effect === "npc_dialog") {
            handleOpenNpcDialog(action.npcProfileId ?? "jane");
            return;
        }
        if (action.effect === "trigger_encounter" && action.encounterKey) {
            if (!triggeredEncounters.includes(action.encounterKey)) {
                openEncounter(action.encounterKey);
                return;
            }
            setEventLogs((prev) => [
                ...prev,
                createUnavailableDestinationMessage(action.targetMapName),
            ]);
            return;
        }
        if (action.effect === "travel_map" && action.destinationMapId) {
            handleMapTravel(action.destinationMapId);
            return;
        }
        if (action.effect === "travel_placeholder") {
            setEventLogs((prev) => [
                ...prev,
                createUnavailableDestinationMessage(action.targetMapName),
            ]);
            return;
        }
        if (action.effect === "learn_rumor" && action.rumorKey) {
            const resolution = learnRumor(action.rumorKey);
            logQuestUpdates(applyQuestEvents(mergeQuestProgressEvents([{ type: "rumor", rumorKey: action.rumorKey }], resolution
                ? createQuestEventsFromDiscoveryResolution(resolution)
                : [])));
            return;
        }
        if (action.effect === "quest_interaction" && action.questKey) {
            handleQuestInteraction(action.questKey);
            return;
        }
        if (action.effect === "log_message" && action.eventLogMessage) {
            const eventLogMessage = action.eventLogMessage;
            setEventLogs((prev) => [...prev, eventLogMessage]);
            return;
        }
        if (action.effect === "sell_resources") {
            handleSellResources(action);
            return;
        }
        if (action.effect === "start_fishing") {
            handleOpenFishing(action);
            return;
        }
        if (action.effect === "start_mining") {
            handleOpenMining(action);
            return;
        }
        if (action.effect === "open_hideout") {
            handleOpenHideout();
            return;
        }
        if (action.effect === "rest") {
            const restored = action.amount ?? 2;
            setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot(previousPlayer, [
                {
                    type: "stamina",
                    amount: restored,
                },
            ]));
            setEventLogs((prev) => [
                ...prev,
                createStaminaRecoveredMessage(restored),
            ]);
            return;
        }
        if (action.rewardItem) {
            const rewardItem = action.rewardItem;
            const cost = resolveConditionAdjustedStaminaCost(player, action.staminaCost ?? 0);
            if (!canSpendPlayerStamina(player, cost)) {
                setEventLogs((prev) => [
                    ...prev,
                    createInsufficientStaminaMessage(action.label),
                ]);
                return;
            }
            const amount = action.amount ?? 1;
            setPlayer((previousPlayer) => applyRewardsToPlayerSnapshot(applyConditionActionWear(spendPlayerStamina(previousPlayer, cost)), [
                {
                    type: "item",
                    itemKey: rewardItem,
                    amount,
                },
            ]));
            setEventLogs((prev) => [
                ...prev,
                createActionPerformedMessage(action.label),
                createItemObtainedMessage(rewardItem, amount),
                ...(hasInjury
                    ? [createSystemMessage("Injury makes the effort cost 1 extra stamina.")]
                    : []),
                ...(hasPoison
                    ? [createSystemMessage("Poison drains 1 HP and 1 SP as you exert yourself.")]
                    : []),
            ]);
            logQuestUpdates(applyQuestEvents([
                {
                    type: "action",
                    actionId: action.id,
                },
                {
                    type: "item",
                    itemKey: rewardItem,
                    amount,
                },
            ]));
            recordSkillTraining({
                type: "world.action.completed",
                action: {
                    id: action.id,
                    label: action.label,
                    rewardItem,
                    amount,
                    effect: action.effect,
                },
            });
            tryTriggerLoreDiscovery(action);
        }
    };
    if (!player)
        return null;
    const counts = new Map();
    for (const item of player.inventory) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
    }
    const groupedInventory = resolveInventoryItemViews(Array.from(counts.entries()).map(([itemKey, count]) => ({
        itemKey,
        count,
    })));
    const hideoutStorageDisplayEntries = storageEntries.map(({ itemKey, count }) => resolveInventoryItemView(itemKey, count));
    const sellableInventoryEntries = groupedInventory.filter((item) => (activeNpcProfile.sellableItemKeys ?? []).includes(item.itemKey));
    const currentWeight = groupedInventory.reduce((total, item) => total + item.weight * item.count, 0);
    const xpText = xpProgress
        ? `XP ${xpProgress.xpIntoLevel} of ${xpProgress.xpToNextLevel}`
        : "XP 0 of 0";
    const xpProgressPercent = xpProgress
        ? xpProgress.xpToNextLevel > 0
            ? Math.max(0, Math.min(100, (xpProgress.xpIntoLevel / xpProgress.xpToNextLevel) * 100))
            : 0
        : 0;
    const sideNavItems = [
        {
            id: "world-map",
            label: "World Map",
            icon: sideNavIcons.worldMap,
            onClick: handleOpenWorldMap,
            isActive: worldMapDialogOpen,
            tooltipDescription: "Open the atlas view of Belegard and the surrounding frontier.",
        },
        {
            id: "quests",
            label: "Quest Log",
            icon: sideNavIcons.quests,
            onClick: handleOpenQuestLog,
            isActive: questLogDialogOpen,
            tooltipDescription: "Review daily missions, lore questlines, and hunt contracts.",
        },
        {
            id: "bestiary",
            label: "Bestiary",
            icon: sideNavIcons.bestiary,
            onClick: handleOpenBestiary,
            isActive: bestiaryDialogOpen,
            tooltipDescription: "Review known creatures and unlock deeper knowledge through repeated kills.",
        },
        {
            id: "hideout",
            label: "Hideout",
            icon: sideNavIcons.hideout,
            onClick: handleOpenHideout,
            isActive: hideoutDialogOpen,
            tooltipDescription: "Open your camp management window and upgrade core structures.",
        },
        {
            id: "skill-tree",
            label: "Skill Tree",
            icon: sideNavIcons.skillTree,
            onClick: handleOpenSkillTree,
            isActive: skillTreeDialogOpen,
            tooltipDescription: "Open the full talent and specialization window.",
        },
    ];
    const disconnectNavItem = {
        id: "disconnect",
        label: "Disconnect",
        icon: sideNavIcons.disconnect,
        onClick: () => {
            const shouldDisconnect = window.confirm("Disconnect and return to the login screen?");
            if (!shouldDisconnect) {
                return;
            }
            onDisconnect();
        },
        tooltipDescription: "Leave the current session and return to the login screen.",
    };
    return (_jsx("main", { className: "game-shell", children: _jsxs("section", { className: "game-grid", children: [_jsx(SideNavRail, { items: sideNavItems, footerItem: disconnectNavItem }), _jsxs("section", { className: "world-panel", children: [_jsx(TopPanel, { locationName: currentMapData.name, locationSubtitle: "", worldStatus: [], rightContent: _jsx(RegionPlayersIndicator, { currentMapId: currentMap, currentMapName: currentMapData.name, currentPlayerName: player.name, onSendMessage: (_, playerName) => {
                                    setEventLogs((previousLogs) => [
                                        ...previousLogs,
                                        createDirectMessagePlaceholder(playerName),
                                    ]);
                                }, onInviteToHunt: (_, playerName) => {
                                    setEventLogs((previousLogs) => [
                                        ...previousLogs,
                                        createHuntInvitePlaceholder(playerName),
                                    ]);
                                } }, currentMap), stats: [
                                {
                                    label: "HP",
                                    value: computedHp,
                                    max: computedMaxHp,
                                    className: "bar-hp",
                                },
                                {
                                    label: "SP",
                                    value: player.currentSp,
                                    max: computedSp,
                                    className: "bar-sp",
                                },
                                {
                                    label: "Stamina",
                                    value: player.stamina,
                                    max: player.maxStamina,
                                    className: "bar-stamina",
                                },
                            ] }), _jsx(WorldMap, { currentLocation: currentLocation, contextState: contextState, mapData: currentMapData, onTravel: handleTravelAndOpenContext, onMinimizeContext: () => setContextState("minimized"), onExpandContext: () => setContextState("expanded"), onAction: handleAction, onGlobalAction: handleGlobalMapAction, onStopGlobalAction: handleStopGlobalMapAction, activeGlobalActionLabel: activeLoopActionLabel, globalActionStatus: continuousCombatLoopState.status, globalActionEncountersCompleted: continuousCombatLoopState.completedEncounters, npcDialogOpen: npcDialogOpen, npcName: activeNpcProfile.name, npcRole: activeNpcProfile.role, npcDialogueLines: npcDialogueLines, npcDialogueOptions: npcDialogueOptions, npcLoreNotes: npcLoreNotes, onCloseNpcDialog: handleCloseNpcDialog, onNpcOptionSelect: handleNpcOptionSelect, onNpcBuyItem: handleNpcBuyItem, onNpcSellItems: handleNpcSellItems, npcBuyOffers: activeNpcProfile.buyOffers, npcSellInventoryEntries: sellableInventoryEntries, npcSellPlaceholderMessage: activeNpcProfile.sellPlaceholderMessage, combatDialogOpen: Boolean(activeEncounter && activeEncounterData && combatState), combatEnemyName: activeEncounterData?.enemyName ?? "", combatEnemyTitle: activeEncounterData?.enemyTitle ?? "", combatEnemyHp: combatState && activeEncounterData
                                ? combatState.combatants[combatState.enemyCombatantIds[0] ?? ""]?.currentHp ?? 0
                                : 0, combatEnemyMaxHp: activeEncounterData?.enemyMaxHp ?? 0, combatLog: combatState?.combatLog.map((entry) => entry.message) ?? [], combatState: combatState, combatActionAvailabilities: combatActionAvailabilities, combatResolved: combatState?.status === "resolved", onCombatAction: dispatchCombatAction, onCombatRetreat: handleRetreatEncounter, onCloseCombatDialog: handleCloseEncounter, discoverablePois: discoverablePoisData, revealedPois: player.revealedPois, discoveredPois: player.discoveredPois, onDiscoverPoi: (poiKey) => {
                                const resolution = discoverPoi(poiKey);
                                logQuestUpdates(applyQuestEvents(mergeQuestProgressEvents([{ type: "poi", poiKey }], resolution
                                    ? createQuestEventsFromDiscoveryResolution(resolution)
                                    : [])));
                            }, npcNarrativeHint: activeNpcProfile.narrativeHint, showNpcNarrativeStatus: true, npcNarrativeStatusText: activeNpcProfileKey === "jane" && sewerRumorLearned
                                ? "Jane may still respond to what you uncover in the world."
                                : activeNpcProfile.narrativeStatusText, overlayContent: activeFishingConfig ? (_jsx(FishingDialog, { isOpen: Boolean(activeFishingConfig), config: activeFishingConfig, onClose: handleCloseFishing, onSuccess: handleFishingSuccess, onFailure: handleFishingFailure })) : activeMiningConfig ? (_jsx(MiningDialog, { isOpen: Boolean(activeMiningConfig), config: activeMiningConfig, onClose: handleCloseMining, onSuccess: handleMiningSuccess, onFailure: handleMiningFailure })) : skillTreeDialogOpen ? (_jsx(SkillTreeDialog, { isOpen: skillTreeDialogOpen, characterLevel: computedLevel, skills: skills, specializationProgress: player.specializationProgress, talentTrees: talentTrees, talentPointsEarned: talentPointsEarned, talentPointsSpent: talentPointsSpent, talentPointsAvailable: talentPointsAvailable, onClose: handleCloseSkillTree, onUnlockTalent: (nodeKey) => spendTalentPoint(nodeKey, computedLevel), onSelectSpecialization: (skillKey, nodeKey) => {
                                    const skill = skills.find((entry) => entry.key === skillKey);
                                    if (!skill) {
                                        return;
                                    }
                                    selectSkillSpecialization(skill, nodeKey);
                                } })) : questLogDialogOpen ? (_jsx(QuestLogDialog, { isOpen: questLogDialogOpen, entries: questLog.entries, onClose: handleCloseQuestLog })) : bestiaryDialogOpen ? (_jsx(BestiaryDialog, { isOpen: bestiaryDialogOpen, entries: bestiaryEntries, onClose: handleCloseBestiary })) : hideoutDialogOpen ? (_jsx(HideoutDialog, { isOpen: hideoutDialogOpen, hideoutName: hideoutState.name, structures: hideoutStructures, inventoryEntries: groupedInventory, storageEntries: hideoutStorageDisplayEntries, onClose: handleCloseHideout, onUpgrade: handleHideoutUpgrade, onDepositItem: handleDepositToHideoutStorage, onWithdrawItem: handleWithdrawFromHideoutStorage })) : worldMapDialogOpen ? (_jsx(WorldMapDialog, { isOpen: worldMapDialogOpen, currentMap: currentMap, currentWorldMapPoiId: currentWorldMapPoiId, playerAvatarSrc: selectedCharacterAvatar.imageSrc, playerAvatarAlt: selectedCharacterAvatar.altLabel, onClose: handleCloseWorldMap, onPoiSelect: handleSelectWorldMapPoi, onFastTravelConfirm: handleConfirmWorldMapFastTravel, activeFastTravel: activeWorldFastTravel, completedFastTravelReport: completedWorldFastTravelReport, onDismissFastTravelReport: handleDismissWorldFastTravelReport, overlayToast: worldMapOverlayToast, onDismissOverlayToast: dismissWorldMapOverlayToast })) : null }), _jsxs("section", { className: "bottom-left-panel", children: [_jsx(EventLogPanel, { logs: eventLogs }), _jsx(ChatPanel, { messages: chatMessages, inputValue: chatInput, onInputChange: setChatInput, onSend: () => {
                                        const nextMessage = chatInput.trim().slice(0, 200);
                                        if (!nextMessage)
                                            return;
                                        setChatMessages((prev) => [
                                            ...prev,
                                            createChatMessage(`You: ${nextMessage}`),
                                        ]);
                                        setChatInput("");
                                    } })] })] }), _jsxs("aside", { className: "right-sidebar", children: [_jsx(CharacterPanel, { level: computedLevel, xpText: xpText, xpProgressPercent: xpProgressPercent, name: player.name, characterClass: selectedClass.name, avatarSrc: selectedCharacterAvatar.imageSrc, avatarAlt: selectedCharacterAvatar.altLabel, conditions: resolvedCharacterConditions, buffs: buffsData }), _jsx(EquipmentPanel, { equipmentRows: equipmentRows }), _jsx(InventoryPanel, { items: groupedInventory, currentWeight: Number(currentWeight.toFixed(1)), maxWeight: computedCarryWeight }), _jsx(SkillsPanel, { skills: skills, specializationProgress: player.specializationProgress })] })] }) }));
}
