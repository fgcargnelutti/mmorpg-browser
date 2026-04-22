export function createLootClaimRequest(encounterKey) {
    return {
        encounterKey,
    };
}
export function createLocalLootClaimPayload(encounterKey, resolution) {
    // Backend seam note:
    // - Local prototype resolves loot immediately on victory.
    // - Future backend can replace this with an authoritative claim/receipt flow
    //   while the consuming UI still reads one normalized reward payload.
    return {
        encounterKey,
        rewards: resolution.rewards,
        lootFound: resolution.lootFound,
    };
}
