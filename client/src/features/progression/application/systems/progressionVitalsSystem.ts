import { collectRewardMessages } from "../../../systems/application/systems/rewardResolutionSystem";
import {
  createDamageReceivedMessage,
  createLevelUpMessage,
  createSystemMessage,
  createXpGainMessage,
} from "../../../systems/application/systems/eventLogMessageSystem";
import type { Reward } from "../../../systems/domain/rewardTypes";
import { getLevelFromTotalXp } from "../../../../data/experienceTable";

type DamageablePlayerState = {
  currentHp: number;
};

export function applyPlayerDamageState<T extends DamageablePlayerState>(
  playerState: T,
  damage: number
): T {
  if (damage <= 0) {
    return playerState;
  }

  return {
    ...playerState,
    currentHp: Math.max(0, playerState.currentHp - damage),
  };
}

export function createDamageTakenMessages(damage: number, reason?: string) {
  if (damage <= 0) {
    return [];
  }

  return [createDamageReceivedMessage(damage, reason)];
}

export function createRewardApplicationMessages(
  previousTotalXp: number,
  rewards: Reward[],
  leadingMessages: string[] = []
) {
  const xpReward = rewards.reduce((total, reward) => {
    return reward.type === "xp" ? total + reward.amount : total;
  }, 0);
  const previousLevel = getLevelFromTotalXp(previousTotalXp);
  const nextLevel = getLevelFromTotalXp(previousTotalXp + xpReward);
  const rewardMessages = collectRewardMessages(rewards);
  const messages = [...leadingMessages, ...rewardMessages];

  if (xpReward > 0 && nextLevel > previousLevel) {
    messages.push(createLevelUpMessage(nextLevel));
  }

  return messages;
}

export function createXpGainMessages(
  previousTotalXp: number,
  amount: number,
  reason: string
) {
  if (amount <= 0) {
    return [];
  }

  return createRewardApplicationMessages(
    previousTotalXp,
    [
      {
        type: "xp",
        amount,
        reason,
      },
    ],
    [createXpGainMessage(amount, reason)]
  );
}

export function createLoreDiscoveryMessages(
  previousTotalXp: number,
  discoveryMessage: string,
  xpReward: number,
  xpReason: string
) {
  return createRewardApplicationMessages(
    previousTotalXp,
    [
      {
        type: "xp",
        amount: xpReward,
        reason: xpReason,
      },
    ],
    [createSystemMessage(discoveryMessage), createXpGainMessage(xpReward, xpReason)]
  );
}
