// Persistence / backend seam note:
// - The frontend prototype still owns hideout state locally.
// - Future backend authority should replace this adapter's implementation,
//   while consumers continue to read/write one normalized hideout payload shape.
export function serializeHideoutState(hideoutState) {
    return {
        version: 1,
        hideoutKey: hideoutState.hideoutKey,
        unlocked: hideoutState.unlocked,
        storage: {
            gold: hideoutState.storage.gold,
            itemCounts: hideoutState.storage.itemCounts,
            capacitySlots: hideoutState.storage.capacitySlots ?? null,
        },
        structures: Object.values(hideoutState.structures).map((structure) => ({
            structureKey: structure.structureKey,
            state: structure.state,
            level: structure.level,
            startedAt: structure.startedAt,
            completedAt: structure.completedAt,
        })),
    };
}
export function deserializeHideoutState(payload, fallbackState) {
    if (!payload || payload.version !== 1 || payload.hideoutKey !== fallbackState.hideoutKey) {
        return fallbackState;
    }
    const nextStructures = { ...fallbackState.structures };
    for (const structure of payload.structures) {
        if (!(structure.structureKey in nextStructures)) {
            continue;
        }
        nextStructures[structure.structureKey] = {
            structureKey: structure.structureKey,
            state: structure.state,
            level: Math.max(0, structure.level),
            startedAt: structure.startedAt,
            completedAt: structure.completedAt,
        };
    }
    return {
        ...fallbackState,
        unlocked: payload.unlocked,
        storage: {
            gold: Math.max(0, payload.storage.gold),
            itemCounts: payload.storage.itemCounts,
            capacitySlots: payload.storage.capacitySlots ?? null,
        },
        structures: nextStructures,
    };
}
export function createHideoutStorageTransferRequest(hideoutKey, transfer, quantity = 1) {
    return {
        hideoutKey,
        itemKey: transfer.itemKey,
        source: transfer.source,
        quantity: Math.max(1, quantity),
    };
}
