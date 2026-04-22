export function createInitialSkillUnlockState(definition) {
    return {
        skillKey: definition.skillKey,
        state: definition.state ?? "locked",
    };
}
export function applySkillUnlockDescriptor(unlockStates, unlock) {
    if (unlock.type !== "skill") {
        return unlockStates;
    }
    return unlockStates.map((unlockState) => {
        if (unlockState.skillKey !== unlock.key) {
            return unlockState;
        }
        if (unlockState.state === "unlocked") {
            return unlockState;
        }
        return {
            ...unlockState,
            state: "unlocked",
            unlockedAt: unlockState.unlockedAt ?? new Date().toISOString(),
        };
    });
}
export function unlockSkillBySource(unlockStates, skillKey, source) {
    return unlockStates.map((unlockState) => {
        if (unlockState.skillKey !== skillKey) {
            return unlockState;
        }
        if (unlockState.state === "unlocked") {
            return unlockState;
        }
        return {
            ...unlockState,
            state: "unlocked",
            unlockedAt: unlockState.unlockedAt ?? new Date().toISOString(),
            discoveredBy: source,
        };
    });
}
