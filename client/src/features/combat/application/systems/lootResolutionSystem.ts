import type { EncounterKey } from "../../../../data/encountersData";
import { encountersData } from "../../../../data/encountersData";
import type { Reward } from "../../../systems/domain/rewardTypes";
import { mergeStackableRewards } from "../../../systems/application/systems/rewardResolutionSystem";
import type {
  LootResolution,
  LootTableDefinition,
  ResolvedLootDrop,
} from "../../domain/lootTypes";
import { getLootTableMasterData } from "../../infrastructure/combatMasterDataAdapter";

function pickWeightedEntry(table: LootTableDefinition) {
  const availableEntries = table.itemEntries.filter(
    (entry) =>
      !entry.guaranteed &&
      entry.dropChance === undefined &&
      (entry.weight ?? 0) > 0
  );

  if (availableEntries.length === 0) {
    return null;
  }

  const totalWeight = availableEntries.reduce(
    (sum, entry) => sum + (entry.weight ?? 0),
    0
  );
  let roll = Math.random() * totalWeight;

  for (const entry of availableEntries) {
    roll -= entry.weight ?? 0;
    if (roll <= 0) {
      return entry;
    }
  }

  return availableEntries.at(-1) ?? null;
}

function resolveEntryAmount(tableEntry: LootTableDefinition["itemEntries"][number]) {
  const fixedAmount = Math.max(
    1,
    tableEntry.amount ??
      tableEntry.minAmount ??
      tableEntry.maxAmount ??
      1
  );

  const minAmount = Math.max(1, tableEntry.minAmount ?? fixedAmount);
  const maxAmount = Math.max(minAmount, tableEntry.maxAmount ?? fixedAmount);

  if (minAmount === maxAmount) {
    return minAmount;
  }

  return (
    Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount
  );
}

function resolveGuaranteedDrops(table: LootTableDefinition): ResolvedLootDrop[] {
  return table.itemEntries
    .filter((entry) => entry.guaranteed)
    .map((entry) => ({
      itemKey: entry.itemKey,
      amount: resolveEntryAmount(entry),
      rarity: entry.rarity,
    }));
}

function resolveChanceBasedDrops(table: LootTableDefinition): ResolvedLootDrop[] {
  return table.itemEntries
    .filter((entry) => !entry.guaranteed && entry.dropChance !== undefined)
    .flatMap((entry) => {
      const resolvedChance = Math.min(1, Math.max(0, entry.dropChance ?? 0));

      if (Math.random() > resolvedChance) {
        return [];
      }

      return [
        {
          itemKey: entry.itemKey,
          amount: resolveEntryAmount(entry),
          rarity: entry.rarity,
        },
      ];
    });
}

function resolveRolledDrops(table: LootTableDefinition): ResolvedLootDrop[] {
  const drops: ResolvedLootDrop[] = [];

  for (let index = 0; index < table.rolls; index += 1) {
    const entry = pickWeightedEntry(table);

    if (!entry) {
      continue;
    }

    drops.push({
      itemKey: entry.itemKey,
      amount: resolveEntryAmount(entry),
      rarity: entry.rarity,
    });
  }

  return drops;
}

export function resolveLootTable(table: LootTableDefinition): LootResolution {
  const drops = [
    ...resolveGuaranteedDrops(table),
    ...resolveChanceBasedDrops(table),
    ...resolveRolledDrops(table),
  ];
  const rewards: Reward[] = [
    ...(table.guaranteedRewards?.map((entry) => entry.reward) ?? []),
    ...drops.map(
      (drop): Reward => ({
        type: "item",
        itemKey: drop.itemKey,
        amount: drop.amount,
      })
    ),
  ];

  return {
    tableKey: table.key,
    sourceType: table.sourceType,
    sourceKey: table.sourceKey,
    drops,
    rewards: mergeStackableRewards(rewards),
  };
}

export function resolveEncounterLoot(
  encounterKey: EncounterKey
): LootResolution | null {
  const encounter = encountersData[encounterKey];

  if (!encounter) {
    return null;
  }

  const tableKey = encounter?.lootTableKey;
  const table = tableKey ? getLootTableMasterData(tableKey) : null;

  if (!table) {
    return null;
  }

  return resolveLootTable(table);
}
