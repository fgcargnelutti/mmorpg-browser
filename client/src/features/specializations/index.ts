export { skillTreesData } from "./domain/skillTreesData";
export { talentTreesData } from "./domain/talentTreesData";
export { useSkillTree } from "./application/hooks/useSkillTree";
export { useTalentTree } from "./application/hooks/useTalentTree";
export { getSkillTreeNodes } from "./application/selectors/getSkillTreeNodes";
export { getUnlockedSkillSpecializations } from "./application/selectors/getUnlockedSkillSpecializations";
export {
  createInitialTalentProgressState,
  buildTalentTreeSnapshots,
  getEarnedTalentPoints,
  getAvailableTalentPoints,
  unlockTalentNode,
} from "./application/systems/talentTreeSystem";
export {
  createInitialSpecializationProgressState,
  resolveSkillTreeNodeState,
  selectSpecializationNode,
} from "./application/systems/specializationProgressSystem";
export { default as SkillTreeDialog } from "./presentation/components/SkillTreeDialog";

export type {
  CharacterSpecializationProgressState,
  SkillTreeDefinition,
  SkillTreeNodeDefinition,
  SkillTreeNodeEffect,
  SkillTreeNodeState,
  SkillTreeProgressSnapshot,
  SkillTreeTier,
} from "./domain/skillTreeTypes";
export type {
  CharacterTalentProgressState,
  TalentArchetypeDefinition,
  TalentArchetypeKey,
  TalentNodeDefinition,
  TalentNodeState,
  TalentTreeNodeSnapshot,
  TalentTreeSnapshot,
} from "./domain/talentTreeTypes";
