import { combatActionCatalog } from "../../domain/combatActionCatalog";
export function resolveCreatureNextAction(combatState, combatantId) {
    const combatant = combatState.combatants[combatantId];
    if (!combatant || combatant.entityType !== "enemy") {
        return combatActionCatalog["basic-attack"];
    }
    return combatActionCatalog["basic-attack"];
}
