import type { CreatureBestiaryKey } from "../features/bestiary";

export type EncounterKey =
  | "north-road-goblin"
  | "north-forest-goblin-ruins-goblin"
  | "southwest-farm-goblin-raider";

export type EncounterData = {
  key: EncounterKey;
  creatureKey: CreatureBestiaryKey;
  encounterType?: "creature" | "boss";
  lootTableKey?: string;
  enemyName: string;
  enemyTitle: string;
  enemyMaxHp: number;
  playerAttackDamage: number;
  enemyAttackDamage: number;
  rewardXp: number;
  introText: string;
  victoryText: string;
  retreatText: string;
};

export const encountersData: Record<EncounterKey, EncounterData> = {
  "north-road-goblin": {
    key: "north-road-goblin",
    creatureKey: "goblin",
    encounterType: "creature",
    lootTableKey: "north-road-goblin",
    enemyName: "Goblin",
    enemyTitle: "Roadside Ambusher",
    enemyMaxHp: 18,
    playerAttackDamage: 6,
    enemyAttackDamage: 3,
    rewardXp: 12,
    introText:
      "A Goblin jumps out from the northern road, blocking your path with a jagged blade.",
    victoryText:
      "The Goblin collapses into the dust. The northern path falls silent again.",
    retreatText:
      "You step back and abandon the road for now, leaving the Goblin behind.",
  },
  "north-forest-goblin-ruins-goblin": {
    key: "north-forest-goblin-ruins-goblin",
    creatureKey: "goblin",
    encounterType: "creature",
    lootTableKey: "north-forest-goblin-ruins-goblin",
    enemyName: "Goblin",
    enemyTitle: "Ruins Scavenger",
    enemyMaxHp: 20,
    playerAttackDamage: 6,
    enemyAttackDamage: 3,
    rewardXp: 12,
    introText:
      "A Goblin darts between the broken barricades of the ruins and lunges with a chipped spear.",
    victoryText:
      "The Goblin falls among the shattered campfires. The ruins grow quiet for a moment.",
    retreatText:
      "You break away from the ruins before the Goblin can corner you.",
  },
  "southwest-farm-goblin-raider": {
    key: "southwest-farm-goblin-raider",
    creatureKey: "goblin",
    encounterType: "creature",
    lootTableKey: "southwest-farm-goblin-raider",
    enemyName: "Goblin",
    enemyTitle: "Field Raider",
    enemyMaxHp: 19,
    playerAttackDamage: 6,
    enemyAttackDamage: 3,
    rewardXp: 12,
    introText:
      "A Goblin bursts from the overgrown field boundary, hoping to catch you between the ruined fences.",
    victoryText:
      "The Goblin crumples into the weeds. The farmland falls quiet for a breath before the next rustle.",
    retreatText:
      "You break off the hunt and slip back from the ruined fields before the Goblin can press the attack.",
  },
};
