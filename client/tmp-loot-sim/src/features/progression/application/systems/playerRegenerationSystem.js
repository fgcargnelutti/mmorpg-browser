function resolveTimedRegen(currentValue, maxValue, anchorAt, now, config) {
    const clampedCurrentValue = Math.max(0, Math.min(currentValue, maxValue));
    if (clampedCurrentValue >= maxValue) {
        return {
            nextValue: maxValue,
            nextAnchorAt: now,
            recoveredAmount: 0,
        };
    }
    const elapsedMs = Math.max(0, now - anchorAt);
    const completedTicks = Math.floor(elapsedMs / config.intervalMs);
    if (completedTicks <= 0) {
        return {
            nextValue: clampedCurrentValue,
            nextAnchorAt: anchorAt,
            recoveredAmount: 0,
        };
    }
    const recoveredAmount = completedTicks * config.amount;
    const nextValue = Math.min(maxValue, clampedCurrentValue + recoveredAmount);
    return {
        nextValue,
        nextAnchorAt: anchorAt + completedTicks * config.intervalMs,
        recoveredAmount: nextValue - clampedCurrentValue,
    };
}
export function createInitialPlayerRegenState(now) {
    return {
        hpAnchorAt: now,
        spAnchorAt: now,
        staminaAnchorAt: now,
        lastSeenAt: now,
    };
}
export function applyOnlineRegen(player, regenState, regenConfig, maxStats, now) {
    const hpResolution = resolveTimedRegen(player.currentHp, maxStats.maxHp, regenState.hpAnchorAt, now, regenConfig.hp);
    const spResolution = resolveTimedRegen(player.currentSp, maxStats.maxSp, regenState.spAnchorAt, now, regenConfig.sp);
    const staminaResolution = resolveTimedRegen(player.stamina, maxStats.maxStamina, regenState.staminaAnchorAt, now, regenConfig.stamina);
    return {
        nextPlayer: {
            ...player,
            currentHp: hpResolution.nextValue,
            currentSp: spResolution.nextValue,
            stamina: staminaResolution.nextValue,
        },
        nextRegenState: {
            ...regenState,
            hpAnchorAt: hpResolution.nextAnchorAt,
            spAnchorAt: spResolution.nextAnchorAt,
            staminaAnchorAt: staminaResolution.nextAnchorAt,
        },
        summary: {
            hpRecovered: hpResolution.recoveredAmount,
            spRecovered: spResolution.recoveredAmount,
            staminaRecovered: staminaResolution.recoveredAmount,
        },
    };
}
export function applyOfflineStaminaRegen(player, regenState, regenConfig, now) {
    const staminaResolution = resolveTimedRegen(player.stamina, player.maxStamina, regenState.lastSeenAt, now, regenConfig.offlineStamina);
    return {
        nextPlayer: {
            ...player,
            stamina: staminaResolution.nextValue,
        },
        nextRegenState: {
            ...regenState,
            staminaAnchorAt: now,
            lastSeenAt: now,
        },
        recoveredStamina: staminaResolution.recoveredAmount,
    };
}
