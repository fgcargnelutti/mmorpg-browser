import { useMemo } from "react";
import {} from "../features/multiplayer/domain/regionPresenceTypes";
import { useRegionPresence } from "../features/multiplayer/application/hooks/useRegionPresence";
export function useRegionPlayers({ currentMapId, currentPlayerName, }) {
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
