import type { Reward } from "../../systems/domain/rewardTypes";
import type { QuestObjectiveDefinition } from "./questObjectiveTypes";

export type QuestCategory = "main" | "side" | "activity" | "hidden";
export type QuestState = "locked" | "available" | "active" | "completed" | "failed";
export type QuestLogSectionKey = "daily" | "lore" | "hunt";

export type QuestSource =
  | { type: "npc"; npcKey: string }
  | { type: "poi"; poiKey: string }
  | { type: "item"; itemKey: string }
  | { type: "discovery"; discoveryKey: string }
  | { type: "system"; key: string };

export type QuestDependency =
  | { type: "quest_completed"; questKey: string }
  | { type: "skill_unlocked"; skillKey: string }
  | { type: "poi_revealed"; poiKey: string }
  | { type: "item_owned"; itemKey: string; amount?: number };

export type QuestDefinition = {
  key: string;
  title: string;
  description: string;
  category: QuestCategory;
  logSection?: QuestLogSectionKey;
  state?: QuestState;
  source: QuestSource;
  objectives: QuestObjectiveDefinition[];
  dependencies?: QuestDependency[];
  rewards?: Reward[];
  failureMessage?: string;
};

export type QuestProgressState = {
  questKey: string;
  state: QuestState;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  rewardClaimedAt?: string;
  objectiveProgress: Record<
    string,
    {
      current: number;
      required: number;
      state: "locked" | "active" | "completed" | "failed";
    }
  >;
};

// Source-of-truth note:
// - Local prototype: quest progress can be derived and stored on the client.
// - Future backend: quest ownership, availability, rewards, and completion state
//   should be validated and persisted server-side.
