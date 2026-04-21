import type {
  CombatActionAvailability,
  CombatActionId,
  CombatState,
} from "../../domain/combatEngineTypes";
import {
  combatActionBarOrder,
  combatActionCatalog,
} from "../../domain/combatActionCatalog";
import "./CombatActionBar.css";

type CombatActionBarProps = {
  combatState: CombatState;
  activeCombatantName: string;
  actionAvailabilities: CombatActionAvailability[];
  onAction: (actionId: CombatActionId) => void;
  disabled?: boolean;
};

export default function CombatActionBar({
  combatState,
  activeCombatantName,
  actionAvailabilities,
  onAction,
  disabled = false,
}: CombatActionBarProps) {
  const availabilityByActionId = new Map(
    actionAvailabilities.map((entry) => [entry.actionId, entry])
  );
  const activeCombatant = combatState.combatants[combatState.turn.activeCombatantId];

  return (
    <section className="combat-action-bar">
      <div className="combat-action-bar__header">
        <strong>{activeCombatantName}'s turn</strong>
        <span>
          Round {combatState.turn.round} • Actions{" "}
          {activeCombatant.actionEconomy.actionsRemaining}
        </span>
      </div>

      <div className="combat-action-bar__grid">
        {combatActionBarOrder.map((actionId) => {
          const action = combatActionCatalog[actionId];
          const availability = availabilityByActionId.get(actionId);
          const isDisabled =
            disabled || (availability ? !availability.isEnabled : true);

          return (
            <button
              key={action.id}
              type="button"
              className={`combat-action-bar__button combat-action-bar__button--${action.type}`}
              onClick={() => onAction(action.id)}
              disabled={isDisabled}
              title={availability?.reason}
            >
              <span className="combat-action-bar__label">{action.label}</span>
              <span className="combat-action-bar__hotkey">{action.hotkey ?? "-"}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
