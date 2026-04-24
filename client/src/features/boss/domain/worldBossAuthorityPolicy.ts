import type {
  WorldBossReconnectPolicy,
  WorldBossResurrectionPolicy,
  WorldBossSessionAuthorityMode,
} from "./worldBossTypes";

// Local prototype authority only. The production version should replace this
// with server-authored scheduling, session membership, round resolution, and
// reward claim validation without forcing UI contract churn.
export const WORLD_BOSS_SESSION_AUTHORITY_MODE: WorldBossSessionAuthorityMode =
  "local-prototype";

// The temporary browser-only prototype does not support reconnect continuation.
// Leaving or disconnecting removes the participant from the encounter.
export const WORLD_BOSS_RECONNECT_POLICY: WorldBossReconnectPolicy = "disabled";

// Resurrection is intentionally disabled for the first prototype, but the
// session model keeps the policy explicit so a future server-driven revive flow
// can be introduced without redefining the session contract.
export const WORLD_BOSS_RESURRECTION_POLICY: WorldBossResurrectionPolicy =
  "future-hook";
