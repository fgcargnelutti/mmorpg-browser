import { hideoutStructuresData } from "./hideoutStructuresData";
export const hideoutUpgradeCosts = {
    house: Object.fromEntries(hideoutStructuresData.house.tiers.map((tier) => [tier.level, tier.buildCosts])),
    bed: Object.fromEntries(hideoutStructuresData.bed.tiers.map((tier) => [tier.level, tier.buildCosts])),
    worktable: Object.fromEntries(hideoutStructuresData.worktable.tiers.map((tier) => [tier.level, tier.buildCosts])),
    forge: Object.fromEntries(hideoutStructuresData.forge.tiers.map((tier) => [tier.level, tier.buildCosts])),
};
