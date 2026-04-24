import type { CharacterClassKey } from "../../../../data/characterClassesData";
import { playerCombatProfiles } from "../../../combat/domain/playerCombatProfiles";
import { worldBossData } from "../../domain/worldBossData";
import {
  WORLD_BOSS_PLAYER_RESOLUTION_PHASES,
  WORLD_BOSS_PLAYER_ROUND_DURATION_MS,
} from "../../domain/worldBossLaneRules";
import type {
  WorldBossLaneId,
  WorldBossParticipant,
  WorldBossPlayerSnapshot,
  WorldBossParticipantRole,
  WorldBossSession,
} from "../../domain/worldBossTypes";
import { createInitialWorldBossContribution } from "./worldBossContributionSystem";
import {
  WORLD_BOSS_RECONNECT_POLICY,
  WORLD_BOSS_RESURRECTION_POLICY,
  WORLD_BOSS_SESSION_AUTHORITY_MODE,
} from "../../domain/worldBossAuthorityPolicy";

function resolveWorldBossParticipantRole(
  classKey: CharacterClassKey
): WorldBossParticipantRole {
  switch (classKey) {
    case "wasteland-warrior":
      return "tank";
    case "thief":
      return "melee";
    case "arcanist":
      return "ranged";
    default:
      return "hybrid";
  }
}

function resolveDefaultLaneId(classKey: CharacterClassKey): WorldBossLaneId {
  switch (classKey) {
    case "wasteland-warrior":
      return "front";
    case "thief":
      return "mid";
    case "arcanist":
      return "back";
    default:
      return "mid";
  }
}

function createSessionId(bossKey: string, now: Date) {
  return `world-boss:${bossKey}:${now.getTime()}`;
}

function createParticipant(
  player: WorldBossPlayerSnapshot,
  nowIso: string
): WorldBossParticipant {
  return {
    id: `boss-player:${player.id}`,
    playerId: player.id,
    name: player.name,
    classKey: player.classKey,
    role: resolveWorldBossParticipantRole(player.classKey),
    laneId: resolveDefaultLaneId(player.classKey),
    state: "ready",
    currentHp: player.currentHp,
    maxHp: player.maxHp,
    currentSp: player.currentSp,
    maxSp: player.maxSp,
    currentStamina: player.currentStamina,
    maxStamina: player.maxStamina,
    joinedAt: nowIso,
    lastConfirmedAt: nowIso,
  };
}

export function createWorldBossSession(params: {
  bossKey: string;
  localPlayer: WorldBossPlayerSnapshot;
  joinedPlayers?: WorldBossPlayerSnapshot[];
  countdownDurationMs?: number;
  now?: Date;
}): WorldBossSession {
  const now = params.now ?? new Date();
  const nowIso = now.toISOString();
  const boss = worldBossData[params.bossKey];

  if (!boss) {
    throw new Error(`Unknown World Boss key: ${params.bossKey}`);
  }

  const joinedPlayers = [
    params.localPlayer,
    ...(params.joinedPlayers ?? []).filter(
      (player) => player.id !== params.localPlayer.id
    ),
  ];
  const participants = joinedPlayers.map((player) =>
    createParticipant(player, nowIso)
  );
  const countdownDurationMs = Math.max(0, params.countdownDurationMs ?? 10_000);
  const playerDecisionDeadlineAt = new Date(
    now.getTime() + countdownDurationMs + WORLD_BOSS_PLAYER_ROUND_DURATION_MS
  ).toISOString();

  return {
    sessionId: createSessionId(boss.key, now),
    bossKey: boss.key,
    state: "forming",
    authorityMode: WORLD_BOSS_SESSION_AUTHORITY_MODE,
    reconnectPolicy: WORLD_BOSS_RECONNECT_POLICY,
    resurrectionPolicy: WORLD_BOSS_RESURRECTION_POLICY,
    createdAt: nowIso,
    availableAt: nowIso,
    lobbyCountdownDurationMs: countdownDurationMs,
    boss: {
      name: boss.name,
      title: boss.title,
      currentHp: boss.maxHp,
      maxHp: boss.maxHp,
      currentSp: boss.maxSp,
      maxSp: boss.maxSp,
    },
    participants,
    round: {
      round: 1,
      state: "collecting-player-actions",
      playerWindowDurationMs: boss.baseRoundDurationMs,
      playerDecisionDeadlineAt,
      resolutionPhases: [...WORLD_BOSS_PLAYER_RESOLUTION_PHASES],
      submittedPlayerActions: [],
      bossActionQueue: boss.actions.slice(0, boss.bossActionsPerTurn.max),
      activeTelegraphs: [],
      preparedEffects: [],
    },
    contribution: createInitialWorldBossContribution(participants),
  };
}

export function resolveWorldBossSuggestedLaneForClass(
  classKey: CharacterClassKey
) {
  return resolveDefaultLaneId(classKey);
}

export function resolveWorldBossSuggestedActionEconomy(
  classKey: CharacterClassKey
) {
  const profile = playerCombatProfiles[classKey];

  return {
    baseActionsPerRound: profile.baseActionsPerTurn,
    bonusActions: 0,
  };
}
