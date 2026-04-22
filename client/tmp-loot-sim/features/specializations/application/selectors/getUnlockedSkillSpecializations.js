import { skillTreesData } from "../../domain/skillTreesData";
export function getUnlockedSkillSpecializations(skill, progress) {
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
            tier: tier,
            items,
        };
    })
        .filter((group) => group.items.length > 0);
}
