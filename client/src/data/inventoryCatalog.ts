import {
  itemCatalog,
  type ItemDefinition,
} from "../features/items";

export type InventoryCatalogItem = ItemDefinition;

// Compatibility layer for existing callers. The authoritative source now lives
// under `features/items`, where item domains are split by category and ready
// for future backend-driven synchronization.
export const inventoryCatalog = itemCatalog;
