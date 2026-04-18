import type { HideoutStorageTransferPayload } from "../domain/hideoutStorageTypes";
import type { HideoutStructureKey } from "../domain/hideoutStructureTypes";
import type { HideoutState } from "../domain/hideoutTypes";

export type PersistedHideoutStructureEntry = {
  structureKey: HideoutStructureKey;
  state: HideoutState["structures"][HideoutStructureKey]["state"];
  level: number;
  startedAt?: string;
  completedAt?: string;
};

export type PersistedHideoutPayload = {
  version: 1;
  hideoutKey: string;
  unlocked: boolean;
  storage: {
    gold: number;
    itemCounts: Record<string, number>;
    capacitySlots?: number | null;
  };
  structures: PersistedHideoutStructureEntry[];
};

export type HideoutStorageTransferRequest = HideoutStorageTransferPayload & {
  hideoutKey: string;
  quantity: number;
};

// Persistence / backend seam note:
// - The frontend prototype still owns hideout state locally.
// - Future backend authority should replace this adapter's implementation,
//   while consumers continue to read/write one normalized hideout payload shape.
export function serializeHideoutState(
  hideoutState: HideoutState
): PersistedHideoutPayload {
  return {
    version: 1,
    hideoutKey: hideoutState.hideoutKey,
    unlocked: hideoutState.unlocked,
    storage: {
      gold: hideoutState.storage.gold,
      itemCounts: hideoutState.storage.itemCounts,
      capacitySlots: hideoutState.storage.capacitySlots ?? null,
    },
    structures: Object.values(hideoutState.structures).map((structure) => ({
      structureKey: structure.structureKey,
      state: structure.state,
      level: structure.level,
      startedAt: structure.startedAt,
      completedAt: structure.completedAt,
    })),
  };
}

export function deserializeHideoutState(
  payload: PersistedHideoutPayload | null | undefined,
  fallbackState: HideoutState
): HideoutState {
  if (!payload || payload.version !== 1 || payload.hideoutKey !== fallbackState.hideoutKey) {
    return fallbackState;
  }

  const nextStructures = { ...fallbackState.structures };

  for (const structure of payload.structures) {
    if (!(structure.structureKey in nextStructures)) {
      continue;
    }

    nextStructures[structure.structureKey] = {
      structureKey: structure.structureKey,
      state: structure.state,
      level: Math.max(0, structure.level),
      startedAt: structure.startedAt,
      completedAt: structure.completedAt,
    };
  }

  return {
    ...fallbackState,
    unlocked: payload.unlocked,
    storage: {
      gold: Math.max(0, payload.storage.gold),
      itemCounts: payload.storage.itemCounts,
      capacitySlots: payload.storage.capacitySlots ?? null,
    },
    structures: nextStructures,
  };
}

export function createHideoutStorageTransferRequest(
  hideoutKey: string,
  transfer: HideoutStorageTransferPayload,
  quantity: number = 1
): HideoutStorageTransferRequest {
  return {
    hideoutKey,
    itemKey: transfer.itemKey,
    source: transfer.source,
    quantity: Math.max(1, quantity),
  };
}
