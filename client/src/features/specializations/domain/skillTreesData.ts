import {
  skillCatalog,
  type SkillDefinition,
  type SkillKey,
} from "../../progression";
import type {
  SkillTreeDefinition,
  SkillTreeNodeDefinition,
  SkillTreeTier,
} from "./skillTreeTypes";

function buildTierNodes(
  skillKey: SkillKey,
  tier: SkillTreeTier,
  specializations: SkillDefinition["tier30" | "tier60" | "tier100"]
): SkillTreeNodeDefinition[] {
  return specializations.map((specialization, index) => ({
    key: `${skillKey}-tier-${tier}-${index + 1}`,
    skillKey,
    tier,
    title: specialization.title,
    description: specialization.description,
    icon: specialization.icon,
    unlockLevel: tier,
    state: "locked",
    effects: [
      {
        type: "specialization",
        specializationKey: specialization.title.toLowerCase().replaceAll(" ", "-"),
      },
    ],
  }));
}

function buildSkillTreeDefinition(skill: SkillDefinition): SkillTreeDefinition {
  return {
    skillKey: skill.key,
    skillName: skill.name,
    tooltip: skill.tooltip,
    nodes: [
      ...buildTierNodes(skill.key, 30, skill.tier30),
      ...buildTierNodes(skill.key, 60, skill.tier60),
      ...buildTierNodes(skill.key, 100, skill.tier100),
    ],
  };
}

export const skillTreesData: Record<SkillKey, SkillTreeDefinition> = {
  survival: buildSkillTreeDefinition(skillCatalog.survival),
  melee: buildSkillTreeDefinition(skillCatalog.melee),
  archery: buildSkillTreeDefinition(skillCatalog.archery),
  stealth: buildSkillTreeDefinition(skillCatalog.stealth),
  arcane: buildSkillTreeDefinition(skillCatalog.arcane),
};
