"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateLootTableDrops = simulateLootTableDrops;
const lootResolutionSystem_1 = require("./lootResolutionSystem");
function buildEmptyItemStats(itemKey) {
    return {
        itemKey,
        totalAmount: 0,
        dropOccurrences: 0,
        dropRatePercent: 0,
        averageAmountPerKill: 0,
        averageAmountWhenDropped: 0,
        estimatedKillsPerDrop: null,
    };
}
function aggregateDrops(drops, byItemKey) {
    for (const drop of drops) {
        const currentStats = byItemKey.get(drop.itemKey) ?? buildEmptyItemStats(drop.itemKey);
        currentStats.totalAmount += drop.amount;
        currentStats.dropOccurrences += 1;
        byItemKey.set(drop.itemKey, currentStats);
    }
}
function finalizeItemStats(byItemKey, killCount) {
    return [...byItemKey.values()]
        .map((itemStats) => {
        const dropRatePercent = (itemStats.dropOccurrences / killCount) * 100;
        const averageAmountPerKill = itemStats.totalAmount / killCount;
        const averageAmountWhenDropped = itemStats.dropOccurrences > 0
            ? itemStats.totalAmount / itemStats.dropOccurrences
            : 0;
        const estimatedKillsPerDrop = itemStats.dropOccurrences > 0
            ? killCount / itemStats.dropOccurrences
            : null;
        return {
            ...itemStats,
            dropRatePercent,
            averageAmountPerKill,
            averageAmountWhenDropped,
            estimatedKillsPerDrop,
        };
    })
        .sort((left, right) => right.dropOccurrences - left.dropOccurrences);
}
function simulateLootTableDrops(table, killCount) {
    const safeKillCount = Math.max(1, Math.floor(killCount));
    const resolutions = [];
    const byItemKey = new Map();
    for (let killIndex = 0; killIndex < safeKillCount; killIndex += 1) {
        const resolution = (0, lootResolutionSystem_1.resolveLootTable)(table);
        resolutions.push(resolution);
        aggregateDrops(resolution.drops, byItemKey);
    }
    return {
        killCount: safeKillCount,
        resolutions,
        itemStats: finalizeItemStats(byItemKey, safeKillCount),
    };
}
