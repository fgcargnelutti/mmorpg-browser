import ironOreImage from "../../../assets/items/mining/ironore.png";
import type { ItemDefinition } from "./itemTypes";

export const oreItemsData: ItemDefinition[] = [
  {
    key: "iron-ore",
    name: "Iron Ore",
    icon: ironOreImage,
    iconKey: "ore",
    weight: 1.8,
    description: "A rough iron-bearing chunk taken from a shallow seam.",
    stats: ["Mining material"],
    category: "ore",
    stackable: true,
    baseValue: 5,
    tags: ["ore", "mining"],
  },
];
