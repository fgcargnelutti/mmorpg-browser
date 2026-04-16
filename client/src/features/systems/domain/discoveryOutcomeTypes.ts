import type { Reward } from "./rewardTypes";
import type { UnlockDescriptor } from "./unlockTypes";

export type DiscoveryOutcomeType =
  | "reveal_poi"
  | "discover_poi"
  | "discover_location"
  | "grant_reward"
  | "grant_item"
  | "start_quest"
  | "unlock_skill"
  | "unlock_structure"
  | "grant_companion"
  | "log_message";

export type RevealPoiOutcome = {
  type: "reveal_poi";
  poiKey: string;
  message?: string;
};

export type DiscoverPoiOutcome = {
  type: "discover_poi";
  poiKey: string;
  message?: string;
};

export type DiscoverLocationOutcome = {
  type: "discover_location";
  locationKey: string;
  message?: string;
};

export type GrantRewardOutcome = {
  type: "grant_reward";
  rewards: Reward[];
};

export type GrantItemOutcome = {
  type: "grant_item";
  itemKey: string;
  amount: number;
  message?: string;
};

export type StartQuestOutcome = {
  type: "start_quest";
  questKey: string;
  message?: string;
};

export type UnlockSkillOutcome = {
  type: "unlock_skill";
  skillKey: string;
  message?: string;
};

export type UnlockStructureOutcome = {
  type: "unlock_structure";
  structureKey: string;
  message?: string;
};

export type GrantCompanionOutcome = {
  type: "grant_companion";
  companionKey: string;
  message?: string;
};

export type LogMessageOutcome = {
  type: "log_message";
  message: string;
};

export type DiscoveryOutcome =
  | RevealPoiOutcome
  | DiscoverPoiOutcome
  | DiscoverLocationOutcome
  | GrantRewardOutcome
  | GrantItemOutcome
  | StartQuestOutcome
  | UnlockSkillOutcome
  | UnlockStructureOutcome
  | GrantCompanionOutcome
  | LogMessageOutcome;

export type DiscoveryResolution = {
  messages: string[];
  rewards: Reward[];
  unlocks: UnlockDescriptor[];
  revealedPoiKeys: string[];
  discoveredPoiKeys: string[];
  discoveredLocationKeys: string[];
  startedQuestKeys: string[];
};
