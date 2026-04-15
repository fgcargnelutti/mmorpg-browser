import { useMemo } from "react";
import {
  type RegionPresencePlayer as OnlineRegionPlayer,
} from "../features/multiplayer/domain/regionPresenceTypes";
import { useRegionPresence } from "../features/multiplayer/application/hooks/useRegionPresence";
import type { MapId } from "../features/world";

type UseRegionPlayersParams = {
  currentMapId: MapId;
  currentPlayerName?: string;
};

type UseRegionPlayersResult = {
  players: OnlineRegionPlayer[];
  onlineCount: number;
};

export function useRegionPlayers({
  currentMapId,
  currentPlayerName,
}: UseRegionPlayersParams): UseRegionPlayersResult {
  const snapshot = useRegionPresence({
    currentMapId,
    currentPlayerName,
  });

  return useMemo(() => {
    return {
      players: snapshot.players,
      onlineCount: snapshot.onlineCount,
    };
  }, [snapshot.onlineCount, snapshot.players]);
}
