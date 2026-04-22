export const sharedRegenConfig = {
    stamina: {
        amount: 1,
        intervalMs: 144_000,
    },
    offlineStamina: {
        amount: 1,
        intervalMs: 120_000,
    },
};
export const classRegenConfig = {
    "wasteland-warrior": {
        hp: {
            amount: 1,
            intervalMs: 3_000,
        },
        sp: {
            amount: 1,
            intervalMs: 12_000,
        },
    },
    thief: {
        hp: {
            amount: 1,
            intervalMs: 6_000,
        },
        sp: {
            amount: 1,
            intervalMs: 6_000,
        },
    },
    arcanist: {
        hp: {
            amount: 1,
            intervalMs: 12_000,
        },
        sp: {
            amount: 1,
            intervalMs: 2_000,
        },
    },
};
export function resolveCharacterRegenConfig(classKey) {
    return {
        ...classRegenConfig[classKey],
        ...sharedRegenConfig,
    };
}
