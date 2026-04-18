import type { QuestDefinition } from "./questTypes";

export const questsData: Record<string, QuestDefinition> = {
  "maria-goblin-hunt": {
    key: "maria-goblin-hunt",
    title: "Goblin Hunt",
    description:
      "Maria wants the goblin threat near the northern ruins reduced before it spills back toward the farms.",
    category: "activity",
    logSection: "hunt",
    state: "available",
    source: {
      type: "npc",
      npcKey: "maria",
    },
    objectives: [
      {
        key: "defeat-goblin-ruins-goblin",
        kind: "defeat_enemy",
        title: "Defeat the Goblin at Goblin Ruins",
        description:
          "Travel to North Forest and defeat the goblin lurking in the Goblin Ruins.",
        progress: {
          current: 0,
          required: 1,
        },
        trigger: {
          type: "encounter",
          encounterKey: "north-forest-goblin-ruins-goblin",
        },
      },
    ],
    rewards: [
      {
        type: "xp",
        amount: 18,
        reason: "Completed Maria's Goblin Hunt",
      },
      {
        type: "gold",
        amount: 6,
        reason: "Maria pays for the cleared threat",
      },
      {
        type: "message",
        message: "Maria: Good. One less goblin stalking the roads between the farms and the outpost.",
      },
    ],
  },
  "jane-sewer-whispers": {
    key: "jane-sewer-whispers",
    title: "Whispers Beneath Belegard",
    description:
      "Jane warns that the sewer below Belegard hides movement and secrets worth uncovering.",
    category: "side",
    logSection: "lore",
    state: "available",
    source: {
      type: "npc",
      npcKey: "jane",
    },
    objectives: [
      {
        key: "learn-jane-rumor",
        kind: "learn_rumor",
        title: "Listen to Jane's warning",
        description: "Learn the rumor about the sewer from Jane.",
        progress: {
          current: 0,
          required: 1,
        },
        trigger: {
          type: "rumor",
          rumorKey: "jane-sewer-rumor",
        },
      },
      {
        key: "reveal-sewer",
        kind: "reveal_poi",
        title: "Reveal the sewer entrance",
        description: "Uncover the hidden sewer entrance below Belegard.",
        progress: {
          current: 0,
          required: 1,
        },
        trigger: {
          type: "reveal_poi",
          poiKey: "sewer",
        },
      },
    ],
    rewards: [
      {
        type: "xp",
        amount: 20,
        reason: "Completed Whispers Beneath Belegard",
      },
    ],
  },
  "library-fragments": {
    key: "library-fragments",
    title: "Fragments of the Archive",
    description:
      "Search the ruined library for surviving scraps of knowledge and whatever still lies buried below the rubble.",
    category: "activity",
    logSection: "lore",
    state: "available",
    source: {
      type: "poi",
      poiKey: "old-library",
    },
    objectives: [
      {
        key: "visit-old-library",
        kind: "visit_poi",
        title: "Reach the Old Library",
        description: "Travel to the Old Library in Belegard.",
        progress: {
          current: 0,
          required: 1,
        },
        trigger: {
          type: "poi",
          poiKey: "old-library",
        },
      },
      {
        key: "recover-paper",
        kind: "collect_item",
        title: "Recover library scraps",
        description: "Collect 1 paper scrap from the library rubble.",
        progress: {
          current: 0,
          required: 1,
        },
        trigger: {
          type: "item",
          itemKey: "paper",
        },
      },
    ],
    rewards: [
      {
        type: "item",
        itemKey: "paper",
        amount: 1,
        reason: "Recovered from the Old Library",
      },
    ],
  },
};
