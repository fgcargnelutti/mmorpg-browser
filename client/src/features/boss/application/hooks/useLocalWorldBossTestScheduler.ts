import { useEffect, useMemo, useState } from "react";
import { worldBossData } from "../../domain/worldBossData";
import { worldBossLocalTestSchedulerConfig } from "../../domain/worldBossTestSchedulerConfig";
import type { WorldBossEventSnapshot } from "../../domain/worldBossTypes";
import {
  isWorldBossEventActive,
  isWorldBossJoinableNow,
  resolveWorldBossJoinEndsAt,
} from "../selectors/resolveWorldBossEventState";
import { resolveLocalWorldBossTestSchedulerTick } from "../systems/resolveLocalWorldBossTestSchedulerTick";

type LocalWorldBossTestSchedulerState = {
  activeEvent: WorldBossEventSnapshot | null;
  lastTriggeredSlotKey: string | null;
};

export function useLocalWorldBossTestScheduler() {
  const [schedulerState, setSchedulerState] =
    useState<LocalWorldBossTestSchedulerState>({
      activeEvent: null,
      lastTriggeredSlotKey: null,
    });

  useEffect(() => {
    const tickScheduler = () => {
      setSchedulerState((currentState) => {
        const tickResult = resolveLocalWorldBossTestSchedulerTick({
          now: new Date(),
          config: worldBossLocalTestSchedulerConfig,
          currentEvent: currentState.activeEvent,
          lastTriggeredSlotKey: currentState.lastTriggeredSlotKey,
        });

        return {
          activeEvent: tickResult.activeEvent,
          lastTriggeredSlotKey: tickResult.lastTriggeredSlotKey,
        };
      });
    };

    tickScheduler();

    if (!worldBossLocalTestSchedulerConfig.enabled) {
      return;
    }

    const intervalId = window.setInterval(
      tickScheduler,
      worldBossLocalTestSchedulerConfig.pollIntervalMs
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const activeBossDefinition = useMemo(() => {
    if (!schedulerState.activeEvent) {
      return null;
    }

    return worldBossData[schedulerState.activeEvent.bossKey] ?? null;
  }, [schedulerState.activeEvent]);

  return {
    activeEvent: schedulerState.activeEvent,
    activeBossDefinition,
    lastTriggeredSlotKey: schedulerState.lastTriggeredSlotKey,
    isEnabled: worldBossLocalTestSchedulerConfig.enabled,
    isActive: schedulerState.activeEvent
      ? isWorldBossEventActive(schedulerState.activeEvent)
      : false,
    isJoinableNow: schedulerState.activeEvent
      ? isWorldBossJoinableNow(schedulerState.activeEvent)
      : false,
    joinEndsAt: schedulerState.activeEvent
      ? resolveWorldBossJoinEndsAt(schedulerState.activeEvent)
      : null,
  };
}
