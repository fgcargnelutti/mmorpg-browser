import { getItemDefinition } from "../../domain/itemCatalog";
import type { ItemCategory } from "../../domain/itemTypes";

export type InventoryItemVisualTone =
  | "currency"
  | "equipment"
  | "survival"
  | "resource"
  | "quest"
  | "monster";

export type InventoryItemView = {
  key: string;
  itemKey: string;
  name: string;
  count: number;
  weight: number;
  description: string;
  stats?: string[];
  category: ItemCategory;
  stackable: boolean;
  iconGlyph: string;
  iconLabel: string;
  iconTone: InventoryItemVisualTone;
};

type InventoryItemVisualDefinition = {
  glyph: string;
  label: string;
  tone: InventoryItemVisualTone;
};

const inventoryItemVisuals: Record<string, InventoryItemVisualDefinition> = {
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

function resolveFallbackVisual(category: ItemCategory): InventoryItemVisualDefinition {
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

export function resolveInventoryItemView(
  itemKey: string,
  count: number
): InventoryItemView {
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
      iconLabel: inventoryItemVisuals.crate.label,
      iconTone: inventoryItemVisuals.crate.tone,
    };
  }

  const visual =
    inventoryItemVisuals[item.iconKey] ?? resolveFallbackVisual(item.category);

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
    iconLabel: visual.label,
    iconTone: visual.tone,
  };
}

export function resolveInventoryItemViews(
  entries: Array<{ itemKey: string; count: number }>
) {
  return entries.map(({ itemKey, count }) =>
    resolveInventoryItemView(itemKey, count)
  );
}
