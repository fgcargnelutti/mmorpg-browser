import { talentTreesData } from "../../domain/talentTreesData";
export function createInitialTalentProgressState() {
    return {
        unlockedNodeKeys: [],
    };
}
export function getEarnedTalentPoints(characterLevel) {
    return Math.floor(characterLevel / 5);
}
export function getAvailableTalentPoints(characterLevel, progress) {
    return Math.max(0, getEarnedTalentPoints(characterLevel) - progress.unlockedNodeKeys.length);
}
function resolveTalentNodeState(node, progress, characterLevel) {
    if (progress.unlockedNodeKeys.includes(node.key)) {
        return "unlocked";
    }
    if (characterLevel < node.unlockLevel) {
        return "locked";
    }
    const prerequisites = node.prerequisites ?? [];
    if (prerequisites.some((prerequisite) => !progress.unlockedNodeKeys.includes(prerequisite))) {
        return "locked";
    }
    if (getAvailableTalentPoints(characterLevel, progress) <= 0) {
        return "locked";
    }
    return "unlockable";
}
export function buildTalentTreeSnapshots(progress, characterLevel) {
    return talentTreesData.map((archetype) => ({
        archetype,
        nodes: archetype.nodes.map((node) => ({
            ...node,
            state: resolveTalentNodeState(node, progress, characterLevel),
        })),
    }));
}
export function unlockTalentNode(progress, nodeKey, characterLevel) {
    if (progress.unlockedNodeKeys.includes(nodeKey)) {
        return progress;
    }
    const node = talentTreesData.flatMap((archetype) => archetype.nodes).find((entry) => entry.key === nodeKey);
    if (!node) {
        return progress;
    }
    const nodeState = resolveTalentNodeState(node, progress, characterLevel);
    if (nodeState !== "unlockable") {
        return progress;
    }
    return {
        ...progress,
        unlockedNodeKeys: [...progress.unlockedNodeKeys, nodeKey],
    };
}
