export { hideoutStructuresData } from "./domain/hideoutStructuresData";
export { hideoutUpgradeCosts } from "./domain/hideoutUpgradeCosts";
export { useHideout } from "./application/hooks/useHideout";
export {
  evaluateHideoutUpgradeEligibility,
  getNextStructureTier,
} from "./application/systems/hideoutEligibilitySystem";
export {
  applyHideoutUpgrade,
  consumeHideoutUpgradeCosts,
} from "./application/systems/hideoutUpgradeSystem";
export {
  depositInventoryItemToHideoutStorage,
  withdrawHideoutStorageItemToInventory,
} from "./application/systems/hideoutStorageSystem";
export { default as HideoutDialog } from "./presentation/components/HideoutDialog";

export type {
  HideoutState,
  HideoutStructureProgressState,
  HideoutZone,
} from "./domain/hideoutTypes";
export type {
  HideoutStorageState,
  HideoutStorageTransferPayload,
  HideoutStorageTransferSource,
} from "./domain/hideoutStorageTypes";
export type {
  HideoutStructureCost,
  HideoutStructureDefinition,
  HideoutStructureKey,
  HideoutStructureRequirement,
  HideoutStructureState,
  HideoutStructureTier,
} from "./domain/hideoutStructureTypes";
