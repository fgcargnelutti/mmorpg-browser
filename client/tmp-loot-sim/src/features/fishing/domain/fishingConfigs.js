export const fishingConfigs = {
    "north-forest-toxic-bog": {
        key: "north-forest-toxic-bog",
        name: "Toxic Bog",
        description: "The water is foul, but something alive still thrashes below the surface.",
        difficulty: "easy",
        rewardItemKey: "fish",
        rewardAmount: 1,
        hotspot: {
            activeDurationMs: 550,
            respawnDelayMs: 250,
            validArea: {
                minXPercent: 12,
                maxXPercent: 88,
                minYPercent: 16,
                maxYPercent: 84,
            },
        },
        struggle: {
            durationMs: 5000,
            idealZoneCenter: 50,
            idealZoneSize: 26,
            fishForce: 26,
            controlForce: 38,
            centerPull: 0.8,
            tensionDrainRate: 18,
            tensionRecoverRate: 12,
            directionChangeMinMs: 380,
            directionChangeMaxMs: 760,
        },
        successLog: "You landed a river fish from the Toxic Bog.",
        failureLog: "The fish slipped away before you could secure the catch.",
    },
};
