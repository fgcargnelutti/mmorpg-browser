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

import SkillsPanel from "../components/SkillsPanel";
import InventoryPanel from "../components/InventoryPanel";
import CharacterPanel from "../components/CharacterPanel";
import EquipmentPanel from "../components/EquipmentPanel";
import EventLogPanel from "../components/EventLogPanel";
import ChatPanel from "../components/ChatPanel";
import TopPanel from "../components/TopPanel";
import RegionPlayersIndicator from "../components/RegionPlayersIndicator";

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
  encountersData,
  type EncounterKey,
} from "../data/encountersData";
import { inventoryCatalog } from "../data/inventoryCatalog";
import { equipmentRows } from "../data/equipmentData";
import { conditionsData } from "../data/conditionsData";
import { buffsData } from "../data/buffsData";
import { useCharacterProgression } from "../features/progression";
import type { CharacterSummary } from "./CharacterSelectScreen";
import type { DialogueOption } from "../components/NpcDialog";

type ActiveEncounter = {
  key: EncounterKey;
  enemyHp: number;
  combatLog: string[];
  isResolved: boolean;
};

type GameScreenProps = {
  selectedCharacter: CharacterSummary;
};

export default function GameScreen({ selectedCharacter }: GameScreenProps) {
  const [eventLogs, setEventLogs] = useState<string[]>([
    "System: The wasteland is silent today.",
    "System: You feel the cold wind across the ruins.",
  ]);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "NPC Mara: Keep your hood on. The wind cuts deep near the river.",
    "Ronan: Anyone heading to Blackwood?",
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
  } = useCharacterProgression({
    selectedCharacter,
    setEventLogs,
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

  const handleMapTravel = (destinationMapId?: MapId) => {
    if (!destinationMapId) return;

    setCurrentMap(destinationMapId);
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setContextState("expanded");

    const destinationMap = mapsData[destinationMapId];

    if (destinationMap.entryLocationKey) {
      handleTravel(destinationMap.entryLocationKey);
    }

    setEventLogs((prev) => [
      ...prev,
      `System: You travel to ${destinationMap.name}.`,
    ]);
  };

  const handleTravelAndOpenContext = (location: LocationKey) => {
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setContextState("expanded");

    handleTravel(location);

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
    });

    setEventLogs((prev) => [
      ...prev,
      `System: Encounter started: ${encounter.enemyName}.`,
    ]);
  };

  const handleAttackEncounter = () => {
    if (!activeEncounter || !player) return;

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
        combatLog: [
          ...activeEncounter.combatLog,
          `You strike the ${encounter.enemyName} for ${encounter.playerAttackDamage} damage.`,
          encounter.victoryText,
        ],
      });

      gainCharacterXp(encounter.rewardXp, `Defeated ${encounter.enemyName}`);
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
          learnRumor("jane-sewer-rumor");
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
      learnRumor(action.rumorKey);
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

  const groupedInventory = Array.from(counts.entries()).map(([name, count]) => {
    const catalogItem = inventoryCatalog[name] ?? {
      key: name,
      name,
      icon: "📦",
      weight: 1,
      description: "An unidentified item recovered from the wasteland.",
      stats: ["Unknown properties"],
    };

    return {
      key: catalogItem.key,
      name: catalogItem.name,
      icon: catalogItem.icon,
      count,
      weight: catalogItem.weight,
      description: catalogItem.description,
      stats: catalogItem.stats,
    };
  });

  const currentWeight = groupedInventory.reduce(
    (total, item) => total + item.weight * item.count,
    0
  );

  const xpText = xpProgress
    ? `${xpProgress.xpIntoLevel}/${xpProgress.xpToNextLevel} XP`
    : "0/0 XP";

  return (
    <main className="game-shell">
      <section className="game-grid">
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
            onDiscoverPoi={discoverPoi}
            npcNarrativeHint={activeNpcProfile.narrativeHint}
            showNpcNarrativeStatus={true}
            npcNarrativeStatusText={
              activeNpcProfileKey === "jane" && sewerRumorLearned
                ? "Jane may still respond to what you uncover in the world."
                : activeNpcProfile.narrativeStatusText
            }
          />

          <section className="bottom-left-panel">
            <EventLogPanel logs={eventLogs} />

            <ChatPanel
              messages={chatMessages}
              inputValue={chatInput}
              onInputChange={setChatInput}
              onSend={() => {
                if (!chatInput.trim()) return;
                setChatMessages((prev) => [...prev, `You: ${chatInput}`]);
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

          <SkillsPanel skills={skills} />
        </aside>
      </section>
    </main>
  );
}
