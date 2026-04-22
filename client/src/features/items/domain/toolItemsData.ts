import healthPotionImage from "../../../assets/items/potions/healthpotion.png";
import manaPotionImage from "../../../assets/items/potions/manapotion.png";
import staminaPotionImage from "../../../assets/items/potions/staminapotion.png";
import pickaxeImage from "../../../assets/items/equipments/tools/pickaxe.png";
import type { ItemDefinition } from "./itemTypes";

export const toolItemsData: ItemDefinition[] = [
  {
    key: "life-potion",
    name: "Life Potion",
    icon: healthPotionImage,
    iconKey: "life-potion",
    weight: 0.4,
    description: "A compact restorative vial used to recover health in combat.",
    stats: ["Consumable", "Restores HP"],
    category: "tool",
    stackable: true,
    baseValue: 10,
    tags: ["potion", "combat", "healing"],
  },
  {
    key: "mana-potion",
    name: "Mana Potion",
    icon: manaPotionImage,
    iconKey: "mana-potion",
    weight: 0.4,
    description: "A blue tonic that restores spiritual power during battle.",
    stats: ["Consumable", "Restores SP"],
    category: "tool",
    stackable: true,
    baseValue: 10,
    tags: ["potion", "combat", "mana"],
  },
  {
    key: "variable-potion",
    name: "Variable Potion",
    icon: staminaPotionImage,
    iconKey: "variable-potion",
    weight: 0.4,
    description: "An unstable mixture that supports hybrid recovery in combat.",
    stats: ["Consumable", "Hybrid recovery"],
    category: "tool",
    stackable: true,
    baseValue: 12,
    tags: ["potion", "combat", "hybrid"],
  },
  {
    key: "pickaxe",
    name: "Pickaxe",
    icon: pickaxeImage,
    iconKey: "pickaxe",
    weight: 3.2,
    description: "A practical mining tool that can still fetch a fair price.",
    stats: ["Tool item"],
    category: "tool",
    stackable: false,
    baseValue: 14,
    tags: ["tool", "mining"],
  },
];
