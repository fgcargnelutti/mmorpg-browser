import type { MapId } from "../../../world/domain/mapsData";
import type {
  WorldBossEventSnapshot,
  WorldBossSession,
} from "../../domain/worldBossTypes";
import { isWorldBossJoinableNow } from "./resolveWorldBossEventState";

export type WorldBossJoinEligibilityReason =
  | "no-event"
  | "already-joined"
  | "travel-required"
  | "join-window-closed"
  | "combat-started"
  | "eligible";

export type WorldBossJoinEligibility = {
  bossKey: string | null;
  isEligibleToJoin: boolean;
  isAlreadyJoined: boolean;
  canLeaveBeforeStart: boolean;
  isOnTargetMap: boolean;
  reason: WorldBossJoinEligibilityReason;
  message: string;
};

export function resolveWorldBossJoinEligibility(params: {
  event: WorldBossEventSnapshot | null;
  currentMapId: MapId;
  activeSession: WorldBossSession | null;
}): WorldBossJoinEligibility {
  const { event, currentMapId, activeSession } = params;

  if (!event) {
    return {
      bossKey: null,
      isEligibleToJoin: false,
      isAlreadyJoined: false,
      canLeaveBeforeStart: false,
      isOnTargetMap: false,
      reason: "no-event",
      message: "There is no active World Boss event to join.",
    };
  }

  const isAlreadyJoined =
    activeSession?.bossKey === event.bossKey &&
    activeSession.state !== "completed" &&
    activeSession.state !== "failed";
  const isOnTargetMap = currentMapId === event.mapId;
  const isJoinableNow = isWorldBossJoinableNow(event);
  const hasCombatStarted = Boolean(event.combatStartedAt);

  if (isAlreadyJoined) {
    return {
      bossKey: event.bossKey,
      isEligibleToJoin: false,
      isAlreadyJoined: true,
      canLeaveBeforeStart:
        activeSession?.state === "forming" || activeSession?.state === "countdown",
      isOnTargetMap,
      reason: "already-joined",
      message: "You are already enrolled in this World Boss session.",
    };
  }

  if (hasCombatStarted) {
    return {
      bossKey: event.bossKey,
      isEligibleToJoin: false,
      isAlreadyJoined: false,
      canLeaveBeforeStart: false,
      isOnTargetMap,
      reason: "combat-started",
      message: "The World Boss battle has already started.",
    };
  }

  if (!isOnTargetMap) {
    return {
      bossKey: event.bossKey,
      isEligibleToJoin: false,
      isAlreadyJoined: false,
      canLeaveBeforeStart: false,
      isOnTargetMap: false,
      reason: "travel-required",
      message: "Travel to the boss map before joining the World Boss event.",
    };
  }

  if (!isJoinableNow) {
    return {
      bossKey: event.bossKey,
      isEligibleToJoin: false,
      isAlreadyJoined: false,
      canLeaveBeforeStart: false,
      isOnTargetMap: true,
      reason: "join-window-closed",
      message: "The World Boss join window is no longer open.",
    };
  }

  return {
    bossKey: event.bossKey,
    isEligibleToJoin: true,
    isAlreadyJoined: false,
    canLeaveBeforeStart: false,
    isOnTargetMap: true,
    reason: "eligible",
    message: "You can join this World Boss event from the current map.",
  };
}
