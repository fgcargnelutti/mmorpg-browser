export type NpcDialogueOptionData = {
  id: string;
  label: string;
  state?: "unlocked" | "new" | "completed" | "locked";
  category?: string;
};

export type NpcProfileKey = "jane" | "maria";

export type NpcShopOffer = {
  itemKey: string;
  priceGold: number;
  label: string;
  description: string;
};

export type NpcProfileData = {
  key: NpcProfileKey;
  name: string;
  role: string;
  initialDialogueLines: string[];
  dialogueOptions: NpcDialogueOptionData[];
  loreNotes: string[];
  narrativeHint: string;
  narrativeStatusText: string;
  buyPlaceholderMessage: string;
  sellPlaceholderMessage: string;
  buyOffers?: NpcShopOffer[];
  sellableItemKeys?: string[];
  sellPriceGoldPerItem?: number;
};

export const npcProfilesData: Record<NpcProfileKey, NpcProfileData> = {
  jane: {
    key: "jane",
    name: "Jane",
    role: "Merchant",
    initialDialogueLines: [
      "Jane watches the road in silence before finally speaking.",
      "Bring me useful scraps, and I can keep you supplied for another day.",
    ],
    dialogueOptions: [
      {
        id: "who-are-you",
        label: "Who are you?",
        state: "unlocked",
      },
      {
        id: "what-do-you-sell",
        label: "What do you sell?",
        state: "unlocked",
      },
      {
        id: "any-rumors",
        label: "Any rumors?",
        state: "new",
      },
    ],
    loreNotes: [
      "Jane has kept this trading post alive longer than most people expected.",
    ],
    narrativeHint: "This NPC still has an important role in the story.",
    narrativeStatusText: "Jane still seems to be holding back information.",
    buyPlaceholderMessage: "System: Jane is ready to sell basic survival gear.",
    sellPlaceholderMessage: "System: Jane is ready to buy gathered resources.",
    sellableItemKeys: ["stone", "wood", "herb", "fish", "rope", "paper"],
    sellPriceGoldPerItem: 3,
    buyOffers: [
      {
        itemKey: "short-sword",
        priceGold: 6,
        label: "Short Sword",
        description: "Basic weapon • Attack +4",
      },
      {
        itemKey: "shield",
        priceGold: 5,
        label: "Scrap Shield",
        description: "Basic shield • Defense +3",
      },
    ],
  },
  maria: {
    key: "maria",
    name: "Maria",
    role: "Apothecary",
    initialDialogueLines: [
      "Maria arranges cloudy bottles by color before looking up from the counter.",
      "The farm still grows what the city forgot. Roots, herbs, and stranger things too.",
    ],
    dialogueOptions: [
      {
        id: "who-are-you",
        label: "Who are you?",
        state: "unlocked",
      },
      {
        id: "what-do-you-sell",
        label: "What do you sell?",
        state: "unlocked",
      },
      {
        id: "why-live-here",
        label: "Why live here?",
        state: "new",
      },
    ],
    loreNotes: [
      "Maria keeps a tiny magical trade alive far from the main outpost.",
      "She buys herbs, fruit, fish, and whatever the land still offers.",
    ],
    narrativeHint:
      "Maria feels like the first step toward a deeper rural questline.",
    narrativeStatusText:
      "Maria seems open to trade, but not yet ready to share all her secrets.",
    buyPlaceholderMessage: "System: Maria's potion stock is still a placeholder.",
    sellPlaceholderMessage:
      "System: Maria examines your natural goods with professional interest.",
    sellableItemKeys: ["fruit", "herb", "fish", "rabbit-meat"],
    sellPriceGoldPerItem: 2,
    buyOffers: [],
  },
};
