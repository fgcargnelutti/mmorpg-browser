import type {
  SkillUnlockDefinition,
  SkillUnlockProgressState,
} from "../../domain/skillUnlockTypes";

export function getUnlockedSkills(
  definitions: Record<string, SkillUnlockDefinition>,
  unlockStates: SkillUnlockProgressState[]
) {
  const statesBySkillKey = new Map(
    unlockStates.map((unlockState) => [unlockState.skillKey, unlockState])
  );

  return Object.values(definitions).filter((definition) => {
    const unlockState = statesBySkillKey.get(definition.skillKey);
    return unlockState?.state === "unlocked";
  });
}
