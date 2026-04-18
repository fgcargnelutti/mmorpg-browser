import type { ItemDefinition } from "./itemTypes";

export const toolItemsData: ItemDefinition[] = [
  {
    key: "pickaxe",
    name: "Pickaxe",
    icon: "Pick",
    weight: 3.2,
    description: "A practical mining tool that can still fetch a fair price.",
    stats: ["Tool item"],
    category: "tool",
    stackable: false,
    baseValue: 14,
    tags: ["tool", "mining"],
  },
];
