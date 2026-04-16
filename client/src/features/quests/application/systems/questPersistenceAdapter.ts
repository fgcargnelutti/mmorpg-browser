import type { QuestDefinition, QuestProgressState } from "../../domain/questTypes";

export type PersistedQuestProgressEntry = {
  questKey: string;
  state: QuestProgressState["state"];
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  rewardClaimedAt?: string;
  objectiveProgress: QuestProgressState["objectiveProgress"];
};

export type PersistedQuestLogPayload = {
  version: 1;
  entries: PersistedQuestProgressEntry[];
};

export type QuestRewardClaimRequest = {
  questKey: string;
};

export function serializeQuestProgressStates(
  progressStates: QuestProgressState[]
): PersistedQuestLogPayload {
  return {
    version: 1,
    entries: progressStates.map((state) => ({
      questKey: state.questKey,
      state: state.state,
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      failedAt: state.failedAt,
      rewardClaimedAt: state.rewardClaimedAt,
      objectiveProgress: state.objectiveProgress,
    })),
  };
}

export function deserializeQuestProgressStates(
  payload: PersistedQuestLogPayload | null | undefined,
  quests: QuestDefinition[]
): QuestProgressState[] {
  if (!payload || payload.version !== 1) {
    return [];
  }

  const supportedQuestKeys = new Set(quests.map((quest) => quest.key));

  return payload.entries
    .filter((entry) => supportedQuestKeys.has(entry.questKey))
    .map((entry) => ({
      questKey: entry.questKey,
      state: entry.state,
      startedAt: entry.startedAt,
      completedAt: entry.completedAt,
      failedAt: entry.failedAt,
      rewardClaimedAt: entry.rewardClaimedAt,
      objectiveProgress: entry.objectiveProgress,
    }));
}

export function createQuestRewardClaimRequest(
  questKey: string
): QuestRewardClaimRequest {
  return {
    questKey,
  };
}
