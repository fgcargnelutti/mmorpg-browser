import { combatActionCatalog } from "../../domain/combatActionCatalog";
import type { CombatActionDefinition, CombatState } from "../../domain/combatEngineTypes";

export function resolveCreatureNextAction(
  combatState: CombatState,
  combatantId: string
): CombatActionDefinition {
  const combatant = combatState.combatants[combatantId];

  if (!combatant || combatant.entityType !== "enemy") {
    return combatActionCatalog["basic-attack"];
  }

  return combatActionCatalog["basic-attack"];
}
