import type { MapId } from "../../world";

export type RegionCooperationTier = "solo" | "pair" | "group" | "crowded";

export type RegionScalingContext = {
  currentMapId: MapId;
  onlinePlayerCount: number;
};

export type RegionScalingSnapshot = {
  currentMapId: MapId;
  onlinePlayerCount: number;
  effectivePlayerCount: number;
  cooperationTier: RegionCooperationTier;
  enemyHealthMultiplier: number;
  enemyDamageMultiplier: number;
  xpMultiplier: number;
  rewardMultiplier: number;
};
