export { creatureCompendiumData } from "./domain/creatureCompendiumData";
export { bestiaryThresholdsData } from "./domain/bestiaryThresholdsData";
export { useBestiary } from "./application/hooks/useBestiary";
export { default as BestiaryDialog } from "./presentation/components/BestiaryDialog";
export {
  serializeBestiaryProgress,
  deserializeBestiaryProgress,
} from "./application/systems/bestiaryPersistenceAdapter";
export {
  createInitialBestiaryProgressState,
  getKnowledgeTierForKillCount,
  getBestiaryMilestoneMessage,
  registerCreatureKill,
} from "./application/systems/bestiaryProgressionSystem";
export {
  getVisibleBestiaryEntries,
  getVisibleBestiaryEntry,
} from "./application/selectors/getVisibleBestiaryEntry";

export type {
  BestiaryKillRegistrationResult,
  BestiaryThresholdDefinition,
  CreatureAttackDescriptor,
  CreatureBestiaryData,
  CreatureBestiaryKey,
  CreatureDropGroup,
  CreatureKnowledgeTier,
  PlayerBestiaryEntryState,
  PlayerBestiaryProgressState,
  VisibleBestiaryEntry,
} from "./domain/bestiaryTypes";
