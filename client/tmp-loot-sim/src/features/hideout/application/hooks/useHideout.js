import { useMemo, useState } from "react";
import { hideoutStructuresData } from "../../domain/hideoutStructuresData";
import { evaluateHideoutUpgradeEligibility, } from "../systems/hideoutEligibilitySystem";
import { applyHideoutUpgrade } from "../systems/hideoutUpgradeSystem";
import { depositInventoryItemToHideoutStorage, withdrawHideoutStorageItemToInventory, } from "../systems/hideoutStorageSystem";
const initialHideoutState = {
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
function countInventory(inventory) {
    return inventory.reduce((counts, itemKey) => {
        counts[itemKey] = (counts[itemKey] ?? 0) + 1;
        return counts;
    }, {});
}
export function useHideout({ inventory, playerLevel }) {
    const [hideoutState, setHideoutState] = useState(initialHideoutState);
    const inventoryCounts = useMemo(() => countInventory(inventory), [inventory]);
    const storageEntries = useMemo(() => [
        ...(hideoutState.storage.gold > 0
            ? [{ itemKey: "gold", count: hideoutState.storage.gold }]
            : []),
        ...Object.entries(hideoutState.storage.itemCounts).map(([itemKey, count]) => ({
            itemKey,
            count,
        })),
    ].sort((left, right) => left.itemKey.localeCompare(right.itemKey)), [hideoutState.storage.gold, hideoutState.storage.itemCounts]);
    const structures = useMemo(() => Object.values(hideoutStructuresData).map((definition) => {
        const progress = hideoutState.structures[definition.key];
        const eligibility = evaluateHideoutUpgradeEligibility(definition, hideoutState, inventoryCounts, playerLevel);
        return {
            definition,
            progress,
            eligibility,
        };
    }), [hideoutState, inventoryCounts, playerLevel]);
    const upgradeStructure = (structureKey) => {
        setHideoutState((previousState) => applyHideoutUpgrade(previousState, structureKey));
    };
    const depositItem = (itemKey, currentInventory) => {
        let didTransfer = false;
        let nextInventory = currentInventory;
        setHideoutState((previousState) => {
            const result = depositInventoryItemToHideoutStorage(previousState, currentInventory, itemKey);
            didTransfer = result.didTransfer;
            nextInventory = result.nextInventory;
            return result.nextHideoutState;
        });
        return {
            didTransfer,
            nextInventory,
        };
    };
    const withdrawItem = (itemKey, currentInventory) => {
        let didTransfer = false;
        let nextInventory = currentInventory;
        setHideoutState((previousState) => {
            const result = withdrawHideoutStorageItemToInventory(previousState, currentInventory, itemKey);
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
