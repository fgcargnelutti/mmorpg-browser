import type { CSSProperties } from "react";
import type { ToastDefinition } from "../../domain/toastTypes";
import "./ToastViewport.css";

type ToastViewportProps = {
  toasts: ToastDefinition[];
  onDismiss: (toastId: string) => void;
};

function getToneIcon(toast: ToastDefinition) {
  if (toast.icon) {
    return toast.icon;
  }

  switch (toast.tone) {
    case "success":
      return "OK";
    case "error":
    case "warning":
      return "!";
    default:
      return "i";
  }
}

function getToastStyle(toast: ToastDefinition) {
  return {
    "--toast-duration-ms": `${toast.durationMs}ms`,
  } as CSSProperties;
}

export default function ToastViewport({
  toasts,
  onDismiss,
}: ToastViewportProps) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <article
          key={toast.id}
          className={`toast-card game-card toast-card--${toast.tone}`}
          role="status"
          data-group-key={toast.groupKey}
          style={getToastStyle(toast)}
        >
          <div className="toast-card__icon-slot game-icon-surface" aria-hidden="true">
            <span className="toast-card__icon">{getToneIcon(toast)}</span>
          </div>

          <div className="toast-card__content">
            {toast.title ? (
              <strong className="toast-card__title">{toast.title}</strong>
            ) : null}
            <p className="toast-card__message">{toast.message}</p>
          </div>

          <button
            type="button"
            className="toast-card__dismiss game-button game-button--ghost game-icon-button"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            x
          </button>

          <div className="toast-card__timer" aria-hidden="true" />
        </article>
      ))}
    </div>
  );
}
