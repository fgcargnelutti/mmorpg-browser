import type {
  WorldBossParticipant,
  WorldBossParticipantRemovalReason,
  WorldBossSession,
} from "../../domain/worldBossTypes";

type RemoveWorldBossParticipantParams = {
  session: WorldBossSession;
  playerId: string;
  reason: WorldBossParticipantRemovalReason;
  now?: Date;
};

export type WorldBossParticipantRemovalResult = {
  didRemove: boolean;
  nextSession: WorldBossSession;
  messages: string[];
};

function replaceParticipant(
  participants: WorldBossParticipant[],
  nextParticipant: WorldBossParticipant
) {
  return participants.map((participant) =>
    participant.id === nextParticipant.id ? nextParticipant : participant
  );
}

function resolveRemovalMessage(
  participantName: string,
  reason: WorldBossParticipantRemovalReason
) {
  switch (reason) {
    case "disconnect":
      return `World Boss: ${participantName} disconnected and was removed from the encounter.`;
    case "voluntary-exit":
      return `World Boss: ${participantName} left the encounter and was removed immediately.`;
    case "death":
      return `World Boss: ${participantName} can no longer act after being defeated.`;
    default:
      return `World Boss: ${participantName} is no longer active in the encounter.`;
  }
}

export function removeWorldBossParticipantFromSession({
  session,
  playerId,
  reason,
  now = new Date(),
}: RemoveWorldBossParticipantParams): WorldBossParticipantRemovalResult {
  const targetParticipant =
    session.participants.find((participant) => participant.playerId === playerId) ??
    null;

  if (!targetParticipant) {
    return {
      didRemove: false,
      nextSession: session,
      messages: [],
    };
  }

  const nextParticipantState = reason === "death" ? "dead" : "left";
  const nextParticipants = replaceParticipant(session.participants, {
    ...targetParticipant,
    state: nextParticipantState,
    currentHp: reason === "death" ? 0 : targetParticipant.currentHp,
    lastConfirmedAt: now.toISOString(),
  });
  const nextRound = {
    ...session.round,
    submittedPlayerActions: session.round.submittedPlayerActions.filter(
      (action) => action.participantId !== targetParticipant.id
    ),
  };
  const remainingReadyParticipants = nextParticipants.filter(
    (participant) => participant.state === "ready"
  );
  const messages = [resolveRemovalMessage(targetParticipant.name, reason)];

  if (remainingReadyParticipants.length <= 0) {
    messages.push(
      "World Boss: No active participants remain in the encounter. The raid has failed."
    );

    return {
      didRemove: true,
      nextSession: {
        ...session,
        state: "failed",
        resolvedAt: now.toISOString(),
        participants: nextParticipants,
        round: nextRound,
      },
      messages,
    };
  }

  return {
    didRemove: true,
    nextSession: {
      ...session,
      participants: nextParticipants,
      round: nextRound,
    },
    messages,
  };
}
