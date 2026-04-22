import { resolveDiscoveryOutcomes } from "../../../systems/application/systems/discoveryOutcomeSystem";
import { createSystemMessage } from "../../../systems/application/systems/eventLogMessageSystem";
import { discoverablePoisData } from "../../../world/domain/discoverablePoisData";
import { loreDiscoveriesData, } from "../../domain/loreDiscoveriesData";
import { locationDiscoveriesData } from "../../domain/locationDiscoveriesData";
export function resolveRumorDiscovery(rumorKey, playerState) {
    if (playerState.learnedRumors.includes(rumorKey)) {
        return null;
    }
    const poisUnlocked = Object.values(discoverablePoisData).filter((poi) => poi.requiredRumorKey === rumorKey);
    const newlyRevealedPois = poisUnlocked.filter((poi) => !playerState.revealedPois.includes(poi.key));
    const revealedPoiKeys = newlyRevealedPois.map((poi) => poi.key);
    const outcomes = [];
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
export function applyRumorDiscoveryState(playerState, rumorKey, revealedPoiKeys) {
    if (playerState.learnedRumors.includes(rumorKey)) {
        return playerState;
    }
    return {
        ...playerState,
        learnedRumors: [...playerState.learnedRumors, rumorKey],
        revealedPois: [...playerState.revealedPois, ...revealedPoiKeys],
    };
}
export function resolvePoiDiscovery(poiKey, playerState) {
    if (playerState.discoveredPois.includes(poiKey)) {
        return null;
    }
    const poi = discoverablePoisData[poiKey];
    const outcomes = [
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
export function applyPoiDiscoveryState(playerState, poiKey, locationKey) {
    if (playerState.discoveredPois.includes(poiKey)) {
        return playerState;
    }
    return {
        ...playerState,
        discoveredPois: [...playerState.discoveredPois, poiKey],
        discoveredLocations: locationKey && !playerState.discoveredLocations.includes(locationKey)
            ? [...playerState.discoveredLocations, locationKey]
            : playerState.discoveredLocations,
    };
}
export function resolveLocationDiscovery(nextLocation, playerState) {
    if (playerState.discoveredLocations.includes(nextLocation)) {
        return null;
    }
    const discoveryData = locationDiscoveriesData[nextLocation];
    const outcomes = [
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
export function applyLocationDiscoveryState(playerState, nextLocation) {
    if (playerState.discoveredLocations.includes(nextLocation)) {
        return playerState;
    }
    return {
        ...playerState,
        discoveredLocations: [...playerState.discoveredLocations, nextLocation],
    };
}
export function findMatchingLoreDiscovery(currentLocation, action) {
    return Object.values(loreDiscoveriesData).find((loreDiscovery) => loreDiscovery.locationKey === currentLocation &&
        action.label.toLowerCase().includes(loreDiscovery.actionMatch));
}
