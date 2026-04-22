export const miningConfigs = {
    "southwest-farm-small-hill": {
        key: "southwest-farm-small-hill",
        name: "Small Hill",
        description: "A weathered rock seam breaks through the hillside, offering a quick mining opportunity.",
        difficulty: "easy",
        rewardItemKey: "iron-ore",
        rewardAmount: 1,
        weakPoint: {
            activeDurationMs: 720,
            respawnDelayMs: 190,
            sizePx: 58,
            validArea: {
                minXPercent: 14,
                maxXPercent: 86,
                minYPercent: 18,
                maxYPercent: 84,
            },
        },
        session: {
            durationMs: 6500,
            targetProgress: 100,
            hitProgress: 20,
            missPenalty: 6,
            idleDecayPerSecond: 1.6,
        },
        successLog: "You break free a usable chunk of iron ore from the Small Hill seam.",
        failureLog: "The weak points slip away before you can crack the seam open.",
    },
};
