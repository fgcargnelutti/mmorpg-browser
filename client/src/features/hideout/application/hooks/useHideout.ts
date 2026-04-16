import { useMemo, useState } from "react";
import { hideoutStructuresData } from "../../domain/hideoutStructuresData";
import type { HideoutState } from "../../domain/hideoutTypes";
import type { HideoutStructureKey } from "../../domain/hideoutStructureTypes";
import {
  evaluateHideoutUpgradeEligibility,
} from "../systems/hideoutEligibilitySystem";
import { applyHideoutUpgrade } from "../systems/hideoutUpgradeSystem";
import {
  depositInventoryItemToHideoutStorage,
  withdrawHideoutStorageItemToInventory,
} from "../systems/hideoutStorageSystem";

type UseHideoutParams = {
  inventory: string[];
  playerLevel: number;
};

const initialHideoutState: HideoutState = {
  hideoutKey: "southwest-hideout",
  name: "Southwest Hideout",
  zone: "rural",
  unlocked: true,
  storage: {
    gold: 0,
    itemCounts: {},
    capacitySlots: null,
  },
  structures: {
    house: {
      structureKey: "house",
      state: "available",
      level: 0,
    },
    bed: {
      structureKey: "bed",
      state: "locked",
      level: 0,
    },
    worktable: {
      structureKey: "worktable",
      state: "locked",
      level: 0,
    },
    forge: {
      structureKey: "forge",
      state: "locked",
      level: 0,
    },
  },
};

function countInventory(inventory: string[]) {
  return inventory.reduce<Record<string, number>>((counts, itemKey) => {
    counts[itemKey] = (counts[itemKey] ?? 0) + 1;
    return counts;
  }, {});
}

export function useHideout({ inventory, playerLevel }: UseHideoutParams) {
  const [hideoutState, setHideoutState] = useState<HideoutState>(initialHideoutState);
  const inventoryCounts = useMemo(() => countInventory(inventory), [inventory]);
  const storageEntries = useMemo(
    () =>
      [
        ...(hideoutState.storage.gold > 0
          ? [{ itemKey: "gold", count: hideoutState.storage.gold }]
          : []),
        ...Object.entries(hideoutState.storage.itemCounts).map(([itemKey, count]) => ({
          itemKey,
          count,
        })),
      ].sort((left, right) => left.itemKey.localeCompare(right.itemKey)),
    [hideoutState.storage.gold, hideoutState.storage.itemCounts]
  );

  const structures = useMemo(
    () =>
      Object.values(hideoutStructuresData).map((definition) => {
        const progress = hideoutState.structures[definition.key];
        const eligibility = evaluateHideoutUpgradeEligibility(
          definition,
          hideoutState,
          inventoryCounts,
          playerLevel
        );

        return {
          definition,
          progress,
          eligibility,
        };
      }),
    [hideoutState, inventoryCounts, playerLevel]
  );

  const upgradeStructure = (structureKey: HideoutStructureKey) => {
    setHideoutState((previousState) => applyHideoutUpgrade(previousState, structureKey));
  };

  const depositItem = (itemKey: string, currentInventory: string[]) => {
    let didTransfer = false;
    let nextInventory = currentInventory;

    setHideoutState((previousState) => {
      const result = depositInventoryItemToHideoutStorage(
        previousState,
        currentInventory,
        itemKey
      );

      didTransfer = result.didTransfer;
      nextInventory = result.nextInventory;
      return result.nextHideoutState;
    });

    return {
      didTransfer,
      nextInventory,
    };
  };

  const withdrawItem = (itemKey: string, currentInventory: string[]) => {
    let didTransfer = false;
    let nextInventory = currentInventory;

    setHideoutState((previousState) => {
      const result = withdrawHideoutStorageItemToInventory(
        previousState,
        currentInventory,
        itemKey
      );

      didTransfer = result.didTransfer;
      nextInventory = result.nextInventory;
      return result.nextHideoutState;
    });

    return {
      didTransfer,
      nextInventory,
    };
  };

  return {
    hideoutState,
    structures,
    inventoryCounts,
    storageEntries,
    upgradeStructure,
    depositItem,
    withdrawItem,
  };
}
