import type { HideoutStorageState } from "./hideoutStorageTypes";
import type {
  HideoutStructureKey,
  HideoutStructureState,
} from "./hideoutStructureTypes";

export type HideoutZone = "outskirts" | "forest" | "rural" | "underground";

export type HideoutStructureProgressState = {
  structureKey: HideoutStructureKey;
  state: HideoutStructureState;
  level: number;
  startedAt?: string;
  completedAt?: string;
};

export type HideoutState = {
  hideoutKey: string;
  name: string;
  zone: HideoutZone;
  unlocked: boolean;
  storage: HideoutStorageState;
  structures: Record<HideoutStructureKey, HideoutStructureProgressState>;
};

// Source-of-truth note:
// - Local prototype: hideout state can live in client progression/session state.
// - Future backend: structure ownership, upgrade validation, costs, and timers
//   should be persisted and validated server-side.
