import { resolveWorldBossTestSchedulerSlotKey, resolveWorldBossTestSchedulerSlotStart } from "../selectors/resolveWorldBossTestSchedulerSlot";
import { hasWorldBossEventExpired } from "../selectors/resolveWorldBossEventState";
import { createWorldBossEventSnapshot } from "./createWorldBossEventSnapshot";
import type { WorldBossEventSnapshot } from "../../domain/worldBossTypes";
import type { WorldBossLocalTestSchedulerConfig } from "../../domain/worldBossTestSchedulerConfig";

type ResolveLocalWorldBossTestSchedulerTickParams = {
  now: Date;
  config: WorldBossLocalTestSchedulerConfig;
  currentEvent: WorldBossEventSnapshot | null;
  lastTriggeredSlotKey: string | null;
};

export type LocalWorldBossTestSchedulerTickResult = {
  activeEvent: WorldBossEventSnapshot | null;
  lastTriggeredSlotKey: string | null;
  didTrigger: boolean;
};

function resolveActiveEvent(
  currentEvent: WorldBossEventSnapshot | null,
  now: Date
) {
  if (!currentEvent) {
    return null;
  }

  if (currentEvent.combatStartedAt || currentEvent.resolvedAt) {
    return currentEvent;
  }

  return hasWorldBossEventExpired(currentEvent, now) ? null : currentEvent;
}

export function resolveLocalWorldBossTestSchedulerTick({
  now,
  config,
  currentEvent,
  lastTriggeredSlotKey,
}: ResolveLocalWorldBossTestSchedulerTickParams): LocalWorldBossTestSchedulerTickResult {
  const activeEvent = resolveActiveEvent(currentEvent, now);

  if (!config.enabled) {
    return {
      activeEvent,
      lastTriggeredSlotKey,
      didTrigger: false,
    };
  }

  const slotKey = resolveWorldBossTestSchedulerSlotKey({
    now,
    slotIntervalMinutes: config.slotIntervalMinutes,
  });

  if (!slotKey || slotKey === lastTriggeredSlotKey) {
    return {
      activeEvent,
      lastTriggeredSlotKey,
      didTrigger: false,
    };
  }

  const slotStart = resolveWorldBossTestSchedulerSlotStart({
    now,
    slotIntervalMinutes: config.slotIntervalMinutes,
  });
  const expiresAt = new Date(
    slotStart.getTime() + Math.max(0, config.activeDurationMs)
  ).toISOString();

  return {
    activeEvent: createWorldBossEventSnapshot({
      bossKey: config.bossKey,
      source: "local-test-scheduler",
      schedulerSlotKey: slotKey,
      activatedAt: slotStart.toISOString(),
      expiresAt,
    }),
    lastTriggeredSlotKey: slotKey,
    didTrigger: true,
  };
}
