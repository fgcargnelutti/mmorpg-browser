import type { SkillUnlockDefinition } from "./skillUnlockTypes";

export const unlockableSkillsData: Record<string, SkillUnlockDefinition> = {
  alchemy: {
    skillKey: "alchemy",
    title: "Alchemy",
    description: "Learn to brew potions, tinctures, and improvised field remedies.",
    state: "locked",
    source: {
      type: "npc",
      npcKey: "maria",
    },
    message: "You learned the foundations of alchemy from Maria.",
  },
  trapcraft: {
    skillKey: "trapcraft",
    title: "Trapcraft",
    description: "Build and place crude field traps using salvaged materials.",
    state: "locked",
    source: {
      type: "document",
      documentKey: "old-hunting-notes",
    },
    message: "You deciphered enough notes to begin crafting simple traps.",
  },
  lockpicking: {
    skillKey: "lockpicking",
    title: "Lockpicking",
    description: "Open sealed locks and improvised mechanisms in forgotten places.",
    state: "locked",
    source: {
      type: "enemy_drop",
      encounterKey: "north-road-goblin",
    },
    message: "You discovered lockpicking techniques hidden among stolen tools.",
  },
};
