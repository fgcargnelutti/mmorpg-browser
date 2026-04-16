import type { UnlockState } from "../../systems/domain/unlockTypes";

export type SkillUnlockSource =
  | { type: "npc"; npcKey: string }
  | { type: "item"; itemKey: string }
  | { type: "document"; documentKey: string }
  | { type: "discovery"; discoveryKey: string }
  | { type: "shop"; vendorKey: string }
  | { type: "enemy_drop"; encounterKey: string }
  | { type: "quest"; questKey: string };

export type SkillUnlockDefinition = {
  skillKey: string;
  title: string;
  description: string;
  state?: UnlockState;
  source: SkillUnlockSource;
  message?: string;
};

export type SkillUnlockProgressState = {
  skillKey: string;
  state: UnlockState;
  unlockedAt?: string;
  discoveredBy?: SkillUnlockSource["type"];
};

// Source-of-truth note:
// - Local prototype: unlock state can be simulated in front-end progression state.
// - Future backend: unlock validation and permanent ownership should move to server authority.
