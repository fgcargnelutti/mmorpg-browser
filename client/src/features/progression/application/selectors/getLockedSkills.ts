import type {
  SkillUnlockDefinition,
  SkillUnlockProgressState,
} from "../../domain/skillUnlockTypes";

export function getLockedSkills(
  definitions: Record<string, SkillUnlockDefinition>,
  unlockStates: SkillUnlockProgressState[]
) {
  const statesBySkillKey = new Map(
    unlockStates.map((unlockState) => [unlockState.skillKey, unlockState])
  );

  return Object.values(definitions).filter((definition) => {
    const unlockState = statesBySkillKey.get(definition.skillKey);
    return (unlockState?.state ?? definition.state ?? "locked") !== "unlocked";
  });
}
