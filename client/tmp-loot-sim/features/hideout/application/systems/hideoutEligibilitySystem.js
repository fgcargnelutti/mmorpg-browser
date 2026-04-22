function getStructureLevel(hideoutState, structureKey) {
    return hideoutState.structures[structureKey]?.level ?? 0;
}
function checkRequirement(requirement, hideoutState, playerLevel = 1) {
    switch (requirement.type) {
        case "player_level":
            return playerLevel >= requirement.value;
        case "quest_completed":
            return false;
        case "structure_level":
            return getStructureLevel(hideoutState, requirement.structureKey) >= requirement.level;
        default:
            return false;
    }
}
export function getNextStructureTier(definition, currentLevel) {
    return definition.tiers.find((tier) => tier.level === currentLevel + 1) ?? null;
}
export function getMissingCosts(costs, inventoryCounts) {
    return costs.filter((cost) => (inventoryCounts[cost.itemKey] ?? 0) < cost.amount);
}
export function evaluateHideoutUpgradeEligibility(definition, hideoutState, inventoryCounts, playerLevel = 1) {
    const currentLevel = getStructureLevel(hideoutState, definition.key);
    const nextTier = getNextStructureTier(definition, currentLevel);
    if (!nextTier) {
        return {
            canUpgrade: false,
            reasons: ["Maximum level reached."],
            missingCosts: [],
            nextTier: null,
        };
    }
    const missingCosts = getMissingCosts(nextTier.buildCosts, inventoryCounts);
    const unmetRequirements = (nextTier.requirements ?? []).filter((requirement) => !checkRequirement(requirement, hideoutState, playerLevel));
    const reasons = [
        ...missingCosts.map((cost) => `Need ${cost.amount}x ${cost.itemKey}.`),
        ...unmetRequirements.map((requirement) => {
            if (requirement.type === "structure_level") {
                return `Requires ${requirement.structureKey} level ${requirement.level}.`;
            }
            if (requirement.type === "player_level") {
                return `Requires player level ${requirement.value}.`;
            }
            return `Requires quest ${requirement.questKey}.`;
        }),
    ];
    return {
        canUpgrade: missingCosts.length === 0 && unmetRequirements.length === 0,
        reasons,
        missingCosts,
        nextTier,
    };
}
