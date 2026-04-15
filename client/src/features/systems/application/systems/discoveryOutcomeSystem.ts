import type {
  DiscoveryOutcome,
  DiscoveryResolution,
} from "../../domain/discoveryOutcomeTypes";
import type { Reward } from "../../domain/rewardTypes";
import { mergeStackableRewards } from "./rewardResolutionSystem";
import { dedupeUnlocks } from "./unlockResolutionSystem";

export function resolveDiscoveryOutcomes(
  outcomes: DiscoveryOutcome[]
): DiscoveryResolution {
  const messages: string[] = [];
  const rewards: Reward[] = [];
  const unlocks: DiscoveryResolution["unlocks"] = [];
  const revealedPoiKeys: string[] = [];
  const startedQuestKeys: string[] = [];

  for (const outcome of outcomes) {
    switch (outcome.type) {
      case "reveal_poi":
        revealedPoiKeys.push(outcome.poiKey);
        if (outcome.message) messages.push(outcome.message);
        break;
      case "grant_reward":
        rewards.push(...outcome.rewards);
        break;
      case "grant_item":
        rewards.push({
          type: "item",
          itemKey: outcome.itemKey,
          amount: outcome.amount,
        });
        if (outcome.message) messages.push(outcome.message);
        break;
      case "start_quest":
        startedQuestKeys.push(outcome.questKey);
        unlocks.push({
          key: outcome.questKey,
          type: "quest",
          message: outcome.message,
        });
        break;
      case "unlock_skill":
        unlocks.push({
          key: outcome.skillKey,
          type: "skill",
          message: outcome.message,
        });
        break;
      case "unlock_structure":
        unlocks.push({
          key: outcome.structureKey,
          type: "hideout_structure",
          message: outcome.message,
        });
        break;
      case "grant_companion":
        unlocks.push({
          key: outcome.companionKey,
          type: "companion",
          message: outcome.message,
        });
        break;
      case "log_message":
        messages.push(outcome.message);
        break;
      default:
        break;
    }
  }

  return {
    messages,
    rewards: mergeStackableRewards(rewards),
    unlocks: dedupeUnlocks(unlocks),
    revealedPoiKeys: Array.from(new Set(revealedPoiKeys)),
    startedQuestKeys: Array.from(new Set(startedQuestKeys)),
  };
}
