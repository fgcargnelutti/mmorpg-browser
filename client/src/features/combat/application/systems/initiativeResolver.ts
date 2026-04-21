import type {
  CombatInitiativeState,
  CombatantRuntimeState,
} from "../../domain/combatEngineTypes";

export function resolveInitiativeState(
  base: number,
  modifier = 0
): CombatInitiativeState {
  return {
    base,
    modifier,
    computed: base + modifier,
  };
}

export function resolveCombatTurnOrder(combatants: CombatantRuntimeState[]) {
  return [...combatants]
    .sort((left, right) => {
      const initiativeDifference =
        right.initiative.computed - left.initiative.computed;

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
