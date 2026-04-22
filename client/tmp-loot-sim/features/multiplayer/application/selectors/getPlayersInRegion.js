export function getPlayersInRegion({ players, currentMapId, currentPlayerName, }) {
    const normalizedCurrentPlayerName = currentPlayerName?.trim().toLowerCase();
    return players.filter((player) => {
        if (!player.isOnline)
            return false;
        if (player.currentMapId !== currentMapId)
            return false;
        return player.name.trim().toLowerCase() !== normalizedCurrentPlayerName;
    });
}
