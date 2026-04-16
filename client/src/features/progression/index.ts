export { useCharacterProgression } from "./application/hooks/useCharacterProgression";
export { locationDiscoveriesData } from "./domain/locationDiscoveriesData";
export { loreDiscoveriesData } from "./domain/loreDiscoveriesData";
export { skillCatalog, skillOrder } from "./domain/skillCatalog";
export {
  buildCharacterSkillSummaries,
  createInitialSkillProgressionState,
  getSkillLevelFromTotalXp,
  getSkillProgress,
} from "./domain/skillProgression";
export { unlockableSkillsData } from "./domain/unlockableSkillsData";
export {
  applySkillUnlockDescriptor,
  createInitialSkillUnlockState,
  unlockSkillBySource,
} from "./application/systems/skillUnlockSystem";
export { getUnlockedSkills } from "./application/selectors/getUnlockedSkills";
export { getLockedSkills } from "./application/selectors/getLockedSkills";
export type { PlayerBestiaryProgressState } from "../bestiary";

export type { LocationDiscoveryData } from "./domain/locationDiscoveriesData";
export type {
  LoreDiscoveryData,
  LoreDiscoveryKey,
} from "./domain/loreDiscoveriesData";
export type {
  SkillDefinition,
  SkillKey,
  SkillSpecialization,
} from "./domain/skillCatalog";
export type {
  CharacterSkillProgressionState,
  CharacterSkillSummary,
  SkillProgressState,
} from "./domain/skillProgression";
export type {
  SkillUnlockDefinition,
  SkillUnlockProgressState,
  SkillUnlockSource,
} from "./domain/skillUnlockTypes";
export type {
  SkillTrainingEvent,
  SkillTrainingReward,
} from "./domain/skillTrainingRules";
