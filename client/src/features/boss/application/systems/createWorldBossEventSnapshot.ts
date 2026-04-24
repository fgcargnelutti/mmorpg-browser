import { worldBossData } from "../../domain/worldBossData";
import type { WorldBossEventSnapshot } from "../../domain/worldBossTypes";

type CreateWorldBossEventSnapshotParams = {
  bossKey: string;
  source?: WorldBossEventSnapshot["source"];
  schedulerSlotKey?: string;
  activatedAt?: string;
  expiresAt?: string;
  combatStartedAt?: string;
  resolvedAt?: string;
};

export function createWorldBossEventSnapshot(
  params: CreateWorldBossEventSnapshotParams
): WorldBossEventSnapshot {
  const boss = worldBossData[params.bossKey];

  if (!boss) {
    throw new Error(`Unknown World Boss key: ${params.bossKey}`);
  }

  return {
    bossKey: boss.key,
    mapId: boss.mapId,
    activationIntervalMs: boss.activationIntervalMs,
    joinWindowDurationMs: boss.joinWindowDurationMs,
    source: params.source,
    schedulerSlotKey: params.schedulerSlotKey,
    activatedAt: params.activatedAt,
    expiresAt: params.expiresAt,
    combatStartedAt: params.combatStartedAt,
    resolvedAt: params.resolvedAt,
  };
}
