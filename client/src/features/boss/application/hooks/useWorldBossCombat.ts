import { useEffect, useMemo, useState } from "react";
import { worldBossData } from "../../domain/worldBossData";
import {
  createWorldBossPlayerActionSelection,
  validateWorldBossPlayerAction,
} from "../systems/worldBossActionSelectionSystem";
import {
  hasWorldBossPlayerDecisionWindowExpired,
  resolveWorldBossParticipantByPlayerId,
  resolveWorldBossSubmittedAction,
  upsertWorldBossSubmittedAction,
} from "../systems/worldBossRoundClockSystem";
import { resolveWorldBossRound } from "../systems/worldBossResolutionSystem";
import type {
  WorldBossLaneId,
  WorldBossPlayerActionSelection,
  WorldBossPlayerActionType,
  WorldBossSession,
} from "../../domain/worldBossTypes";

type CombatFeedBatch = {
  key: string;
  messages: string[];
};

type UseWorldBossCombatParams = {
  activeSession: WorldBossSession | null;
  setActiveSession: React.Dispatch<React.SetStateAction<WorldBossSession | null>>;
  localPlayerId: string;
};

type WorldBossCombatActionOption = {
  key: string;
  label: string;
  type: WorldBossPlayerActionType;
  description: string;
  targetLaneId?: WorldBossLaneId;
  isDisabled: boolean;
  disabledReason?: string;
};

function createFeedEvent(message: string) {
  return {
    key: `${Date.now()}:${message}`,
    messages: [message],
  };
}

