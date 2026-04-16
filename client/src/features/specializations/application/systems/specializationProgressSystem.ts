import type { CharacterSkillSummary } from "../../../progression";
import type {
  CharacterSpecializationProgressState,
  SkillTreeDefinition,
  SkillTreeNodeDefinition,
  SkillTreeNodeState,
} from "../../domain/skillTreeTypes";

export function createInitialSpecializationProgressState(): CharacterSpecializationProgressState {
  return {
    survival: { selectedNodeKeys: [] },
    melee: { selectedNodeKeys: [] },
    archery: { selectedNodeKeys: [] },
    stealth: { selectedNodeKeys: [] },
    arcane: { selectedNodeKeys: [] },
  };
}

function hasSelectedTierNode(
  progress: CharacterSpecializationProgressState,
  skillKey: CharacterSkillSummary["key"],
  tier: 30 | 60 | 100
) {
  return progress[skillKey].selectedNodeKeys.some((nodeKey) =>
    nodeKey.startsWith(`${skillKey}-tier-${tier}-`)
  );
}

export function resolveSkillTreeNodeState(
  node: SkillTreeNodeDefinition,
  skill: CharacterSkillSummary,
  progress: CharacterSpecializationProgressState
): SkillTreeNodeState {
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

export function selectSpecializationNode(
  progress: CharacterSpecializationProgressState,
  skill: CharacterSkillSummary,
  tree: SkillTreeDefinition,
  nodeKey: string
) {
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
