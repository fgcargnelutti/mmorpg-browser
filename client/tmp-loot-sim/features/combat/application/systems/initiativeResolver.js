export function resolveInitiativeState(base, modifier = 0) {
    return {
        base,
        modifier,
        computed: base + modifier,
    };
}
export function resolveCombatTurnOrder(combatants) {
    return [...combatants]
        .sort((left, right) => {
        const initiativeDifference = right.initiative.computed - left.initiative.computed;
        if (initiativeDifference !== 0) {
            return initiativeDifference;
        }
        if (left.entityType === right.entityType) {
            return left.id.localeCompare(right.id);
        }
        return left.entityType === "player" ? -1 : 1;
    })
        .map((combatant) => combatant.id);
}
