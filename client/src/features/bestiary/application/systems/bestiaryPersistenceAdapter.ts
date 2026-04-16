import type {
  CreatureBestiaryKey,
  PersistedBestiaryProgressPayload,
  PlayerBestiaryEntryState,
  PlayerBestiaryProgressState,
} from "../../domain/bestiaryTypes";
import { creatureCompendiumData } from "../../domain/creatureCompendiumData";

function isSupportedCreatureKey(value: string): value is CreatureBestiaryKey {
  return value in creatureCompendiumData;
}

export function serializeBestiaryProgress(
  progress: PlayerBestiaryProgressState
): PersistedBestiaryProgressPayload {
  // This payload intentionally mirrors a backend-friendly shape so the local
  // bestiary source of truth can later be replaced by API responses.
  const entries = Object.values(progress)
    .filter((entry): entry is PlayerBestiaryEntryState => Boolean(entry))
    .map((entry) => ({
      creatureKey: entry.creatureKey,
      killCount: entry.killCount,
      unlockedTier: entry.unlockedTier,
    }));

  return {
    version: 1,
    entries,
  };
}

export function deserializeBestiaryProgress(
  payload: PersistedBestiaryProgressPayload | null | undefined
): PlayerBestiaryProgressState {
  if (!payload || payload.version !== 1) {
    return {};
  }

  return payload.entries.reduce<PlayerBestiaryProgressState>((nextState, entry) => {
    if (!isSupportedCreatureKey(entry.creatureKey)) {
      return nextState;
    }

    nextState[entry.creatureKey] = {
      creatureKey: entry.creatureKey,
      killCount: Math.max(0, entry.killCount),
      unlockedTier: entry.unlockedTier,
    };

    return nextState;
  }, {});
}
