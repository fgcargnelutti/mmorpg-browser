export function serializeWorldProgression(state) {
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
export function deserializeWorldProgression(payload, fallbackState) {
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
