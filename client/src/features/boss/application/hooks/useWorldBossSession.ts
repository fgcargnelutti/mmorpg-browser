import { useEffect, useMemo, useState } from "react";
import type { MapId } from "../../../world/domain/mapsData";
import type {
  WorldBossEventSnapshot,
  WorldBossLaneId,
  WorldBossParticipantRemovalReason,
  WorldBossPlayerSnapshot,
  WorldBossSession,
} from "../../domain/worldBossTypes";
import { resolveWorldBossJoinEligibility } from "../selectors/resolveWorldBossJoinEligibility";
import { resolveWorldBossLobbySummary } from "../selectors/resolveWorldBossLobbySummary";
import { useWorldBossCombat } from "./useWorldBossCombat";
import { createWorldBossSession } from "../systems/createWorldBossSession";
import { removeWorldBossParticipantFromSession } from "../systems/worldBossSessionBoundarySystem";

type UseWorldBossSessionParams = {
  event: WorldBossEventSnapshot | null;
  currentMapId: MapId;
  localPlayer: WorldBossPlayerSnapshot;
};

export function useWorldBossSession({
  event,
  currentMapId,
  localPlayer,
}: UseWorldBossSessionParams) {
  const [activeSession, setActiveSession] = useState<WorldBossSession | null>(null);
  const [sessionNowMs, setSessionNowMs] = useState(() => Date.now());
  const [resolvedEventSlotKey, setResolvedEventSlotKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!activeSession) {
      return;
    }

    if (activeSession.state === "completed" || activeSession.state === "failed") {
      return;
    }

    if (!event || activeSession.bossKey !== event.bossKey) {
      setActiveSession(null);
    }
  }, [activeSession, event]);

  useEffect(() => {
    if (!event?.schedulerSlotKey) {
      if (resolvedEventSlotKey) {
        setResolvedEventSlotKey(null);
      }
      return;
    }

    if (
      resolvedEventSlotKey &&
      resolvedEventSlotKey !== event.schedulerSlotKey
    ) {
      setResolvedEventSlotKey(null);
    }
  }, [event?.schedulerSlotKey, resolvedEventSlotKey]);

  useEffect(() => {
    if (
      !activeSession ||
      (activeSession.state !== "completed" && activeSession.state !== "failed") ||
      !event?.schedulerSlotKey
    ) {
      return;
    }

    setResolvedEventSlotKey((currentSlotKey) =>
      currentSlotKey === event.schedulerSlotKey
        ? currentSlotKey
        : event.schedulerSlotKey ?? null
    );
  }, [activeSession, event?.schedulerSlotKey]);

  useEffect(() => {
    if (!activeSession || activeSession.state !== "countdown") {
      return;
    }

    const tick = () => {
      const nowMs = Date.now();
      setSessionNowMs(nowMs);

      setActiveSession((currentSession) => {
        if (
          !currentSession ||
          currentSession.state !== "countdown" ||
          !currentSession.countdownStartedAt
        ) {
          return currentSession;
        }

        const countdownStartMs = new Date(
          currentSession.countdownStartedAt
        ).getTime();

        if (Number.isNaN(countdownStartMs)) {
          return currentSession;
        }

        const countdownEndsAtMs =
          countdownStartMs + currentSession.lobbyCountdownDurationMs;

        if (nowMs < countdownEndsAtMs) {
          return currentSession;
        }

        return {
          ...currentSession,
          state: "active",
          combatStartedAt: new Date(nowMs).toISOString(),
        };
      });
    };

    tick();

    const intervalId = window.setInterval(tick, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeSession]);

  const joinEligibility = useMemo(() => {
    const baseEligibility = resolveWorldBossJoinEligibility({
      event,
      currentMapId,
      activeSession,
    });

    if (
      event?.schedulerSlotKey &&
      resolvedEventSlotKey === event.schedulerSlotKey
    ) {
      return {
        ...baseEligibility,
        isEligibleToJoin: false,
        isAlreadyJoined: false,
        canLeaveBeforeStart: false,
        reason: "combat-started" as const,
        message:
          "This World Boss slot has already been resolved. Wait for the next activation window.",
      };
    }

    return baseEligibility;
  }, [activeSession, currentMapId, event, resolvedEventSlotKey]);

  const combat = useWorldBossCombat({
    activeSession,
    setActiveSession,
    localPlayerId: localPlayer.id,
  });

  const lobbySummary = useMemo(
    () =>
      resolveWorldBossLobbySummary({
        session: activeSession,
        localPlayerId: localPlayer.id,
        nowMs: sessionNowMs,
      }),
    [activeSession, localPlayer.id, sessionNowMs]
  );

  const joinWorldBoss = () => {
    if (!event || !joinEligibility.isEligibleToJoin) {
      return {
        didJoin: false,
        reason: joinEligibility.reason,
      };
    }

    const nextSession = createWorldBossSession({
      bossKey: event.bossKey,
      localPlayer,
      now: new Date(),
    });
    const countdownStartedAt = new Date().toISOString();

    setActiveSession({
      ...nextSession,
      state: "countdown",
      countdownStartedAt,
    });

    return {
      didJoin: true,
      session: {
        ...nextSession,
        state: "countdown",
        countdownStartedAt,
      },
    };
  };

  const leaveWorldBoss = () => {
    if (!activeSession || !joinEligibility.canLeaveBeforeStart) {
      return {
        didLeave: false,
      };
    }

    setActiveSession(null);

    return {
      didLeave: true,
    };
  };

  const selectLobbyLane = (laneId: WorldBossLaneId) => {
    if (
      !activeSession ||
      (activeSession.state !== "forming" && activeSession.state !== "countdown")
    ) {
      return {
        didSelect: false,
      };
    }

    let didSelect = false;

    setActiveSession((currentSession) => {
      if (
        !currentSession ||
        (currentSession.state !== "forming" && currentSession.state !== "countdown")
      ) {
        return currentSession;
      }

      const nextParticipants = currentSession.participants.map((participant) => {
        if (participant.playerId !== localPlayer.id || participant.laneId === laneId) {
          return participant;
        }

        didSelect = true;

        return {
          ...participant,
          laneId,
        };
      });

      return didSelect
        ? {
            ...currentSession,
            participants: nextParticipants,
          }
        : currentSession;
    });

    return {
      didSelect,
    };
  };

  const closeResolvedSession = () => {
    if (
      !activeSession ||
      (activeSession.state !== "completed" && activeSession.state !== "failed")
    ) {
      return {
        didClose: false,
      };
    }

    setActiveSession(null);

    return {
      didClose: true,
    };
  };

  const abandonWorldBossSession = (
    reason: Extract<
      WorldBossParticipantRemovalReason,
      "disconnect" | "voluntary-exit"
    >
  ) => {
    if (!activeSession) {
      return {
        didAbandon: false,
        messages: [],
      };
    }

    if (activeSession.state === "forming" || activeSession.state === "countdown") {
      setActiveSession(null);

      return {
        didAbandon: true,
        messages: [
          reason === "disconnect"
            ? "World Boss: The local player disconnected before the battle started and was removed from the session."
            : "World Boss: You left the staging session before the battle started.",
        ],
      };
    }

    if (activeSession.state === "active") {
      const removalResult = removeWorldBossParticipantFromSession({
        session: activeSession,
        playerId: localPlayer.id,
        reason,
        now: new Date(),
      });

      if (removalResult.didRemove) {
        if (event?.schedulerSlotKey) {
          setResolvedEventSlotKey((currentSlotKey) =>
            currentSlotKey === event.schedulerSlotKey
              ? currentSlotKey
              : event.schedulerSlotKey ?? null
          );
        }

        setActiveSession(removalResult.nextSession);
      }

      return {
        didAbandon: removalResult.didRemove,
        messages: removalResult.messages,
      };
    }

    if (activeSession.state === "completed" || activeSession.state === "failed") {
      setActiveSession(null);

      return {
        didAbandon: true,
        messages: [],
      };
    }

    return {
      didAbandon: false,
      messages: [],
    };
  };

  return {
    activeSession,
    joinEligibility,
    lobbySummary,
    sessionShellState:
      activeSession?.state === "forming" || activeSession?.state === "countdown"
        ? "lobby"
        : activeSession?.state === "active"
          ? "combat"
          : activeSession?.state === "completed" ||
              activeSession?.state === "failed"
            ? "result"
        : "hidden",
    joinWorldBoss,
    leaveWorldBoss,
    selectLobbyLane,
    closeResolvedSession,
    abandonWorldBossSession,
    combat,
  };
}
