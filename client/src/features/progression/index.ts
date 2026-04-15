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
  SkillTrainingEvent,
  SkillTrainingReward,
} from "./domain/skillTrainingRules";
