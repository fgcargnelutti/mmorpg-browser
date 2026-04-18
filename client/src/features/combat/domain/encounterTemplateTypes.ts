import type { CreatureSpeciesId } from "../../creatures";
import type { LootTableId } from "./lootTypes";

export type EncounterKey =
  | "north-road-goblin"
  | "north-forest-goblin-ruins-goblin"
  | "southwest-farm-goblin-raider";

export type EncounterTemplate = {
  key: EncounterKey;
  speciesId: CreatureSpeciesId;
  encounterType?: "creature" | "boss";
  lootTableKey?: LootTableId;
  enemyName: string;
  enemyTitle: string;
  statOverrides?: {
    enemyMaxHp?: number;
    playerAttackDamage?: number;
    enemyAttackDamage?: number;
    rewardXp?: number;
  };
  introText: string;
  victoryText: string;
  retreatText: string;
};
