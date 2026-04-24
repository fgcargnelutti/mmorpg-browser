import { getItemDefinition } from "../../../items/domain/itemCatalog";
import { mergeStackableRewards } from "../../../systems/application/systems/rewardResolutionSystem";
import type { Reward } from "../../../systems/domain/rewardTypes";
import type {
  WorldBossContributionRecord,
  WorldBossDefinition,
  WorldBossParticipant,
  WorldBossSession,
} from "../../domain/worldBossTypes";

type WorldBossResultRewardEntry = {
  key: string;
  label: string;
  description: string;
  amountLabel: string;
  icon: string;
  tone: "xp" | "gold" | "item" | "stamina" | "message";
};

export type WorldBossResultSummary = {
  outcome: "victory" | "defeat";
  title: string;
  subtitle: string;
  durationLabel: string;
  totalPlayers: number;
  rewards: Reward[];
  rewardEntries: WorldBossResultRewardEntry[];
  contribution: {
    damageDealt: number;
    healingDone: number;
    damageTaken: number;
    roundsParticipated: number;
    roundsAlive: number;
    actionsCommitted: number;
  };
};

function resolveContributionRecord(
  records: WorldBossContributionRecord[],
  participantId: string | null
) {
  if (!participantId) {
    return null;
  }

  return records.find((record) => record.participantId === participantId) ?? null;
}

function resolveLocalParticipantId(
  participants: WorldBossParticipant[],
  localPlayerId: string
) {
  return (
    participants.find((participant) => participant.playerId === localPlayerId)?.id ??
    null
  );
}

function formatDurationLabel(durationMs: number) {
  const clampedDurationMs = Math.max(0, durationMs);
  const totalSeconds = Math.floor(clampedDurationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function formatRewardAmountLabel(reward: Reward) {
  if (reward.type === "item") {
    return `${reward.amount}x`;
  }

  if (reward.type === "xp") {
    return `${reward.amount} XP`;
  }

  if (reward.type === "gold") {
    return `${reward.amount} Gold`;
  }

  if (reward.type === "stamina") {
    return `${reward.amount} SP`;
  }

  return "Update";
}

function resolveRewardEntry(reward: Reward, index: number): WorldBossResultRewardEntry {
  if (reward.type === "xp") {
    return {
      key: `xp:${index}:${reward.amount}`,
      label: "Experience",
      description: reward.reason ?? "World Boss victory experience.",
      amountLabel: formatRewardAmountLabel(reward),
      icon: "XP",
      tone: "xp",
    };
  }

  if (reward.type === "gold") {
    return {
      key: `gold:${index}:${reward.amount}`,
      label: "Gold",
      description: reward.reason ?? "Recovered from the reward cache.",
      amountLabel: formatRewardAmountLabel(reward),
      icon: "G",
      tone: "gold",
    };
  }

  if (reward.type === "item") {
    const itemDefinition = getItemDefinition(reward.itemKey);

    return {
      key: `item:${reward.itemKey}:${index}`,
      label: itemDefinition?.name ?? reward.itemKey,
      description: reward.reason ?? itemDefinition?.description ?? "Reward item.",
      amountLabel: formatRewardAmountLabel(reward),
      icon: itemDefinition?.icon ?? "[]",
      tone: "item",
    };
  }

  if (reward.type === "stamina") {
    return {
      key: `stamina:${index}:${reward.amount}`,
      label: "Stamina",
      description: reward.reason ?? "Recovered after the battle.",
      amountLabel: formatRewardAmountLabel(reward),
      icon: "SP",
      tone: "stamina",
    };
  }

  return {
    key: `message:${index}`,
    label: "Reward Notice",
    description:
      reward.type === "message"
        ? reward.message
        : reward.reason ?? "A World Boss milestone was updated.",
    amountLabel: "Notice",
    icon: "!",
    tone: "message",
  };
}

export function resolveWorldBossResultSummary(params: {
  session: WorldBossSession;
  boss: WorldBossDefinition;
  localPlayerId: string;
}): WorldBossResultSummary {
  const { session, boss, localPlayerId } = params;
  const outcome = session.state === "completed" ? "victory" : "defeat";
  const localParticipantId = resolveLocalParticipantId(
    session.participants,
    localPlayerId
  );
  const contributionRecord = resolveContributionRecord(
    session.contribution,
    localParticipantId
  );
  const resolvedAtMs = session.resolvedAt
    ? new Date(session.resolvedAt).getTime()
    : Date.now();
  const startedAtMs = session.combatStartedAt
    ? new Date(session.combatStartedAt).getTime()
    : new Date(session.createdAt).getTime();
  const durationLabel = formatDurationLabel(resolvedAtMs - startedAtMs);
  const rewards =
    outcome === "victory" ? mergeStackableRewards(boss.rewardPool) : [];

  return {
    outcome,
    title:
      outcome === "victory"
        ? `${boss.name} Defeated`
        : `${boss.name} Repelled The Raid`,
    subtitle:
      outcome === "victory"
        ? "The assault window is closed and the reward cache has been secured."
        : "The formation collapsed before the boss could be brought down.",
    durationLabel,
    totalPlayers: session.participants.length,
    rewards,
    rewardEntries: rewards.map(resolveRewardEntry),
    contribution: {
      damageDealt: contributionRecord?.damageDealt ?? 0,
      healingDone: contributionRecord?.healingDone ?? 0,
      damageTaken: contributionRecord?.damageTaken ?? 0,
      roundsParticipated: contributionRecord?.roundsParticipated ?? 0,
      roundsAlive: contributionRecord?.roundsAlive ?? 0,
      actionsCommitted: contributionRecord?.actionsCommitted ?? 0,
    },
  };
}
