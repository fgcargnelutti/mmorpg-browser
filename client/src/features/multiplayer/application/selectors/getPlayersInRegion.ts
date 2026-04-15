import type { MapId } from "../../../world";
import type { RegionPresencePlayer } from "../../domain/regionPresenceTypes";

type GetPlayersInRegionParams = {
  players: RegionPresencePlayer[];
  currentMapId: MapId;
  currentPlayerName?: string;
};

export function getPlayersInRegion({
  players,
  currentMapId,
  currentPlayerName,
}: GetPlayersInRegionParams): RegionPresencePlayer[] {
  const normalizedCurrentPlayerName = currentPlayerName?.trim().toLowerCase();

  return players.filter((player) => {
    if (!player.isOnline) return false;
    if (player.currentMapId !== currentMapId) return false;

    return player.name.trim().toLowerCase() !== normalizedCurrentPlayerName;
  });
}
