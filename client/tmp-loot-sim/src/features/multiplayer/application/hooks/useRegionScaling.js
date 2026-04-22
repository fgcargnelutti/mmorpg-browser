import { useMemo } from "react";
import { getRegionScalingSnapshot } from "../selectors/getRegionScalingSnapshot";
export function useRegionScaling({ currentMapId, onlinePlayerCount, }) {
    return useMemo(() => getRegionScalingSnapshot(currentMapId, onlinePlayerCount), [currentMapId, onlinePlayerCount]);
}
