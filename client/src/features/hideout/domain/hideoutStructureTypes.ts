import type { Reward } from "../../systems/domain/rewardTypes";

export type HideoutStructureKey = "house" | "forge" | "bed" | "worktable";
export type HideoutStructureState = "locked" | "available" | "built" | "upgrading";

export type HideoutStructureCost = {
  itemKey: string;
  amount: number;
};

export type HideoutStructureRequirement =
  | { type: "player_level"; value: number }
  | { type: "quest_completed"; questKey: string }
  | { type: "structure_level"; structureKey: HideoutStructureKey; level: number };

export type HideoutStructureTier = {
  level: number;
  label: string;
  description: string;
  buildCosts: HideoutStructureCost[];
  requirements?: HideoutStructureRequirement[];
  unlockedFunctions?: string[];
  passiveRewards?: Reward[];
};

export type HideoutStructureDefinition = {
  key: HideoutStructureKey;
  name: string;
  description: string;
  maxLevel: number;
  tiers: HideoutStructureTier[];
};
