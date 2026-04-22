import {
  WORLD_BOSS_PLAYER_RESOLUTION_PHASES,
  WORLD_BOSS_PLAYER_ROUND_DURATION_MS,
} from "./worldBossLaneRules";
import type { WorldBossDefinition } from "./worldBossTypes";

void WORLD_BOSS_PLAYER_RESOLUTION_PHASES;

export const worldBossData: Record<string, WorldBossDefinition> = {
  "ancient-colossus": {
    key: "ancient-colossus",
    name: "Ancient Colossus",
    title: "Warden of the Broken Frontier",
    mapId: "north-forest",
    description:
      "A prototype World Boss used to validate synchronized raid-session combat, lane pressure, and contribution tracking.",
    maxHp: 4000,
    maxSp: 250,
    baseRoundDurationMs: WORLD_BOSS_PLAYER_ROUND_DURATION_MS,
    laneChangeStaminaCost: 2,
    meleeAttackStaminaCost: 1,
    bossActionsPerTurn: {
      min: 1,
      max: 2,
    },
    actions: [
      {
        key: "crushing-sweep",
        label: "Crushing Sweep",
        type: "lane-attack",
        targeting: "front-lane",
        laneIds: ["front"],
        telegraphRoundsAhead: 1,
        maxExecutionsPerTurn: 1,
        description:
          "A heavy frontal swing aimed at players holding the front line.",
      },
      {
        key: "stone-shrapnel",
        label: "Stone Shrapnel",
        type: "multi-lane-attack",
        targeting: "multiple-lanes",
        laneIds: ["mid", "back"],
        telegraphRoundsAhead: 1,
        maxExecutionsPerTurn: 1,
        description:
          "A burst of jagged debris that threatens the mid and back lanes together.",
      },
      {
        key: "seismic-roar",
        label: "Seismic Roar",
        type: "all-lanes-attack",
        targeting: "all-lanes",
        telegraphRoundsAhead: 1,
        maxExecutionsPerTurn: 1,
        description:
          "A full-arena shockwave that can pressure every lane at once.",
      },
    ],
  },
};
