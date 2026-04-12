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
import WorldMap from "../components/WorldMap";
import InventoryPanel from "../components/InventoryPanel";
import CharacterPanel from "../components/CharacterPanel";
import EquipmentPanel from "../components/EquipmentPanel";
import EventLogPanel from "../components/EventLogPanel";
import ChatPanel from "../components/ChatPanel";
import TopPanel from "../components/TopPanel";

import {
  locations,
  type ContextAction,
  type LocationKey,
} from "../data/locations";
import { inventoryCatalog } from "../data/inventoryCatalog";
import { equipmentRows } from "../data/equipmentData";
import { skillsData } from "../data/skillsData";
import { conditionsData } from "../data/conditionsData";
import {
  encountersData,
  type EncounterKey,
} from "../data/encountersData";
import { useCharacterProgression } from "../hooks/useCharacterProgression";
import type { CharacterSummary } from "./CharacterSelectScreen";

type DialogueOption = {
  id: string;
  label: string;
};

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

  const [npcDialogueLines, setNpcDialogueLines] = useState<string[]>([
    "Jane watches the road in silence before finally speaking.",
    "Bring me useful scraps, and I can keep you supplied for another day.",
  ]);

  const [triggeredEncounters, setTriggeredEncounters] = useState<EncounterKey[]>(
    []
  );

  const [activeEncounter, setActiveEncounter] = useState<ActiveEncounter | null>(
    null
  );

  const npcDialogueOptions: DialogueOption[] = [
    { id: "who-are-you", label: "Who are you?" },
    { id: "what-do-you-sell", label: "What do you sell?" },
    { id: "any-rumors", label: "Any rumors?" },
  ];

  const npcLoreNotes = [
    "Jane has kept this trading post alive longer than most people expected.",
  ];

  const {
    player,
    setPlayer,
    selectedClass,
    currentLocation,
    computedLevel,
    computedHp,
    computedSp,
    computedCarryWeight,
    xpProgress,
    handleTravel,
    tryTriggerLoreDiscovery,
    gainCharacterXp,
  } = useCharacterProgression({
    selectedCharacter,
    setEventLogs,
  });

  const handleTravelAndOpenContext = (location: LocationKey) => {
    setNpcDialogOpen(false);
    setActiveEncounter(null);
    setContextState("expanded");
    handleTravel(location);
  };

  const handleOpenNpcDialog = (npcName?: string) => {
    setContextState("hidden");
    setNpcDialogOpen(true);

    setEventLogs((prev) => [
      ...prev,
      `System: You started a conversation with ${npcName ?? "the NPC"}.`,
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
    if (!activeEncounter) return;

    const encounter = encountersData[activeEncounter.key];
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

      gainCharacterXp(
        encounter.rewardXp,
        `Defeated ${encounter.enemyName}`
      );

      setEventLogs((prev) => [
        ...prev,
        `System: You defeated ${encounter.enemyName}.`,
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

  const handleSellResources = () => {
    if (!player) return;

    const sellableItems = ["stone", "wood", "herb", "fish", "rope", "paper"];

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

    const goldEarned = soldItems.length * 2;
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

  const handleAction = (action: ContextAction) => {
    if (!player) return;

    if (action.effect === "npc_dialog") {
      handleOpenNpcDialog(action.npcName);
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

    if (action.effect === "travel_placeholder") {
      setEventLogs((prev) => [
        ...prev,
        `System: ${action.targetMapName ?? "This destination"} is not available yet.`,
      ]);
      return;
    }

    if (action.effect === "sell_resources") {
      handleSellResources();
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

  const activeEncounterData = activeEncounter
    ? encountersData[activeEncounter.key]
    : null;

  return (
    <main className="game-shell">
      <section className="game-grid">
        <section className="world-panel">
          <TopPanel
            locationName={locations[currentLocation].name}
            locationSubtitle={locations[currentLocation].subtitle}
            worldStatus={[
              `Level ${computedLevel}`,
              xpProgress
                ? `${xpProgress.xpIntoLevel}/${xpProgress.xpToNextLevel} XP`
                : "0/0 XP",
            ]}
          />

          <WorldMap
            player={player}
            currentLocation={currentLocation}
            contextState={contextState}
            locations={locations}
            onTravel={handleTravelAndOpenContext}
            onMinimizeContext={() => setContextState("minimized")}
            onExpandContext={() => setContextState("expanded")}
            onAction={handleAction}
            npcDialogOpen={npcDialogOpen}
            npcName="Jane"
            npcRole="Merchant"
            npcDialogueLines={npcDialogueLines}
            npcDialogueOptions={npcDialogueOptions}
            npcLoreNotes={npcLoreNotes}
            onCloseNpcDialog={handleCloseNpcDialog}
            onNpcOptionSelect={(optionId) => {
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
              }
            }}
            onNpcBuy={() =>
              setEventLogs((prev) => [...prev, "System: Buy flow placeholder."])
            }
            onNpcSell={handleSellResources}
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
            name={player.name}
            characterClass={selectedClass.name}
            stats={[
              {
                label: "HP",
                value: computedHp,
                max: computedHp,
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
            conditions={conditionsData}
          />

          <EquipmentPanel equipmentRows={equipmentRows} />

          <InventoryPanel
            items={groupedInventory}
            currentWeight={Number(currentWeight.toFixed(1))}
            maxWeight={computedCarryWeight}
          />

          <SkillsPanel skills={skillsData} />
        </aside>
      </section>
    </main>
  );
}