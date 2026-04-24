export const WORLD_BOSS_LOCAL_TEST_SCHEDULER_ENABLED = true;
export const WORLD_BOSS_LOCAL_TEST_SCHEDULER_BOSS_KEY = "ancient-colossus";
export const WORLD_BOSS_LOCAL_TEST_SCHEDULER_SLOT_INTERVAL_MINUTES = 10;
export const WORLD_BOSS_LOCAL_TEST_SCHEDULER_ACTIVE_DURATION_MS = 5 * 60 * 1000;
export const WORLD_BOSS_LOCAL_TEST_SCHEDULER_POLL_INTERVAL_MS = 5 * 1000;

export type WorldBossLocalTestSchedulerConfig = {
  enabled: boolean;
  bossKey: string;
  slotIntervalMinutes: number;
  activeDurationMs: number;
  pollIntervalMs: number;
};

export const worldBossLocalTestSchedulerConfig: WorldBossLocalTestSchedulerConfig = {
  enabled: WORLD_BOSS_LOCAL_TEST_SCHEDULER_ENABLED,
  bossKey: WORLD_BOSS_LOCAL_TEST_SCHEDULER_BOSS_KEY,
  slotIntervalMinutes: WORLD_BOSS_LOCAL_TEST_SCHEDULER_SLOT_INTERVAL_MINUTES,
  activeDurationMs: WORLD_BOSS_LOCAL_TEST_SCHEDULER_ACTIVE_DURATION_MS,
  pollIntervalMs: WORLD_BOSS_LOCAL_TEST_SCHEDULER_POLL_INTERVAL_MS,
};
