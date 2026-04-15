import { useMemo } from "react";
import type { MapId } from "../../../world";
import { getRegionScalingSnapshot } from "../selectors/getRegionScalingSnapshot";

type UseRegionScalingParams = {
  currentMapId: MapId;
  onlinePlayerCount: number;
};

export function useRegionScaling({
  currentMapId,
  onlinePlayerCount,
}: UseRegionScalingParams) {
  return useMemo(
    () => getRegionScalingSnapshot(currentMapId, onlinePlayerCount),
    [currentMapId, onlinePlayerCount]
  );
}
