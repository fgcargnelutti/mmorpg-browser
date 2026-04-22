import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import GameDialog from "../../../../components/GameDialog";
import StatusIcon from "../../../../components/StatusIcon";
import { skillTreesData } from "../../domain/skillTreesData";
import { resolveSkillTreeNodeState } from "../../application/systems/specializationProgressSystem";
import "./SkillTreeDialog.css";
function formatTierLabel(tier) {
    return `Level ${tier}`;
}
export default function SkillTreeDialog({ isOpen, characterLevel, skills, specializationProgress, talentTrees, talentPointsEarned, talentPointsSpent, talentPointsAvailable, onClose, onUnlockTalent, onSelectSpecialization, }) {
    const [activeTab, setActiveTab] = useState("talents");
    const specializationRows = useMemo(() => skills.map((skill) => ({
        skill,
        tree: skillTreesData[skill.key],
        nodes: skillTreesData[skill.key].nodes.map((node) => ({
            ...node,
            state: resolveSkillTreeNodeState(node, skill, specializationProgress),
        })),
    })), [skills, specializationProgress]);
    if (!isOpen) {
        return null;
    }
    return (_jsx("div", { className: "skill-tree-dialog-anchor", children: _jsx(GameDialog, { title: "Skill Tree", subtitle: "Shape your character through level-based talents and learn-by-doing specializations.", onClose: onClose, children: _jsxs("div", { className: "skill-tree-dialog", children: [_jsxs("div", { className: "skill-tree-tabs", children: [_jsx("button", { type: "button", className: `skill-tree-tab${activeTab === "talents" ? " is-active" : ""}`, onClick: () => setActiveTab("talents"), children: "Talents" }), _jsx("button", { type: "button", className: `skill-tree-tab${activeTab === "specializations" ? " is-active" : ""}`, onClick: () => setActiveTab("specializations"), children: "Specializations" })] }), activeTab === "talents" ? (_jsxs("div", { className: "skill-tree-content", children: [_jsxs("div", { className: "skill-tree-summary", children: [_jsxs("div", { className: "skill-tree-summary__item", children: [_jsx("span", { children: "Character Level" }), _jsx("strong", { children: characterLevel })] }), _jsxs("div", { className: "skill-tree-summary__item", children: [_jsx("span", { children: "Talent Points Earned" }), _jsx("strong", { children: talentPointsEarned })] }), _jsxs("div", { className: "skill-tree-summary__item", children: [_jsx("span", { children: "Points Spent" }), _jsx("strong", { children: talentPointsSpent })] }), _jsxs("div", { className: "skill-tree-summary__item", children: [_jsx("span", { children: "Available Now" }), _jsx("strong", { children: talentPointsAvailable })] })] }), _jsx("div", { className: "skill-tree-talents", children: talentTrees.map(({ archetype, nodes }) => (_jsxs("section", { className: "talent-branch", children: [_jsxs("div", { className: "talent-branch__header", children: [_jsx("h4", { children: archetype.label }), _jsx("p", { children: archetype.description })] }), _jsxs("div", { className: "talent-branch__grid", children: [nodes.map((node) => (_jsxs("button", { type: "button", className: `talent-node talent-node--${node.state}`, style: {
                                                        gridColumn: node.gridColumn,
                                                        gridRow: node.gridRow,
                                                    }, onClick: () => onUnlockTalent(node.key), disabled: node.state !== "unlockable", children: [_jsx("strong", { children: node.title }), _jsx("span", { children: node.description }), _jsx("small", { children: node.state === "unlocked"
                                                                ? "Unlocked"
                                                                : node.state === "unlockable"
                                                                    ? "Spend 1 point"
                                                                    : `Requires Lv. ${node.unlockLevel}` })] }, node.key))), _jsx("div", { className: "talent-link talent-link--left", "aria-hidden": "true" }), _jsx("div", { className: "talent-link talent-link--right", "aria-hidden": "true" }), _jsx("div", { className: "talent-link talent-link--down", "aria-hidden": "true" })] })] }, archetype.key))) })] })) : (_jsxs("div", { className: "skill-tree-content", children: [_jsxs("div", { className: "skill-tree-specializations", children: [_jsxs("div", { className: "specialization-table specialization-table--header", children: [_jsx("div", { children: "Skill" }), _jsx("div", { children: formatTierLabel(30) }), _jsx("div", { children: formatTierLabel(60) }), _jsx("div", { children: formatTierLabel(100) })] }), specializationRows.map(({ skill, tree, nodes: skillNodes }) => (_jsxs("div", { className: "specialization-table specialization-table--row", children: [_jsxs("div", { className: "specialization-skill-cell", children: [_jsx("strong", { children: skill.name }), _jsx("span", { children: tree.tooltip })] }), [30, 60, 100].map((tier) => {
                                                const nodes = skillNodes.filter((node) => node.tier === tier);
                                                return (_jsxs("div", { className: `specialization-tier-cell${nodes.some((node) => node.state === "selected")
                                                        ? " is-selected"
                                                        : nodes.some((node) => node.state === "unlockable")
                                                            ? " is-unlockable"
                                                            : skill.level >= tier
                                                                ? " is-unlocked"
                                                                : ""}`, children: [_jsx("div", { className: "specialization-tier-cell__label", children: nodes.some((node) => node.state === "selected")
                                                                ? "Chosen"
                                                                : nodes.some((node) => node.state === "unlockable")
                                                                    ? "Choose 1"
                                                                    : skill.level >= tier
                                                                        ? "Available"
                                                                        : `Requires Lv. ${tier}` }), _jsx("div", { className: "specialization-tier-cell__icons", children: nodes.map((node) => (_jsxs("button", { type: "button", className: `skill-tree-specialization-choice skill-tree-specialization-choice--${node.state}`, onClick: () => onSelectSpecialization(skill.key, node.key), disabled: node.state !== "unlockable", children: [_jsx(StatusIcon, { icon: node.icon, label: node.title, description: node.description, active: node.state !== "locked", variant: "specialization", size: "md" }), _jsx("span", { children: node.title })] }, node.key))) })] }, `${skill.key}-${tier}`));
                                            })] }, skill.key)))] }), _jsxs("div", { className: "skill-tree-note", children: [_jsx("strong", { children: "Current quick view" }), _jsx("p", { children: "The compact Skills panel only shows specializations you already own. Use this complete window to inspect every future branch." })] })] }))] }) }) }));
}
