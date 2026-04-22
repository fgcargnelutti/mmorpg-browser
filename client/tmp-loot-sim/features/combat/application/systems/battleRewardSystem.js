import { getItemDefinition } from "../../../items";
import { collectRewardMessages } from "../../../systems/application/systems/rewardResolutionSystem";
import { resolveEncounterLoot } from "./lootResolutionSystem";
function formatLootSummary(encounter, lootResolution) {
    if (lootResolution.drops.length === 0) {
        return `System: ${encounter.enemyName} carried nothing of value.`;
    }
    const labels = lootResolution.drops.map((drop) => {
        const rarityPrefix = drop.rarity === "rare" || drop.rarity === "boss"
            ? `${drop.rarity.toUpperCase()} `
            : "";
        const itemLabel = getItemDefinition(drop.itemKey)?.name ?? drop.itemKey;
        return `${rarityPrefix}${drop.amount}x ${itemLabel}`;
    });
    return `System: Loot recovered from ${encounter.enemyName}: ${labels.join(", ")}.`;
}
export function resolveBattleVictoryRewards(encounter) {
    const lootResolution = resolveEncounterLoot(encounter.key);
    if (!lootResolution) {
        return {
            rewards: [],
            eventLogMessages: encounter.lootTableKey
                ? [
                    `System: Loot configuration for ${encounter.enemyName} is unavailable, so no loot was granted.`,
                ]
                : [],
            lootFound: false,
        };
    }
    return {
        rewards: lootResolution.rewards,
        lootFound: lootResolution.drops.length > 0,
        eventLogMessages: [
            formatLootSummary(encounter, lootResolution),
            ...collectRewardMessages(lootResolution.rewards),
        ],
    };
}
