export type StaminaPlayerSnapshot = {
  stamina: number;
  maxStamina: number;
};

export type InventoryPlayerSnapshot = {
  inventory: string[];
};

export function countInventoryItem(
  inventory: string[],
  itemKey: string
) {
  return inventory.reduce((count, currentItemKey) => {
    return currentItemKey === itemKey ? count + 1 : count;
  }, 0);
}

export function canSpendPlayerStamina(
  snapshot: Pick<StaminaPlayerSnapshot, "stamina">,
  amount: number
) {
  return snapshot.stamina >= Math.max(0, amount);
}

export function spendPlayerStamina<T extends Pick<StaminaPlayerSnapshot, "stamina">>(
  snapshot: T,
  amount: number
): T {
  const resolvedAmount = Math.max(0, amount);

  if (resolvedAmount <= 0) {
    return snapshot;
  }

  return {
    ...snapshot,
    stamina: Math.max(0, snapshot.stamina - resolvedAmount),
  };
}

export function replacePlayerInventory<T extends InventoryPlayerSnapshot>(
  snapshot: T,
  inventory: string[]
): T {
  return {
    ...snapshot,
    inventory,
  };
}

export function removeInventoryItemsByPredicate<T extends InventoryPlayerSnapshot>(
  snapshot: T,
  predicate: (itemKey: string) => boolean
): {
  nextSnapshot: T;
  removedItems: string[];
} {
  const removedItems = snapshot.inventory.filter(predicate);
  const keptItems = snapshot.inventory.filter((itemKey) => !predicate(itemKey));

  return {
    nextSnapshot: replacePlayerInventory(snapshot, keptItems),
    removedItems,
  };
}

export function consumeInventoryItemAmount<T extends InventoryPlayerSnapshot>(
  snapshot: T,
  itemKey: string,
  amount: number
): {
  didConsume: boolean;
  nextSnapshot: T;
} {
  const resolvedAmount = Math.max(0, amount);

  if (resolvedAmount <= 0) {
    return {
      didConsume: true,
      nextSnapshot: snapshot,
    };
  }

  let amountToRemove = resolvedAmount;
  const nextInventory = [...snapshot.inventory];

  for (let index = nextInventory.length - 1; index >= 0; index -= 1) {
    if (nextInventory[index] !== itemKey) {
      continue;
    }

    nextInventory.splice(index, 1);
    amountToRemove -= 1;

    if (amountToRemove <= 0) {
      break;
    }
  }

  if (amountToRemove > 0) {
    return {
      didConsume: false,
      nextSnapshot: snapshot,
    };
  }

  return {
    didConsume: true,
    nextSnapshot: replacePlayerInventory(snapshot, nextInventory),
  };
}
