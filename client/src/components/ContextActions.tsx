import GameDialog from "./GameDialog";
import "./ContextActions.css";
import type { ContextAction } from "../features/world";

type ContextActionsProps = {
  state: "hidden" | "expanded" | "minimized";
  locationName: string;
  locationDescription: string;
  actions: ContextAction[];
  onMinimize: () => void;
  onExpand: () => void;
  onAction: (action: ContextAction) => void;
};

export default function ContextActions({
  state,
  locationName,
  locationDescription,
  actions,
  onMinimize,
  onExpand,
  onAction,
}: ContextActionsProps) {
  if (state === "hidden") {
    return null;
  }

  return (
    <GameDialog
      title={locationName}
      subtitle={locationDescription}
      isMinimized={state === "minimized"}
      minimizedIcon="✦"
      onMinimize={onMinimize}
      onExpand={onExpand}
    >
      <div className="context-dialog__actions">
        {actions.map((action) => (
          <button
            key={action.id}
            className="context-dialog__action ornate-button"
            type="button"
            onClick={() => onAction(action)}
          >
            <strong>{action.label}</strong>
            <span>{action.description}</span>
          </button>
        ))}
      </div>
    </GameDialog>
  );
}
