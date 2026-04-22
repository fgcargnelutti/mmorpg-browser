import type { PlayerRegenState } from "../../domain/regenerationTypes";

export type PersistedPlayerVitalsPayload = {
  version: 1;
  sessionKey: string;
  currentHp: number;
  currentSp: number;
  stamina: number;
  regenState: PlayerRegenState;
};

type PersistablePlayerVitals = {
  currentHp: number;
  currentSp: number;
  stamina: number;
};

export function serializePlayerVitalsState(
  sessionKey: string,
  player: PersistablePlayerVitals,
  regenState: PlayerRegenState
): PersistedPlayerVitalsPayload {
  return {
    version: 1,
    sessionKey,
    currentHp: Math.max(0, player.currentHp),
    currentSp: Math.max(0, player.currentSp),
    stamina: Math.max(0, player.stamina),
    regenState,
  };
}

export function deserializePlayerVitalsState(
  payload: PersistedPlayerVitalsPayload | null | undefined,
  sessionKey: string,
  fallbackPlayer: PersistablePlayerVitals,
  fallbackRegenState: PlayerRegenState
): {
  player: PersistablePlayerVitals;
  regenState: PlayerRegenState;
} {
  if (
    !payload ||
    payload.version !== 1 ||
    payload.sessionKey !== sessionKey
  ) {
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
