export function applyHideoutUpgrade(hideoutState, structureKey) {
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
export function consumeHideoutUpgradeCosts(inventory, costs) {
    const remainingInventory = [...inventory];
    for (const cost of costs) {
        let amountToRemove = cost.amount;
        for (let index = remainingInventory.length - 1; index >= 0; index -= 1) {
            if (remainingInventory[index] !== cost.itemKey)
                continue;
            remainingInventory.splice(index, 1);
            amountToRemove -= 1;
            if (amountToRemove <= 0) {
                break;
            }
        }
    }
    return remainingInventory;
}
