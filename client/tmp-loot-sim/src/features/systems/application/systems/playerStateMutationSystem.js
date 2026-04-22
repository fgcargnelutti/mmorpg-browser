export function countInventoryItem(inventory, itemKey) {
    return inventory.reduce((count, currentItemKey) => {
        return currentItemKey === itemKey ? count + 1 : count;
    }, 0);
}
export function countInventoryItemsByKeys(inventory, itemKeys) {
    const supportedKeys = new Set(itemKeys);
    return inventory.reduce((count, currentItemKey) => {
        return supportedKeys.has(currentItemKey) ? count + 1 : count;
    }, 0);
}
export function canSpendPlayerStamina(snapshot, amount) {
    return snapshot.stamina >= Math.max(0, amount);
}
export function spendPlayerStamina(snapshot, amount) {
    const resolvedAmount = Math.max(0, amount);
    if (resolvedAmount <= 0) {
        return snapshot;
    }
    return {
        ...snapshot,
        stamina: Math.max(0, snapshot.stamina - resolvedAmount),
    };
}
export function replacePlayerInventory(snapshot, inventory) {
    return {
        ...snapshot,
        inventory,
    };
}
export function removeInventoryItemsByPredicate(snapshot, predicate) {
    const removedItems = snapshot.inventory.filter(predicate);
    const keptItems = snapshot.inventory.filter((itemKey) => !predicate(itemKey));
    return {
        nextSnapshot: replacePlayerInventory(snapshot, keptItems),
        removedItems,
    };
}
export function consumeInventoryItemAmount(snapshot, itemKey, amount) {
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
export function consumeInventoryItemsByPriority(snapshot, itemKeys, amount) {
    const resolvedAmount = Math.max(0, amount);
    if (resolvedAmount <= 0) {
        return {
            didConsume: true,
            nextSnapshot: snapshot,
            consumedItems: [],
        };
    }
    let nextSnapshot = snapshot;
    let remainingAmount = resolvedAmount;
    const consumedItems = [];
    for (const itemKey of itemKeys) {
        if (remainingAmount <= 0) {
            break;
        }
        const availableAmount = countInventoryItem(nextSnapshot.inventory, itemKey);
        const amountToConsume = Math.min(availableAmount, remainingAmount);
        if (amountToConsume <= 0) {
            continue;
        }
        const consumption = consumeInventoryItemAmount(nextSnapshot, itemKey, amountToConsume);
        if (!consumption.didConsume) {
            return {
                didConsume: false,
                nextSnapshot: snapshot,
                consumedItems: [],
            };
        }
        nextSnapshot = consumption.nextSnapshot;
        remainingAmount -= amountToConsume;
        for (let count = 0; count < amountToConsume; count += 1) {
            consumedItems.push(itemKey);
        }
    }
    if (remainingAmount > 0) {
        return {
            didConsume: false,
            nextSnapshot: snapshot,
            consumedItems: [],
        };
    }
    return {
        didConsume: true,
        nextSnapshot,
        consumedItems,
    };
}
