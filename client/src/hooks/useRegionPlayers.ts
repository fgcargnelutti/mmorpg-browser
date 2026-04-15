import { useMemo } from "react";
import {
  onlineRegionPlayersData,
  type OnlineRegionPlayer,
} from "../data/onlineRegionPlayersData";
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
  return useMemo(() => {
    const normalizedCurrentPlayerName = currentPlayerName?.trim().toLowerCase();

    const players = onlineRegionPlayersData.filter((player) => {
      if (!player.isOnline) return false;
      if (player.currentMapId !== currentMapId) return false;

      return player.name.trim().toLowerCase() !== normalizedCurrentPlayerName;
    });

    return {
      players,
      onlineCount: players.length,
    };
  }, [currentMapId, currentPlayerName]);
}
