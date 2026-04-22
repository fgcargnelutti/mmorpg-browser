export function createQuestEventsFromDiscoveryResolution(resolution) {
    return [
        ...resolution.revealedPoiKeys.map((poiKey) => ({
            type: "reveal_poi",
            poiKey,
        })),
        ...resolution.discoveredPoiKeys.map((poiKey) => ({
            type: "poi",
            poiKey,
        })),
        ...resolution.discoveredLocationKeys.map((locationKey) => ({
            type: "poi",
            poiKey: locationKey,
        })),
    ];
}
export function mergeQuestProgressEvents(...eventGroups) {
    const merged = eventGroups.flat();
    const deduped = new Map();
    for (const event of merged) {
        deduped.set(JSON.stringify(event), event);
    }
    return Array.from(deduped.values());
}
