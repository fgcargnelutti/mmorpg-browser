import type { CharacterClassKey } from "../../../data/characterClassesData";

export type WorldBossSessionState =
  | "available"
  | "forming"
  | "countdown"
  | "active"
  | "completed"
  | "failed";

export type WorldBossLaneId = "front" | "mid" | "back";

export type WorldBossRoundResolutionPhase =
  | "movement"
  | "defense"
  | "preparation"
  | "support"
  | "offense"
  | "post-action";

export type WorldBossParticipantRole =
  | "tank"
  | "melee"
  | "ranged"
  | "support"
  | "healer"
  | "hybrid";

export type WorldBossCombatantState = "ready" | "down" | "dead" | "left";

export type WorldBossPlayerActionType =
  | "basic-melee"
  | "skill"
  | "lane-change"
  | "defend"
  | "support"
  | "heal"
  | "skip";

export type WorldBossBossActionType =
  | "melee"
  | "ranged"
  | "lane-attack"
  | "multi-lane-attack"
  | "all-lanes-attack"
  | "boss-skill";

export type WorldBossBossActionTargeting =
  | "front-lane"
  | "mid-lane"
  | "back-lane"
  | "multiple-lanes"
  | "all-lanes"
  | "single-player";

export type WorldBossContributionRecord = {
  participantId: string;
  damageDealt: number;
  healingDone: number;
  damageTaken: number;
  roundsParticipated: number;
  roundsAlive: number;
  actionsCommitted: number;
};

export type WorldBossParticipant = {
  id: string;
  playerId: string;
  name: string;
  classKey: CharacterClassKey;
  role: WorldBossParticipantRole;
  laneId: WorldBossLaneId;
  state: WorldBossCombatantState;
  currentHp: number;
  maxHp: number;
  currentSp: number;
  maxSp: number;
  currentStamina: number;
  maxStamina: number;
  joinedAt: string;
  lastConfirmedAt: string;
};

export type WorldBossParticipantSummary = Pick<
  WorldBossParticipant,
  | "id"
  | "name"
  | "classKey"
  | "role"
  | "laneId"
  | "state"
  | "currentHp"
  | "maxHp"
  | "currentSp"
  | "maxSp"
>;

export type WorldBossTelegraph = {
  id: string;
  actionKey: string;
  targeting: WorldBossBossActionTargeting;
  laneIds: WorldBossLaneId[];
  message: string;
  revealsAtRound: number;
  resolvesAtRound: number;
};

export type WorldBossPreparedEffect = {
  id: string;
  sourceParticipantId?: string;
  sourceBossActionKey?: string;
  resolvesAtRound: number;
  phase: WorldBossRoundResolutionPhase;
  label: string;
  description: string;
};

export type WorldBossBossActionDefinition = {
  key: string;
  label: string;
  type: WorldBossBossActionType;
  targeting: WorldBossBossActionTargeting;
  laneIds?: WorldBossLaneId[];
  staminaCost?: number;
  telegraphRoundsAhead?: number;
  maxExecutionsPerTurn?: number;
  description: string;
};

export type WorldBossPlayerActionSelection = {
  participantId: string;
  type: WorldBossPlayerActionType;
  phase: WorldBossRoundResolutionPhase;
  selectedAt: string;
  consumesTurnAction: boolean;
  targetLaneId?: WorldBossLaneId;
  skillKey?: string;
  description?: string;
};

export type WorldBossBossRoundPlan = {
  round: number;
  actionKeys: string[];
};

export type WorldBossRoundState = {
  round: number;
  state: "collecting-player-actions" | "resolving-player-round" | "boss-turn";
  playerWindowDurationMs: number;
  playerDecisionDeadlineAt: string;
  resolutionPhases: WorldBossRoundResolutionPhase[];
  submittedPlayerActions: WorldBossPlayerActionSelection[];
  bossActionQueue: WorldBossBossActionDefinition[];
  activeTelegraphs: WorldBossTelegraph[];
  preparedEffects: WorldBossPreparedEffect[];
};

export type WorldBossDefinition = {
  key: string;
  name: string;
  title: string;
  mapId: string;
  description: string;
  maxHp: number;
  maxSp: number;
  baseRoundDurationMs: number;
  laneChangeStaminaCost: number;
  meleeAttackStaminaCost: number;
  bossActionsPerTurn: {
    min: number;
    max: number;
  };
  actions: WorldBossBossActionDefinition[];
};

export type WorldBossSession = {
  sessionId: string;
  bossKey: string;
  state: WorldBossSessionState;
  createdAt: string;
  availableAt: string;
  countdownStartedAt?: string;
  combatStartedAt?: string;
  resolvedAt?: string;
  boss: {
    name: string;
    title: string;
    currentHp: number;
    maxHp: number;
    currentSp: number;
    maxSp: number;
  };
  participants: WorldBossParticipant[];
  round: WorldBossRoundState;
  contribution: WorldBossContributionRecord[];
};
