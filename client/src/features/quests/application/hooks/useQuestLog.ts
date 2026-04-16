import { useMemo } from "react";
import type { QuestDefinition, QuestProgressState } from "../../domain/questTypes";
import {
  buildQuestAvailabilityMap,
  type QuestAvailabilityContext,
} from "../systems/questAvailabilitySystem";

type UseQuestLogParams = {
  quests: QuestDefinition[];
  progressStates: QuestProgressState[];
  context?: QuestAvailabilityContext;
};

export function useQuestLog({
  quests,
  progressStates,
  context,
}: UseQuestLogParams) {
  return useMemo(() => {
    const progressByKey = new Map(progressStates.map((state) => [state.questKey, state]));
    const availabilityMap = buildQuestAvailabilityMap(quests, progressStates, context);

    const entries = quests.map((quest) => {
      const progressState = progressByKey.get(quest.key);
      const availability = availabilityMap.get(quest.key) ?? false;
      const state = progressState?.state ?? quest.state ?? (availability ? "available" : "locked");

      return {
        quest,
        progressState,
        state,
        isAvailable: availability,
        isRewardClaimed: Boolean(progressState?.rewardClaimedAt),
        canClaimRewards:
          state === "completed" && Boolean(quest.rewards?.length) && !progressState?.rewardClaimedAt,
      };
    });

    return {
      entries,
      available: entries.filter((entry) => entry.state === "available"),
      active: entries.filter((entry) => entry.state === "active"),
      completed: entries.filter((entry) => entry.state === "completed"),
      failed: entries.filter((entry) => entry.state === "failed"),
      locked: entries.filter((entry) => entry.state === "locked"),
    };
  }, [context, progressStates, quests]);
}
