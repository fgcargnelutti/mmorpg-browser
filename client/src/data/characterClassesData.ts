import { BASE_CHARACTER_STAMINA } from "./gameBalance";

export type CharacterClassKey =
  | "wasteland-warrior"
  | "arcanist"
  | "thief";

export type LearnByDoingRates = {
  survival: number;
  melee: number;
  archery: number;
  stealth: number;
  arcane: number;
};

export type CharacterClassData = {
  key: CharacterClassKey;
  name: string;
  title: string;
  description: string;

  baseHp: number;
  baseSp: number;
  baseStamina: number;
  carryWeight: number;

  staminaRecoveryOnHeavyAction: {
    chancePercent: number;
    minimumStaminaCost: number;
    staminaRecovered: number;
  };

  injuryResistancePercent: number;

  npcInteractionProfile: {
    avoidsSuspicionDebuffs: boolean;
    notes: string[];
  };

  levelScaling: {
    hpPerLevel: number;
    spPerLevel: number;
  };

  traits: string[];
  learnByDoingRates: LearnByDoingRates;
};

export const characterClassesData: Record<
  CharacterClassKey,
  CharacterClassData
> = {
  "wasteland-warrior": {
    key: "wasteland-warrior",
    name: "Wasteland Warrior",
    title: "Frontline Survivor",
    description:
      "A hardened survivor built for endurance, direct confrontation, and harsh wasteland routines. Excels in physical resilience, heavy labor, and reliable interactions across hostile territories.",

    baseHp: 100,
    baseSp: 30,
    baseStamina: BASE_CHARACTER_STAMINA,
    carryWeight: 100,

    staminaRecoveryOnHeavyAction: {
      chancePercent: 20,
      minimumStaminaCost: 3,
      staminaRecovered: 1,
    },

    injuryResistancePercent: 20,

    npcInteractionProfile: {
      avoidsSuspicionDebuffs: true,
      notes: [
        "Generally perceived as reliable in direct interactions.",
        "Does not suffer suspicion-style social penalties common to less trusted archetypes.",
        "Well suited for rough environments and practical survival contexts.",
      ],
    },

    levelScaling: {
      hpPerLevel: 10,
      spPerLevel: 1,
    },

    traits: [
      "High HP, low SP.",
      "Regenerates 1 HP every 3 seconds.",
      "Regenerates 1 SP every 12 seconds.",
      "Regenerates 1 stamina every 2 minutes and 24 seconds.",
      "Offline stamina regenerates 1 point every 2 minutes.",
      "Can carry up to 100 kg.",
      "20% chance to recover 1 stamina after actions costing 3 or more stamina.",
      "20% resistance to injury chance.",
      "Stable and trustworthy interaction profile with NPCs and the environment.",
    ],

    learnByDoingRates: {
      survival: 100,
      melee: 100,
      archery: 50,
      stealth: 50,
      arcane: 5,
    },
  },

    arcanist: {
    key: "arcanist",
    name: "Arcanist",
    title: "Keeper of Forgotten Knowledge",
    description:
      "A fragile but powerful wielder of forgotten forces who excels through spiritual power, relic attunement, and mastery of arcane growth.",

    baseHp: 60,
    baseSp: 100,
    baseStamina: BASE_CHARACTER_STAMINA,
    carryWeight: 70,

    staminaRecoveryOnHeavyAction: {
      chancePercent: 0,
      minimumStaminaCost: 999,
      staminaRecovered: 0,
    },

    injuryResistancePercent: 0,

    npcInteractionProfile: {
      avoidsSuspicionDebuffs: true,
      notes: [
        "Does not suffer suspicion-style social penalties common to distrusted archetypes.",
        "Interacts well with environments and NPC contexts tied to knowledge, relics, and the old world.",
      ],
    },

    levelScaling: {
      hpPerLevel: 2,
      spPerLevel: 10,
    },

    traits: [
      "Low HP, high SP.",
      "Regenerates 1 HP every 12 seconds.",
      "Regenerates 1 SP every 2 seconds.",
      "Regenerates 1 stamina every 2 minutes and 24 seconds.",
      "Offline stamina regenerates 1 point every 2 minutes.",
      "Can carry up to 70 kg.",
      "All jewel-derived bonuses are 10% more effective.",
      "Does not suffer suspicion-style social debuffs common to distrusted archetypes.",
    ],

    learnByDoingRates: {
      survival: 50,
      melee: 50,
      archery: 50,
      stealth: 50,
      arcane: 100,
    },
  },

    thief: {
    key: "thief",
    name: "Thief",
    title: "Shadow Scavenger",
    description:
      "A fast and adaptable opportunist who thrives on stealth, mobility, and resourceful exploration, but often struggles with trust in social interactions.",

    baseHp: 80,
    baseSp: 60,
    baseStamina: BASE_CHARACTER_STAMINA,
    carryWeight: 80,

    staminaRecoveryOnHeavyAction: {
      chancePercent: 0,
      minimumStaminaCost: 999,
      staminaRecovered: 0,
    },

    injuryResistancePercent: 0,

    npcInteractionProfile: {
      avoidsSuspicionDebuffs: false,
      notes: [
        "May suffer suspicion-style social debuffs in NPC interactions.",
        "Can face worse prices, distrust, or penalties in certain dialogue contexts.",
        "Excels in risky routes, fast travel behavior, and opportunistic resource gathering.",
      ],
    },

    levelScaling: {
      hpPerLevel: 5,
      spPerLevel: 5,
    },

    traits: [
      "Medium HP, medium SP.",
      "Regenerates 1 HP every 6 seconds.",
      "Regenerates 1 SP every 6 seconds.",
      "Regenerates 1 stamina every 2 minutes and 24 seconds.",
      "Offline stamina regenerates 1 point every 2 minutes.",
      "Can carry up to 80 kg.",
      "10% chance to obtain additional loot when gathering resources.",
      "10% chance to avoid stamina consumption when performing map travel actions.",
      "May suffer suspicion-style debuffs in interactions with NPCs.",
    ],

    learnByDoingRates: {
      survival: 50,
      melee: 70,
      archery: 80,
      stealth: 100,
      arcane: 20,
    },
  },
};
