import { lootTablesData } from "../domain/lootTablesData";
import { simulateLootTableDrops } from "../application/systems/lootSimulationSystem";
const goblinLootTable = lootTablesData["goblin-common"];
const killCount = 1000;
const simulation = simulateLootTableDrops(goblinLootTable, killCount);
const table = simulation.itemStats.map((itemStats) => ({
    itemKey: itemStats.itemKey,
    totalAmount: itemStats.totalAmount,
    dropOccurrences: itemStats.dropOccurrences,
    dropRatePercent: Number(itemStats.dropRatePercent.toFixed(2)),
    averageAmountPerKill: Number(itemStats.averageAmountPerKill.toFixed(3)),
    averageAmountWhenDropped: Number(itemStats.averageAmountWhenDropped.toFixed(3)),
    estimatedKillsPerDrop: itemStats.estimatedKillsPerDrop === null
        ? null
        : Number(itemStats.estimatedKillsPerDrop.toFixed(2)),
}));
console.table(table);
