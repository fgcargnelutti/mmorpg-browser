import type { LootTableDefinition } from "./lootTypes";

export const lootTablesData: Record<string, LootTableDefinition> = {
  "north-road-goblin": {
    key: "north-road-goblin",
    encounterKey: "north-road-goblin",
    sourceType: "creature",
    sourceKey: "goblin",
    rolls: 1,
    guaranteedRewards: [],
    itemEntries: [
      {
        itemKey: "stone",
        amount: 1,
        rarity: "common",
        weight: 3,
      },
      {
        itemKey: "rope",
        amount: 1,
        rarity: "common",
        weight: 2,
      },
      {
        itemKey: "cookie",
        amount: 1,
        rarity: "rare",
        weight: 1,
      },
    ],
  },
  "north-forest-goblin-ruins-goblin": {
    key: "north-forest-goblin-ruins-goblin",
    encounterKey: "north-forest-goblin-ruins-goblin",
    sourceType: "creature",
    sourceKey: "goblin",
    rolls: 1,
    guaranteedRewards: [],
    itemEntries: [
      {
        itemKey: "stone",
        amount: 1,
        rarity: "common",
        weight: 2,
      },
      {
        itemKey: "rope",
        amount: 1,
        rarity: "common",
        weight: 2,
      },
      {
        itemKey: "cookie",
        amount: 1,
        rarity: "rare",
        weight: 1,
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
