export type HideoutStorageState = {
  gold: number;
  itemCounts: Record<string, number>;
  capacitySlots?: number | null;
};

export type HideoutStorageTransferSource = "inventory" | "storage";

export type HideoutStorageTransferPayload = {
  itemKey: string;
  source: HideoutStorageTransferSource;
};

// Source-of-truth note:
// - Local prototype: storage contents can live in local hideout state.
// - Future backend: item ownership, gold balances, transfer validation,
//   storage limits, and anti-duplication rules should be server-authoritative.
