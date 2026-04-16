import type { EncounterKey } from "../../../../data/encountersData";
import type { BattleVictoryRewardResolution } from "./battleRewardSystem";

export type LootClaimRequest = {
  encounterKey: EncounterKey;
};

export type LocalLootClaimPayload = {
  encounterKey: EncounterKey;
  rewards: BattleVictoryRewardResolution["rewards"];
  lootFound: boolean;
};

export function createLootClaimRequest(
  encounterKey: EncounterKey
): LootClaimRequest {
  return {
    encounterKey,
  };
}

export function createLocalLootClaimPayload(
  encounterKey: EncounterKey,
  resolution: BattleVictoryRewardResolution
): LocalLootClaimPayload {
  // Backend seam note:
  // - Local prototype resolves loot immediately on victory.
  // - Future backend can replace this with an authoritative claim/receipt flow
  //   while the consuming UI still reads one normalized reward payload.
  return {
    encounterKey,
    rewards: resolution.rewards,
    lootFound: resolution.lootFound,
  };
}
