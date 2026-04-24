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
import type { InventoryPanelItem } from "../components/InventoryPanel";
import CharacterPanel from "../components/CharacterPanel";
import EquipmentPanel from "../components/EquipmentPanel";
import EventLogPanel from "../components/EventLogPanel";
import ChatPanel from "../components/ChatPanel";
import TopPanel from "../components/TopPanel";
import RegionPlayersIndicator from "../components/RegionPlayersIndicator";
import SideNavRail, { sideNavIcons } from "../components/SideNavRail";
import { useCombatEncounter } from "../features/combat/application/hooks/useCombatEncounter";
import { useLocalWorldBossTestScheduler } from "../features/boss/application/hooks/useLocalWorldBossTestScheduler";
import { useWorldBossSession } from "../features/boss/application/hooks/useWorldBossSession";
import { resolveWorldBossMapNotification } from "../features/boss/application/selectors/resolveWorldBossMapNotification";
import { resolveWorldBossResultSummary } from "../features/boss/application/selectors/resolveWorldBossResultSummary";
import { worldBossData } from "../features/boss/domain/worldBossData";
import WorldBossLobbyDialog from "../features/boss/presentation/components/WorldBossLobbyDialog";
import WorldBossActionDialog from "../features/boss/presentation/components/WorldBossActionDialog";
import WorldBossResultDialog from "../features/boss/presentation/components/WorldBossResultDialog";

import {
  WorldMap,
  WorldMapDialog,
  discoverablePoisData,
  resolveMapData,
  npcProfilesData,
  resolveWorldFastTravelReport,
  worldMapPoisData,
  type ActiveWorldFastTravel,
  type WorldFastTravelActivity,
  type WorldFastTravelReport,
  type MapGlobalAction,
  type WorldMapPoi,
  type WorldMapPoiId,
  type WorldMapTravelCost,
  type ContextAction,
  type LocationKey,
  type MapId,
  type NpcProfileKey,
  type NpcShopOffer,
} from "../features/world";
import { useContinuousCombatLoop } from "../features/combat/application/hooks/useContinuousCombatLoop";
import {
  FishingDialog,
  fishingConfigs,
} from "../features/fishing";
import {
  MiningDialog,
  miningConfigs,
} from "../features/mining";
import {
  HideoutDialog,
  consumeHideoutUpgradeCosts,
  useHideout,
  type HideoutStructureKey,
} from "../features/hideout";
import {
  QuestLogDialog,
  createQuestEventsFromDiscoveryResolution,
  mergeQuestProgressEvents,
  questsData,
  useQuestLog,
  useQuestProgression,
} from "../features/quests";
import { BestiaryDialog, useBestiary } from "../features/bestiary";
import { SkillTreeDialog, useTalentTree } from "../features/specializations";
import { type EncounterKey } from "../data/encountersData";
import { resolveEncounterData } from "../features/combat/application/selectors/resolveEncounterData";
import {
  getItemDefinition,
  resolveInventoryItemView,
  resolveInventoryItemViews,
} from "../features/items";
import { inventoryCatalog } from "../data/inventoryCatalog";
import { equipmentRows } from "../data/equipmentData";
import { conditionsData } from "../data/conditionsData";
import { buffsData } from "../data/buffsData";
import { collectRewardMessages } from "../features/systems/application/systems/rewardResolutionSystem";
import { applyRewardsToPlayerSnapshot } from "../features/systems/application/systems/playerRewardStateSystem";
import {
  applyConditionActionWear,
  resolveConditionAdjustedStaminaCost,
} from "../features/systems/application/systems/playerConditionSystem";
import {
  countInventoryItem,
  countInventoryItemsByKeys,
  canSpendPlayerStamina,
  consumeInventoryItemsByPriority,
  consumeInventoryItemAmount,
  removeInventoryItemsByPredicate,
  replacePlayerInventory,
  spendPlayerStamina,
} from "../features/systems/application/systems/playerStateMutationSystem";
import { resolveBattleVictoryRewards } from "../features/combat/application/systems/battleRewardSystem";
import {
  createActionPerformedMessage,
  createConversationStartedMessage,
  createDirectMessagePlaceholder,
  createEncounterStartedMessage,
  createHideoutReasonMessage,
  createHideoutStorageMessage,
  createHideoutUpgradeMessage,
  createHuntInvitePlaceholder,
  createInsufficientStaminaMessage,
  createItemObtainedMessage,
  createNoSellableResourcesMessage,
  createPanelOpenedMessage,
  createPurchaseSuccessMessage,
  createStaminaRecoveredMessage,
  createSystemMessage,
  createTravelMessage,
  createUnavailableDestinationMessage,
  createSellResourcesMessage,
} from "../features/systems/application/systems/eventLogMessageSystem";
import { useCharacterProgression } from "../features/progression";
import { useNotifications } from "../features/notifications";
import type { CharacterSummary } from "./CharacterSelectScreen";
import type { DialogueOption } from "../components/NpcDialog";
import type { ChatMessage } from "../components/ChatPanel";
import { useGameOverlayState } from "./hooks/useGameOverlayState";
import { resolveCharacterAvatarByClassKey } from "../data/characterAvatarCatalog";

type GameScreenProps = {
  selectedCharacter: CharacterSummary;
  onDisconnect: () => void;
};

function formatChatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function createChatMessage(content: string, date = new Date()): ChatMessage {
  return {
    content,
    timestamp: formatChatTimestamp(date),
  };
}

const fastTravelFoodItemKeys = ["cookie", "fruit", "fish", "rabbit-meat"];
const alwaysVisibleConditionKeys = new Set(["cold", "hunger"]);

