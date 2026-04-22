import type { CharacterClassKey } from "../../../data/characterClassesData";

export type RegenResourceKey = "hp" | "sp" | "stamina";

export type RegenTickConfig = {
  amount: number;
  intervalMs: number;
};

export type ClassRegenConfig = {
  hp: RegenTickConfig;
  sp: RegenTickConfig;
};

export type SharedRegenConfig = {
  stamina: RegenTickConfig;
  offlineStamina: RegenTickConfig;
};

export type ResolvedRegenConfig = ClassRegenConfig & SharedRegenConfig;

export type CharacterRegenConfigMap = Record<CharacterClassKey, ClassRegenConfig>;

export type PlayerRegenState = {
  hpAnchorAt: number;
  spAnchorAt: number;
  staminaAnchorAt: number;
  lastSeenAt: number;
};

export type RegenApplicationSummary = {
  hpRecovered: number;
  spRecovered: number;
  staminaRecovered: number;
};

