export type EncounterKey = "north-road-goblin";

export type EncounterData = {
  key: EncounterKey;
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
};