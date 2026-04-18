import type { LootTableDefinition } from "./lootTypes";

export const lootTablesData: Record<string, LootTableDefinition> = {
  "north-road-goblin": {
    key: "north-road-goblin",
    encounterKey: "north-road-goblin",
    sourceType: "creature",
    sourceKey: "goblin",
    rolls: 0,
    guaranteedRewards: [],
    itemEntries: [
      {
        itemKey: "gold",
        minAmount: 1,
        maxAmount: 4,
        rarity: "common",
        guaranteed: true,
      },
      {
        itemKey: "rabbit-meat",
        amount: 1,
        rarity: "common",
        guaranteed: true,
      },
      {
        itemKey: "rope",
        amount: 1,
        rarity: "common",
        dropChance: 0.7,
      },
      {
        itemKey: "pickaxe",
        amount: 1,
        rarity: "uncommon",
        dropChance: 0.25,
      },
      {
        itemKey: "goblin-essence",
        amount: 1,
        rarity: "rare",
        dropChance: 0.01,
      },
      {
        itemKey: "goblin-helmet",
        amount: 1,
        rarity: "rare",
        dropChance: 0.0003,
      },
    ],
  },
  "north-forest-goblin-ruins-goblin": {
    key: "north-forest-goblin-ruins-goblin",
    encounterKey: "north-forest-goblin-ruins-goblin",
    sourceType: "creature",
    sourceKey: "goblin",
    rolls: 0,
    guaranteedRewards: [],
    itemEntries: [
      {
        itemKey: "gold",
        minAmount: 1,
        maxAmount: 4,
        rarity: "common",
        guaranteed: true,
      },
      {
        itemKey: "rabbit-meat",
        amount: 1,
        rarity: "common",
        guaranteed: true,
      },
      {
        itemKey: "rope",
        amount: 1,
        rarity: "common",
        dropChance: 0.7,
      },
      {
        itemKey: "pickaxe",
        amount: 1,
        rarity: "uncommon",
        dropChance: 0.25,
      },
      {
        itemKey: "goblin-essence",
        amount: 1,
        rarity: "rare",
        dropChance: 0.01,
      },
      {
        itemKey: "goblin-helmet",
        amount: 1,
        rarity: "rare",
        dropChance: 0.0003,
      },
    ],
  },
  "southwest-farm-goblin-raider": {
    key: "southwest-farm-goblin-raider",
    encounterKey: "southwest-farm-goblin-raider",
    sourceType: "creature",
    sourceKey: "goblin",
    rolls: 0,
    guaranteedRewards: [],
    itemEntries: [
      {
        itemKey: "gold",
        minAmount: 1,
        maxAmount: 4,
        rarity: "common",
        guaranteed: true,
      },
      {
        itemKey: "rabbit-meat",
        amount: 1,
        rarity: "common",
        guaranteed: true,
      },
      {
        itemKey: "rope",
        amount: 1,
        rarity: "common",
        dropChance: 0.7,
      },
      {
        itemKey: "pickaxe",
        amount: 1,
        rarity: "uncommon",
        dropChance: 0.25,
      },
      {
        itemKey: "goblin-essence",
        amount: 1,
        rarity: "rare",
        dropChance: 0.01,
      },
      {
        itemKey: "goblin-helmet",
        amount: 1,
        rarity: "rare",
        dropChance: 0.0003,
      },
    ],
  },
  "boss-prototype-minotaur": {
    key: "boss-prototype-minotaur",
    sourceType: "boss",
    sourceKey: "minotaur",
    rolls: 2,
    guaranteedRewards: [
      {
        reward: {
          type: "gold",
          amount: 8,
          reason: "Boss spoils",
        },
        guaranteed: true,
      },
    ],
    itemEntries: [
      {
        itemKey: "gold",
        amount: 4,
        rarity: "boss",
        weight: 3,
      },
      {
        itemKey: "iron-ore",
        amount: 2,
        rarity: "boss",
        weight: 2,
      },
      {
        itemKey: "rope",
        amount: 1,
        rarity: "rare",
        weight: 1,
      },
    ],
  },
};
