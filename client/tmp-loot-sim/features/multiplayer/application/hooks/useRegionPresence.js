import { useMemo } from "react";
import { mockRegionPlayersData } from "../../domain/mockRegionPlayersData";
import { getPlayersInRegion } from "../selectors/getPlayersInRegion";
export function useRegionPresence({ currentMapId, currentPlayerName, }) {
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
