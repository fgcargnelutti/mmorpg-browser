export type InventoryCatalogItem = {
  key: string;
  name: string;
  icon: string;
  weight: number;
  description: string;
  stats?: string[];
};

export const inventoryCatalog: Record<string, InventoryCatalogItem> = {
  stone: {
    key: "stone",
    name: "Stone",
    icon: "🪨",
    weight: 1.5,
    description: "A rough stone used for crafting and construction.",
    stats: ["Crafting material"],
  },

  herb: {
    key: "herb",
    name: "Herb",
    icon: "🌿",
    weight: 0.2,
    description: "A medicinal herb with basic healing properties.",
    stats: ["Consumable ingredient"],
  },

  wood: {
    key: "wood",
    name: "Wood",
    icon: "🪵",
    weight: 2.0,
    description: "Dry timber used for fuel, tools, and structures.",
    stats: ["Crafting material"],
  },

  "short-sword": {
    key: "short-sword",
    name: "Short Sword",
    icon: "🗡️",
    weight: 3.5,
    description: "A worn but reliable short sword.",
    stats: ["Attack +4"],
  },

  fish: {
    key: "fish",
    name: "River Fish",
    icon: "🐟",
    weight: 0.8,
    description: "A small river catch. Better cooked than eaten raw.",
    stats: ["Food item"],
  },

  rope: {
    key: "rope",
    name: "Rope",
    icon: "🪢",
    weight: 1.0,
    description: "Useful for climbing, binding, and field repairs.",
    stats: ["Traversal utility"],
  },

  paper: {
    key: "paper",
    name: "Paper Scrap",
    icon: "📜",
    weight: 0.1,
    description: "A fragile sheet salvaged from old records and books.",
    stats: ["Quest item material"],
  },

  shield: {
    key: "shield",
    name: "Scrap Shield",
    icon: "🛡️",
    weight: 4.0,
    description: "A basic shield made from reused metal and wood.",
    stats: ["Defense +3"],
  },

  gold: {
    key: "gold",
    name: "Gold",
    icon: "🪙",
    weight: 0.05,
    description: "Currency used for simple trade.",
    stats: ["Trade currency"],
  },
};