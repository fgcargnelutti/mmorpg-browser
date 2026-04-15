export type FishingSpotKey = "north-forest-toxic-bog";

export type FishingHotspotConfig = {
  activeDurationMs: number;
  respawnDelayMs: number;
  validArea: {
    minXPercent: number;
    maxXPercent: number;
    minYPercent: number;
    maxYPercent: number;
  };
};

export type FishingStruggleConfig = {
  durationMs: number;
  idealZoneCenter: number;
  idealZoneSize: number;
  fishForce: number;
  controlForce: number;
  centerPull: number;
  tensionDrainRate: number;
  tensionRecoverRate: number;
  directionChangeMinMs: number;
  directionChangeMaxMs: number;
};

export type FishingDifficulty = "easy" | "medium" | "hard";

export type FishingSpotConfig = {
  key: FishingSpotKey;
  name: string;
  description: string;
  difficulty: FishingDifficulty;
  rewardItemKey: string;
  rewardAmount: number;
  hotspot: FishingHotspotConfig;
  struggle: FishingStruggleConfig;
  successLog: string;
  failureLog: string;
};

export const fishingConfigs: Record<FishingSpotKey, FishingSpotConfig> = {
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
