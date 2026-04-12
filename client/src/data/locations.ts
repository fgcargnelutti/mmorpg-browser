import type { EncounterKey } from "./encountersData";

export type LocationKey =
  | "north-road"
  | "old-library"
  | "blacksmith"
  | "merchant"
  | "sewer"
  | "temple"
  | "stairs"
  | "southwest-road"
  | "southeast-road";

export type PoiVariant =
  | "road"
  | "building"
  | "merchant"
  | "temple"
  | "danger"
  | "transition";

export type ContextAction = {
  id: string;
  label: string;
  description: string;
  rewardItem?: string;
  amount?: number;
  staminaCost?: number;
  effect?:
    | "rest"
    | "sell_resources"
    | "npc_dialog"
    | "travel_placeholder"
    | "trigger_encounter";
  targetMapName?: string;
  npcName?: string;
  encounterKey?: EncounterKey;
};

export type LocationData = {
  name: string;
  subtitle: string;
  description: string;
  actions: ContextAction[];
  mapPosition: {
    top: string;
    left: string;
  };
  poiVariant: PoiVariant;
};

export const locations: Record<LocationKey, LocationData> = {
  "north-road": {
    name: "North Road",
    subtitle: "Exit route",
    description: "A road leading north. The next map is not ready yet.",
    mapPosition: {
      top: "14%",
      left: "41%",
    },
    poiVariant: "road",
    actions: [
      {
        id: "travel-north",
        label: "Travel North",
        description: "Attempt to move toward the northern outskirts.",
        effect: "trigger_encounter",
        encounterKey: "north-road-goblin",
        targetMapName: "Northern Outskirts",
      },
    ],
  },

  "old-library": {
    name: "Old Library",
    subtitle: "Ruined archive",
    description:
      "Broken shelves, dust, and loose pages. You might find scraps worth keeping.",
    mapPosition: {
      top: "28%",
      left: "52%",
    },
    poiVariant: "building",
    actions: [
      {
        id: "library-rubble",
        label: "Search Rubble",
        description: "Search the rubble for paper or wood.",
        staminaCost: 2,
        rewardItem: "paper",
        amount: 1,
      },
      {
        id: "library-wood",
        label: "Pull Broken Shelves",
        description: "Recover wood from damaged bookshelves.",
        staminaCost: 2,
        rewardItem: "wood",
        amount: 1,
      },
    ],
  },

  blacksmith: {
    name: "Blacksmith",
    subtitle: "Collapsed forge",
    description:
      "A ruined forge. You can still trade, buy gear, or salvage debris.",
    mapPosition: {
      top: "36%",
      left: "62%",
    },
    poiVariant: "building",
    actions: [
      {
        id: "buy-weapon",
        label: "Buy Short Sword",
        description: "Buy a basic short sword for testing.",
        staminaCost: 0,
        rewardItem: "short-sword",
        amount: 1,
      },
      {
        id: "buy-shield",
        label: "Buy Scrap Shield",
        description: "Buy a basic shield for testing.",
        staminaCost: 0,
        rewardItem: "shield",
        amount: 1,
      },
      {
        id: "blacksmith-rubble",
        label: "Search Rubble",
        description: "Look for stone or wood among the debris.",
        staminaCost: 2,
        rewardItem: "stone",
        amount: 2,
      },
      {
        id: "blacksmith-sell",
        label: "Sell Resources",
        description: "Sell gathered resources for gold.",
        effect: "sell_resources",
      },
    ],
  },

  merchant: {
    name: "Merchant",
    subtitle: "Trading post",
    description:
      "A sheltered stall still in use. You can sell goods or talk to Jane.",
    mapPosition: {
      top: "22%",
      left: "34%",
    },
    poiVariant: "merchant",
    actions: [
      {
        id: "merchant-sell",
        label: "Sell Resources",
        description: "Sell gathered resources for gold.",
        effect: "sell_resources",
      },
      {
        id: "merchant-talk",
        label: "Talk to NPC Jane",
        description: "Open a dialog with Jane.",
        effect: "npc_dialog",
        npcName: "Jane",
      },
    ],
  },

  sewer: {
    name: "Sewer",
    subtitle: "Map transition",
    description: "The sewer leads to another map we do not have yet.",
    mapPosition: {
      top: "49%",
      left: "52%",
    },
    poiVariant: "danger",
    actions: [
      {
        id: "travel-sewer",
        label: "Enter Sewer",
        description: "This would take you to a future underground map.",
        effect: "travel_placeholder",
        targetMapName: "Underground Tunnels",
      },
    ],
  },

  temple: {
    name: "Temple",
    subtitle: "Abandoned sanctuary",
    description:
      "A quiet ruin where you can recover a little strength or search debris.",
    mapPosition: {
      top: "74%",
      left: "52%",
    },
    poiVariant: "temple",
    actions: [
      {
        id: "temple-pray",
        label: "Pray",
        description: "Recover 2 stamina.",
        effect: "rest",
        amount: 2,
      },
      {
        id: "temple-stone",
        label: "Search Debris",
        description: "Look for stone among the temple rubble.",
        staminaCost: 2,
        rewardItem: "stone",
        amount: 2,
      },
      {
        id: "temple-wood",
        label: "Lift Broken Beams",
        description: "Recover wood from fallen supports.",
        staminaCost: 2,
        rewardItem: "wood",
        amount: 1,
      },
    ],
  },

  stairs: {
    name: "Stairs",
    subtitle: "Map transition",
    description: "These stairs lead somewhere we still need to build.",
    mapPosition: {
      top: "52%",
      left: "69%",
    },
    poiVariant: "transition",
    actions: [
      {
        id: "travel-stairs",
        label: "Descend Stairs",
        description: "This would take you to another future map.",
        effect: "travel_placeholder",
        targetMapName: "Lower District",
      },
    ],
  },

  "southwest-road": {
    name: "Southwest Road",
    subtitle: "Map transition",
    description: "A road leading out of town. The destination is not ready yet.",
    mapPosition: {
      top: "82%",
      left: "34%",
    },
    poiVariant: "road",
    actions: [
      {
        id: "travel-sw",
        label: "Take Southwest Road",
        description: "This would take you to another map.",
        effect: "travel_placeholder",
        targetMapName: "Southwest Wilds",
      },
    ],
  },

  "southeast-road": {
    name: "Southeast Road",
    subtitle: "Map transition",
    description: "A road leaving the town. The destination is not ready yet.",
    mapPosition: {
      top: "70%",
      left: "67%",
    },
    poiVariant: "road",
    actions: [
      {
        id: "travel-se",
        label: "Take Southeast Road",
        description: "This would take you to another map.",
        effect: "travel_placeholder",
        targetMapName: "Southeast Fields",
      },
    ],
  },
};