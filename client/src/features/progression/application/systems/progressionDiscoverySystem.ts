import { resolveDiscoveryOutcomes } from "../../../systems/application/systems/discoveryOutcomeSystem";
import { createSystemMessage } from "../../../systems/application/systems/eventLogMessageSystem";
import type {
  DiscoveryOutcome,
  DiscoveryResolution,
} from "../../../systems/domain/discoveryOutcomeTypes";
import { discoverablePoisData } from "../../../world/domain/discoverablePoisData";
import type { ContextAction, LocationKey } from "../../../world/domain/locations";
import {
  loreDiscoveriesData,
  type LoreDiscoveryKey,
} from "../../domain/loreDiscoveriesData";
import { locationDiscoveriesData } from "../../domain/locationDiscoveriesData";

type ProgressionDiscoveryPlayerState = {
  learnedRumors: string[];
  revealedPois: string[];
  discoveredPois: string[];
  discoveredLocations: LocationKey[];
  discoveredLore: LoreDiscoveryKey[];
};

export type RumorDiscoveryResult = {
  resolution: DiscoveryResolution;
  revealedPoiKeys: string[];
};

export type PoiDiscoveryResult = {
  resolution: DiscoveryResolution;
  locationKey?: LocationKey;
};

export function resolveRumorDiscovery(
  rumorKey: string,
  playerState: Pick<ProgressionDiscoveryPlayerState, "learnedRumors" | "revealedPois">
): RumorDiscoveryResult | null {
  if (playerState.learnedRumors.includes(rumorKey)) {
    return null;
  }

  const poisUnlocked = Object.values(discoverablePoisData).filter(
    (poi) => poi.requiredRumorKey === rumorKey
  );
  const newlyRevealedPois = poisUnlocked.filter(
    (poi) => !playerState.revealedPois.includes(poi.key)
  );
  const revealedPoiKeys = newlyRevealedPois.map((poi) => poi.key);
  const outcomes: DiscoveryOutcome[] = [];

  for (const poi of poisUnlocked) {
    if (poi.learningMessage) {
      outcomes.push({
        type: "log_message",
        message: createSystemMessage(poi.learningMessage),
      });
    }
  }

  for (const poi of newlyRevealedPois) {
    outcomes.push({
      type: "reveal_poi",
      poiKey: poi.revealedMapPoiId ?? poi.locationKey ?? poi.key,
    });

    if (poi.xpReward && poi.xpReward > 0) {
      outcomes.push({
        type: "grant_reward",
        rewards: [
          {
            type: "xp",
            amount: poi.xpReward,
            reason: poi.xpReason,
          },
        ],
      });
    }
  }

  return {
    resolution: resolveDiscoveryOutcomes(outcomes),
    revealedPoiKeys,
  };
}

export function applyRumorDiscoveryState<T extends ProgressionDiscoveryPlayerState>(
  playerState: T,
  rumorKey: string,
  revealedPoiKeys: string[]
): T {
  if (playerState.learnedRumors.includes(rumorKey)) {
    return playerState;
  }

  return {
    ...playerState,
    learnedRumors: [...playerState.learnedRumors, rumorKey],
    revealedPois: [...playerState.revealedPois, ...revealedPoiKeys],
  };
}

export function resolvePoiDiscovery(
  poiKey: string,
  playerState: Pick<ProgressionDiscoveryPlayerState, "discoveredPois" | "discoveredLocations">
): PoiDiscoveryResult | null {
  if (playerState.discoveredPois.includes(poiKey)) {
    return null;
  }

  const poi = discoverablePoisData[poiKey as keyof typeof discoverablePoisData];
  const outcomes: DiscoveryOutcome[] = [
    {
      type: "discover_poi",
      poiKey: poi.revealedMapPoiId ?? poi.locationKey ?? poi.key,
    },
    {
      type: "log_message",
      message: createSystemMessage(poi.discoveryMessage),
    },
  ];

  if (poi.xpReward && poi.xpReward > 0) {
    outcomes.push({
      type: "grant_reward",
      rewards: [
        {
          type: "xp",
          amount: poi.xpReward,
          reason: poi.xpReason,
        },
      ],
    });
  }

  return {
    resolution: resolveDiscoveryOutcomes(outcomes),
    locationKey: poi.locationKey,
  };
}

export function applyPoiDiscoveryState<T extends ProgressionDiscoveryPlayerState>(
  playerState: T,
  poiKey: string,
  locationKey?: LocationKey
): T {
  if (playerState.discoveredPois.includes(poiKey)) {
    return playerState;
  }

  return {
    ...playerState,
    discoveredPois: [...playerState.discoveredPois, poiKey],
    discoveredLocations:
      locationKey && !playerState.discoveredLocations.includes(locationKey)
        ? [...playerState.discoveredLocations, locationKey]
        : playerState.discoveredLocations,
  };
}

export function resolveLocationDiscovery(
  nextLocation: LocationKey,
  playerState: Pick<ProgressionDiscoveryPlayerState, "discoveredLocations">
): DiscoveryResolution | null {
  if (playerState.discoveredLocations.includes(nextLocation)) {
    return null;
  }

  const discoveryData = locationDiscoveriesData[nextLocation];
  const outcomes: DiscoveryOutcome[] = [
    {
      type: "discover_location",
      locationKey: nextLocation,
    },
  ];

  if (discoveryData?.xpReward && discoveryData.xpReward > 0) {
    outcomes.push({
      type: "grant_reward",
      rewards: [
        {
          type: "xp",
          amount: discoveryData.xpReward,
          reason: discoveryData.xpReason,
        },
      ],
    });
  }

  return resolveDiscoveryOutcomes(outcomes);
}

export function applyLocationDiscoveryState<T extends ProgressionDiscoveryPlayerState>(
  playerState: T,
  nextLocation: LocationKey
): T {
  if (playerState.discoveredLocations.includes(nextLocation)) {
    return playerState;
  }

  return {
    ...playerState,
    discoveredLocations: [...playerState.discoveredLocations, nextLocation],
  };
}

export function findMatchingLoreDiscovery(
  currentLocation: LocationKey,
  action: Pick<ContextAction, "label">
) {
  return Object.values(loreDiscoveriesData).find(
    (loreDiscovery) =>
      loreDiscovery.locationKey === currentLocation &&
      action.label.toLowerCase().includes(loreDiscovery.actionMatch)
  );
}
