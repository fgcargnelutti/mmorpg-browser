import { mapsData, type MapId } from "../../../world/domain/mapsData";
import { worldBossData } from "../../domain/worldBossData";
import type {
  WorldBossEventSnapshot,
  WorldBossSession,
} from "../../domain/worldBossTypes";
import {
  isWorldBossJoinableNow,
  resolveWorldBossJoinEndsAt,
} from "./resolveWorldBossEventState";

export type WorldBossMapNotification = {
  bossKey: string;
  bossName: string;
  bossTitle: string;
  targetMapId: MapId;
  targetMapName: string;
  joinEndsAt: string | null;
  joinEndsAtLabel: string | null;
  isJoinableNow: boolean;
  isOnTargetMap: boolean;
  canShowEncounterEntryPoint: boolean;
  title: string;
  message: string;
  statusLabel: string;
  entryPointTitle?: string;
  entryPointMessage?: string;
};

function formatWorldBossJoinWindowLabel(joinEndsAt: string | null) {
  if (!joinEndsAt) {
    return null;
  }

  const joinEndDate = new Date(joinEndsAt);

  if (Number.isNaN(joinEndDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(joinEndDate);
}

export function resolveWorldBossMapNotification(params: {
  event: WorldBossEventSnapshot | null;
  currentMapId: MapId;
  activeSession?: WorldBossSession | null;
}): WorldBossMapNotification | null {
  const { event, currentMapId, activeSession } = params;

  if (!event) {
    return null;
  }

  const boss = worldBossData[event.bossKey];
  const targetMap = mapsData[event.mapId];

  if (!boss || !targetMap) {
    return null;
  }

  const isOnTargetMap = currentMapId === targetMap.id;
  const joinableNow = isWorldBossJoinableNow(event);
  const joinEndsAt = resolveWorldBossJoinEndsAt(event);
  const joinEndsAtLabel = formatWorldBossJoinWindowLabel(joinEndsAt);
  const canShowEncounterEntryPoint = isOnTargetMap && joinableNow;
  const isJoinedSession =
    activeSession?.bossKey === event.bossKey &&
    activeSession.state !== "completed" &&
    activeSession.state !== "failed";
  const hasBattleStarted = activeSession?.state === "active";

  return {
    bossKey: boss.key,
    bossName: boss.name,
    bossTitle: boss.title,
    targetMapId: targetMap.id,
    targetMapName: targetMap.name,
    joinEndsAt,
    joinEndsAtLabel,
    isJoinableNow: joinableNow,
    isOnTargetMap,
    canShowEncounterEntryPoint,
    title: hasBattleStarted
      ? `World Boss ${boss.name} battle started.`
      : isJoinedSession
      ? `You joined World Boss ${boss.name}.`
      : canShowEncounterEntryPoint
      ? `World Boss ${boss.name} is active on this map.`
      : `World Boss ${boss.name} is active.`,
    message: hasBattleStarted
      ? "The local battle state is now active. Late join is blocked while the combat implementation is connected in the next phase."
      : isJoinedSession
      ? "You are enrolled in the local pre-battle session. You can leave before combat starts."
      : canShowEncounterEntryPoint
      ? `You are already in ${targetMap.name}. The map can now surface the World Boss encounter entry point here when the next phase is connected.`
      : isOnTargetMap
        ? `The World Boss event is present on this map, but the temporary join window is no longer open.`
      : `Travel to ${targetMap.name} to reach the active World Boss area before the local test window closes.`,
    statusLabel: hasBattleStarted
      ? "Battle Started"
      : isJoinedSession
      ? "Joined"
      : canShowEncounterEntryPoint
      ? "Entry Point Available"
      : isOnTargetMap
        ? "Window Closed"
        : "Travel Required",
    entryPointTitle: hasBattleStarted
      ? "Combat Handoff"
      : isJoinedSession
      ? "Session Status"
      : canShowEncounterEntryPoint
        ? "Encounter Entry Point"
      : undefined,
    entryPointMessage: hasBattleStarted
      ? "The lobby countdown completed and the session is now locked. The synchronized combat loop will take over in the next implementation phase."
      : isJoinedSession
      ? `Local enrollment is active with ${activeSession?.participants.length ?? 1} participant(s). The full lobby and countdown will be connected in the next phase.`
      : canShowEncounterEntryPoint
        ? "This map is now the valid World Boss map. `Join Battle` itself will be wired in the next phase, without teleporting directly into combat."
      : undefined,
  };
}
