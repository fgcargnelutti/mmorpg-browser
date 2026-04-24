import { canLanePerformMelee } from "../../domain/worldBossLaneRules";
import type {
  WorldBossDefinition,
  WorldBossLaneId,
  WorldBossParticipant,
  WorldBossPlayerActionSelection,
  WorldBossPlayerActionType,
  WorldBossRoundResolutionPhase,
} from "../../domain/worldBossTypes";

type CreateWorldBossPlayerActionSelectionParams = {
  participant: WorldBossParticipant;
  boss: WorldBossDefinition;
  type: WorldBossPlayerActionType;
  now?: Date;
  targetLaneId?: WorldBossLaneId;
};

type WorldBossActionValidationResult = {
  isValid: boolean;
  reason?: string;
  phase?: WorldBossRoundResolutionPhase;
  description?: string;
};

function resolveWorldBossActionPhase(
  type: WorldBossPlayerActionType
): WorldBossRoundResolutionPhase {
  switch (type) {
    case "lane-change":
      return "movement";
    case "defend":
      return "defense";
    case "support":
    case "heal":
      return "support";
    case "basic-melee":
    case "skill":
      return "offense";
    case "skip":
    default:
      return "post-action";
  }
}

function resolveWorldBossActionDescription(params: {
  type: WorldBossPlayerActionType;
  targetLaneId?: WorldBossLaneId;
}) {
  switch (params.type) {
    case "lane-change":
      return params.targetLaneId
        ? `Move to ${params.targetLaneId} lane.`
        : "Change lane.";
    case "defend":
      return "Prepare a defensive action.";
    case "support":
      return "Prepare a support action.";
    case "heal":
      return "Prepare a healing action.";
    case "basic-melee":
      return "Commit a melee strike.";
    case "skip":
      return "No action selected. Skip the round.";
    default:
      return "Prepare an action.";
  }
}

export function validateWorldBossPlayerAction(params: {
  participant: WorldBossParticipant;
  boss: WorldBossDefinition;
  type: WorldBossPlayerActionType;
  targetLaneId?: WorldBossLaneId;
}): WorldBossActionValidationResult {
  const { participant, boss, type, targetLaneId } = params;

  if (participant.state !== "ready") {
    return {
      isValid: false,
      reason: "You are no longer an active combatant in this World Boss encounter.",
    };
  }

  if (type === "lane-change") {
    if (!targetLaneId || targetLaneId === participant.laneId) {
      return {
        isValid: false,
        reason: "Choose a different lane before confirming movement.",
      };
    }

    if (participant.currentStamina < boss.laneChangeStaminaCost) {
      return {
        isValid: false,
        reason: "Not enough stamina to change lanes.",
      };
    }
  }

  if (type === "basic-melee") {
    if (!canLanePerformMelee(participant.laneId)) {
      return {
        isValid: false,
        reason: "Melee attacks cannot be committed from the back lane.",
      };
    }

    if (participant.currentStamina < boss.meleeAttackStaminaCost) {
      return {
        isValid: false,
        reason: "Not enough stamina to commit a melee attack.",
      };
    }
  }

  return {
    isValid: true,
    phase: resolveWorldBossActionPhase(type),
    description: resolveWorldBossActionDescription({
      type,
      targetLaneId,
    }),
  };
}

export function createWorldBossPlayerActionSelection(
  params: CreateWorldBossPlayerActionSelectionParams
): WorldBossPlayerActionSelection {
  const validation = validateWorldBossPlayerAction(params);

  if (!validation.isValid || !validation.phase) {
    throw new Error(validation.reason ?? "Invalid World Boss player action.");
  }

  return {
    participantId: params.participant.id,
    type: params.type,
    phase: validation.phase,
    selectedAt: (params.now ?? new Date()).toISOString(),
    consumesTurnAction: params.type !== "skip",
    targetLaneId: params.targetLaneId,
    description: validation.description,
  };
}
