export function getLockedSkills(definitions, unlockStates) {
    const statesBySkillKey = new Map(unlockStates.map((unlockState) => [unlockState.skillKey, unlockState]));
    return Object.values(definitions).filter((definition) => {
        const unlockState = statesBySkillKey.get(definition.skillKey);
        return (unlockState?.state ?? definition.state ?? "locked") !== "unlocked";
    });
}