function resolveInventoryDisplayItem(itemKey: string, count: number) {
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

export default function GameScreen({
  selectedCharacter,
  onDisconnect,
}: GameScreenProps) {
  const selectedCharacterAvatar = resolveCharacterAvatarByClassKey(
    selectedCharacter.classKey
  );
  const { notifyError, notifySuccess, notifyInfo } = useNotifications();
  const [eventLogs, setEventLogs] = useState<string[]>([
    "System: The wasteland is silent today.",
    "System: You feel the cold wind across the ruins.",
  ]);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    createChatMessage(
      "NPC Mara: Keep your hood on. The wind cuts deep near the river."
    ),
    createChatMessage("Ronan: Anyone heading to Blackwood?"),
  ]);

  const [triggeredEncounters, setTriggeredEncounters] = useState<EncounterKey[]>(
    []
  );
  const [activeWorldFastTravel, setActiveWorldFastTravel] =
    useState<ActiveWorldFastTravel | null>(null);
  const [completedWorldFastTravelReport, setCompletedWorldFastTravelReport] =
    useState<WorldFastTravelReport | null>(null);
  const [worldMapOverlayToast, setWorldMapOverlayToast] = useState<{
    tone: "error" | "info" | "success" | "warning";
    title?: string;
    message: string;
  } | null>(null);
  const [pendingWorldFastTravelArrivalMapId, setPendingWorldFastTravelArrivalMapId] =
    useState<MapId | null>(null);
  // Temporary continent-position override used by the world-map prototype/testing flow.
  // This lets the pin and highlighted continent PoI move even when a destination does not
  // yet have a fully mapped local playable map. It must not be treated as the same source
  // of truth as `currentMap` for future gameplay systems.
  const [currentWorldMapPoiOverrideId, setCurrentWorldMapPoiOverrideId] =
    useState<WorldMapPoiId | null>("belagard");
  const fastTravelRecoveryRef = useRef<{
    travelKey: string | null;
    recoveredMinutesApplied: number;
  }>({
    travelKey: null,
    recoveredMinutesApplied: 0,
  });
  const fastTravelCompletionRef = useRef<string | null>(null);
  const worldMapOverlayToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const continuousCombatLoopStopRef = useRef<string | null>(null);
  const announcedWorldBossSlotKeyRef = useRef<string | null>(null);
  const announcedWorldBossBattleSessionIdRef = useRef<string | null>(null);
  const announcedWorldBossCombatFeedEventKeyRef = useRef<string | null>(null);
  const announcedWorldBossResolvedSessionIdRef = useRef<string | null>(null);

  const [currentMap, setCurrentMap] = useState<MapId>("belagard");
  const localWorldBossScheduler = useLocalWorldBossTestScheduler();
  const {
    contextState,
    setContextState,
    npcDialogOpen,
    activeNpcProfileKey,
    npcDialogueLines,
    setNpcDialogueLines,
    activeEncounter,
    setActiveEncounter,
    activeFishingSession,
    activeMiningSession,
    bestiaryDialogOpen,
    skillTreeDialogOpen,
    hideoutDialogOpen,
    questLogDialogOpen,
    worldMapDialogOpen,
    closeWorldActivityOverlays,
    openNpcDialog: openNpcOverlay,
    closeNpcDialog: closeNpcOverlay,
    openEncounter: openEncounterOverlay,
    openFishingSession: openFishingOverlay,
    closeFishingSession: closeFishingOverlay,
    openMiningSession: openMiningOverlay,
    closeMiningSession: closeMiningOverlay,
    openHideoutDialog: openHideoutOverlay,
    closeHideoutDialog: closeHideoutOverlay,
    openBestiaryDialog: openBestiaryOverlay,
    closeBestiaryDialog: closeBestiaryOverlay,
    openSkillTreeDialog: openSkillTreeOverlay,
    closeSkillTreeDialog: closeSkillTreeOverlay,
    openQuestLogDialog: openQuestLogOverlay,
    closeQuestLogDialog: closeQuestLogOverlay,
    openWorldMapDialog: openWorldMapOverlay,
    closeWorldMapDialog: closeWorldMapOverlay,
  } = useGameOverlayState();

  const {
    player,
    setPlayer,
    selectedClass,
    currentLocation,
    computedLevel,
    computedHp,
    computedMaxHp,
    computedSp,
    computedCarryWeight,
    xpProgress,
    skills,
    handleTravel,
    tryTriggerLoreDiscovery,
    gainCharacterXp,
    learnRumor,
    discoverPoi,
    recordSkillTraining,
    registerBestiaryKill,
    spendTalentPoint,
    selectSkillSpecialization,
  } = useCharacterProgression({
    selectedCharacter,
    setEventLogs,
  });
  const { entries: bestiaryEntries } = useBestiary({
    progress: player?.bestiaryProgress ?? {},
  });
  const {
    trees: talentTrees,
    pointsEarned: talentPointsEarned,
    pointsSpent: talentPointsSpent,
    pointsAvailable: talentPointsAvailable,
  } = useTalentTree({
    progress: player?.talentProgress ?? { unlockedNodeKeys: [] },
    characterLevel: computedLevel,
  });
  const questDefinitions = Object.values(questsData);
  const {
    progressStates: questProgressStates,
    activateQuestByKey,
    applyEvent: applyQuestEvent,
    applyEvents: applyQuestEvents,
    claimQuestRewardsByKey,
  } = useQuestProgression({
    quests: questDefinitions,
  });

  const currentMapData = resolveMapData(currentMap);
  const localWorldBossPlayerSnapshot = {
    id: selectedCharacter.id,
    name: player.name,
    classKey: selectedCharacter.classKey,
    currentHp: Math.min(player.currentHp, computedMaxHp),
    maxHp: computedMaxHp,
    currentSp: Math.min(player.currentSp, computedSp),
    maxSp: computedSp,
    currentStamina: player.stamina,
    maxStamina: player.maxStamina,
  };
  const worldBossSession = useWorldBossSession({
    event: localWorldBossScheduler.activeEvent,
    currentMapId: currentMap,
    localPlayer: localWorldBossPlayerSnapshot,
  });
  const activeWorldBossDefinition = worldBossSession.activeSession
    ? worldBossData[worldBossSession.activeSession.bossKey]
    : localWorldBossScheduler.activeBossDefinition;
  const worldBossMapNotice = resolveWorldBossMapNotification({
    event: localWorldBossScheduler.activeEvent,
    currentMapId: currentMap,
    activeSession: worldBossSession.activeSession,
  });
  const worldBossMapAction = worldBossSession.joinEligibility.isEligibleToJoin
    ? {
        label: "Join Battle",
        description:
          "Enter the local pre-battle World Boss session from this map.",
        tone: "join" as const,
      }
    : worldBossSession.joinEligibility.canLeaveBeforeStart
      ? {
          label: "Leave Battle",
          description:
            "Leave the local World Boss session before combat starts.",
          tone: "leave" as const,
        }
      : null;
  const worldBossLobbyOverlay =
    worldBossSession.sessionShellState === "lobby" &&
    worldBossSession.lobbySummary &&
    activeWorldBossDefinition ? (
      <WorldBossLobbyDialog
        isOpen={true}
        bossName={activeWorldBossDefinition.name}
        bossTitle={activeWorldBossDefinition.title}
        totalPlayers={worldBossSession.lobbySummary.totalPlayers}
        countdownRemainingSeconds={
          worldBossSession.lobbySummary.countdownRemainingSeconds
        }
        currentLaneId={worldBossSession.lobbySummary.localPlayerLaneId}
        laneSummaries={worldBossSession.lobbySummary.laneSummaries}
        onSelectLane={(laneId) => {
          const selection = worldBossSession.selectLobbyLane(laneId);

          if (!selection.didSelect) {
            return;
          }

          setEventLogs((previousLogs) => [
            ...previousLogs,
            `World Boss: You moved to the ${laneId} lane in the pre-battle lobby.`,
          ]);
        }}
        onLeave={() => {
          const leaveResult = worldBossSession.leaveWorldBoss();

          if (!leaveResult.didLeave || !worldBossMapNotice) {
            return;
          }

          const leaveMessage = `You left the World Boss staging session for ${worldBossMapNotice.bossName}.`;
          setEventLogs((previousLogs) => [...previousLogs, leaveMessage]);
          notifyInfo(leaveMessage, {
            title: "World Boss Left",
          });
        }}
      />
    ) : null;
  const worldBossActionOverlay =
    worldBossSession.sessionShellState === "combat" &&
    activeWorldBossDefinition ? (
      <WorldBossActionDialog
        isOpen={true}
        bossName={activeWorldBossDefinition.name}
        bossTitle={activeWorldBossDefinition.title}
        bossCurrentHp={worldBossSession.activeSession?.boss.currentHp ?? 0}
        bossMaxHp={worldBossSession.activeSession?.boss.maxHp ?? 0}
        round={worldBossSession.activeSession?.round.round ?? 1}
        currentLaneId={
          worldBossSession.activeSession?.participants.find(
            (participant) => participant.playerId === selectedCharacter.id
          )?.laneId ?? null
        }
        countdownRemainingSeconds={
          worldBossSession.combat.countdownRemainingSeconds
        }
        telegraphs={worldBossSession.activeSession?.round.activeTelegraphs ?? []}
        participants={
          worldBossSession.activeSession?.participants.map((participant) => ({
            id: participant.id,
            name: participant.name,
            classKey: participant.classKey,
            role: participant.role,
            laneId: participant.laneId,
            state: participant.state,
            currentHp: participant.currentHp,
            maxHp: participant.maxHp,
            currentSp: participant.currentSp,
            maxSp: participant.maxSp,
          })) ?? []
        }
        currentSelection={worldBossSession.combat.currentSelection}
        latestCommittedAction={worldBossSession.combat.latestCommittedAction}
        combatLog={worldBossSession.combat.combatLog}
        actionOptions={worldBossSession.combat.actionOptions}
        onSelectAction={(params) => {
          const result = worldBossSession.combat.submitAction(params);

          if (!result.didSubmit && result.reason) {
            notifyError(result.reason, {
              title: "World Boss Action",
            });
          }
        }}
        onLeaveBattle={() => {
          const leaveResult = worldBossSession.abandonWorldBossSession(
            "voluntary-exit"
          );

          if (!leaveResult.didAbandon) {
            return;
          }

          setEventLogs((previousLogs) => [
            ...previousLogs,
            ...leaveResult.messages,
          ]);
          notifyInfo("You left the active World Boss encounter.", {
            title: "World Boss Left",
          });
        }}
      />
    ) : null;
  const worldBossResultSummary =
    worldBossSession.sessionShellState === "result" &&
    worldBossSession.activeSession &&
    activeWorldBossDefinition
      ? resolveWorldBossResultSummary({
          session: worldBossSession.activeSession,
          boss: activeWorldBossDefinition,
          localPlayerId: selectedCharacter.id,
        })
      : null;
  const worldBossResultOverlay =
    worldBossResultSummary && activeWorldBossDefinition ? (
      <WorldBossResultDialog
        isOpen={true}
        bossName={activeWorldBossDefinition.name}
        bossTitle={activeWorldBossDefinition.title}
        summary={worldBossResultSummary}
        onClose={() => {
          if (worldBossResultSummary.rewards.length > 0) {
            setPlayer((previousPlayer) =>
              applyRewardsToPlayerSnapshot(
                previousPlayer,
                worldBossResultSummary.rewards
              )
            );
          }

          const resultMessages = [
            `World Boss Result: ${worldBossResultSummary.outcome === "victory" ? "Victory" : "Defeat"} against ${activeWorldBossDefinition.name}.`,
            `World Boss Summary: ${worldBossResultSummary.contribution.damageDealt} damage dealt, ${worldBossResultSummary.contribution.healingDone} healing done, ${worldBossResultSummary.contribution.damageTaken} damage taken, ${worldBossResultSummary.durationLabel} duration, ${worldBossResultSummary.totalPlayers} player(s).`,
            ...collectRewardMessages(worldBossResultSummary.rewards),
          ];

          setEventLogs((previousLogs) => [...previousLogs, ...resultMessages]);

          if (worldBossResultSummary.outcome === "victory") {
            notifySuccess(`${activeWorldBossDefinition.name} rewards claimed.`, {
              title: "World Boss Complete",
            });
          } else {
            notifyInfo("The World Boss session has been closed.", {
              title: "World Boss Defeat",
            });
          }

          worldBossSession.closeResolvedSession();
        }}
      />
    ) : null;
  const linkedCurrentMapPoi =
    worldMapPoisData.find((poi) => poi.linkedMapIds?.includes(currentMap)) ?? null;
  // Prefer the prototype/testing continent override when present; otherwise fall back
  // to the continent PoI inferred from the current local playable map.
  const currentWorldMapPoiId = currentWorldMapPoiOverrideId ?? linkedCurrentMapPoi?.id ?? null;
  const currentWorldMapPoi =
    worldMapPoisData.find((poi) => poi.id === currentWorldMapPoiId) ??
    linkedCurrentMapPoi ??
    null;
  const activeNpcProfile = npcProfilesData[activeNpcProfileKey];
  const sewerRumorLearned =
    player?.learnedRumors.includes("jane-sewer-rumor") ?? false;

  const npcDialogueOptions: DialogueOption[] = activeNpcProfile.dialogueOptions.map(
    (option) => {
      if (activeNpcProfileKey === "jane" && option.id === "any-rumors") {
        return {
          ...option,
          state: sewerRumorLearned ? "completed" : "new",
        };
      }

      return option;
    }
  );

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
  const {
    hideoutState,
    structures: hideoutStructures,
    storageEntries,
    upgradeStructure,
    depositItem,
    withdrawItem,
  } = useHideout({
    inventory: player?.inventory ?? [],
    playerLevel: computedLevel,
  });
  const questLog = useQuestLog({
    quests: questDefinitions,
    progressStates: questProgressStates,
    context: {
      inventoryItemCounts: (player?.inventory ?? []).reduce<Record<string, number>>(
        (counts, itemKey) => {
          counts[itemKey] = (counts[itemKey] ?? 0) + 1;
          return counts;
        },
        {}
      ),
      revealedPoiKeys: player?.revealedPois ?? [],
      completedQuestKeys: questProgressStates
        .filter((entry) => entry.state === "completed")
        .map((entry) => entry.questKey),
    },
  });
  const resolvedCharacterConditions = conditionsData.map((condition) => ({
    ...condition,
    active:
      alwaysVisibleConditionKeys.has(condition.key) ||
      (player?.activeConditions.includes(condition.key) ?? false),
  }));
  const hasInjury = player?.activeConditions.includes("injury") ?? false;
  const hasPoison = player?.activeConditions.includes("poison") ?? false;

  useEffect(() => {
    const activeEvent = localWorldBossScheduler.activeEvent;

    if (!activeEvent?.schedulerSlotKey || !worldBossMapNotice) {
      return;
    }

    if (announcedWorldBossSlotKeyRef.current === activeEvent.schedulerSlotKey) {
      return;
    }

    announcedWorldBossSlotKeyRef.current = activeEvent.schedulerSlotKey;

    const activationMessage = `World Boss ${worldBossMapNotice.bossName} is active. Travel to ${worldBossMapNotice.targetMapName}.`;

    setEventLogs((previousLogs) => [...previousLogs, activationMessage]);
    notifyInfo(activationMessage, {
      title: "World Boss Active",
      dedupeKey: `world-boss-slot:${activeEvent.schedulerSlotKey}`,
    });
  }, [
    localWorldBossScheduler.activeEvent,
    notifyInfo,
    worldBossMapNotice,
  ]);

  useEffect(() => {
    const activeSession = worldBossSession.activeSession;

    if (!activeSession || activeSession.state !== "active") {
      return;
    }

    if (announcedWorldBossBattleSessionIdRef.current === activeSession.sessionId) {
      return;
    }

    announcedWorldBossBattleSessionIdRef.current = activeSession.sessionId;

    const battleStartMessage = `World Boss: The lobby countdown ended. ${activeSession.boss.name} battle state is now active.`;

    setEventLogs((previousLogs) => [...previousLogs, battleStartMessage]);
    notifyInfo(battleStartMessage, {
      title: "World Boss Battle Started",
      dedupeKey: `world-boss-battle:${activeSession.sessionId}`,
    });
  }, [notifyInfo, worldBossSession.activeSession]);

  useEffect(() => {
    const feedBatch = worldBossSession.combat.latestFeedBatch;

    if (!feedBatch) {
      return;
    }

    if (announcedWorldBossCombatFeedEventKeyRef.current === feedBatch.key) {
      return;
    }

    announcedWorldBossCombatFeedEventKeyRef.current = feedBatch.key;
    setEventLogs((previousLogs) => [...previousLogs, ...feedBatch.messages]);
  }, [worldBossSession.combat.latestFeedBatch]);

  useEffect(() => {
    const activeSession = worldBossSession.activeSession;

    if (
      !activeSession ||
      (activeSession.state !== "completed" && activeSession.state !== "failed")
    ) {
      return;
    }

    if (announcedWorldBossResolvedSessionIdRef.current === activeSession.sessionId) {
      return;
    }

    announcedWorldBossResolvedSessionIdRef.current = activeSession.sessionId;

    const resolutionMessage =
      activeSession.state === "completed"
        ? `World Boss: ${activeSession.boss.name} was defeated. Review the result screen to claim rewards.`
        : `World Boss: The raid failed against ${activeSession.boss.name}. Review the result screen for the battle summary.`;

    setEventLogs((previousLogs) => [...previousLogs, resolutionMessage]);

    if (activeSession.state === "completed") {
      notifySuccess(resolutionMessage, {
        title: "World Boss Victory",
        dedupeKey: `world-boss-result:${activeSession.sessionId}`,
      });
      return;
    }

    notifyInfo(resolutionMessage, {
      title: "World Boss Defeat",
      dedupeKey: `world-boss-result:${activeSession.sessionId}`,
    });
  }, [notifyInfo, notifySuccess, worldBossSession.activeSession]);

  const logQuestUpdates = useCallback(
    (updates: Array<{
      questKey: string;
      previousState: string;
      nextState: string;
    }>) => {
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
    },
    [questDefinitions]
  );

  const dismissWorldMapOverlayToast = useCallback(() => {
    if (worldMapOverlayToastTimeoutRef.current) {
      clearTimeout(worldMapOverlayToastTimeoutRef.current);
      worldMapOverlayToastTimeoutRef.current = null;
    }

    setWorldMapOverlayToast(null);
  }, []);

  const showWorldMapOverlayToast = useCallback(
    (toast: {
      tone: "error" | "info" | "success" | "warning";
      title?: string;
      message: string;
    }) => {
      dismissWorldMapOverlayToast();
      setWorldMapOverlayToast(toast);

      worldMapOverlayToastTimeoutRef.current = setTimeout(() => {
        setWorldMapOverlayToast(null);
        worldMapOverlayToastTimeoutRef.current = null;
      }, 3200);
    },
    [dismissWorldMapOverlayToast]
  );

  const handleMapTravel = (destinationMapId?: MapId) => {
    if (!destinationMapId) return;

    setCurrentMap(destinationMapId);
    const destinationWorldPoi =
      worldMapPoisData.find((poi) => poi.linkedMapIds?.includes(destinationMapId)) ?? null;
    setCurrentWorldMapPoiOverrideId(destinationWorldPoi?.id ?? null);
    closeWorldActivityOverlays();
    setContextState("expanded");

    const destinationMap = resolveMapData(destinationMapId);

    const travelResolution = destinationMap.entryLocationKey
      ? handleTravel(destinationMap.entryLocationKey)
      : null;

    logQuestUpdates(
      applyQuestEvents(
        mergeQuestProgressEvents(
          [{ type: "map", mapId: destinationMapId }],
          travelResolution
            ? createQuestEventsFromDiscoveryResolution(travelResolution)
            : []
        )
      )
    );

    setEventLogs((prev) => [
      ...prev,
      createTravelMessage(destinationMap.name),
    ]);
  };

  const handleTravelAndOpenContext = (location: LocationKey) => {
    closeWorldActivityOverlays();
    setContextState("expanded");

    const travelResolution = handleTravel(location);
    logQuestUpdates(
      applyQuestEvents(
        mergeQuestProgressEvents(
          [{ type: "poi", poiKey: location }],
          travelResolution
            ? createQuestEventsFromDiscoveryResolution(travelResolution)
            : []
        )
      )
    );

  };

  const handleOpenNpcDialog = (profileKey: NpcProfileKey = "jane") => {
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

  const handleWorldBossMapAction = () => {
    if (worldBossSession.joinEligibility.isEligibleToJoin) {
      const joinResult = worldBossSession.joinWorldBoss();

      if (!joinResult.didJoin || !worldBossMapNotice) {
        return;
      }

      const joinMessage = `You joined the World Boss staging session for ${worldBossMapNotice.bossName} in ${worldBossMapNotice.targetMapName}.`;
      setEventLogs((previousLogs) => [...previousLogs, joinMessage]);
      notifySuccess(joinMessage, {
        title: "World Boss Joined",
      });
      return;
    }

    if (worldBossSession.joinEligibility.canLeaveBeforeStart) {
      const leaveResult = worldBossSession.leaveWorldBoss();

      if (!leaveResult.didLeave || !worldBossMapNotice) {
        return;
      }

      const leaveMessage = `You left the World Boss staging session for ${worldBossMapNotice.bossName}.`;
      setEventLogs((previousLogs) => [...previousLogs, leaveMessage]);
      notifyInfo(leaveMessage, {
        title: "World Boss Left",
      });
    }
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
      const totalDuration =
        activeWorldFastTravel.completesAt - activeWorldFastTravel.startedAt;
      const elapsed = now - activeWorldFastTravel.startedAt;
      const progressPercent =
        totalDuration <= 0 ? 100 : Math.min(100, (elapsed / totalDuration) * 100);
      const recoveredStaminaMinutes = Math.min(
        activeWorldFastTravel.durationMinutes,
        Math.floor(Math.max(0, elapsed) / 60000)
      );

      const alreadyAppliedRecovery =
        fastTravelRecoveryRef.current.travelKey === travelKey
          ? fastTravelRecoveryRef.current.recoveredMinutesApplied
          : 0;
      const staminaDelta = Math.max(
        0,
        recoveredStaminaMinutes - alreadyAppliedRecovery
      );

      if (staminaDelta > 0) {
        setPlayer((previousPlayer) =>
          applyRewardsToPlayerSnapshot(previousPlayer, [
            {
              type: "stamina",
              amount: staminaDelta,
            },
          ])
        );

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

        const originPoi =
          worldMapPoisData.find((poi) => poi.id === activeWorldFastTravel.originPoiId) ??
          null;
        const destinationPoi =
          worldMapPoisData.find(
            (poi) => poi.id === activeWorldFastTravel.destinationPoiId
          ) ?? null;
        const destinationMapId = destinationPoi?.linkedMapIds?.[0];
        const report = resolveWorldFastTravelReport(
          activeWorldFastTravel,
          originPoi,
          destinationPoi,
          recoveredStaminaMinutes
        );

        setPlayer((previousPlayer) => {
          const withRewards =
            report.rewards.length > 0
              ? applyRewardsToPlayerSnapshot(previousPlayer, report.rewards)
              : previousPlayer;

          return {
            ...withRewards,
            currentHp: Math.max(1, withRewards.currentHp - report.hpLoss),
            currentSp: Math.max(0, withRewards.currentSp - report.spLoss),
            activeConditions: Array.from(
              new Set([
                ...withRewards.activeConditions,
                ...report.inflictedConditions,
              ])
            ),
          };
        });

        const rewardQuestEvents = report.rewards.flatMap((reward) =>
          reward.type === "item"
            ? [
                {
                  type: "item" as const,
                  itemKey: reward.itemKey,
                  amount: reward.amount,
                },
              ]
            : []
        );

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
          createSystemMessage(
            `You arrive at ${destinationPoi?.label ?? "your destination"} after recovering ${recoveredStaminaMinutes} stamina during the journey. Planned activity: ${activeWorldFastTravel.activity.label}.`
          ),
        ]);

        setCompletedWorldFastTravelReport(report);
        setActiveWorldFastTravel(null);
        return;
      }

      setActiveWorldFastTravel((currentTravel: ActiveWorldFastTravel | null) => {
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

  const openEncounter = useCallback((encounterKey: EncounterKey) => {
    const encounter = resolveEncounterData(encounterKey);

    if (!encounter) {
      notifyError("Encounter configuration is unavailable.", {
        title: "Combat unavailable",
      });
      return;
    }

    setTriggeredEncounters((prev) =>
      prev.includes(encounterKey) ? prev : [...prev, encounterKey]
    );

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
  const {
    combatState,
    actionAvailabilities: combatActionAvailabilities,
    dispatchCombatAction,
    retreatEncounter,
    closeCombat,
  } = useCombatEncounter({
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
      registerBestiaryKill(
        speciesId as Parameters<typeof registerBestiaryKill>[0],
        enemyName
      );
    },
    onResolveVictoryRewards: (encounter) => {
      const victoryRewards = resolveBattleVictoryRewards(encounter);

      if (victoryRewards.rewards.length > 0) {
        setPlayer((previousPlayer) =>
          applyRewardsToPlayerSnapshot(previousPlayer, victoryRewards.rewards)
        );
      }

      return victoryRewards.eventLogMessages;
    },
    onRecordTraining: (event) => {
      recordSkillTraining(event as Parameters<typeof recordSkillTraining>[0]);
    },
    onEncounterQuestProgress: (encounterKey) => {
      logQuestUpdates(
        applyQuestEvent({
          type: "encounter",
          encounterKey,
        })
      );
    },
  });

  const combatLoopEncounterState = activeEncounter
    ? {
        key: activeEncounter.key,
        isResolved: combatState?.status === "resolved",
        resolution:
          combatState?.resolution === "victory" || combatState?.resolution === "defeat"
            ? combatState.resolution
            : null,
      }
    : null;

  const {
    loopState: continuousCombatLoopState,
    activeLoopActionLabel,
    isHunting,
    startGlobalAction,
    stopLoop,
    resetLoop,
  } = useContinuousCombatLoop({
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

  const handleGlobalMapAction = useCallback(
    (action: MapGlobalAction) => {
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
        createSystemMessage(
          `${action.label} begins in ${currentMapData.name}. New encounters will chain automatically until the hunt is stopped or interrupted.`
        ),
      ]);
      setContextState("expanded");
    },
    [currentMapData.name, notifyError, notifyInfo, setContextState, startGlobalAction]
  );

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

    const reasonMessage =
      continuousCombatLoopState.stopReason === "defeat"
        ? "The hunt ends because you were defeated."
        : continuousCombatLoopState.stopReason === "retreat"
          ? "The hunt ends after you retreat from the encounter."
          : continuousCombatLoopState.stopReason === "unavailable"
            ? "The hunt ends because no further encounters are available on this map."
            : "You stop searching for new prey.";

    window.setTimeout(() => {
      setEventLogs((prev) => [
        ...prev,
        createSystemMessage(
          `${reasonMessage} ${continuousCombatLoopState.completedEncounters} encounter(s) were cleared in this run.`
        ),
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

  const handleOpenFishing = (action: ContextAction) => {
    if (!player || !action.fishingSpotKey) return;

    const attemptCost = resolveConditionAdjustedStaminaCost(
      player,
      action.staminaCost ?? 0
    );

    if (!canSpendPlayerStamina(player, attemptCost)) {
      setEventLogs((prev) => [
        ...prev,
        createInsufficientStaminaMessage(action.label),
      ]);
      return;
    }

    setPlayer((previousPlayer) =>
      applyConditionActionWear(spendPlayerStamina(previousPlayer, attemptCost))
    );

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
    if (!player || !activeFishingSession || !activeFishingConfig) return;

    setPlayer((previousPlayer) =>
      applyRewardsToPlayerSnapshot(previousPlayer, [
        {
          type: "item",
          itemKey: activeFishingConfig.rewardItemKey,
          amount: activeFishingConfig.rewardAmount,
        },
      ])
    );

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
      createItemObtainedMessage(
        activeFishingConfig.rewardItemKey,
        activeFishingConfig.rewardAmount
      ),
    ]);

    logQuestUpdates(
      applyQuestEvents([
        {
          type: "action",
          actionId: activeFishingSession.action.id,
        },
        {
          type: "item",
          itemKey: activeFishingConfig.rewardItemKey,
          amount: activeFishingConfig.rewardAmount,
        },
      ])
    );
  };

  const handleFishingFailure = () => {
    if (!activeFishingConfig) return;

    setEventLogs((prev) => [...prev, activeFishingConfig.failureLog]);
  };

  const handleOpenMining = (action: ContextAction) => {
    if (!player || !action.miningSpotKey) return;

    const attemptCost = resolveConditionAdjustedStaminaCost(
      player,
      action.staminaCost ?? 0
    );

    if (!canSpendPlayerStamina(player, attemptCost)) {
      setEventLogs((prev) => [
        ...prev,
        createInsufficientStaminaMessage(action.label),
      ]);
      return;
    }

    setPlayer((previousPlayer) =>
      applyConditionActionWear(spendPlayerStamina(previousPlayer, attemptCost))
    );

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
    if (!player || !activeMiningSession || !activeMiningConfig) return;

    setPlayer((previousPlayer) =>
      applyRewardsToPlayerSnapshot(previousPlayer, [
        {
          type: "item",
          itemKey: activeMiningConfig.rewardItemKey,
          amount: activeMiningConfig.rewardAmount,
        },
      ])
    );

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
      createItemObtainedMessage(
        activeMiningConfig.rewardItemKey,
        activeMiningConfig.rewardAmount
      ),
    ]);

    logQuestUpdates(
      applyQuestEvents([
        {
          type: "action",
          actionId: activeMiningSession.action.id,
        },
        {
          type: "item",
          itemKey: activeMiningConfig.rewardItemKey,
          amount: activeMiningConfig.rewardAmount,
        },
      ])
    );
  };

  const handleMiningFailure = () => {
    if (!activeMiningConfig) return;

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
      createPanelOpenedMessage(
        "World Map",
        "You unfold a wider view of Belegard and the surrounding frontier."
      ),
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

    logQuestUpdates(
      applyQuestEvents(
        mergeQuestProgressEvents(
          [{ type: "map", mapId: arrivalMapId }],
          travelResolution
            ? createQuestEventsFromDiscoveryResolution(travelResolution)
            : []
        )
      )
    );
  };

  const handleCloseWorldMap = () => {
    if (completedWorldFastTravelReport) {
      handleDismissWorldFastTravelReport();
      return;
    }

    dismissWorldMapOverlayToast();
    closeWorldMapOverlay();
  };

  const handleSelectWorldMapPoi = (poi: WorldMapPoi) => {
    setEventLogs((prev) => {
      const message = createSystemMessage(
        `${poi.label} selected on the continent map. Fast travel and region actions will connect here later.`
      );

      if (prev[prev.length - 1] === message) {
        return prev;
      }

      return [...prev, message];
    });
  };

  const handleConfirmWorldMapFastTravel = (
    poi: WorldMapPoi,
    cost: WorldMapTravelCost,
    activity: WorldFastTravelActivity
  ) => {
    const originPoiId = currentWorldMapPoi?.id;

    if (!player || !originPoiId || originPoiId === poi.id) {
      return;
    }

    if (currentMapData.tier !== "primary") {
      showWorldMapOverlayToast({
        tone: "warning",
        title: "Fast travel blocked",
        message:
          "You can't fast travel from here. Go to a city or another relevant point of interest.",
      });
      setEventLogs((prev) => [
        ...prev,
        createSystemMessage(
          "You can't fast travel from here. Go to a city or another relevant point of interest."
        ),
      ]);
      return;
    }

    const availableFood = countInventoryItemsByKeys(
      player.inventory,
      fastTravelFoodItemKeys
    );

    if (availableFood < cost.foodCost) {
      showWorldMapOverlayToast({
        tone: "error",
        title: "Fast travel blocked",
        message: "Not enough food for fast travel",
      });
      setEventLogs((prev) => [
        ...prev,
        createSystemMessage(
          `You need ${cost.foodCost} food to travel to ${poi.label}, but only have ${availableFood}.`
        ),
      ]);
      return;
    }

    const foodConsumption = consumeInventoryItemsByPriority(
      player,
      fastTravelFoodItemKeys,
      cost.foodCost
    );

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
      createSystemMessage(
        `Fast travel to ${poi.label} begins. Travel cost: ${cost.foodCost} food, ${cost.durationMinutes} minute(s). Planned activity: ${activity.label}.`
      ),
    ]);
  };

  const handleCloseHideout = () => {
    closeHideoutOverlay();
  };

  const handleOpenBestiary = () => {
    openBestiaryOverlay();
    setEventLogs((prev) => [
      ...prev,
      createPanelOpenedMessage(
        "Bestiary",
        "You review the creatures documented so far."
      ),
    ]);
  };

  const handleCloseBestiary = () => {
    closeBestiaryOverlay();
  };

  const handleOpenSkillTree = () => {
    openSkillTreeOverlay();
    setEventLogs((prev) => [
      ...prev,
      createPanelOpenedMessage(
        "Skill Tree",
        "You open the full progression window."
      ),
    ]);
  };

  const handleCloseSkillTree = () => {
    closeSkillTreeOverlay();
  };

  const handleOpenQuestLog = () => {
    openQuestLogOverlay();
    setEventLogs((prev) => [
      ...prev,
      createPanelOpenedMessage(
        "Quest Log",
        "You review the active mission categories and future contracts."
      ),
    ]);
  };

  const handleCloseQuestLog = () => {
    closeQuestLogOverlay();
  };

  const applyQuestRewards = (questKey: string) => {
    const questEntry = questLog.entries.find((entry) => entry.quest.key === questKey);

    if (!questEntry || !questEntry.canClaimRewards || !questEntry.quest.rewards?.length) {
      return false;
    }

    const rewards = questEntry.quest.rewards;
    const rewardMessages = collectRewardMessages(rewards);

    setPlayer((previousPlayer) =>
      applyRewardsToPlayerSnapshot(
        {
          ...previousPlayer,
        },
        rewards
      )
    );

    const didClaim = claimQuestRewardsByKey(questKey);

    if (!didClaim) {
      return false;
    }

    setEventLogs((prev) => [...prev, ...rewardMessages]);
    return true;
  };

  const handleQuestInteraction = (questKey: string) => {
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

  const handleHideoutUpgrade = (structureKey: HideoutStructureKey) => {
    const targetStructure = hideoutStructures.find(
      (entry) => entry.definition.key === structureKey
    );

    if (!player || !targetStructure || !targetStructure.eligibility.nextTier) {
      return;
    }

    if (!targetStructure.eligibility.canUpgrade) {
      setEventLogs((prev) => [
        ...prev,
        ...targetStructure.eligibility.reasons.map((reason) =>
          createHideoutReasonMessage(reason)
        ),
      ]);
      return;
    }

    const nextInventory = consumeHideoutUpgradeCosts(
      player.inventory,
      targetStructure.eligibility.nextTier.buildCosts
    );

    setPlayer((previousPlayer) =>
      replacePlayerInventory(previousPlayer, nextInventory)
    );

    upgradeStructure(structureKey);

    setEventLogs((prev) => [
      ...prev,
      createHideoutUpgradeMessage(
        targetStructure.definition.name,
        targetStructure.eligibility.nextTier?.level
      ),
    ]);
  };

  const handleDepositToHideoutStorage = (itemKey: string) => {
    if (!player) return;

    const { didTransfer, nextInventory } = depositItem(itemKey, player.inventory);

    if (!didTransfer) {
      return;
    }

    setPlayer((previousPlayer) =>
      replacePlayerInventory(previousPlayer, nextInventory)
    );

    const itemLabel = getItemDefinition(itemKey)?.name ?? itemKey;

    notifyInfo(itemKey === "gold" ? "Gold stored" : `${itemLabel} stored`, {
      title: "Hideout chest",
    });

    setEventLogs((prev) => [
      ...prev,
      createHideoutStorageMessage(
        itemKey === "gold" ? "Gold" : itemLabel,
        "stored"
      ),
    ]);
  };

  const handleWithdrawFromHideoutStorage = (itemKey: string) => {
    if (!player) return;

    const { didTransfer, nextInventory } = withdrawItem(itemKey, player.inventory);

    if (!didTransfer) {
      return;
    }

    setPlayer((previousPlayer) =>
      replacePlayerInventory(previousPlayer, nextInventory)
    );

    const itemLabel = getItemDefinition(itemKey)?.name ?? itemKey;

    notifyInfo(
      itemKey === "gold" ? "Gold returned to inventory" : `${itemLabel} returned`,
      {
        title: "Hideout chest",
      }
    );

    setEventLogs((prev) => [
      ...prev,
      createHideoutStorageMessage(
        itemKey === "gold" ? "Gold" : itemLabel,
        "returned"
      ),
    ]);
  };

  const handleSellResources = (action?: ContextAction) => {
    if (!player) return;

    const sellableItems =
      action?.sellableItemKeys ?? ["stone", "wood", "herb", "fish", "rope", "paper"];

    const saleResult = removeInventoryItemsByPredicate(
      player,
      (itemKey) => sellableItems.includes(itemKey)
    );
    const soldItems = saleResult.removedItems;

    if (soldItems.length === 0) {
      setEventLogs((prev) => [
        ...prev,
        createNoSellableResourcesMessage(),
      ]);
      return;
    }

    const goldEarned = soldItems.length * (action?.goldPerItem ?? 2);

    setPlayer(
      applyRewardsToPlayerSnapshot(saleResult.nextSnapshot, [
        {
          type: "gold",
          amount: goldEarned,
        },
      ])
    );

    notifySuccess(`${goldEarned} Gold received`, {
      title: "Resources sold",
    });

    setEventLogs((prev) => [
      ...prev,
      createSellResourcesMessage(soldItems.length, goldEarned),
    ]);
  };

  const handleNpcBuyItem = (offer: NpcShopOffer) => {
    if (!player) return;

    const availableGold = countInventoryItem(player.inventory, "gold");

    if (availableGold < offer.priceGold) {
      notifyError("Insufficient gold", {
        title: "Purchase failed",
      });
      return;
    }

    setPlayer((previousPlayer) => {
      const goldConsumption = consumeInventoryItemAmount(
        previousPlayer,
        "gold",
        offer.priceGold
      );

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

  const handleNpcSellItems = (items: Array<{ itemKey: string; count: number }>) => {
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

      const consumption = consumeInventoryItemAmount(
        nextSnapshot,
        entry.itemKey,
        entry.count
      );

      if (!consumption.didConsume) {
        return false;
      }

      nextSnapshot = consumption.nextSnapshot;
    }

    const goldEarned = totalItemCount * goldPerItem;

    setPlayer(
      applyRewardsToPlayerSnapshot(nextSnapshot, [
        {
          type: "gold",
          amount: goldEarned,
        },
      ])
    );

    notifySuccess(`${goldEarned} Gold received`, {
      title: "Trade completed",
    });

    setEventLogs((prev) => [
      ...prev,
      createSellResourcesMessage(totalItemCount, goldEarned),
    ]);

    return true;
  };

  const handleNpcOptionSelect = (optionId: string) => {
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
          logQuestUpdates(
            applyQuestEvents(
              mergeQuestProgressEvents(
                [{ type: "rumor", rumorKey: "jane-sewer-rumor" }],
                resolution
                  ? createQuestEventsFromDiscoveryResolution(resolution)
                  : []
              )
            )
          );
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

  const handleAction = (action: ContextAction) => {
    if (!player) return;

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
      logQuestUpdates(
        applyQuestEvents(
          mergeQuestProgressEvents(
            [{ type: "rumor", rumorKey: action.rumorKey }],
            resolution
              ? createQuestEventsFromDiscoveryResolution(resolution)
              : []
          )
        )
      );
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

      setPlayer((previousPlayer) =>
        applyRewardsToPlayerSnapshot(previousPlayer, [
          {
            type: "stamina",
            amount: restored,
          },
        ])
      );

      setEventLogs((prev) => [
        ...prev,
        createStaminaRecoveredMessage(restored),
      ]);
      return;
    }

    if (action.rewardItem) {
      const rewardItem = action.rewardItem;
      const cost = resolveConditionAdjustedStaminaCost(
        player,
        action.staminaCost ?? 0
      );

      if (!canSpendPlayerStamina(player, cost)) {
        setEventLogs((prev) => [
          ...prev,
          createInsufficientStaminaMessage(action.label),
        ]);
        return;
      }

      const amount = action.amount ?? 1;
      setPlayer((previousPlayer) =>
        applyRewardsToPlayerSnapshot(
          applyConditionActionWear(spendPlayerStamina(previousPlayer, cost)),
          [
            {
              type: "item",
              itemKey: rewardItem,
              amount,
            },
          ]
        )
      );

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

      logQuestUpdates(
        applyQuestEvents([
          {
            type: "action",
            actionId: action.id,
          },
          {
            type: "item",
            itemKey: rewardItem,
            amount,
          },
        ])
      );

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

  if (!player) return null;

  const counts = new Map<string, number>();

  for (const item of player.inventory) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  const groupedInventory = resolveInventoryItemViews(
    Array.from(counts.entries()).map(([itemKey, count]) => ({
      itemKey,
      count,
    }))
  );
  const hideoutStorageDisplayEntries = storageEntries.map(({ itemKey, count }) =>
    resolveInventoryItemView(itemKey, count)
  );
  const sellableInventoryEntries: InventoryPanelItem[] = groupedInventory.filter((item) =>
    (activeNpcProfile.sellableItemKeys ?? []).includes(item.itemKey)
  );

  const currentWeight = groupedInventory.reduce(
    (total, item) => total + item.weight * item.count,
    0
  );

  const xpText = xpProgress
    ? `XP ${xpProgress.xpIntoLevel} of ${xpProgress.xpToNextLevel}`
    : "XP 0 of 0";
  const xpProgressPercent = xpProgress
    ? xpProgress.xpToNextLevel > 0
      ? Math.max(
          0,
          Math.min(100, (xpProgress.xpIntoLevel / xpProgress.xpToNextLevel) * 100)
        )
      : 0
    : 0;

  const sideNavItems = [
    {
      id: "world-map",
      label: "World Map",
      icon: sideNavIcons.worldMap,
      onClick: handleOpenWorldMap,
      isActive: worldMapDialogOpen,
      tooltipDescription:
        "Open the atlas view of Belegard and the surrounding frontier.",
    },
    {
      id: "quests",
      label: "Quest Log",
      icon: sideNavIcons.quests,
      onClick: handleOpenQuestLog,
      isActive: questLogDialogOpen,
      tooltipDescription:
        "Review daily missions, lore questlines, and hunt contracts.",
    },
    {
      id: "bestiary",
      label: "Bestiary",
      icon: sideNavIcons.bestiary,
      onClick: handleOpenBestiary,
      isActive: bestiaryDialogOpen,
      tooltipDescription:
        "Review known creatures and unlock deeper knowledge through repeated kills.",
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
      tooltipDescription:
        "Open the full talent and specialization window.",
    },
  ];
  const disconnectNavItem = {
    id: "disconnect",
    label: "Disconnect",
    icon: sideNavIcons.disconnect,
    onClick: () => {
      const shouldDisconnect = window.confirm(
        "Disconnect and return to the login screen?"
      );

      if (!shouldDisconnect) {
        return;
      }

      const disconnectWorldBossResult =
        worldBossSession.abandonWorldBossSession("disconnect");

      if (disconnectWorldBossResult.didAbandon) {
        setEventLogs((previousLogs) => [
          ...previousLogs,
          ...disconnectWorldBossResult.messages,
        ]);
      }

      onDisconnect();
    },
    tooltipDescription: "Leave the current session and return to the login screen.",
  };

  return (
    <main className="game-shell">
      <section className="game-grid">
        <SideNavRail items={sideNavItems} footerItem={disconnectNavItem} />

        <section className="world-panel">
          <TopPanel
            locationName={currentMapData.name}
            locationSubtitle=""
            worldStatus={[]}
            rightContent={
              <RegionPlayersIndicator
                key={currentMap}
                currentMapId={currentMap}
                currentMapName={currentMapData.name}
                currentPlayerName={player.name}
                onSendMessage={(_, playerName) => {
                  setEventLogs((previousLogs) => [
                    ...previousLogs,
                    createDirectMessagePlaceholder(playerName),
                  ]);
                }}
                onInviteToHunt={(_, playerName) => {
                  setEventLogs((previousLogs) => [
                    ...previousLogs,
                    createHuntInvitePlaceholder(playerName),
                  ]);
                }}
              />
            }
            stats={[
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
            ]}
          />

          <WorldMap
            currentLocation={currentLocation}
            contextState={contextState}
            mapData={currentMapData}
            onTravel={handleTravelAndOpenContext}
            onMinimizeContext={() => setContextState("minimized")}
            onExpandContext={() => setContextState("expanded")}
            onAction={handleAction}
            onGlobalAction={handleGlobalMapAction}
            onStopGlobalAction={handleStopGlobalMapAction}
            activeGlobalActionLabel={activeLoopActionLabel}
            globalActionStatus={continuousCombatLoopState.status}
            globalActionEncountersCompleted={
              continuousCombatLoopState.completedEncounters
            }
            worldBossNotice={worldBossMapNotice}
            worldBossAction={worldBossMapAction}
            onWorldBossAction={handleWorldBossMapAction}
            npcDialogOpen={npcDialogOpen}
            npcName={activeNpcProfile.name}
            npcRole={activeNpcProfile.role}
            npcDialogueLines={npcDialogueLines}
            npcDialogueOptions={npcDialogueOptions}
            npcLoreNotes={npcLoreNotes}
            onCloseNpcDialog={handleCloseNpcDialog}
            onNpcOptionSelect={handleNpcOptionSelect}
            onNpcBuyItem={handleNpcBuyItem}
            onNpcSellItems={handleNpcSellItems}
            npcBuyOffers={activeNpcProfile.buyOffers}
            npcSellInventoryEntries={sellableInventoryEntries}
            npcSellPlaceholderMessage={activeNpcProfile.sellPlaceholderMessage}
            combatDialogOpen={Boolean(activeEncounter && activeEncounterData && combatState)}
            combatEnemyName={activeEncounterData?.enemyName ?? ""}
            combatEnemyTitle={activeEncounterData?.enemyTitle ?? ""}
            combatEnemyHp={
              combatState && activeEncounterData
                ? combatState.combatants[
                    combatState.enemyCombatantIds[0] ?? ""
                  ]?.currentHp ?? 0
                : 0
            }
            combatEnemyMaxHp={activeEncounterData?.enemyMaxHp ?? 0}
            combatLog={combatState?.combatLog.map((entry) => entry.message) ?? []}
            combatState={combatState}
            playerClassKey={selectedCharacter.classKey}
            combatActionAvailabilities={combatActionAvailabilities}
            combatResolved={combatState?.status === "resolved"}
            onCombatAction={dispatchCombatAction}
            onCombatRetreat={handleRetreatEncounter}
            onCloseCombatDialog={handleCloseEncounter}
            discoverablePois={discoverablePoisData}
            revealedPois={player.revealedPois}
            discoveredPois={player.discoveredPois}
            onDiscoverPoi={(poiKey) => {
              const resolution = discoverPoi(poiKey);
              logQuestUpdates(
                applyQuestEvents(
                  mergeQuestProgressEvents(
                    [{ type: "poi", poiKey }],
                    resolution
                      ? createQuestEventsFromDiscoveryResolution(resolution)
                      : []
                  )
                )
              );
            }}
            npcNarrativeHint={activeNpcProfile.narrativeHint}
            showNpcNarrativeStatus={true}
            npcNarrativeStatusText={
              activeNpcProfileKey === "jane" && sewerRumorLearned
                ? "Jane may still respond to what you uncover in the world."
                : activeNpcProfile.narrativeStatusText
            }
            overlayContent={
              activeFishingConfig ? (
                <FishingDialog
                  isOpen={Boolean(activeFishingConfig)}
                  config={activeFishingConfig}
                  onClose={handleCloseFishing}
                  onSuccess={handleFishingSuccess}
                  onFailure={handleFishingFailure}
                />
              ) : activeMiningConfig ? (
                <MiningDialog
                  isOpen={Boolean(activeMiningConfig)}
                  config={activeMiningConfig}
                  onClose={handleCloseMining}
                  onSuccess={handleMiningSuccess}
                  onFailure={handleMiningFailure}
                />
              ) : skillTreeDialogOpen ? (
                <SkillTreeDialog
                  isOpen={skillTreeDialogOpen}
                  characterLevel={computedLevel}
                  skills={skills}
                  specializationProgress={player.specializationProgress}
                  talentTrees={talentTrees}
                  talentPointsEarned={talentPointsEarned}
                  talentPointsSpent={talentPointsSpent}
                  talentPointsAvailable={talentPointsAvailable}
                  onClose={handleCloseSkillTree}
                  onUnlockTalent={(nodeKey: string) =>
                    spendTalentPoint(nodeKey, computedLevel)
                  }
                  onSelectSpecialization={(skillKey, nodeKey) => {
                    const skill = skills.find((entry) => entry.key === skillKey);

                    if (!skill) {
                      return;
                    }

                    selectSkillSpecialization(skill, nodeKey);
                  }}
                />
              ) : questLogDialogOpen ? (
                <QuestLogDialog
                  isOpen={questLogDialogOpen}
                  entries={questLog.entries}
                  onClose={handleCloseQuestLog}
                />
              ) : bestiaryDialogOpen ? (
                <BestiaryDialog
                  isOpen={bestiaryDialogOpen}
                  entries={bestiaryEntries}
                  onClose={handleCloseBestiary}
                />
              ) : hideoutDialogOpen ? (
                <HideoutDialog
                  isOpen={hideoutDialogOpen}
                  hideoutName={hideoutState.name}
                  structures={hideoutStructures}
                  inventoryEntries={groupedInventory}
                  storageEntries={hideoutStorageDisplayEntries}
                  onClose={handleCloseHideout}
                  onUpgrade={handleHideoutUpgrade}
                  onDepositItem={handleDepositToHideoutStorage}
                  onWithdrawItem={handleWithdrawFromHideoutStorage}
                />
              ) : worldMapDialogOpen ? (
                <WorldMapDialog
                  isOpen={worldMapDialogOpen}
                  currentMap={currentMap}
                  currentWorldMapPoiId={currentWorldMapPoiId}
                  playerAvatarSrc={selectedCharacterAvatar.imageSrc}
                  playerAvatarAlt={selectedCharacterAvatar.altLabel}
                  onClose={handleCloseWorldMap}
                  onPoiSelect={handleSelectWorldMapPoi}
                  onFastTravelConfirm={handleConfirmWorldMapFastTravel}
                  activeFastTravel={activeWorldFastTravel}
                  completedFastTravelReport={completedWorldFastTravelReport}
                  onDismissFastTravelReport={handleDismissWorldFastTravelReport}
                  overlayToast={worldMapOverlayToast}
                  onDismissOverlayToast={dismissWorldMapOverlayToast}
                />
              ) : worldBossLobbyOverlay ? (
                worldBossLobbyOverlay
              ) : worldBossActionOverlay ? (
                worldBossActionOverlay
              ) : worldBossResultOverlay ? (
                worldBossResultOverlay
              ) : null
            }
          />

          <section className="bottom-left-panel">
            <EventLogPanel logs={eventLogs} />

            <ChatPanel
              messages={chatMessages}
              inputValue={chatInput}
              onInputChange={setChatInput}
              onSend={() => {
                const nextMessage = chatInput.trim().slice(0, 200);
                if (!nextMessage) return;
                setChatMessages((prev) => [
                  ...prev,
                  createChatMessage(`You: ${nextMessage}`),
                ]);
                setChatInput("");
              }}
            />
          </section>
        </section>
        <aside className="right-sidebar">
          <CharacterPanel
            level={computedLevel}
            xpText={xpText}
            xpProgressPercent={xpProgressPercent}
            name={player.name}
            characterClass={selectedClass.name}
            avatarSrc={selectedCharacterAvatar.imageSrc}
            avatarAlt={selectedCharacterAvatar.altLabel}
            conditions={resolvedCharacterConditions}
            buffs={buffsData}
          />

          <EquipmentPanel equipmentRows={equipmentRows} />

          <InventoryPanel
            items={groupedInventory}
            currentWeight={Number(currentWeight.toFixed(1))}
            maxWeight={computedCarryWeight}
          />

          <SkillsPanel
            skills={skills}
            specializationProgress={player.specializationProgress}
          />
        </aside>
      </section>
    </main>
  );
}


