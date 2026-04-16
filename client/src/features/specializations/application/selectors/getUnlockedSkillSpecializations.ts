import type { CharacterSkillSummary } from "../../../progression";
import type { SkillSpecialization } from "../../../progression";
import type { CharacterSpecializationProgressState } from "../../domain/skillTreeTypes";
import { skillTreesData } from "../../domain/skillTreesData";

type UnlockedSpecializationGroup = {
  tier: 30 | 60 | 100;
  items: SkillSpecialization[];
};

export function getUnlockedSkillSpecializations(
  skill: CharacterSkillSummary,
  progress: CharacterSpecializationProgressState
): UnlockedSpecializationGroup[] {
  const tree = skillTreesData[skill.key];
  const selectedNodeKeys = progress[skill.key].selectedNodeKeys;

  return [30, 60, 100]
    .map((tier) => {
      const items = tree.nodes
        .filter((node) => node.tier === tier && selectedNodeKeys.includes(node.key))
        .map((node) => ({
          icon: node.icon,
          title: node.title,
          description: node.description,
        }));

      return {
        tier: tier as 30 | 60 | 100,
        items,
      };
    })
    .filter((group) => group.items.length > 0);
}
