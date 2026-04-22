export function createInitialSpecializationProgressState() {
    return {
        survival: { selectedNodeKeys: [] },
        melee: { selectedNodeKeys: [] },
        archery: { selectedNodeKeys: [] },
        stealth: { selectedNodeKeys: [] },
        arcane: { selectedNodeKeys: [] },
    };
}
function hasSelectedTierNode(progress, skillKey, tier) {
    return progress[skillKey].selectedNodeKeys.some((nodeKey) => nodeKey.startsWith(`${skillKey}-tier-${tier}-`));
}
export function resolveSkillTreeNodeState(node, skill, progress) {
    if (progress[skill.key].selectedNodeKeys.includes(node.key)) {
        return "selected";
    }
    if (skill.level < node.unlockLevel) {
        return "locked";
    }
    if (hasSelectedTierNode(progress, skill.key, node.tier)) {
        return "blocked-by-choice";
    }
    return "unlockable";
}
export function selectSpecializationNode(progress, skill, tree, nodeKey) {
    const node = tree.nodes.find((entry) => entry.key === nodeKey);
    if (!node) {
        return progress;
    }
    const state = resolveSkillTreeNodeState(node, skill, progress);
    if (state !== "unlockable") {
        return progress;
    }
    return {
        ...progress,
        [skill.key]: {
            selectedNodeKeys: [...progress[skill.key].selectedNodeKeys, node.key],
        },
    };
}
