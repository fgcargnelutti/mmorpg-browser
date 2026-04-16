export type PersistedInventoryEntry = {
  itemKey: string;
  count: number;
};

export type PersistedInventoryPayload = {
  version: 1;
  gold: number;
  items: PersistedInventoryEntry[];
};

export function serializePlayerInventory(
  inventory: string[]
): PersistedInventoryPayload {
  const itemCounts = inventory.reduce<Record<string, number>>((counts, itemKey) => {
    counts[itemKey] = (counts[itemKey] ?? 0) + 1;
    return counts;
  }, {});

  const gold = itemCounts.gold ?? 0;
  const { gold: _gold, ...nonGoldCounts } = itemCounts;
  const items = Object.entries(nonGoldCounts)
    .filter(([, count]) => count > 0)
    .map(([itemKey, count]) => ({
      itemKey,
      count,
    }))
    .sort((left, right) => left.itemKey.localeCompare(right.itemKey));

  // Backend seam note:
  // - The local UI still uses a flat inventory string array.
  // - This payload normalizes that client shape into a backend-friendly ownership
  //   snapshot with explicit gold and item counts.
  return {
    version: 1,
    gold,
    items,
  };
}

export function deserializePlayerInventory(
  payload: PersistedInventoryPayload | null | undefined
): string[] {
  if (!payload || payload.version !== 1) {
    return [];
  }

  const inventory: string[] = [];

  for (let count = 0; count < Math.max(0, payload.gold); count += 1) {
    inventory.push("gold");
  }

  for (const entry of payload.items) {
    for (let count = 0; count < Math.max(0, entry.count); count += 1) {
      inventory.push(entry.itemKey);
    }
  }

  return inventory;
}
