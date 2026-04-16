import type { SkillKey } from "../../progression";

export type SkillTreeTier = 30 | 60 | 100;
export type SkillTreeNodeState =
  | "locked"
  | "unlockable"
  | "selected"
  | "blocked-by-choice";

export type SkillTreeNodeEffect =
  | { type: "specialization"; specializationKey: string }
  | { type: "stat_bonus"; key: string; value: number }
  | { type: "passive"; key: string };

export type SkillTreeNodeDefinition = {
  key: string;
  skillKey: SkillKey;
  tier: SkillTreeTier;
  title: string;
  description: string;
  icon: string;
  unlockLevel: number;
  state?: SkillTreeNodeState;
  effects: SkillTreeNodeEffect[];
  prerequisites?: string[];
};

export type SkillTreeDefinition = {
  skillKey: SkillKey;
  skillName: string;
  tooltip: string;
  nodes: SkillTreeNodeDefinition[];
};

export type CharacterSpecializationProgressState = Record<
  SkillKey,
  {
    selectedNodeKeys: string[];
  }
>;

export type SkillTreeProgressSnapshot = {
  skillKey: SkillKey;
  selectedNodeKeys: string[];
  unlockableNodeKeys: string[];
  blockedNodeKeys: string[];
  lockedNodeKeys: string[];
};
