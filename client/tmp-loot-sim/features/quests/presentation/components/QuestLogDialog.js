import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import EmptyStateNotice from "../../../../components/EmptyStateNotice";
import GameDialog from "../../../../components/GameDialog";
import SectionHeading from "../../../../components/SectionHeading";
import { inventoryCatalog } from "../../../../data/inventoryCatalog";
import "./QuestLogDialog.css";
function formatStateLabel(state) {
    return state.replace("-", " ");
}
function getProgressSummary(entry) {
    const objectives = entry.quest.objectives;
    const objectiveProgress = entry.progressState?.objectiveProgress ?? {};
    const completedObjectives = objectives.filter((objective) => {
        const progress = objectiveProgress[objective.key];
        return progress?.state === "completed";
    }).length;
    if (entry.state === "available") {
        return "Ready to accept";
    }
    if (entry.state === "completed") {
        return entry.isRewardClaimed ? "Reward claimed" : "Return for reward";
    }
    return `${completedObjectives}/${objectives.length} objectives completed`;
}
function getCurrentObjectiveText(entry) {
    if (entry.state === "completed") {
        return entry.isRewardClaimed
            ? "This contract has already been settled."
            : "Return to the source NPC to collect the reward.";
    }
    const objectiveProgress = entry.progressState?.objectiveProgress ?? {};
    const nextObjective = entry.quest.objectives.find((objective) => {
        const progress = objectiveProgress[objective.key];
        return !progress || progress.state !== "completed";
    });
    return nextObjective?.description ?? entry.quest.description;
}
function getQuestSourceLabel(entry) {
    switch (entry.quest.source.type) {
        case "npc":
            return `Source: NPC ${entry.quest.source.npcKey}`;
        case "poi":
            return `Source: PoI ${entry.quest.source.poiKey}`;
        case "item":
            return `Source: Item ${entry.quest.source.itemKey}`;
        case "discovery":
            return `Source: Discovery ${entry.quest.source.discoveryKey}`;
        case "system":
            return `Source: ${entry.quest.source.key}`;
        default:
            return "Source: Unknown";
    }
}
function getRewardPreview(entry) {
    const rewards = entry.quest.rewards ?? [];
    if (rewards.length === 0) {
        return "No reward registered yet";
    }
    return rewards
        .map((reward) => {
        if (reward.type === "xp") {
            return `${reward.amount} XP`;
        }
        if (reward.type === "gold") {
            return `${reward.amount} Gold`;
        }
        if (reward.type === "item") {
            return `${reward.amount}x ${inventoryCatalog[reward.itemKey]?.name ?? reward.itemKey}`;
        }
        if (reward.type === "stamina") {
            return `${reward.amount} Stamina`;
        }
        if (reward.type === "message") {
            return "Narrative reward";
        }
        return reward.unlockKey;
    })
        .join(" • ");
}
function getTurnInStatus(entry) {
    if (entry.state === "available") {
        return "Turn-in: Accept this contract to begin progress";
    }
    if (entry.state === "active") {
        return "Turn-in: Objective still in progress";
    }
    if (entry.state === "completed" && entry.isRewardClaimed) {
        return "Turn-in: Reward already claimed";
    }
    if (entry.state === "completed") {
        return entry.canClaimRewards
            ? "Turn-in: Return to the source to claim rewards"
            : "Turn-in: Completed";
    }
    return "Turn-in: Not available";
}
function getStatusClassName(state) {
    switch (state) {
        case "available":
            return "quest-log-status quest-log-status--available";
        case "active":
            return "quest-log-status quest-log-status--active";
        case "completed":
            return "quest-log-status quest-log-status--completed";
        default:
            return "quest-log-status";
    }
}
function resolveQuestSection(quest) {
    return quest.logSection ?? "lore";
}
export default function QuestLogDialog({ isOpen, onClose, entries, }) {
    if (!isOpen) {
        return null;
    }
    const dailyEntries = entries.filter((entry) => resolveQuestSection(entry.quest) === "daily");
    const loreEntries = entries.filter((entry) => resolveQuestSection(entry.quest) === "lore");
    const huntEntries = entries.filter((entry) => resolveQuestSection(entry.quest) === "hunt");
    const sections = [
        {
            id: "daily",
            label: "Daily Tasks",
            summary: "Repeatable work, routine requests, and future rotating objectives.",
            entries: dailyEntries,
            emptyState: "No daily tasks are available yet in this prototype slice.",
        },
        {
            id: "lore",
            label: "Lore Quests",
            summary: "Longer story-driven leads tied to discoveries, NPCs, and the world's broader progression.",
            entries: loreEntries,
            emptyState: "No lore quests are currently visible here.",
        },
        {
            id: "hunt",
            label: "Hunt Contracts",
            summary: "Targeted contracts focused on hostile creatures, field threats, and regional pressure.",
            entries: huntEntries,
            emptyState: "No hunt contracts are currently available.",
        },
    ];
    return (_jsx("div", { className: "quest-log-dialog-anchor", children: _jsx(GameDialog, { title: "Quest Log", subtitle: "Track available work, active objectives, and completed contracts without tying quest rules to the panel itself.", onClose: onClose, children: _jsxs("div", { className: "quest-log-dialog", children: [_jsxs("div", { className: "quest-log-dialog__overview", children: [_jsxs("div", { className: "quest-log-dialog__overview-item", children: [_jsx("span", { children: "Available" }), _jsx("strong", { children: entries.filter((entry) => entry.state === "available").length })] }), _jsxs("div", { className: "quest-log-dialog__overview-item", children: [_jsx("span", { children: "In Progress" }), _jsx("strong", { children: entries.filter((entry) => entry.state === "active").length })] }), _jsxs("div", { className: "quest-log-dialog__overview-item", children: [_jsx("span", { children: "Completed" }), _jsx("strong", { children: entries.filter((entry) => entry.state === "completed").length })] })] }), _jsx("div", { className: "quest-log-dialog__sections", children: sections.map((section) => (_jsxs("section", { className: "quest-log-section", children: [_jsx(SectionHeading, { className: "quest-log-section__header", title: section.label, description: section.summary }), _jsx("div", { className: "quest-log-section__entries", children: section.entries.length > 0 ? (section.entries.map((entry) => (_jsxs("article", { className: "quest-log-entry", children: [_jsxs("div", { className: "quest-log-entry__topline", children: [_jsx("strong", { children: entry.quest.title }), _jsx("span", { className: getStatusClassName(entry.state), children: formatStateLabel(entry.state) })] }), _jsx("div", { className: "quest-log-entry__source", children: _jsx("span", { children: getQuestSourceLabel(entry) }) }), _jsxs("div", { className: "quest-log-entry__meta", children: [_jsx("span", { children: getProgressSummary(entry) }), _jsx("span", { children: getTurnInStatus(entry) })] }), _jsx("p", { children: entry.quest.description }), _jsx("div", { className: "quest-log-entry__divider" }), _jsxs("div", { className: "quest-log-entry__detail-row", children: [_jsx("span", { className: "quest-log-entry__detail-label", children: "Current objective" }), _jsx("small", { children: getCurrentObjectiveText(entry) })] }), _jsxs("div", { className: "quest-log-entry__detail-row", children: [_jsx("span", { className: "quest-log-entry__detail-label", children: "Reward preview" }), _jsx("small", { children: getRewardPreview(entry) })] })] }, entry.quest.key)))) : (_jsx(EmptyStateNotice, { className: "quest-log-section__empty", title: "Nothing here yet", description: section.emptyState })) })] }, section.id))) })] }) }) }));
}
