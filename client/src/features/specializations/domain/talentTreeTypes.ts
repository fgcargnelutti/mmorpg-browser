export type TalentArchetypeKey = "wasteland-survivor" | "combatant";

export type TalentNodeState = "locked" | "unlockable" | "unlocked";

export type TalentNodeDefinition = {
  key: string;
  archetypeKey: TalentArchetypeKey;
  title: string;
  description: string;
  unlockLevel: number;
  prerequisites?: string[];
  gridColumn: number;
  gridRow: number;
};

export type TalentArchetypeDefinition = {
  key: TalentArchetypeKey;
  label: string;
  description: string;
  nodes: TalentNodeDefinition[];
};

export type CharacterTalentProgressState = {
  unlockedNodeKeys: string[];
};

export type TalentTreeNodeSnapshot = TalentNodeDefinition & {
  state: TalentNodeState;
};

export type TalentTreeSnapshot = {
  archetype: TalentArchetypeDefinition;
  nodes: TalentTreeNodeSnapshot[];
};
