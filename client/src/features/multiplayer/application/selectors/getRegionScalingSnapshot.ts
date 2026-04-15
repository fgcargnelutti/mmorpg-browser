import type { MapId } from "../../../world";
import { buildRegionScalingSnapshot } from "../../domain/regionScalingRules";
import type { RegionScalingSnapshot } from "../../domain/regionScalingTypes";

export function getRegionScalingSnapshot(
  currentMapId: MapId,
  onlinePlayerCount: number
): RegionScalingSnapshot {
  return buildRegionScalingSnapshot(currentMapId, onlinePlayerCount);
}
