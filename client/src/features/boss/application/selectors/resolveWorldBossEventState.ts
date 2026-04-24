import type {
  WorldBossEventSnapshot,
  WorldBossEventState,
} from "../../domain/worldBossTypes";

function resolveReferenceTime(now?: Date) {
  return now ?? new Date();
}

function toTimestamp(isoDate?: string) {
  if (!isoDate) {
    return null;
  }

  const timestamp = new Date(isoDate).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function resolveWorldBossJoinEndsAt(
  event: WorldBossEventSnapshot
) {
  if (event.expiresAt) {
    return event.expiresAt;
  }

  const activatedAtTimestamp = toTimestamp(event.activatedAt);

  if (activatedAtTimestamp === null) {
    return null;
  }

  return new Date(
    activatedAtTimestamp + Math.max(0, event.joinWindowDurationMs)
  ).toISOString();
}

export function resolveWorldBossEventState(
  event: WorldBossEventSnapshot,
  now?: Date
): WorldBossEventState {
  if (event.resolvedAt) {
    return "resolved";
  }

  if (event.combatStartedAt) {
    return "in-battle";
  }

  const activatedAtTimestamp = toTimestamp(event.activatedAt);

  if (activatedAtTimestamp === null) {
    return "inactive";
  }

  const joinEndsAt = resolveWorldBossJoinEndsAt(event);
  const joinEndsAtTimestamp = toTimestamp(joinEndsAt ?? undefined);

  if (joinEndsAtTimestamp === null) {
    return "active";
  }

  return resolveReferenceTime(now).getTime() <= joinEndsAtTimestamp
    ? "active"
    : "join-closed";
}

export function isWorldBossEventActive(
  event: WorldBossEventSnapshot,
  now?: Date
) {
  const eventState = resolveWorldBossEventState(event, now);

  return (
    eventState === "active" ||
    eventState === "join-closed" ||
    eventState === "in-battle"
  );
}

export function isWorldBossJoinableNow(
  event: WorldBossEventSnapshot,
  now?: Date
) {
  return resolveWorldBossEventState(event, now) === "active";
}

export function hasWorldBossEventExpired(
  event: WorldBossEventSnapshot,
  now?: Date
) {
  const expiresAtTimestamp = toTimestamp(resolveWorldBossJoinEndsAt(event) ?? undefined);

  if (expiresAtTimestamp === null) {
    return false;
  }

  return resolveReferenceTime(now).getTime() > expiresAtTimestamp;
}
