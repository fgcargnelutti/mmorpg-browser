"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLootTable = resolveLootTable;
exports.resolveEncounterLoot = resolveEncounterLoot;
const encountersData_1 = require("../../../../data/encountersData");
const rewardResolutionSystem_1 = require("../../../systems/application/systems/rewardResolutionSystem");
const combatMasterDataAdapter_1 = require("../../infrastructure/combatMasterDataAdapter");
function pickWeightedEntry(table) {
    const availableEntries = table.itemEntries.filter((entry) => !entry.guaranteed &&
        entry.dropChance === undefined &&
        (entry.weight ?? 0) > 0);
    if (availableEntries.length === 0) {
        return null;
    }
    const totalWeight = availableEntries.reduce((sum, entry) => sum + (entry.weight ?? 0), 0);
    let roll = Math.random() * totalWeight;
    for (const entry of availableEntries) {
        roll -= entry.weight ?? 0;
        if (roll <= 0) {
            return entry;
        }
    }
    return availableEntries.at(-1) ?? null;
}
function resolveEntryAmount(tableEntry) {
    const fixedAmount = Math.max(1, tableEntry.amount ??
        tableEntry.minAmount ??
        tableEntry.maxAmount ??
        1);
    const minAmount = Math.max(1, tableEntry.minAmount ?? fixedAmount);
    const maxAmount = Math.max(minAmount, tableEntry.maxAmount ?? fixedAmount);
    if (minAmount === maxAmount) {
        return minAmount;
    }
    return (Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount);
}
function resolveGuaranteedDrops(table) {
    return table.itemEntries
        .filter((entry) => entry.guaranteed)
        .map((entry) => ({
        itemKey: entry.itemKey,
        amount: resolveEntryAmount(entry),
        rarity: entry.rarity,
    }));
}
function resolveChanceBasedDrops(table) {
    return table.itemEntries
        .filter((entry) => !entry.guaranteed && entry.dropChance !== undefined)
        .flatMap((entry) => {
        const resolvedChance = Math.min(1, Math.max(0, entry.dropChance ?? 0));
        if (Math.random() > resolvedChance) {
            return [];
        }
        return [
            {
                itemKey: entry.itemKey,
                amount: resolveEntryAmount(entry),
                rarity: entry.rarity,
            },
        ];
    });
}
function resolveRolledDrops(table) {
    const drops = [];
    for (let index = 0; index < table.rolls; index += 1) {
        const entry = pickWeightedEntry(table);
        if (!entry) {
            continue;
        }
        drops.push({
            itemKey: entry.itemKey,
            amount: resolveEntryAmount(entry),
            rarity: entry.rarity,
        });
    }
    return drops;
}
function resolveLootTable(table) {
    const drops = [
        ...resolveGuaranteedDrops(table),
        ...resolveChanceBasedDrops(table),
        ...resolveRolledDrops(table),
    ];
    const rewards = [
        ...(table.guaranteedRewards?.map((entry) => entry.reward) ?? []),
        ...drops.map((drop) => ({
            type: "item",
            itemKey: drop.itemKey,
            amount: drop.amount,
        })),
    ];
    return {
        tableKey: table.key,
        sourceType: table.sourceType,
        sourceKey: table.sourceKey,
        drops,
        rewards: (0, rewardResolutionSystem_1.mergeStackableRewards)(rewards),
    };
}
function resolveEncounterLoot(encounterKey) {
    const encounter = encountersData_1.encountersData[encounterKey];
    if (!encounter) {
        return null;
    }
    const tableKey = encounter?.lootTableKey;
    const table = tableKey ? (0, combatMasterDataAdapter_1.getLootTableMasterData)(tableKey) : null;
    if (!table) {
        return null;
    }
    return resolveLootTable(table);
}