export function useWorldBossCombat({
  activeSession,
  setActiveSession,
  localPlayerId,
}: UseWorldBossCombatParams) {
  const [combatNowMs, setCombatNowMs] = useState(() => Date.now());
  const [latestCommittedAction, setLatestCommittedAction] =
    useState<WorldBossPlayerActionSelection | null>(null);
  const [latestFeedBatch, setLatestFeedBatch] = useState<CombatFeedBatch | null>(
    null
  );
  const [combatLog, setCombatLog] = useState<string[]>([]);

  const publishFeedBatch = (feedBatch: CombatFeedBatch) => {
    setLatestFeedBatch(feedBatch);
    setCombatLog((previousLog) => {
      const nextLog = [...previousLog, ...feedBatch.messages];
      return nextLog.slice(-12);
    });
  };

  const boss = activeSession ? worldBossData[activeSession.bossKey] ?? null : null;
  const localParticipant = useMemo(
    () =>
      activeSession
        ? resolveWorldBossParticipantByPlayerId(
            activeSession.participants,
            localPlayerId
          )
        : null,
    [activeSession, localPlayerId]
  );
  const currentSelection =
    activeSession && localParticipant
      ? resolveWorldBossSubmittedAction(activeSession.round, localParticipant.id)
      : null;
  const countdownRemainingMs = activeSession
    ? Math.max(
        0,
        new Date(activeSession.round.playerDecisionDeadlineAt).getTime() - combatNowMs
      )
    : 0;
  const countdownRemainingSeconds = Math.ceil(countdownRemainingMs / 1000);

  useEffect(() => {
    if (!activeSession || activeSession.state !== "active") {
      return;
    }

    const tick = () => {
      const nowMs = Date.now();
      setCombatNowMs(nowMs);

      setActiveSession((currentSession) => {
        if (!currentSession || currentSession.state !== "active") {
          return currentSession;
        }

        if (
          currentSession.round.state !== "collecting-player-actions" ||
          !hasWorldBossPlayerDecisionWindowExpired(currentSession.round, nowMs)
        ) {
          return currentSession;
        }

        const participant = resolveWorldBossParticipantByPlayerId(
          currentSession.participants,
          localPlayerId
        );

        if (!participant) {
          return currentSession;
        }

        const existingSelection = resolveWorldBossSubmittedAction(
          currentSession.round,
          participant.id
        );
        const resolvedSelection =
          existingSelection ??
          createWorldBossPlayerActionSelection({
            participant,
            boss: worldBossData[currentSession.bossKey],
            type: "skip",
            now: new Date(nowMs),
          });

        if (!existingSelection) {
          publishFeedBatch(
            createFeedEvent(
              `World Boss: No action was chosen in time. Your round ${currentSession.round.round} action became Skip.`
            )
          );
        }

        setLatestCommittedAction(resolvedSelection);

        const roundWithResolvedAction = existingSelection
          ? currentSession.round
          : upsertWorldBossSubmittedAction(currentSession.round, resolvedSelection);
        const resolvedSessionState = resolveWorldBossRound({
          session: {
            ...currentSession,
            round: roundWithResolvedAction,
          },
          boss: worldBossData[currentSession.bossKey],
          now: new Date(nowMs),
        });

        publishFeedBatch({
          key: `${nowMs}:world-boss-resolution:${resolvedSessionState.nextSession.round.round}:${resolvedSessionState.messages.join("|")}`,
          messages: resolvedSessionState.messages,
        });

        return resolvedSessionState.nextSession;
      });
    };

    tick();

    const intervalId = window.setInterval(tick, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeSession, localPlayerId, setActiveSession]);

  const actionOptions = useMemo<WorldBossCombatActionOption[]>(() => {
    if (!activeSession || !boss || !localParticipant) {
      return [];
    }

    if (localParticipant.state !== "ready") {
      return [
        {
          key: "inactive",
          label: "Unavailable",
          type: "skip",
          description:
            "You are no longer an active participant in this encounter.",
          isDisabled: true,
          disabledReason:
            "You cannot submit actions after leaving, disconnecting, or dying.",
        },
      ];
    }

    const baseOptions: Array<{
      key: string;
      label: string;
      type: WorldBossPlayerActionType;
      description: string;
      targetLaneId?: WorldBossLaneId;
    }> = [
      {
        key: "basic-melee",
        label: "Basic Melee",
        type: "basic-melee",
        description: "Commit a melee attack for the offensive phase.",
      },
      {
        key: "defend",
        label: "Defend",
        type: "defend",
        description: "Prepare a defensive action for this round.",
      },
      {
        key: "support",
        label: "Support",
        type: "support",
        description: "Prepare a support action for the team.",
      },
      {
        key: "heal",
        label: "Heal",
        type: "heal",
        description: "Prepare a healing action.",
      },
      {
        key: "move-front",
        label: "Move Front",
        type: "lane-change",
        targetLaneId: "front",
        description: "Commit movement to the front lane.",
      },
      {
        key: "move-mid",
        label: "Move Mid",
        type: "lane-change",
        targetLaneId: "mid",
        description: "Commit movement to the mid lane.",
      },
      {
        key: "move-back",
        label: "Move Back",
        type: "lane-change",
        targetLaneId: "back",
        description: "Commit movement to the back lane.",
      },
      {
        key: "skip",
        label: "Skip",
        type: "skip",
        description: "Take no action this round.",
      },
    ];

    return baseOptions.map((option) => {
      const validation = validateWorldBossPlayerAction({
        participant: localParticipant,
        boss,
        type: option.type,
        targetLaneId: option.targetLaneId,
      });

      return {
        ...option,
        isDisabled: !validation.isValid,
        disabledReason: validation.reason,
      };
    });
  }, [activeSession, boss, localParticipant]);

  const submitAction = (params: {
    type: WorldBossPlayerActionType;
    targetLaneId?: WorldBossLaneId;
  }) => {
    if (
      !activeSession ||
      activeSession.state !== "active" ||
      activeSession.round.state !== "collecting-player-actions" ||
      !boss ||
      !localParticipant ||
      localParticipant.state !== "ready"
    ) {
      return {
        didSubmit: false,
        reason: "No active World Boss decision window is available.",
      };
    }

    const validation = validateWorldBossPlayerAction({
      participant: localParticipant,
      boss,
      type: params.type,
      targetLaneId: params.targetLaneId,
    });

    if (!validation.isValid) {
      return {
        didSubmit: false,
        reason: validation.reason ?? "That action is not valid right now.",
      };
    }

    const selection = createWorldBossPlayerActionSelection({
      participant: localParticipant,
      boss,
      type: params.type,
      targetLaneId: params.targetLaneId,
    });

    setActiveSession((currentSession) => {
      if (!currentSession || currentSession.state !== "active") {
        return currentSession;
      }

      return {
        ...currentSession,
        round: upsertWorldBossSubmittedAction(currentSession.round, selection),
      };
    });

    publishFeedBatch(
      createFeedEvent(
        `World Boss: Round ${activeSession.round.round} action selected as ${selection.type}${
          selection.targetLaneId ? ` -> ${selection.targetLaneId}` : ""
        }.`
      )
    );

    return {
      didSubmit: true,
      selection,
    };
  };

  return {
    currentSelection,
    latestCommittedAction,
    latestFeedBatch,
    combatLog,
    countdownRemainingSeconds,
    actionOptions,
    submitAction,
  };
}
