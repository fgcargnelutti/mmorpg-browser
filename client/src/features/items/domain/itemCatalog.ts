import { currencyItemsData } from "./currencyItemsData";
import { equipmentItemsData } from "./equipmentItemsData";
import { foodItemsData } from "./foodItemsData";
import { materialItemsData } from "./materialItemsData";
import { monsterPartItemsData } from "./monsterPartItemsData";
import { oreItemsData } from "./oreItemsData";
import { toolItemsData } from "./toolItemsData";
import { valuableItemsData } from "./valuableItemsData";
import type { ItemCatalog, ItemCategory, ItemDefinition } from "./itemTypes";

export const itemDefinitions: ItemDefinition[] = [
  ...currencyItemsData,
  ...equipmentItemsData,
  ...foodItemsData,
  ...materialItemsData,
  ...monsterPartItemsData,
  ...oreItemsData,
  ...toolItemsData,
  ...valuableItemsData,
];

export const itemCatalog: ItemCatalog = itemDefinitions.reduce<ItemCatalog>(
  (catalog, item) => {
    catalog[item.key] = item;
    return catalog;
  },
  {}
);

export const itemDefinitionsByCategory: Record<ItemCategory, ItemDefinition[]> = {
  currency: currencyItemsData,
  equipment: equipmentItemsData,
  tool: toolItemsData,
  valuable: valuableItemsData,
  food: foodItemsData,
  ore: oreItemsData,
  material: materialItemsData,
  "monster-part": monsterPartItemsData,
  quest: itemDefinitions.filter((item) => item.category === "quest"),
};

export function getItemDefinition(itemKey: string) {
  return itemCatalog[itemKey] ?? null;
}
