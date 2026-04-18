import "./MapGlobalActionsPanel.css";
import type { MapGlobalAction } from "../../domain/mapsData";
import type { ContinuousCombatLoopStatus } from "../../../combat/application/systems/continuousCombatLoopSystem";

type MapGlobalActionsPanelProps = {
  actions: MapGlobalAction[];
  huntingStatus: ContinuousCombatLoopStatus;
  activeActionLabel?: string | null;
  completedEncounters?: number;
  onAction: (action: MapGlobalAction) => void;
  onStop: () => void;
};

export default function MapGlobalActionsPanel({
  actions,
  huntingStatus,
  activeActionLabel,
  completedEncounters = 0,
  onAction,
  onStop,
}: MapGlobalActionsPanelProps) {
  if (actions.length === 0 && huntingStatus !== "hunting") {
    return null;
  }

  return (
    <aside className="map-global-actions-panel">
      <div className="map-global-actions-panel__header">
        <strong>Map Actions</strong>
        {huntingStatus === "hunting" ? (
          <span className="map-global-actions-panel__badge">Active</span>
        ) : null}
      </div>

      {huntingStatus === "hunting" ? (
        <div className="map-global-actions-panel__active">
          <div>
            <strong>{activeActionLabel ?? "Hunting"}</strong>
            <p>{completedEncounters} encounter(s) cleared in this run.</p>
          </div>

          <button
            type="button"
            className="map-global-actions-panel__button map-global-actions-panel__button--stop"
            onClick={onStop}
          >
            Stop
          </button>
        </div>
      ) : (
        <div className="map-global-actions-panel__list">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="map-global-actions-panel__button"
              onClick={() => onAction(action)}
            >
              <strong>{action.label}</strong>
              <span>{action.description}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
