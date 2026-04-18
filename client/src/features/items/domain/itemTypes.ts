export type ItemCategory =
  | "currency"
  | "equipment"
  | "tool"
  | "valuable"
  | "food"
  | "ore"
  | "material"
  | "monster-part"
  | "quest";

export type ItemDefinition = {
  key: string;
  name: string;
  icon: string;
  weight: number;
  description: string;
  stats?: string[];
  category: ItemCategory;
  stackable: boolean;
  baseValue?: number;
  tags?: string[];
};

export type ItemCatalog = Record<string, ItemDefinition>;
