import type { CreatureBestiaryKey } from "../features/bestiary";

export type EncounterKey = "north-road-goblin" | "north-forest-goblin-ruins-goblin";

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
};
