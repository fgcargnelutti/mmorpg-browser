import { useState } from "react";

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

import {
  WorldMap,
  locations,
  discoverablePoisData,
  mapsData,
  npcProfilesData,
  type ContextAction,
  type LocationKey,
  type MapId,
  type NpcProfileKey,
} from "../features/world";
import {
  FishingDialog,
  fishingConfigs,
  type FishingSpotKey,
} from "../features/fishing";
import {
  MiningDialog,
  miningConfigs,
  type MiningSpotKey,
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
import {
  encountersData,
  type EncounterKey,
} from "../data/encountersData";
import { inventoryCatalog } from "../data/inventoryCatalog";
import { equipmentRows } from "../data/equipmentData";
import { conditionsData } from "../data/conditionsData";
import { buffsData } from "../data/buffsData";
import { collectRewardMessages } from "../features/systems/application/systems/rewardResolutionSystem";
import { useCharacterProgression } from "../features/progression";
import type { CharacterSummary } from "./CharacterSelectScreen";
import type { DialogueOption } from "../components/NpcDialog";
import type { ChatMessage } from "../components/ChatPanel";

type ActiveEncounter = {
  key: EncounterKey;
  enemyHp: number;
  combatLog: string[];
  isResolved: boolean;
  resolution: "victory" | "defeat" | null;
};

type GameScreenProps = {
  selectedCharacter: CharacterSummary;
};

type ActiveFishingSession = {
  action: ContextAction;
  configKey: FishingSpotKey;
};

type ActiveMiningSession = {
  action: ContextAction;
  configKey: MiningSpotKey;
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

export default function GameScreen({ selectedCharacter }: GameScreenProps) {
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

  const [contextState, setContextState] = useState<
    "hidden" | "expanded" | "minimized"
  >("hidden");

  const [npcDialogOpen, setNpcDialogOpen] = useState(false);
  const [activeNpcProfileKey, setActiveNpcProfileKey] =
    useState<NpcProfileKey>("jane");
  const [npcDialogueLines, setNpcDialogueLines] = useState<string[]>(
    npcProfilesData.jane.initialDialogueLines
  );

  const [triggeredEncounters, setTriggeredEncounters] = useState<EncounterKey[]>(
    []
  );

  const [activeEncounter, setActiveEncounter] = useState<ActiveEncounter | null>(
    null
  );
  const [activeFishingSession, setActiveFishingSession] =
    useState<ActiveFishingSession | null>(null);
  const [activeMiningSession, setActiveMiningSession] =
    useState<ActiveMiningSession | null>(null);
  const [bestiaryDialogOpen, setBestiaryDialogOpen] = useState(false);
  const [skillTreeDialogOpen, setSkillTreeDialogOpen] = useState(false);
  const [hideoutDialogOpen, setHideoutDialogOpen] = useState(false);
  const [questLogDialogOpen, setQuestLogDialogOpen] = useState(false);

  const [currentMap, setCurrentMap] = useState<MapId>("town");

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
    applyDamageToPlayer,
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

  const currentMapData = mapsData[currentMap];
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
    ? encountersData[activeEncounter.key]
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

  const handleMapTravel = (destinationMapId?: MapId) => {
    if (!destinationMapId) return;

    setCurrentMap(destinationMapId);
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setContextState("expanded");

    const destinationMap = mapsData[destinationMapId];

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
      `System: You travel to ${destinationMap.name}.`,
    ]);
  };

  const handleTravelAndOpenContext = (location: LocationKey) => {
    setNpcDialogOpen(false);
    setActiveEncounter(null);
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

    if (location === "sewer" && currentMap === "town") {
      handleMapTravel("sewer");
    }
  };

  const handleOpenNpcDialog = (profileKey: NpcProfileKey = "jane") => {
    const profile = npcProfilesData[profileKey];

    setContextState("hidden");
    setActiveNpcProfileKey(profileKey);
    setNpcDialogueLines(profile.initialDialogueLines);
    setNpcDialogOpen(true);

    setEventLogs((prev) => [
      ...prev,
      `System: You started a conversation with ${profile.name}.`,
    ]);

    logQuestUpdates(applyQuestEvents([{ type: "npc", npcKey: profileKey }]));
  };

  const handleCloseNpcDialog = () => {
    setNpcDialogOpen(false);
    setContextState("expanded");
  };

  const openEncounter = (encounterKey: EncounterKey) => {
    const encounter = encountersData[encounterKey];

    setTriggeredEncounters((prev) =>
      prev.includes(encounterKey) ? prev : [...prev, encounterKey]
    );

    setNpcDialogOpen(false);
    setContextState("hidden");

    setActiveEncounter({
      key: encounterKey,
      enemyHp: encounter.enemyMaxHp,
      combatLog: [encounter.introText],
      isResolved: false,
      resolution: null,
    });

    setEventLogs((prev) => [
      ...prev,
      `System: Encounter started: ${encounter.enemyName}.`,
    ]);
  };

  const handleAttackEncounter = () => {
    if (!activeEncounter || !player) return;
    if (activeEncounter.isResolved || activeEncounter.resolution !== null) return;

    const encounter = encountersData[activeEncounter.key];
    recordSkillTraining({
      type: "combat.attack",
      combatStyle: "melee",
      encounterKey: activeEncounter.key,
    });

    const nextEnemyHp = Math.max(
      0,
      activeEncounter.enemyHp - encounter.playerAttackDamage
    );

    if (nextEnemyHp <= 0) {
      setActiveEncounter({
        ...activeEncounter,
        enemyHp: 0,
        isResolved: true,
        resolution: "victory",
        combatLog: [
          ...activeEncounter.combatLog,
          `You strike the ${encounter.enemyName} for ${encounter.playerAttackDamage} damage.`,
          encounter.victoryText,
        ],
      });

      gainCharacterXp(encounter.rewardXp, `Defeated ${encounter.enemyName}`);
      registerBestiaryKill(encounter.creatureKey, encounter.enemyName);
      logQuestUpdates(
        applyQuestEvent({
          type: "encounter",
          encounterKey: activeEncounter.key,
        })
      );
      recordSkillTraining({
        type: "combat.victory",
        combatStyle: "melee",
        encounterKey: activeEncounter.key,
      });

      setEventLogs((prev) => [
        ...prev,
        `System: You defeated ${encounter.enemyName}.`,
      ]);

      return;
    }

    const nextPlayerHp = Math.max(
      0,
      player.currentHp - encounter.enemyAttackDamage
    );

    applyDamageToPlayer(encounter.enemyAttackDamage, encounter.enemyName);

    if (nextPlayerHp <= 0) {
      setActiveEncounter({
        ...activeEncounter,
        enemyHp: nextEnemyHp,
        isResolved: true,
        resolution: "defeat",
        combatLog: [
          ...activeEncounter.combatLog,
          `You strike the ${encounter.enemyName} for ${encounter.playerAttackDamage} damage.`,
          `${encounter.enemyName} retaliates for ${encounter.enemyAttackDamage} damage.`,
          `You collapse under the ${encounter.enemyName}'s attack.`,
        ],
      });

      setEventLogs((prev) => [
        ...prev,
        `System: You were defeated by ${encounter.enemyName}.`,
      ]);

      return;
    }

    setActiveEncounter({
      ...activeEncounter,
      enemyHp: nextEnemyHp,
      combatLog: [
        ...activeEncounter.combatLog,
        `You strike the ${encounter.enemyName} for ${encounter.playerAttackDamage} damage.`,
        `${encounter.enemyName} retaliates for ${encounter.enemyAttackDamage} damage.`,
      ],
    });
  };

  const handleRetreatEncounter = () => {
    if (!activeEncounter) return;

    const encounter = encountersData[activeEncounter.key];

    setEventLogs((prev) => [...prev, `System: ${encounter.retreatText}`]);
    setActiveEncounter(null);
    setContextState("expanded");
  };

  const handleCloseEncounter = () => {
    setActiveEncounter(null);
    setContextState("expanded");
  };

  const handleOpenFishing = (action: ContextAction) => {
    if (!player || !action.fishingSpotKey) return;

    const attemptCost = action.staminaCost ?? 0;

    if (player.stamina < attemptCost) {
      setEventLogs((prev) => [
        ...prev,
        `Not enough stamina to ${action.label.toLowerCase()}.`,
      ]);
      return;
    }

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      stamina: Math.max(0, previousPlayer.stamina - attemptCost),
    }));

    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setContextState("hidden");
    setActiveFishingSession({
      action,
      configKey: action.fishingSpotKey,
    });

    setEventLogs((prev) => [...prev, `You start fishing at ${currentMapData.name}.`]);
  };

  const handleCloseFishing = () => {
    setActiveFishingSession(null);
    setContextState("expanded");
  };

  const handleFishingSuccess = () => {
    if (!player || !activeFishingSession || !activeFishingConfig) return;

    setPlayer((previousPlayer) => {
      const nextInventory = [...previousPlayer.inventory];

      for (let i = 0; i < activeFishingConfig.rewardAmount; i += 1) {
        nextInventory.push(activeFishingConfig.rewardItemKey);
      }

      return {
        ...previousPlayer,
        inventory: nextInventory,
      };
    });

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
      `You obtained ${activeFishingConfig.rewardAmount}x ${activeFishingConfig.rewardItemKey}.`,
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

    const attemptCost = action.staminaCost ?? 0;

    if (player.stamina < attemptCost) {
      setEventLogs((prev) => [
        ...prev,
        `Not enough stamina to ${action.label.toLowerCase()}.`,
      ]);
      return;
    }

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      stamina: Math.max(0, previousPlayer.stamina - attemptCost),
    }));

    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setContextState("hidden");
    setActiveMiningSession({
      action,
      configKey: action.miningSpotKey,
    });

    setEventLogs((prev) => [
      ...prev,
      `You begin mining at ${currentMapData.name}.`,
    ]);
  };

  const handleCloseMining = () => {
    setActiveMiningSession(null);
    setContextState("expanded");
  };

  const handleMiningSuccess = () => {
    if (!player || !activeMiningSession || !activeMiningConfig) return;

    setPlayer((previousPlayer) => {
      const nextInventory = [...previousPlayer.inventory];

      for (let i = 0; i < activeMiningConfig.rewardAmount; i += 1) {
        nextInventory.push(activeMiningConfig.rewardItemKey);
      }

      return {
        ...previousPlayer,
        inventory: nextInventory,
      };
    });

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
      `You obtained ${activeMiningConfig.rewardAmount}x ${activeMiningConfig.rewardItemKey}.`,
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
    setBestiaryDialogOpen(false);
    setSkillTreeDialogOpen(false);
    setQuestLogDialogOpen(false);
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setActiveFishingSession(null);
    setActiveMiningSession(null);
    setContextState("hidden");
    setHideoutDialogOpen(true);
    setEventLogs((prev) => [...prev, "You step into your hideout and review the camp."]);
  };

  const handleCloseHideout = () => {
    setHideoutDialogOpen(false);
    setContextState("expanded");
  };

  const handleOpenBestiary = () => {
    setHideoutDialogOpen(false);
    setSkillTreeDialogOpen(false);
    setQuestLogDialogOpen(false);
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setActiveFishingSession(null);
    setActiveMiningSession(null);
    setContextState("hidden");
    setBestiaryDialogOpen(true);
    setEventLogs((prev) => [...prev, "Bestiary: You review the creatures documented so far."]);
  };

  const handleCloseBestiary = () => {
    setBestiaryDialogOpen(false);
    setContextState("expanded");
  };

  const handleOpenSkillTree = () => {
    setHideoutDialogOpen(false);
    setBestiaryDialogOpen(false);
    setQuestLogDialogOpen(false);
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setActiveFishingSession(null);
    setActiveMiningSession(null);
    setContextState("hidden");
    setSkillTreeDialogOpen(true);
    setEventLogs((prev) => [
      ...prev,
      "Skill Tree: You open the full progression window.",
    ]);
  };

  const handleCloseSkillTree = () => {
    setSkillTreeDialogOpen(false);
    setContextState("expanded");
  };

  const handleOpenQuestLog = () => {
    setHideoutDialogOpen(false);
    setBestiaryDialogOpen(false);
    setSkillTreeDialogOpen(false);
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setActiveFishingSession(null);
    setActiveMiningSession(null);
    setContextState("hidden");
    setQuestLogDialogOpen(true);
    setEventLogs((prev) => [
      ...prev,
      "Quest Log: You review the active mission categories and future contracts.",
    ]);
  };

  const handleCloseQuestLog = () => {
    setQuestLogDialogOpen(false);
    setContextState("expanded");
  };

  const logQuestUpdates = (
    updates: Array<{
      questKey: string;
      previousState: string;
      nextState: string;
    }>
  ) => {
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
  };

  const applyQuestRewards = (questKey: string) => {
    const questEntry = questLog.entries.find((entry) => entry.quest.key === questKey);

    if (!questEntry || !questEntry.canClaimRewards || !questEntry.quest.rewards?.length) {
      return false;
    }

    const rewards = questEntry.quest.rewards;
    const rewardMessages = collectRewardMessages(rewards);

    setPlayer((previousPlayer) => {
      const nextInventory = [...previousPlayer.inventory];
      let nextTotalXp = previousPlayer.totalXp;
      let nextStamina = previousPlayer.stamina;

      for (const reward of rewards) {
        if (reward.type === "item") {
          for (let count = 0; count < reward.amount; count += 1) {
            nextInventory.push(reward.itemKey);
          }
        }

        if (reward.type === "gold") {
          for (let count = 0; count < reward.amount; count += 1) {
            nextInventory.push("gold");
          }
        }

        if (reward.type === "xp") {
          nextTotalXp += reward.amount;
        }

        if (reward.type === "stamina") {
          nextStamina = Math.min(previousPlayer.maxStamina, nextStamina + reward.amount);
        }
      }

      return {
        ...previousPlayer,
        inventory: nextInventory,
        totalXp: nextTotalXp,
        stamina: nextStamina,
      };
    });

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
        ...targetStructure.eligibility.reasons.map(
          (reason) => `Hideout: ${reason}`
        ),
      ]);
      return;
    }

    const nextInventory = consumeHideoutUpgradeCosts(
      player.inventory,
      targetStructure.eligibility.nextTier.buildCosts
    );

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      inventory: nextInventory,
    }));

    upgradeStructure(structureKey);

    setEventLogs((prev) => [
      ...prev,
      `Hideout: ${targetStructure.definition.name} upgraded to level ${targetStructure.eligibility.nextTier?.level}.`,
    ]);
  };

  const handleDepositToHideoutStorage = (itemKey: string) => {
    if (!player) return;

    const { didTransfer, nextInventory } = depositItem(itemKey, player.inventory);

    if (!didTransfer) {
      return;
    }

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      inventory: nextInventory,
    }));

    setEventLogs((prev) => [
      ...prev,
      `Hideout: ${itemKey === "gold" ? "Gold" : itemKey} stored in the chest.`,
    ]);
  };

  const handleWithdrawFromHideoutStorage = (itemKey: string) => {
    if (!player) return;

    const { didTransfer, nextInventory } = withdrawItem(itemKey, player.inventory);

    if (!didTransfer) {
      return;
    }

    setPlayer((previousPlayer) => ({
      ...previousPlayer,
      inventory: nextInventory,
    }));

    setEventLogs((prev) => [
      ...prev,
      `Hideout: ${itemKey === "gold" ? "Gold" : itemKey} returned to your inventory.`,
    ]);
  };

  const handleSellResources = (action?: ContextAction) => {
    if (!player) return;

    const sellableItems =
      action?.sellableItemKeys ?? ["stone", "wood", "herb", "fish", "rope", "paper"];

    const soldItems = player.inventory.filter((item) =>
      sellableItems.includes(item)
    );

    const keptItems = player.inventory.filter(
      (item) => !sellableItems.includes(item)
    );

    if (soldItems.length === 0) {
      setEventLogs((prev) => [
        ...prev,
        "System: You have no sellable resources.",
      ]);
      return;
    }

    const goldEarned = soldItems.length * (action?.goldPerItem ?? 2);
    const nextInventory = [...keptItems];

    for (let i = 0; i < goldEarned; i += 1) {
      nextInventory.push("gold");
    }

    setPlayer({
      ...player,
      inventory: nextInventory,
    });

    setEventLogs((prev) => [
      ...prev,
      `System: You sold ${soldItems.length} resources and received ${goldEarned} gold.`,
    ]);
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
        `System: ${action.targetMapName ?? "This destination"} is not available yet.`,
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
        `System: ${action.targetMapName ?? "This destination"} is not available yet.`,
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

      setPlayer({
        ...player,
        stamina: Math.min(player.maxStamina, player.stamina + restored),
      });

      setEventLogs((prev) => [
        ...prev,
        `System: You recovered ${restored} stamina.`,
      ]);
      return;
    }

    if (action.rewardItem) {
      const cost = action.staminaCost ?? 0;

      if (player.stamina < cost) {
        setEventLogs((prev) => [
          ...prev,
          `System: Not enough stamina to ${action.label.toLowerCase()}.`,
        ]);
        return;
      }

      const amount = action.amount ?? 1;
      const nextInventory = [...player.inventory];

      for (let i = 0; i < amount; i += 1) {
        nextInventory.push(action.rewardItem);
      }

      setPlayer({
        ...player,
        stamina: Math.max(0, player.stamina - cost),
        inventory: nextInventory,
      });

      setEventLogs((prev) => [
        ...prev,
        `System: Action performed: ${action.label}.`,
        `System: You obtained ${amount}x ${action.rewardItem}.`,
      ]);

      logQuestUpdates(
        applyQuestEvents([
          {
            type: "action",
            actionId: action.id,
          },
          {
            type: "item",
            itemKey: action.rewardItem,
            amount,
          },
        ])
      );

      recordSkillTraining({
        type: "world.action.completed",
        action: {
          id: action.id,
          label: action.label,
          rewardItem: action.rewardItem,
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

  const groupedInventory = Array.from(counts.entries()).map(
    ([itemKey, count]) => resolveInventoryDisplayItem(itemKey, count)
  );
  const hideoutStorageDisplayEntries = storageEntries.map(({ itemKey, count }) =>
    resolveInventoryDisplayItem(itemKey, count)
  );

  const currentWeight = groupedInventory.reduce(
    (total, item) => total + item.weight * item.count,
    0
  );

  const xpText = xpProgress
    ? `${xpProgress.xpIntoLevel}/${xpProgress.xpToNextLevel} XP`
    : "0/0 XP";

  const sideNavItems = [
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

  return (
    <main className="game-shell">
      <section className="game-grid">
        <SideNavRail items={sideNavItems} />

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
                    `System: Direct message to ${playerName} is still a placeholder.`,
                  ]);
                }}
                onInviteToHunt={(_, playerName) => {
                  setEventLogs((previousLogs) => [
                    ...previousLogs,
                    `System: Hunt invite sent to ${playerName} (placeholder).`,
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
                value: computedSp,
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
            locations={locations}
            mapData={currentMapData}
            onTravel={handleTravelAndOpenContext}
            onMapTravel={handleMapTravel}
            onMinimizeContext={() => setContextState("minimized")}
            onExpandContext={() => setContextState("expanded")}
            onAction={handleAction}
            npcDialogOpen={npcDialogOpen}
            npcName={activeNpcProfile.name}
            npcRole={activeNpcProfile.role}
            npcDialogueLines={npcDialogueLines}
            npcDialogueOptions={npcDialogueOptions}
            npcLoreNotes={npcLoreNotes}
            onCloseNpcDialog={handleCloseNpcDialog}
            onNpcOptionSelect={handleNpcOptionSelect}
            onNpcBuy={() =>
              setEventLogs((prev) => [
                ...prev,
                activeNpcProfile.buyPlaceholderMessage,
              ])
            }
            onNpcSell={() => {
              if (activeNpcProfileKey === "maria") {
                handleSellResources({
                  id: "maria-sell-natural-goods",
                  label: "Sell Natural Goods",
                  description: "Sell fruit and natural goods to Maria.",
                  effect: "sell_resources",
                  sellableItemKeys: ["fruit", "herb", "fish", "rabbit-meat"],
                  goldPerItem: 3,
                });
                return;
              }

              handleSellResources();
            }}
            combatDialogOpen={Boolean(activeEncounter && activeEncounterData)}
            combatEnemyName={activeEncounterData?.enemyName ?? ""}
            combatEnemyTitle={activeEncounterData?.enemyTitle ?? ""}
            combatEnemyHp={activeEncounter?.enemyHp ?? 0}
            combatEnemyMaxHp={activeEncounterData?.enemyMaxHp ?? 0}
            combatLog={activeEncounter?.combatLog ?? []}
            combatResolved={activeEncounter?.isResolved ?? false}
            onCombatAttack={handleAttackEncounter}
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
            name={player.name}
            characterClass={selectedClass.name}
            conditions={conditionsData}
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

