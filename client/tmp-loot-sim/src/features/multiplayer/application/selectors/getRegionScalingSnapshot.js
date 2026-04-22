import { buildRegionScalingSnapshot } from "../../domain/regionScalingRules";
export function getRegionScalingSnapshot(currentMapId, onlinePlayerCount) {
    return buildRegionScalingSnapshot(currentMapId, onlinePlayerCount);
}
