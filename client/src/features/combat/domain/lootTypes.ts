import type { Reward } from "../../systems/domain/rewardTypes";
import type { EncounterKey } from "../../../data/encountersData";

export type LootSourceType = "creature" | "boss";
export type LootEntryRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "ultra-rare"
  | "boss";
export type LootTableId = "goblin-common" | "boss-prototype-minotaur";

export type LootItemEntry = {
  itemKey: string;
  amount?: number;
  minAmount?: number;
  maxAmount?: number;
  rarity: LootEntryRarity;
  weight?: number;
  guaranteed?: boolean;
  dropChance?: number;
};

export type LootRewardEntry = {
  reward: Reward;
  guaranteed?: boolean;
};

export type LootTableDefinition = {
  key: LootTableId;
  encounterKey?: EncounterKey;
  sourceType: LootSourceType;
  sourceKey: string;
  rolls: number;
  itemEntries: LootItemEntry[];
  guaranteedRewards?: LootRewardEntry[];
};

export type ResolvedLootDrop = {
  itemKey: string;
  amount: number;
  rarity: LootEntryRarity;
};

export type LootResolution = {
  tableKey: string;
  sourceType: LootSourceType;
  sourceKey: string;
  rewards: Reward[];
  drops: ResolvedLootDrop[];
};
