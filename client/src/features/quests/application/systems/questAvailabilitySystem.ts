import type { QuestDefinition, QuestProgressState, QuestState } from "../../domain/questTypes";

type QuestAvailabilityContext = {
  completedQuestKeys?: string[];
  unlockedSkillKeys?: string[];
  revealedPoiKeys?: string[];
  inventoryItemCounts?: Record<string, number>;
};

function normalizeQuestState(
  quest: QuestDefinition,
  progressState?: QuestProgressState
): QuestState {
  return progressState?.state ?? quest.state ?? "locked";
}

function hasDependencySatisfied(
  dependency: NonNullable<QuestDefinition["dependencies"]>[number],
  context: QuestAvailabilityContext
) {
  switch (dependency.type) {
    case "quest_completed":
      return context.completedQuestKeys?.includes(dependency.questKey) ?? false;
    case "skill_unlocked":
      return context.unlockedSkillKeys?.includes(dependency.skillKey) ?? false;
    case "poi_revealed":
      return context.revealedPoiKeys?.includes(dependency.poiKey) ?? false;
    case "item_owned":
      return (
        (context.inventoryItemCounts?.[dependency.itemKey] ?? 0) >=
        (dependency.amount ?? 1)
      );
    default:
      return false;
  }
}

export function isQuestAvailable(
  quest: QuestDefinition,
  progressState: QuestProgressState | undefined,
  context: QuestAvailabilityContext = {}
) {
  const state = normalizeQuestState(quest, progressState);

  if (state === "active" || state === "completed" || state === "failed") {
    return false;
  }

  if (!quest.dependencies?.length) {
    return true;
  }

  return quest.dependencies.every((dependency) =>
    hasDependencySatisfied(dependency, context)
  );
}

export function buildQuestAvailabilityMap(
  quests: QuestDefinition[],
  progressStates: QuestProgressState[],
  context: QuestAvailabilityContext = {}
) {
  const progressByKey = new Map(progressStates.map((state) => [state.questKey, state]));

  return new Map(
    quests.map((quest) => [
      quest.key,
      isQuestAvailable(quest, progressByKey.get(quest.key), context),
    ])
  );
}

export type { QuestAvailabilityContext };
