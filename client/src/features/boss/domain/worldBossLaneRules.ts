import type { WorldBossLaneId } from "./worldBossTypes";

export const WORLD_BOSS_LANES: WorldBossLaneId[] = ["front", "mid", "back"];

export const WORLD_BOSS_PLAYER_ROUND_DURATION_MS = 4_000;

export const WORLD_BOSS_PLAYER_RESOLUTION_PHASES = [
  "movement",
  "defense",
  "preparation",
  "support",
  "offense",
  "post-action",
] as const;

export const WORLD_BOSS_MELEE_LANE_EFFECTIVENESS: Record<
  WorldBossLaneId,
  { effectivenessMultiplier: number; canPerformMelee: boolean }
> = {
  front: {
    effectivenessMultiplier: 1,
    canPerformMelee: true,
  },
  mid: {
    effectivenessMultiplier: 0.8,
    canPerformMelee: true,
  },
  back: {
    effectivenessMultiplier: 0,
    canPerformMelee: false,
  },
};

export function resolveMeleeLaneRule(laneId: WorldBossLaneId) {
  return WORLD_BOSS_MELEE_LANE_EFFECTIVENESS[laneId];
}

export function canLanePerformMelee(laneId: WorldBossLaneId) {
  return resolveMeleeLaneRule(laneId).canPerformMelee;
}

export function resolveLaneMeleeEffectiveness(laneId: WorldBossLaneId) {
  return resolveMeleeLaneRule(laneId).effectivenessMultiplier;
}
