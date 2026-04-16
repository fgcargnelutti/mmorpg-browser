import type { HideoutState } from "../../domain/hideoutTypes";
import type { HideoutStructureCost, HideoutStructureKey } from "../../domain/hideoutStructureTypes";

export function applyHideoutUpgrade(
  hideoutState: HideoutState,
  structureKey: HideoutStructureKey
): HideoutState {
  const structure = hideoutState.structures[structureKey];
  const nextLevel = (structure?.level ?? 0) + 1;

  return {
    ...hideoutState,
    structures: {
      ...hideoutState.structures,
      [structureKey]: {
        structureKey,
        state: "built",
        level: nextLevel,
        completedAt: new Date().toISOString(),
      },
    },
  };
}

export function consumeHideoutUpgradeCosts(
  inventory: string[],
  costs: HideoutStructureCost[]
) {
  const remainingInventory = [...inventory];

  for (const cost of costs) {
    let amountToRemove = cost.amount;

    for (let index = remainingInventory.length - 1; index >= 0; index -= 1) {
      if (remainingInventory[index] !== cost.itemKey) continue;

      remainingInventory.splice(index, 1);
      amountToRemove -= 1;

      if (amountToRemove <= 0) {
        break;
      }
    }
  }

  return remainingInventory;
}
