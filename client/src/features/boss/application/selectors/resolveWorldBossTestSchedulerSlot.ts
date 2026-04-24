type ResolveWorldBossTestSchedulerSlotParams = {
  now: Date;
  slotIntervalMinutes: number;
};

function padLocalClockPart(value: number) {
  return String(value).padStart(2, "0");
}

function resolveSafeSlotIntervalMinutes(slotIntervalMinutes: number) {
  return Math.max(1, Math.floor(slotIntervalMinutes));
}

export function isWorldBossTestSchedulerTriggerMinute({
  now,
  slotIntervalMinutes,
}: ResolveWorldBossTestSchedulerSlotParams) {
  const safeSlotIntervalMinutes = resolveSafeSlotIntervalMinutes(
    slotIntervalMinutes
  );

  return now.getMinutes() % safeSlotIntervalMinutes === 0;
}

export function resolveWorldBossTestSchedulerSlotStart({
  now,
  slotIntervalMinutes,
}: ResolveWorldBossTestSchedulerSlotParams) {
  const safeSlotIntervalMinutes = resolveSafeSlotIntervalMinutes(
    slotIntervalMinutes
  );
  const slotMinute =
    Math.floor(now.getMinutes() / safeSlotIntervalMinutes) *
    safeSlotIntervalMinutes;
  const slotStart = new Date(now);

  slotStart.setSeconds(0, 0);
  slotStart.setMinutes(slotMinute);

  return slotStart;
}

export function resolveWorldBossTestSchedulerSlotKey(
  params: ResolveWorldBossTestSchedulerSlotParams
) {
  if (!isWorldBossTestSchedulerTriggerMinute(params)) {
    return null;
  }

  const slotStart = resolveWorldBossTestSchedulerSlotStart(params);

  return [
    slotStart.getFullYear(),
    padLocalClockPart(slotStart.getMonth() + 1),
    padLocalClockPart(slotStart.getDate()),
    padLocalClockPart(slotStart.getHours()),
    padLocalClockPart(slotStart.getMinutes()),
  ].join("-");
}
