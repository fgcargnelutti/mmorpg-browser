import goblinEssenceImage from "../../../assets/items/essences/goblinessence.png";
import type { ItemDefinition } from "./itemTypes";

export const monsterPartItemsData: ItemDefinition[] = [
  {
    key: "goblin-essence",
    name: "Goblin Essence",
    icon: goblinEssenceImage,
    iconKey: "essence",
    weight: 0.2,
    description: "A strange residue harvested from a goblin's lingering corruption.",
    stats: ["Monster material"],
    category: "monster-part",
    stackable: true,
    baseValue: 30,
    tags: ["monster-part", "goblin", "essence"],
  },
];
