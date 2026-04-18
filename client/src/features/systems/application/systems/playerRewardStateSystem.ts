import type { Reward } from "../../domain/rewardTypes";
import { getItemDefinition } from "../../../items";

export type RewardPlayerSnapshot = {
  inventory: string[];
  totalXp: number;
  stamina: number;
  maxStamina: number;
};

export function applyRewardsToPlayerSnapshot<T extends RewardPlayerSnapshot>(
  snapshot: T,
  rewards: Reward[]
): T {
  const nextInventory = [...snapshot.inventory];
  let nextTotalXp = snapshot.totalXp;
  let nextStamina = snapshot.stamina;

  for (const reward of rewards) {
    if (reward.type === "item") {
      if (reward.amount <= 0 || !getItemDefinition(reward.itemKey)) {
        continue;
      }

      for (let count = 0; count < reward.amount; count += 1) {
        nextInventory.push(reward.itemKey);
      }
      continue;
    }

    if (reward.type === "gold") {
      if (reward.amount <= 0) {
        continue;
      }

      for (let count = 0; count < reward.amount; count += 1) {
        nextInventory.push("gold");
      }
      continue;
    }

    if (reward.type === "xp") {
      if (reward.amount <= 0) {
        continue;
      }

      nextTotalXp += reward.amount;
      continue;
    }

    if (reward.type === "stamina") {
      if (reward.amount <= 0) {
        continue;
      }

      nextStamina = Math.min(snapshot.maxStamina, nextStamina + reward.amount);
    }
  }

  return {
    ...snapshot,
    inventory: nextInventory,
    totalXp: nextTotalXp,
    stamina: nextStamina,
  };
}
