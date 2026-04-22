import { useMemo } from "react";
import { skillTreesData } from "../../domain/skillTreesData";
import { resolveSkillTreeNodeState } from "../systems/specializationProgressSystem";
export function useSkillTree({ skill, progress }) {
    return useMemo(() => {
        const tree = skillTreesData[skill.key];
        const nodes = tree.nodes.map((node) => ({
            ...node,
            state: resolveSkillTreeNodeState(node, skill, progress),
        }));
        return {
            tree,
            nodes,
            selectedNodeKeys: nodes
                .filter((node) => node.state === "selected")
                .map((node) => node.key),
            unlockableNodeKeys: nodes
                .filter((node) => node.state === "unlockable")
                .map((node) => node.key),
            blockedNodeKeys: nodes
                .filter((node) => node.state === "blocked-by-choice")
                .map((node) => node.key),
            lockedNodeKeys: nodes
                .filter((node) => node.state === "locked")
                .map((node) => node.key),
        };
    }, [progress, skill]);
}
