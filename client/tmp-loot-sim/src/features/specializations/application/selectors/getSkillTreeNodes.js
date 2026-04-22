import { skillTreesData } from "../../domain/skillTreesData";
function resolveNodeState(node, skillLevel) {
    if (skillLevel >= node.unlockLevel) {
        return "unlockable";
    }
    return "locked";
}
export function getSkillTreeNodes(skillSummary) {
    const tree = skillTreesData[skillSummary.key];
    return tree.nodes.map((node) => ({
        ...node,
        state: resolveNodeState(node, skillSummary.level),
    }));
}
