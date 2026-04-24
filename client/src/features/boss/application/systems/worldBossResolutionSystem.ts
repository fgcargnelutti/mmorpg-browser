import {
  canLanePerformMelee,
  resolveLaneMeleeEffectiveness,
} from "../../domain/worldBossLaneRules";
import {
  registerWorldBossDamageContribution,
  registerWorldBossHealingContribution,
  registerWorldBossRoundParticipation,
} from "./worldBossContributionSystem";
import { executeWorldBossBossTurn } from "./worldBossBossTurnSystem";
import { createNextWorldBossRoundState } from "./worldBossRoundClockSystem";
import { groupWorldBossActionsByPhase } from "./worldBossPhaseSystem";
import type {
  WorldBossDefinition,
  WorldBossParticipant,
  WorldBossSession,
} from "../../domain/worldBossTypes";

type ResolveWorldBossRoundParams = {
  session: WorldBossSession;
  boss: WorldBossDefinition;
  now?: Date;
};

export type WorldBossRoundResolutionResult = {
  nextSession: WorldBossSession;
  messages: string[];
};

function findParticipantById(
  participants: WorldBossParticipant[],
  participantId: string
) {
  return participants.find((participant) => participant.id === participantId) ?? null;
}

function replaceParticipant(
  participants: WorldBossParticipant[],
  nextParticipant: WorldBossParticipant
) {
  return participants.map((participant) =>
    participant.id === nextParticipant.id ? nextParticipant : participant
  );
}

function resolveBasicMeleeDamage(participant: WorldBossParticipant) {
  const laneMultiplier = resolveLaneMeleeEffectiveness(participant.laneId);

  return Math.round(18 * laneMultiplier);
}

