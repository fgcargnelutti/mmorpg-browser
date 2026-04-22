export function serializePlayerVitalsState(sessionKey, player, regenState) {
    return {
        version: 1,
        sessionKey,
        currentHp: Math.max(0, player.currentHp),
        currentSp: Math.max(0, player.currentSp),
        stamina: Math.max(0, player.stamina),
        regenState,
    };
}
export function deserializePlayerVitalsState(payload, sessionKey, fallbackPlayer, fallbackRegenState) {
    if (!payload ||
        payload.version !== 1 ||
        payload.sessionKey !== sessionKey) {
        return {
            player: fallbackPlayer,
            regenState: fallbackRegenState,
        };
    }
    return {
        player: {
            currentHp: Math.max(0, payload.currentHp),
            currentSp: Math.max(0, payload.currentSp),
            stamina: Math.max(0, payload.stamina),
        },
        regenState: payload.regenState,
    };
}
