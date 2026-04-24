import {
  registerWorldBossDamageTakenContribution,
} from "./worldBossContributionSystem";
import type {
  WorldBossBossActionDefinition,
  WorldBossContributionRecord,
  WorldBossDefinition,
  WorldBossParticipant,
  WorldBossTelegraph,
} from "../../domain/worldBossTypes";

type ExecuteWorldBossBossTurnParams = {
  boss: WorldBossDefinition;
  round: number;
  participants: WorldBossParticipant[];
  contribution: WorldBossContributionRecord[];
  activeTelegraphs: WorldBossTelegraph[];
  defendedParticipantIds: Set<string>;
};

type WorldBossBossTurnResult = {
  participants: WorldBossParticipant[];
  contribution: WorldBossContributionRecord[];
  activeTelegraphs: WorldBossTelegraph[];
  executedActions: WorldBossBossActionDefinition[];
  preparedActions: WorldBossBossActionDefinition[];
  messages: string[];
};

function resolveBossTurnActionCount(boss: WorldBossDefinition, round: number) {
  const range =
    boss.bossActionsPerTurn.max - boss.bossActionsPerTurn.min + 1;

  return boss.bossActionsPerTurn.min + ((Math.max(1, round) - 1) % Math.max(1, range));
}

function selectWorldBossBossTurnActions(boss: WorldBossDefinition, round: number) {
  const actionCount = resolveBossTurnActionCount(boss, round);
  const startIndex = (Math.max(1, round) - 1) % boss.actions.length;

  return Array.from({ length: actionCount }, (_, offset) => {
    const index = (startIndex + offset) % boss.actions.length;
    return boss.actions[index];
  });
}

function resolveBossActionDamage(action: WorldBossBossActionDefinition) {
  switch (action.key) {
    case "crushing-sweep":
      return 18;
    case "stone-shrapnel":
      return 14;
    case "seismic-roar":
      return 10;
    default:
      switch (action.type) {
        case "lane-attack":
          return 16;
        case "multi-lane-attack":
          return 14;
        case "all-lanes-attack":
          return 10;
        default:
          return 12;
      }
  }
}

function resolveBossActionTargetLaneLabels(action: WorldBossBossActionDefinition) {
  if (!action.laneIds || action.laneIds.length === 0) {
    return "all lanes";
  }

  return action.laneIds
    .map((laneId) => `${laneId} lane`)
    .join(", ");
}

function createWorldBossTelegraph(
  action: WorldBossBossActionDefinition,
  round: number
): WorldBossTelegraph {
  return {
    id: `boss-telegraph:${action.key}:${round}`,
    actionKey: action.key,
    targeting: action.targeting,
    laneIds: action.laneIds ?? [],
    message: `Boss is preparing ${action.label} on ${resolveBossActionTargetLaneLabels(action)}.`,
    revealsAtRound: round,
    resolvesAtRound: round + Math.max(1, action.telegraphRoundsAhead ?? 1),
  };
}

function applyBossDamageToParticipant(
  participant: WorldBossParticipant,
  damage: number
) {
  const nextHp = Math.max(0, participant.currentHp - Math.max(0, damage));

  return {
    ...participant,
    currentHp: nextHp,
    state: nextHp <= 0 ? "dead" : participant.state,
  };
}

export function executeWorldBossBossTurn({
  boss,
  round,
  participants,
  contribution,
  activeTelegraphs,
  defendedParticipantIds,
}: ExecuteWorldBossBossTurnParams): WorldBossBossTurnResult {
  const participantsById = new Map(
    participants.map((participant) => [participant.id, participant])
  );
  let nextContribution = contribution;
  const messages: string[] = [];
  const dueTelegraphs = activeTelegraphs.filter(
    (telegraph) => telegraph.resolvesAtRound === round
  );
  const unresolvedTelegraphs = activeTelegraphs.filter(
    (telegraph) => telegraph.resolvesAtRound > round
  );
  const dueActions = dueTelegraphs
    .map((telegraph) => boss.actions.find((action) => action.key === telegraph.actionKey))
    .filter((action): action is WorldBossBossActionDefinition => Boolean(action));
  const selectedActions = selectWorldBossBossTurnActions(boss, round);
  const immediateActions = selectedActions.filter(
    (action) => !action.telegraphRoundsAhead || action.telegraphRoundsAhead <= 0
  );
  const preparedActions = selectedActions.filter(
    (action) => (action.telegraphRoundsAhead ?? 0) > 0
  );
  const newTelegraphs = preparedActions.map((action) =>
    createWorldBossTelegraph(action, round)
  );
  const actionsToExecute = [...dueActions, ...immediateActions];

  for (const telegraph of newTelegraphs) {
    messages.push(telegraph.message);
  }

  for (const action of actionsToExecute) {
    const targetLaneIds =
      action.laneIds && action.laneIds.length > 0
        ? action.laneIds
        : ["front", "mid", "back"];
    const targets = Array.from(participantsById.values()).filter(
      (participant) =>
        participant.state === "ready" && targetLaneIds.includes(participant.laneId)
    );

    if (targets.length === 0) {
      messages.push(`World Boss: ${action.label} found no targets.`);
      continue;
    }

    const baseDamage = resolveBossActionDamage(action);
    const targetNames: string[] = [];

    for (const target of targets) {
      const finalDamage = defendedParticipantIds.has(target.id)
        ? Math.max(1, Math.ceil(baseDamage / 2))
        : baseDamage;
      const damagedTarget = applyBossDamageToParticipant(target, finalDamage);

      participantsById.set(damagedTarget.id, damagedTarget);
      nextContribution = registerWorldBossDamageTakenContribution(
        nextContribution,
        damagedTarget.id,
        finalDamage
      );
      targetNames.push(`${damagedTarget.name} (-${finalDamage} HP)`);
    }

    messages.push(
      `World Boss: ${action.label} struck ${resolveBossActionTargetLaneLabels(
        action
      )} and hit ${targetNames.join(", ")}.`
    );
  }

  return {
    participants: Array.from(participantsById.values()),
    contribution: nextContribution,
    activeTelegraphs: [...unresolvedTelegraphs, ...newTelegraphs],
    executedActions: actionsToExecute,
    preparedActions,
    messages,
  };
}
