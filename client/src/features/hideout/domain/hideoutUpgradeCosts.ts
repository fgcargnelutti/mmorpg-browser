import type { HideoutStructureKey } from "./hideoutStructureTypes";
import { hideoutStructuresData } from "./hideoutStructuresData";

export const hideoutUpgradeCosts: Record<
  HideoutStructureKey,
  Record<number, { itemKey: string; amount: number }[]>
> = {
  house: Object.fromEntries(
    hideoutStructuresData.house.tiers.map((tier) => [tier.level, tier.buildCosts])
  ) as Record<number, { itemKey: string; amount: number }[]>,
  bed: Object.fromEntries(
    hideoutStructuresData.bed.tiers.map((tier) => [tier.level, tier.buildCosts])
  ) as Record<number, { itemKey: string; amount: number }[]>,
  worktable: Object.fromEntries(
    hideoutStructuresData.worktable.tiers.map((tier) => [tier.level, tier.buildCosts])
  ) as Record<number, { itemKey: string; amount: number }[]>,
  forge: Object.fromEntries(
    hideoutStructuresData.forge.tiers.map((tier) => [tier.level, tier.buildCosts])
  ) as Record<number, { itemKey: string; amount: number }[]>,
};
