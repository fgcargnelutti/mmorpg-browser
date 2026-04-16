import type { QuestObjectiveDefinition } from "../../domain/questObjectiveTypes";
import type { QuestDefinition, QuestProgressState } from "../../domain/questTypes";

export type QuestProgressEvent =
  | { type: "rumor"; rumorKey: string }
  | { type: "poi"; poiKey: string }
  | { type: "reveal_poi"; poiKey: string }
  | { type: "item"; itemKey: string; amount?: number }
  | { type: "npc"; npcKey: string }
  | { type: "map"; mapId: string }
  | { type: "encounter"; encounterKey: string }
  | { type: "action"; actionId: string }
  | { type: "custom"; key: string };

function getObjectiveRequirement(objective: QuestObjectiveDefinition) {
  return objective.progress?.required ?? 1;
}

function objectiveMatchesEvent(
  objective: QuestObjectiveDefinition,
  event: QuestProgressEvent
) {
  switch (event.type) {
    case "rumor":
      return objective.trigger.type === "rumor" && objective.trigger.rumorKey === event.rumorKey;
    case "poi":
      return objective.trigger.type === "poi" && objective.trigger.poiKey === event.poiKey;
    case "reveal_poi":
      return (
        objective.trigger.type === "reveal_poi" &&
        objective.trigger.poiKey === event.poiKey
      );
    case "item":
      return objective.trigger.type === "item" && objective.trigger.itemKey === event.itemKey;
    case "npc":
      return objective.trigger.type === "npc" && objective.trigger.npcKey === event.npcKey;
    case "map":
      return objective.trigger.type === "map" && objective.trigger.mapId === event.mapId;
    case "encounter":
      return (
        objective.trigger.type === "encounter" &&
        objective.trigger.encounterKey === event.encounterKey
      );
    case "action":
      return objective.trigger.type === "action" && objective.trigger.actionId === event.actionId;
    case "custom":
      return objective.trigger.type === "custom" && objective.trigger.key === event.key;
    default:
      return false;
  }
}

export function createInitialQuestProgressState(
  quest: QuestDefinition
): QuestProgressState {
  return {
    questKey: quest.key,
    state: quest.state ?? "locked",
    objectiveProgress: Object.fromEntries(
      quest.objectives.map((objective) => [
        objective.key,
        {
          current: objective.progress?.current ?? 0,
          required: getObjectiveRequirement(objective),
          state: objective.state ?? "locked",
        },
      ])
    ),
  };
}

export function activateQuest(
  quest: QuestDefinition,
  progressState?: QuestProgressState
): QuestProgressState {
  const nextState = progressState
    ? structuredClone(progressState)
    : createInitialQuestProgressState(quest);

  nextState.state = "active";
  nextState.startedAt ??= new Date().toISOString();

  for (const objective of quest.objectives) {
    const progress = nextState.objectiveProgress[objective.key];
    if (progress.state === "locked") {
      progress.state = "active";
    }
  }

  return nextState;
}

export function claimQuestRewards(
  progressState: QuestProgressState
): QuestProgressState {
  if (progressState.state !== "completed" || progressState.rewardClaimedAt) {
    return progressState;
  }

  return {
    ...progressState,
    rewardClaimedAt: new Date().toISOString(),
  };
}

export function applyQuestProgressEvent(
  quest: QuestDefinition,
  progressState: QuestProgressState,
  event: QuestProgressEvent
): QuestProgressState {
  if (progressState.state !== "active") {
    return progressState;
  }

  const nextState = structuredClone(progressState);

  for (const objective of quest.objectives) {
    const objectiveState = nextState.objectiveProgress[objective.key];

    if (objectiveState.state !== "active") continue;
    if (!objectiveMatchesEvent(objective, event)) continue;

    const increment = event.type === "item" ? event.amount ?? 1 : 1;
    objectiveState.current = Math.min(
      objectiveState.required,
      objectiveState.current + increment
    );

    if (objectiveState.current >= objectiveState.required) {
      objectiveState.state = "completed";
    }
  }

  const requiredObjectives = quest.objectives.filter((objective) => !objective.optional);
  const allRequiredCompleted = requiredObjectives.every((objective) => {
    const objectiveState = nextState.objectiveProgress[objective.key];
    return objectiveState?.state === "completed";
  });

  if (allRequiredCompleted) {
    nextState.state = "completed";
    nextState.completedAt ??= new Date().toISOString();
  }

  return nextState;
}

export function applyQuestProgressEvents(
  quest: QuestDefinition,
  progressState: QuestProgressState,
  events: QuestProgressEvent[]
): QuestProgressState {
  return events.reduce(
    (currentState, event) => applyQuestProgressEvent(quest, currentState, event),
    progressState
  );
}
