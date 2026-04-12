import "./ContextActions.css";

type ContextAction = {
  id: string;
  label: string;
  description: string;
};

type ContextActionsProps = {
  state: "expanded" | "minimized";
  locationName: string;
  locationDescription: string;
  actions: ContextAction[];
  onMinimize: () => void;
  onExpand: () => void;
};

export default function ContextActions({
  state,
  locationName,
  locationDescription,
  actions,
  onMinimize,
  onExpand,
}: ContextActionsProps) {
  if (state === "minimized") {
    return (
      <button
        className="context-fab"
        type="button"
        onClick={onExpand}
        aria-label="Expand context actions"
        title="Expand context actions"
      >
        ✦
      </button>
    );
  }

  return (
    <section className="context-dialog">
      <div className="context-dialog__header">
        <div>
          <h3>{locationName}</h3>
          <p>{locationDescription}</p>
        </div>

        <button
          className="context-dialog__minimize"
          type="button"
          onClick={onMinimize}
          aria-label="Minimize context actions"
          title="Minimize"
        >
          _
        </button>
      </div>

      <div className="context-dialog__actions">
        {actions.map((action) => (
          <button key={action.id} className="context-dialog__action" type="button">
            <strong>{action.label}</strong>
            <span>{action.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}