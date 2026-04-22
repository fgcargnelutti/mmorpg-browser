import type {
  PlayerRegenState,
  RegenApplicationSummary,
  RegenTickConfig,
  ResolvedRegenConfig,
} from "../../domain/regenerationTypes";

type OnlineRegenPlayerSnapshot = {
  currentHp: number;
  currentSp: number;
  stamina: number;
  maxStamina: number;
};

type OnlineRegenMaxStats = {
  maxHp: number;
  maxSp: number;
  maxStamina: number;
};

type OfflineStaminaSnapshot = {
  stamina: number;
  maxStamina: number;
};

type TimedRegenResolution = {
  nextValue: number;
  nextAnchorAt: number;
  recoveredAmount: number;
};

function resolveTimedRegen(
  currentValue: number,
  maxValue: number,
  anchorAt: number,
  now: number,
  config: RegenTickConfig
): TimedRegenResolution {
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

export function createInitialPlayerRegenState(now: number): PlayerRegenState {
  return {
    hpAnchorAt: now,
    spAnchorAt: now,
    staminaAnchorAt: now,
    lastSeenAt: now,
  };
}

export function applyOnlineRegen<T extends OnlineRegenPlayerSnapshot>(
  player: T,
  regenState: PlayerRegenState,
  regenConfig: ResolvedRegenConfig,
  maxStats: OnlineRegenMaxStats,
  now: number
): {
  nextPlayer: T;
  nextRegenState: PlayerRegenState;
  summary: RegenApplicationSummary;
} {
  const hpResolution = resolveTimedRegen(
    player.currentHp,
    maxStats.maxHp,
    regenState.hpAnchorAt,
    now,
    regenConfig.hp
  );
  const spResolution = resolveTimedRegen(
    player.currentSp,
    maxStats.maxSp,
    regenState.spAnchorAt,
    now,
    regenConfig.sp
  );
  const staminaResolution = resolveTimedRegen(
    player.stamina,
    maxStats.maxStamina,
    regenState.staminaAnchorAt,
    now,
    regenConfig.stamina
  );

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

export function applyOfflineStaminaRegen<T extends OfflineStaminaSnapshot>(
  player: T,
  regenState: PlayerRegenState,
  regenConfig: ResolvedRegenConfig,
  now: number
): {
  nextPlayer: T;
  nextRegenState: PlayerRegenState;
  recoveredStamina: number;
} {
  const staminaResolution = resolveTimedRegen(
    player.stamina,
    player.maxStamina,
    regenState.lastSeenAt,
    now,
    regenConfig.offlineStamina
  );

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
