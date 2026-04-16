import type { UnlockDescriptor } from "../../../systems/domain/unlockTypes";
import type {
  SkillUnlockDefinition,
  SkillUnlockProgressState,
  SkillUnlockSource,
} from "../../domain/skillUnlockTypes";

export function createInitialSkillUnlockState(
  definition: SkillUnlockDefinition
): SkillUnlockProgressState {
  return {
    skillKey: definition.skillKey,
    state: definition.state ?? "locked",
  };
}

export function applySkillUnlockDescriptor(
  unlockStates: SkillUnlockProgressState[],
  unlock: UnlockDescriptor
): SkillUnlockProgressState[] {
  if (unlock.type !== "skill") {
    return unlockStates;
  }

  return unlockStates.map((unlockState) => {
    if (unlockState.skillKey !== unlock.key) {
      return unlockState;
    }

    if (unlockState.state === "unlocked") {
      return unlockState;
    }

    return {
      ...unlockState,
      state: "unlocked",
      unlockedAt: unlockState.unlockedAt ?? new Date().toISOString(),
    };
  });
}

export function unlockSkillBySource(
  unlockStates: SkillUnlockProgressState[],
  skillKey: string,
  source: SkillUnlockSource["type"]
): SkillUnlockProgressState[] {
  return unlockStates.map((unlockState) => {
    if (unlockState.skillKey !== skillKey) {
      return unlockState;
    }

    if (unlockState.state === "unlocked") {
      return unlockState;
    }

    return {
      ...unlockState,
      state: "unlocked",
      unlockedAt: unlockState.unlockedAt ?? new Date().toISOString(),
      discoveredBy: source,
    };
  });
}
