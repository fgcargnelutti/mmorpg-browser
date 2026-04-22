import { skillCatalog, } from "../../progression";
function buildTierNodes(skillKey, tier, specializations) {
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
function buildSkillTreeDefinition(skill) {
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
export const skillTreesData = {
    survival: buildSkillTreeDefinition(skillCatalog.survival),
    melee: buildSkillTreeDefinition(skillCatalog.melee),
    archery: buildSkillTreeDefinition(skillCatalog.archery),
    stealth: buildSkillTreeDefinition(skillCatalog.stealth),
    arcane: buildSkillTreeDefinition(skillCatalog.arcane),
};
