import type {
  CreatureAttackDescriptor,
  CreatureBestiaryKey,
  CreatureCategory,
  CreatureHabitatTag,
  CreatureThreatTier,
} from "../../bestiary/domain/bestiaryTypes";

export type CreatureSpeciesId = CreatureBestiaryKey;

export type CreatureSpeciesData = {
  id: CreatureSpeciesId;
  name: string;
  category: CreatureCategory;
  threatTier: CreatureThreatTier;
  habitatTags: CreatureHabitatTag[];
  isBossCandidate: boolean;
  baseStats: {
    maxHp: number;
    maxSp: number;
  };
  combatDefaults: {
    enemyMaxHp: number;
    playerAttackDamage: number;
    enemyAttackDamage: number;
    rewardXp: number;
  };
  traits: {
    weaknesses: string[];
    resistances: string[];
    strengths: string[];
  };
  attacks: CreatureAttackDescriptor[];
  loreNotes: string[];
};

export type CreatureSpeciesSnapshot = {
  id: CreatureSpeciesId;
  name: string;
  category: CreatureCategory;
  threatTier: CreatureThreatTier;
  habitatTags: CreatureHabitatTag[];
  isBossCandidate: boolean;
  maxHp: number;
  maxSp: number;
  combatDefaults: {
    enemyMaxHp: number;
    playerAttackDamage: number;
    enemyAttackDamage: number;
    rewardXp: number;
  };
  weaknesses: string[];
  resistances: string[];
  strengths: string[];
  attacks: CreatureAttackDescriptor[];
  notes: string[];
};
