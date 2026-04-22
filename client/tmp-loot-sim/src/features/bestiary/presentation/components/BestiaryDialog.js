import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import EmptyStateNotice from "../../../../components/EmptyStateNotice";
import GameDialog from "../../../../components/GameDialog";
import SectionHeading from "../../../../components/SectionHeading";
import "./BestiaryDialog.css";
function formatList(values) {
    if (!values || values.length === 0) {
        return "Unknown";
    }
    return values.join(", ");
}
function formatDropChance(drop) {
    if (drop.dropChancePercent === undefined) {
        return null;
    }
    return `${drop.dropChancePercent}%`;
}
function getDropsByRarity(drops, rarity) {
    return drops?.filter((drop) => drop.rarity === rarity) ?? [];
}
function formatDrops(values) {
    if (!values || values.length === 0) {
        return "Unknown";
    }
    return values
        .map((entry) => {
        const chanceLabel = formatDropChance(entry);
        return chanceLabel ? `${entry.label} (${chanceLabel})` : entry.label;
    })
        .join(", ");
}
function formatTitleCase(value) {
    return value
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
export default function BestiaryDialog({ isOpen, entries, onClose, }) {
    const [selectedCreatureKey, setSelectedCreatureKey] = useState(entries[0]?.creatureKey ?? null);
    const resolvedSelectedCreatureKey = entries.some((entry) => entry.creatureKey === selectedCreatureKey)
        ? selectedCreatureKey
        : (entries[0]?.creatureKey ?? null);
    const selectedEntry = useMemo(() => entries.find((entry) => entry.creatureKey === resolvedSelectedCreatureKey) ??
        null, [entries, resolvedSelectedCreatureKey]);
    const commonDrops = selectedEntry
        ? getDropsByRarity(selectedEntry.drops, "common")
        : [];
    const uncommonDrops = selectedEntry
        ? getDropsByRarity(selectedEntry.drops, "uncommon")
        : [];
    const rareDrops = selectedEntry
        ? getDropsByRarity(selectedEntry.drops, "rare")
        : [];
    const ultraRareDrops = selectedEntry
        ? getDropsByRarity(selectedEntry.drops, "ultra-rare")
        : [];
    if (!isOpen) {
        return null;
    }
    return (_jsx("div", { className: "bestiary-dialog-anchor", children: _jsx(GameDialog, { title: "Bestiary", subtitle: "Knowledge grows with each kill. Record the creatures you survive long enough to study.", onClose: onClose, children: _jsxs("div", { className: "bestiary-dialog-layout", children: [_jsxs("aside", { className: "bestiary-dialog__list", children: [_jsxs("div", { className: "bestiary-dialog__list-header", children: [_jsx("strong", { children: "Known Creatures" }), _jsx("span", { children: entries.length })] }), entries.length > 0 ? (_jsx("div", { className: "bestiary-dialog__entries", children: entries.map((entry) => (_jsxs("button", { type: "button", className: `bestiary-entry-card${resolvedSelectedCreatureKey === entry.creatureKey
                                        ? " bestiary-entry-card--active"
                                        : ""}`, onClick: () => setSelectedCreatureKey(entry.creatureKey), children: [_jsxs("div", { className: "bestiary-entry-card__title-row", children: [_jsx("strong", { children: entry.name }), _jsxs("span", { children: [entry.killCount, "x"] })] }), _jsxs("span", { className: "bestiary-entry-card__tier", children: ["Knowledge: ", entry.unlockedTier] })] }, entry.creatureKey))) })) : (_jsx(EmptyStateNotice, { className: "bestiary-empty-state", title: "No creatures recorded yet", description: "Defeat a creature to add its first entry to the Bestiary." }))] }), _jsx("section", { className: "bestiary-dialog__detail", children: selectedEntry ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bestiary-dialog__detail-header", children: [_jsxs("div", { children: [_jsx("h4", { children: selectedEntry.name }), _jsxs("p", { children: [selectedEntry.killCount, " confirmed kills"] })] }), _jsxs("div", { className: "bestiary-dialog__meta", children: [_jsx("span", { className: "bestiary-dialog__tier-badge", children: formatTitleCase(selectedEntry.unlockedTier) }), _jsx("span", { className: "bestiary-dialog__tier-badge", children: formatTitleCase(selectedEntry.threatTier) })] })] }), _jsxs("div", { className: "bestiary-detail-scroll", children: [_jsxs("div", { className: "bestiary-detail-summary", children: [_jsxs("div", { className: "bestiary-detail-summary__item", children: [_jsx("span", { children: "Category" }), _jsx("strong", { children: formatTitleCase(selectedEntry.category) })] }), _jsxs("div", { className: "bestiary-detail-summary__item", children: [_jsx("span", { children: "Habitats" }), _jsx("strong", { children: selectedEntry.habitatTags.map(formatTitleCase).join(", ") })] }), _jsxs("div", { className: "bestiary-detail-summary__item", children: [_jsx("span", { children: "Boss Potential" }), _jsx("strong", { children: selectedEntry.isBossCandidate ? "Yes" : "No" })] })] }), _jsxs("div", { className: "bestiary-detail-section", children: [_jsx(SectionHeading, { className: "bestiary-detail-section__header", title: "Vitals" }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "HP" }), _jsx("strong", { children: selectedEntry.maxHp ?? "Unknown" })] }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "SP" }), _jsx("strong", { children: selectedEntry.maxSp ?? "Unknown" })] })] }), _jsxs("div", { className: "bestiary-detail-section", children: [_jsx(SectionHeading, { className: "bestiary-detail-section__header", title: "Loot" }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Common Drops" }), _jsx("strong", { children: formatDrops(commonDrops) })] }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Uncommon Drops" }), _jsx("strong", { children: formatDrops(uncommonDrops) })] }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Rare Drops" }), _jsx("strong", { children: formatDrops(rareDrops) })] }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Ultra Rare Drops" }), _jsx("strong", { children: formatDrops(ultraRareDrops) })] })] }), _jsxs("div", { className: "bestiary-detail-section", children: [_jsx(SectionHeading, { className: "bestiary-detail-section__header", title: "Combat Notes" }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Weaknesses" }), _jsx("strong", { children: formatList(selectedEntry.weaknesses) })] }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Resistances" }), _jsx("strong", { children: formatList(selectedEntry.resistances) })] }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Strengths" }), _jsx("strong", { children: formatList(selectedEntry.strengths) })] }), _jsxs("div", { className: "bestiary-detail-line", children: [_jsx("span", { children: "Attacks" }), _jsx("strong", { children: selectedEntry.attacks?.length
                                                                ? selectedEntry.attacks.map((attack) => attack.label).join(", ")
                                                                : "Unknown" })] })] })] }), _jsxs("div", { className: "bestiary-detail-notes", children: [_jsx("strong", { children: "Field Notes" }), selectedEntry.notes?.length ? (_jsx("ul", { children: selectedEntry.notes.map((note) => (_jsx("li", { children: note }, `${selectedEntry.creatureKey}-${note}`))) })) : (_jsx("p", { children: "Further study is required before useful notes can be recorded." }))] })] })) : (_jsx(EmptyStateNotice, { className: "bestiary-empty-state", title: "No active entry", description: "Select a known creature to inspect its unlocked knowledge." })) })] }) }) }));
}
