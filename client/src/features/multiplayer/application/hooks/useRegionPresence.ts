import { useMemo } from "react";
import type { MapId } from "../../../world";
import { mockRegionPlayersData } from "../../domain/mockRegionPlayersData";
import type { RegionPresenceSnapshot } from "../../domain/regionPresenceTypes";
import { getPlayersInRegion } from "../selectors/getPlayersInRegion";

type UseRegionPresenceParams = {
  currentMapId: MapId;
  currentPlayerName?: string;
};

export function useRegionPresence({
  currentMapId,
  currentPlayerName,
}: UseRegionPresenceParams): RegionPresenceSnapshot {
  return useMemo(() => {
    const players = getPlayersInRegion({
      players: mockRegionPlayersData,
      currentMapId,
      currentPlayerName,
    });

    return {
      currentMapId,
      players,
      onlineCount: players.length,
      source: "mock",
    };
  }, [currentMapId, currentPlayerName]);
}
