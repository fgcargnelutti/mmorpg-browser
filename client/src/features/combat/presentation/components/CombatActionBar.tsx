import type { ReactNode } from "react";
import type { CharacterClassKey } from "../../../../data/characterClassesData";
import Tooltip from "../../../../components/Tooltip";
import type {
  CombatActionAvailability,
  CombatActionId,
  CombatState,
} from "../../domain/combatEngineTypes";
import {
  combatActionBarOrder,
  combatActionCatalog,
} from "../../domain/combatActionCatalog";
import { resolveClassCombatActionDefinition } from "../../domain/classCombatActionPresets";
import "./CombatActionBar.css";

type CombatActionBarProps = {
  playerClassKey: CharacterClassKey;
  combatState: CombatState;
  activeCombatantName: string;
  actionAvailabilities: CombatActionAvailability[];
  onAction: (actionId: CombatActionId) => void;
  disabled?: boolean;
  leftControls?: ReactNode;
};

export default function CombatActionBar({
  playerClassKey,
  combatState,
  activeCombatantName,
  actionAvailabilities,
  onAction,
  disabled = false,
  leftControls,
}: CombatActionBarProps) {
  const availabilityByActionId = new Map(
    actionAvailabilities.map((entry) => [entry.actionId, entry])
  );

  return (
    <section className="combat-action-bar">
      <div className="combat-action-bar__header">
        <strong>{activeCombatantName}'s turn</strong>
        <span>Round {combatState.turn.round}</span>
      </div>

      <div className="combat-action-bar__body">
        {leftControls ? (
          <div className="combat-action-bar__controls">{leftControls}</div>
        ) : null}

        <div className="combat-action-bar__grid">
          {combatActionBarOrder.map((actionId) => {
            const action = resolveClassCombatActionDefinition(
              playerClassKey,
              combatActionCatalog[actionId]
            );
            const availability = availabilityByActionId.get(actionId);
            const isDisabled =
              disabled || (availability ? !availability.isEnabled : true);
            const usesLargeImageSlot =
              Boolean(action.iconImageSrc) &&
              (action.type === "skill" ||
                action.id === "basic-attack" ||
                action.id === "dodge" ||
                action.type === "use-potion");

            const tooltipContent = (
              <>
                <strong>{action.label}</strong>
                <p>Hotkey: {action.hotkey ?? "-"}</p>
                {action.description ? <p>{action.description}</p> : null}
                {availability?.reason ? <p>{availability.reason}</p> : null}
              </>
            );

            return (
              <Tooltip key={action.id} content={tooltipContent}>
                <button
                  type="button"
                  className={`combat-action-bar__button combat-action-bar__button--${action.type} ${usesLargeImageSlot ? "combat-action-bar__button--skill-image" : ""}`}
                  onClick={() => onAction(action.id)}
                  disabled={isDisabled}
                  aria-label={action.label}
                >
                  {action.iconImageSrc ? (
                    <img
                      className="combat-action-bar__icon-image"
                      src={action.iconImageSrc}
                      alt=""
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="combat-action-bar__icon"
                      data-icon-key={action.iconKey}
                      aria-hidden="true"
                    >
                      {action.fallbackIcon ?? "•"}
                    </span>
                  )}
                  <span className="combat-action-bar__hotkey">
                    {action.hotkey ?? "-"}
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </section>
  );
}
