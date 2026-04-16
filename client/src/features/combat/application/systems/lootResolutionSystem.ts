import type { EncounterKey } from "../../../../data/encountersData";
import type { Reward } from "../../../systems/domain/rewardTypes";
import { mergeStackableRewards } from "../../../systems/application/systems/rewardResolutionSystem";
import { lootTablesData } from "../../domain/lootTablesData";
import type {
  LootResolution,
  LootTableDefinition,
  ResolvedLootDrop,
} from "../../domain/lootTypes";

function pickWeightedEntry(table: LootTableDefinition) {
  const availableEntries = table.itemEntries.filter(
    (entry) => !entry.guaranteed && (entry.weight ?? 0) > 0
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

function resolveGuaranteedDrops(table: LootTableDefinition): ResolvedLootDrop[] {
  return table.itemEntries
    .filter((entry) => entry.guaranteed)
    .map((entry) => ({
      itemKey: entry.itemKey,
      amount: entry.amount,
      rarity: entry.rarity,
    }));
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
      amount: entry.amount,
      rarity: entry.rarity,
    });
  }

  return drops;
}

export function resolveLootTable(table: LootTableDefinition): LootResolution {
  const drops = [...resolveGuaranteedDrops(table), ...resolveRolledDrops(table)];
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
  const table = lootTablesData[encounterKey];

  if (!table) {
    return null;
  }

  return resolveLootTable(table);
}
