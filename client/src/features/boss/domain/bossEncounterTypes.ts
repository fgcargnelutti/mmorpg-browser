import type { Reward } from "../../systems/domain/rewardTypes";
import type { ParticipationSnapshot } from "../../systems/domain/participationTypes";

export type BossEncounterState =
  | "locked"
  | "available"
  | "forming"
  | "active"
  | "completed"
  | "failed";

export type BossDefinition = {
  key: string;
  name: string;
  title: string;
  description: string;
  mapId: string;
  maxHp: number;
  rewardPool: Reward[];
};

export type BossEncounterInstance = {
  encounterKey: string;
  bossKey: string;
  state: BossEncounterState;
  currentHp: number;
  maxHp: number;
  participants: ParticipationSnapshot;
  startedAt?: string;
  endedAt?: string;
};

// Source-of-truth note:
// - Local prototype: encounter flow and participants may be simulated client-side.
// - Future backend: participant membership, damage, boss HP, rewards, and encounter
//   completion must become authoritative and synchronized by the server.