export function resolveWorldBossRound({
  session,
  boss,
  now = new Date(),
}: ResolveWorldBossRoundParams): WorldBossRoundResolutionResult {
  const phaseActions = groupWorldBossActionsByPhase(session.round);
  let nextParticipants = [...session.participants];
  let nextContribution = session.contribution;
  const messages: string[] = [];
  const defendedParticipantIds = new Set<string>();

  for (const participant of nextParticipants) {
    nextContribution = registerWorldBossRoundParticipation(
      nextContribution,
      participant.id,
      {
        countedAsAlive: participant.state === "ready",
        actionCommitted: Boolean(
          session.round.submittedPlayerActions.find(
            (action) =>
              action.participantId === participant.id && action.type !== "skip"
          )
        ),
      }
    );
  }

  for (const action of phaseActions.movement) {
    const participant = findParticipantById(nextParticipants, action.participantId);

    if (
      !participant ||
      participant.state !== "ready" ||
      action.type !== "lane-change" ||
      !action.targetLaneId ||
      action.targetLaneId === participant.laneId
    ) {
      continue;
    }

    const nextParticipant = {
      ...participant,
      laneId: action.targetLaneId,
      currentStamina: Math.max(
        0,
        participant.currentStamina - boss.laneChangeStaminaCost
      ),
    };

    nextParticipants = replaceParticipant(nextParticipants, nextParticipant);
    messages.push(
      `World Boss: ${participant.name} moved to the ${action.targetLaneId} lane.`
    );
  }

  for (const action of phaseActions.defense) {
    const participant = findParticipantById(nextParticipants, action.participantId);

    if (!participant || participant.state !== "ready" || action.type !== "defend") {
      continue;
    }

    defendedParticipantIds.add(participant.id);
    messages.push(`World Boss: ${participant.name} is defending this round.`);
  }

  for (const action of phaseActions.support) {
    const participant = findParticipantById(nextParticipants, action.participantId);

    if (!participant || participant.state !== "ready") {
      continue;
    }

    if (action.type === "heal") {
      const healedAmount = Math.min(12, participant.maxHp - participant.currentHp);
      const nextParticipant = {
        ...participant,
        currentHp: Math.min(participant.maxHp, participant.currentHp + 12),
      };

      nextParticipants = replaceParticipant(nextParticipants, nextParticipant);
      nextContribution = registerWorldBossHealingContribution(
        nextContribution,
        participant.id,
        healedAmount
      );
      messages.push(
        `World Boss: ${participant.name} restored ${healedAmount} HP.`
      );
      continue;
    }

    if (action.type === "support") {
      const nextParticipant = {
        ...participant,
        currentSp: Math.min(participant.maxSp, participant.currentSp + 6),
      };

      nextParticipants = replaceParticipant(nextParticipants, nextParticipant);
      messages.push(
        `World Boss: ${participant.name} reinforced the team with a support action.`
      );
    }
  }

  let totalPlayerDamage = 0;

  for (const action of phaseActions.offense) {
    const participant = findParticipantById(nextParticipants, action.participantId);

    if (!participant || participant.state !== "ready") {
      continue;
    }

    if (action.type === "basic-melee") {
      if (!canLanePerformMelee(participant.laneId)) {
        continue;
      }

      const damage = resolveBasicMeleeDamage(participant);
      totalPlayerDamage += damage;
      nextContribution = registerWorldBossDamageContribution(
        nextContribution,
        participant.id,
        damage
      );

      messages.push(
        `World Boss: ${participant.name} committed ${damage} damage from the ${participant.laneId} lane.`
      );
      continue;
    }

    if (action.type === "skill") {
      const damage = 22;
      totalPlayerDamage += damage;
      nextContribution = registerWorldBossDamageContribution(
        nextContribution,
        participant.id,
        damage
      );

      messages.push(
        `World Boss: ${participant.name} committed a skill attack for ${damage} damage.`
      );
    }
  }

  const nextBossHp = Math.max(0, session.boss.currentHp - totalPlayerDamage);

  if (totalPlayerDamage > 0) {
    messages.push(
      `World Boss: The offensive phase dealt ${totalPlayerDamage} total damage to ${session.boss.name}.`
    );
  }

  if (nextBossHp <= 0) {
    messages.push(
      `World Boss: ${session.boss.name} was defeated at the end of the offensive phase.`
    );

    return {
      nextSession: {
        ...session,
        state: "completed",
        resolvedAt: now.toISOString(),
        boss: {
          ...session.boss,
          currentHp: 0,
        },
        participants: nextParticipants,
        contribution: nextContribution,
      },
      messages,
    };
  }

  const bossTurn = executeWorldBossBossTurn({
    boss,
    round: session.round.round,
    participants: nextParticipants,
    contribution: nextContribution,
    activeTelegraphs: session.round.activeTelegraphs,
    defendedParticipantIds,
  });

  nextParticipants = bossTurn.participants;
  nextContribution = bossTurn.contribution;
  messages.push(...bossTurn.messages);

  const aliveParticipants = nextParticipants.filter(
    (participant) => participant.state === "ready"
  );

  if (aliveParticipants.length === 0) {
    messages.push(
      `World Boss: All participants were defeated during round ${session.round.round}.`
    );

    return {
      nextSession: {
        ...session,
        state: "failed",
        resolvedAt: now.toISOString(),
        boss: {
          ...session.boss,
          currentHp: nextBossHp,
        },
        participants: nextParticipants,
        contribution: nextContribution,
        round: {
          ...session.round,
          state: "boss-turn",
          activeTelegraphs: bossTurn.activeTelegraphs,
          bossActionQueue: bossTurn.executedActions,
        },
      },
      messages,
    };
  }

  return {
    nextSession: {
      ...session,
      boss: {
        ...session.boss,
        currentHp: nextBossHp,
      },
      participants: nextParticipants,
      contribution: nextContribution,
      round: createNextWorldBossRoundState({
        previousRound: {
          ...session.round,
          state: "boss-turn",
          activeTelegraphs: bossTurn.activeTelegraphs,
          bossActionQueue: bossTurn.executedActions,
        },
        now,
      }),
    },
    messages,
  };
}
