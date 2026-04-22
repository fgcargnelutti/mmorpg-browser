import { getItemDefinition } from "../../domain/itemCatalog";
const inventoryItemVisuals = {
    coin: { glyph: "$", label: "Coin", tone: "currency" },
    sword: { glyph: "SWD", label: "Sword", tone: "equipment" },
    shield: { glyph: "SHD", label: "Shield", tone: "equipment" },
    helmet: { glyph: "HLM", label: "Helmet", tone: "equipment" },
    fish: { glyph: "FSH", label: "Fish", tone: "survival" },
    ration: { glyph: "RAT", label: "Ration", tone: "survival" },
    fruit: { glyph: "FRT", label: "Fruit", tone: "survival" },
    meat: { glyph: "MET", label: "Meat", tone: "survival" },
    stone: { glyph: "STN", label: "Stone", tone: "resource" },
    herb: { glyph: "HRB", label: "Herb", tone: "resource" },
    wood: { glyph: "WOD", label: "Wood", tone: "resource" },
    rope: { glyph: "ROP", label: "Rope", tone: "resource" },
    paper: { glyph: "DOC", label: "Paper", tone: "quest" },
    essence: { glyph: "ESS", label: "Essence", tone: "monster" },
    ore: { glyph: "ORE", label: "Ore", tone: "resource" },
    pickaxe: { glyph: "PCK", label: "Pickaxe", tone: "equipment" },
    crate: { glyph: "BOX", label: "Item", tone: "resource" },
};
function resolveFallbackVisual(category) {
    switch (category) {
        case "currency":
            return inventoryItemVisuals.coin;
        case "equipment":
        case "tool":
            return inventoryItemVisuals.sword;
        case "food":
            return inventoryItemVisuals.ration;
        case "ore":
        case "material":
            return inventoryItemVisuals.stone;
        case "monster-part":
            return inventoryItemVisuals.essence;
        case "quest":
            return inventoryItemVisuals.paper;
        default:
            return inventoryItemVisuals.crate;
    }
}
export function resolveInventoryItemView(itemKey, count) {
    const item = getItemDefinition(itemKey);
    if (!item) {
        return {
            key: itemKey,
            itemKey,
            name: itemKey,
            count,
            weight: 1,
            description: "An unidentified item recovered from the wasteland.",
            stats: ["Unknown properties"],
            category: "material",
            stackable: true,
            iconGlyph: inventoryItemVisuals.crate.glyph,
            iconImageSrc: undefined,
            iconLabel: inventoryItemVisuals.crate.label,
            iconTone: inventoryItemVisuals.crate.tone,
        };
    }
    const visual = inventoryItemVisuals[item.iconKey] ?? resolveFallbackVisual(item.category);
    return {
        key: item.key,
        itemKey: item.key,
        name: item.name,
        count,
        weight: item.weight,
        description: item.description,
        stats: item.stats,
        category: item.category,
        stackable: item.stackable,
        iconGlyph: visual.glyph,
        iconImageSrc: item.icon,
        iconLabel: visual.label,
        iconTone: visual.tone,
    };
}
export function resolveInventoryItemViews(entries) {
    return entries.map(({ itemKey, count }) => resolveInventoryItemView(itemKey, count));
}
