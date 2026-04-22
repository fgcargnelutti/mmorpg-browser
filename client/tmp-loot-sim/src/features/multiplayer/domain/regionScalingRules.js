function getCooperationTier(playerCount) {
    if (playerCount <= 1)
        return "solo";
    if (playerCount === 2)
        return "pair";
    if (playerCount <= 4)
        return "group";
    return "crowded";
}
export function buildRegionScalingSnapshot(currentMapId, onlinePlayerCount) {
    const effectivePlayerCount = Math.max(1, onlinePlayerCount);
    const extraPlayers = Math.max(0, effectivePlayerCount - 1);
    return {
        currentMapId,
        onlinePlayerCount: effectivePlayerCount,
        effectivePlayerCount,
        cooperationTier: getCooperationTier(effectivePlayerCount),
        enemyHealthMultiplier: Math.max(0.55, 1 - extraPlayers * 0.08),
        enemyDamageMultiplier: Math.max(0.65, 1 - extraPlayers * 0.05),
        xpMultiplier: 1 + extraPlayers * 0.12,
        rewardMultiplier: 1 + extraPlayers * 0.06,
    };
}
