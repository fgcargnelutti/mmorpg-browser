import type { CharacterSkillSummary } from "../../../progression";
import type { SkillTreeNodeDefinition, SkillTreeNodeState } from "../../domain/skillTreeTypes";
import { skillTreesData } from "../../domain/skillTreesData";

function resolveNodeState(
  node: SkillTreeNodeDefinition,
  skillLevel: number
): SkillTreeNodeState {
  if (skillLevel >= node.unlockLevel) {
    return "unlockable";
  }

  return "locked";
}

export function getSkillTreeNodes(skillSummary: CharacterSkillSummary) {
  const tree = skillTreesData[skillSummary.key];

  return tree.nodes.map((node) => ({
    ...node,
    state: resolveNodeState(node, skillSummary.level),
  }));
}
