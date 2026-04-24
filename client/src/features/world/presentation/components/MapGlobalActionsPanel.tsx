import "./MapGlobalActionsPanel.css";
import type { MapGlobalAction } from "../../domain/mapsData";
import type { ContinuousCombatLoopStatus } from "../../../combat/application/systems/continuousCombatLoopSystem";

type MapGlobalActionsPanelProps = {
  actions: MapGlobalAction[];
  huntingStatus: ContinuousCombatLoopStatus;
  activeActionLabel?: string | null;
  completedEncounters?: number;
  worldBossNotice?: {
    title: string;
    message: string;
    statusLabel: string;
    joinEndsAtLabel?: string | null;
    entryPointTitle?: string;
    entryPointMessage?: string;
  } | null;
  worldBossAction?: {
    label: string;
    description: string;
    tone?: "join" | "leave";
  } | null;
  onWorldBossAction?: () => void;
  onAction: (action: MapGlobalAction) => void;
  onStop: () => void;
};

export default function MapGlobalActionsPanel({
  actions,
  huntingStatus,
  activeActionLabel,
  completedEncounters = 0,
  worldBossNotice,
  worldBossAction,
  onWorldBossAction,
  onAction,
  onStop,
}: MapGlobalActionsPanelProps) {
  if (actions.length === 0 && huntingStatus !== "hunting" && !worldBossNotice) {
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

      {worldBossNotice ? (
        <section className="map-global-actions-panel__notice">
          <div className="map-global-actions-panel__notice-header">
            <strong>{worldBossNotice.title}</strong>
            <span className="map-global-actions-panel__notice-badge">
              {worldBossNotice.statusLabel}
            </span>
          </div>

          <p>{worldBossNotice.message}</p>

          {worldBossNotice.joinEndsAtLabel ? (
            <div className="map-global-actions-panel__notice-meta">
              Join window until {worldBossNotice.joinEndsAtLabel}
            </div>
          ) : null}

          {worldBossNotice.entryPointTitle && worldBossNotice.entryPointMessage ? (
            <div className="map-global-actions-panel__notice-entry-point">
              <strong>{worldBossNotice.entryPointTitle}</strong>
              <span>{worldBossNotice.entryPointMessage}</span>
            </div>
          ) : null}

          {worldBossAction && onWorldBossAction ? (
            <button
              type="button"
              className={`map-global-actions-panel__button map-global-actions-panel__button--world-boss map-global-actions-panel__button--${worldBossAction.tone ?? "join"}`}
              onClick={onWorldBossAction}
            >
              <strong>{worldBossAction.label}</strong>
              <span>{worldBossAction.description}</span>
            </button>
          ) : null}
        </section>
      ) : null}

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
