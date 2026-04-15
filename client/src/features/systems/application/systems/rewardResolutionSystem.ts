import type { ItemReward, Reward } from "../../domain/rewardTypes";

function isItemReward(reward: Reward): reward is ItemReward {
  return reward.type === "item";
}

export function mergeStackableRewards(rewards: Reward[]): Reward[] {
  const mergedItems = new Map<string, ItemReward>();
  const mergedRewards: Reward[] = [];

  for (const reward of rewards) {
    if (!isItemReward(reward)) {
      mergedRewards.push(reward);
      continue;
    }

    const current = mergedItems.get(reward.itemKey);

    if (!current) {
      mergedItems.set(reward.itemKey, { ...reward });
      continue;
    }

    current.amount += reward.amount;
  }

  return [...mergedRewards, ...mergedItems.values()];
}

export function collectRewardMessages(rewards: Reward[]): string[] {
  return rewards.flatMap((reward) => {
    if (reward.type === "message") {
      return [reward.message];
    }

    if (reward.type === "item") {
      return [`You obtained ${reward.amount}x ${reward.itemKey}.`];
    }

    if (reward.type === "xp") {
      return reward.reason
        ? [`You gained ${reward.amount} XP. (${reward.reason})`]
        : [`You gained ${reward.amount} XP.`];
    }

    if (reward.type === "gold") {
      return [`You received ${reward.amount} gold.`];
    }

    if (reward.type === "stamina") {
      return [`You recovered ${reward.amount} stamina.`];
    }

    if (reward.type === "unlock") {
      return reward.reason
        ? [reward.reason]
        : [`You unlocked ${reward.unlockKey}.`];
    }

    return [];
  });
}
