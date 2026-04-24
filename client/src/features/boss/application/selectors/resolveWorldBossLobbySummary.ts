import type {
  WorldBossLaneId,
  WorldBossSession,
} from "../../domain/worldBossTypes";

type WorldBossLobbyLaneSummary = {
  laneId: WorldBossLaneId;
  label: string;
  description: string;
  playerCount: number;
};

export type WorldBossLobbySummary = {
  totalPlayers: number;
  localPlayerLaneId: WorldBossLaneId | null;
  countdownRemainingMs: number;
  countdownRemainingSeconds: number;
  countdownEndsAt: string | null;
  laneSummaries: WorldBossLobbyLaneSummary[];
};

const lanePresentation: Record<
  WorldBossLaneId,
  Pick<WorldBossLobbyLaneSummary, "label" | "description">
> = {
  front: {
    label: "Front Lane",
    description: "Highest exposure. Best for tanks and committed melee.",
  },
  mid: {
    label: "Mid Lane",
    description: "Hybrid position. Melee stays effective, but less than front.",
  },
  back: {
    label: "Back Lane",
    description: "Safest lane. Best for support and ranged roles.",
  },
};

function resolveCountdownEndsAt(session: WorldBossSession) {
  if (!session.countdownStartedAt) {
    return null;
  }

  const countdownStartMs = new Date(session.countdownStartedAt).getTime();

  if (Number.isNaN(countdownStartMs)) {
    return null;
  }

  return new Date(
    countdownStartMs + Math.max(0, session.lobbyCountdownDurationMs)
  ).toISOString();
}

export function resolveWorldBossLobbySummary(params: {
  session: WorldBossSession | null;
  localPlayerId: string;
  nowMs?: number;
}): WorldBossLobbySummary | null {
  const { session, localPlayerId, nowMs = Date.now() } = params;

  if (!session) {
    return null;
  }

  const joinedParticipants = session.participants.filter(
    (participant) => participant.state !== "left"
  );
  const localParticipant =
    joinedParticipants.find((participant) => participant.playerId === localPlayerId) ??
    null;
  const countdownEndsAt = resolveCountdownEndsAt(session);
  const countdownEndsAtMs = countdownEndsAt
    ? new Date(countdownEndsAt).getTime()
    : null;
  const countdownRemainingMs =
    countdownEndsAtMs === null
      ? 0
      : Math.max(0, countdownEndsAtMs - nowMs);

  const laneSummaries: WorldBossLobbyLaneSummary[] = (
    ["front", "mid", "back"] as WorldBossLaneId[]
  ).map((laneId) => ({
    laneId,
    label: lanePresentation[laneId].label,
    description: lanePresentation[laneId].description,
    playerCount: joinedParticipants.filter(
      (participant) => participant.laneId === laneId
    ).length,
  }));

  return {
    totalPlayers: joinedParticipants.length,
    localPlayerLaneId: localParticipant?.laneId ?? null,
    countdownRemainingMs,
    countdownRemainingSeconds: Math.ceil(countdownRemainingMs / 1000),
    countdownEndsAt,
    laneSummaries,
  };
}
