export type QuestObjectiveKind =
  | "talk_to_npc"
  | "travel_to_map"
  | "visit_poi"
  | "reveal_poi"
  | "collect_item"
  | "defeat_enemy"
  | "complete_action"
  | "learn_rumor"
  | "custom";

export type QuestObjectiveState = "locked" | "active" | "completed" | "failed";

export type QuestObjectiveProgress = {
  current: number;
  required: number;
};

export type QuestObjectiveTrigger =
  | { type: "npc"; npcKey: string }
  | { type: "map"; mapId: string }
  | { type: "poi"; poiKey: string }
  | { type: "reveal_poi"; poiKey: string }
  | { type: "item"; itemKey: string }
  | { type: "encounter"; encounterKey: string }
  | { type: "action"; actionId: string }
  | { type: "rumor"; rumorKey: string }
  | { type: "custom"; key: string };

export type QuestObjectiveDefinition = {
  key: string;
  kind: QuestObjectiveKind;
  title: string;
  description: string;
  state?: QuestObjectiveState;
  progress?: QuestObjectiveProgress;
  trigger: QuestObjectiveTrigger;
  optional?: boolean;
};
