import type { LocationKey } from "../../../world/domain/locations";
import type { LoreDiscoveryKey } from "../../domain/loreDiscoveriesData";

export type PersistedWorldProgressionPayload = {
  version: 1;
  currentLocation: LocationKey;
  discoveredLocations: LocationKey[];
  discoveredLore: LoreDiscoveryKey[];
  learnedRumors: string[];
  revealedPois: string[];
  discoveredPois: string[];
};

type WorldProgressionState = {
  currentLocation: LocationKey;
  discoveredLocations: LocationKey[];
  discoveredLore: LoreDiscoveryKey[];
  learnedRumors: string[];
  revealedPois: string[];
  discoveredPois: string[];
};

export function serializeWorldProgression(
  state: WorldProgressionState
): PersistedWorldProgressionPayload {
  return {
    version: 1,
    currentLocation: state.currentLocation,
    discoveredLocations: state.discoveredLocations,
    discoveredLore: state.discoveredLore,
    learnedRumors: state.learnedRumors,
    revealedPois: state.revealedPois,
    discoveredPois: state.discoveredPois,
  };
}

export function deserializeWorldProgression(
  payload: PersistedWorldProgressionPayload | null | undefined,
  fallbackState: WorldProgressionState
): WorldProgressionState {
  if (!payload || payload.version !== 1) {
    return fallbackState;
  }

  return {
    currentLocation: payload.currentLocation,
    discoveredLocations: payload.discoveredLocations,
    discoveredLore: payload.discoveredLore,
    learnedRumors: payload.learnedRumors,
    revealedPois: payload.revealedPois,
    discoveredPois: payload.discoveredPois,
  };
}
