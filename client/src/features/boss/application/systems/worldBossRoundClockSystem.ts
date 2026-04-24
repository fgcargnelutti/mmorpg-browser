import type {
  WorldBossBossRoundPlan,
  WorldBossParticipant,
  WorldBossPlayerActionSelection,
  WorldBossRoundState,
} from "../../domain/worldBossTypes";

function resolveRoundDeadlineIso(now: Date, durationMs: number) {
  return new Date(now.getTime() + Math.max(0, durationMs)).toISOString();
}

export function hasWorldBossPlayerDecisionWindowExpired(
  round: WorldBossRoundState,
  nowMs = Date.now()
) {
  const deadlineMs = new Date(round.playerDecisionDeadlineAt).getTime();

  if (Number.isNaN(deadlineMs)) {
    return false;
  }

  return nowMs >= deadlineMs;
}

export function resolveWorldBossSubmittedAction(
  round: WorldBossRoundState,
  participantId: string
) {
  return (
    round.submittedPlayerActions.find(
      (action) => action.participantId === participantId
    ) ?? null
  );
}

export function upsertWorldBossSubmittedAction(
  round: WorldBossRoundState,
  action: WorldBossPlayerActionSelection
) {
  const filteredActions = round.submittedPlayerActions.filter(
    (entry) => entry.participantId !== action.participantId
  );

  return {
    ...round,
    submittedPlayerActions: [...filteredActions, action],
  };
}

export function createNextWorldBossRoundState(params: {
  previousRound: WorldBossRoundState;
  now?: Date;
  bossActionQueue?: WorldBossBossRoundPlan["actionKeys"];
}) {
  const now = params.now ?? new Date();

  return {
    ...params.previousRound,
    round: params.previousRound.round + 1,
    state: "collecting-player-actions" as const,
    playerDecisionDeadlineAt: resolveRoundDeadlineIso(
      now,
      params.previousRound.playerWindowDurationMs
    ),
    submittedPlayerActions: [],
    bossActionQueue: params.previousRound.bossActionQueue,
    activeTelegraphs: params.previousRound.activeTelegraphs,
    preparedEffects: params.previousRound.preparedEffects,
  };
}

export function resolveWorldBossParticipantByPlayerId(
  participants: WorldBossParticipant[],
  playerId: string
) {
  return participants.find((participant) => participant.playerId === playerId) ?? null;
}
