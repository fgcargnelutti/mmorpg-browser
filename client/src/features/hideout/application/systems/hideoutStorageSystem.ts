import type { HideoutState } from "../../domain/hideoutTypes";

type HideoutStorageTransferResult = {
  didTransfer: boolean;
  nextInventory: string[];
  nextHideoutState: HideoutState;
};

function removeSingleItem(inventory: string[], itemKey: string) {
  const itemIndex = inventory.indexOf(itemKey);

  if (itemIndex === -1) {
    return null;
  }

  return [...inventory.slice(0, itemIndex), ...inventory.slice(itemIndex + 1)];
}

function addStorageItem(
  itemCounts: Record<string, number>,
  itemKey: string,
  amount: number = 1
) {
  return {
    ...itemCounts,
    [itemKey]: (itemCounts[itemKey] ?? 0) + amount,
  };
}

function removeStorageItem(
  itemCounts: Record<string, number>,
  itemKey: string,
  amount: number = 1
) {
  const currentAmount = itemCounts[itemKey] ?? 0;

  if (currentAmount < amount) {
    return null;
  }

  if (currentAmount === amount) {
    const { [itemKey]: _removed, ...remainingItems } = itemCounts;
    return remainingItems;
  }

  return {
    ...itemCounts,
    [itemKey]: currentAmount - amount,
  };
}

export function depositInventoryItemToHideoutStorage(
  hideoutState: HideoutState,
  inventory: string[],
  itemKey: string
): HideoutStorageTransferResult {
  const nextInventory = removeSingleItem(inventory, itemKey);

  if (!nextInventory) {
    return {
      didTransfer: false,
      nextInventory: inventory,
      nextHideoutState: hideoutState,
    };
  }

  if (itemKey === "gold") {
    return {
      didTransfer: true,
      nextInventory,
      nextHideoutState: {
        ...hideoutState,
        storage: {
          ...hideoutState.storage,
          gold: hideoutState.storage.gold + 1,
        },
      },
    };
  }

  return {
    didTransfer: true,
    nextInventory,
    nextHideoutState: {
      ...hideoutState,
      storage: {
        ...hideoutState.storage,
        itemCounts: addStorageItem(hideoutState.storage.itemCounts, itemKey),
      },
    },
  };
}

export function withdrawHideoutStorageItemToInventory(
  hideoutState: HideoutState,
  inventory: string[],
  itemKey: string
): HideoutStorageTransferResult {
  if (itemKey === "gold") {
    if (hideoutState.storage.gold <= 0) {
      return {
        didTransfer: false,
        nextInventory: inventory,
        nextHideoutState: hideoutState,
      };
    }

    return {
      didTransfer: true,
      nextInventory: [...inventory, "gold"],
      nextHideoutState: {
        ...hideoutState,
        storage: {
          ...hideoutState.storage,
          gold: hideoutState.storage.gold - 1,
        },
      },
    };
  }

  const nextItemCounts = removeStorageItem(hideoutState.storage.itemCounts, itemKey);

  if (!nextItemCounts) {
    return {
      didTransfer: false,
      nextInventory: inventory,
      nextHideoutState: hideoutState,
    };
  }

  return {
    didTransfer: true,
    nextInventory: [...inventory, itemKey],
    nextHideoutState: {
      ...hideoutState,
      storage: {
        ...hideoutState.storage,
        itemCounts: nextItemCounts,
      },
    },
  };
}
