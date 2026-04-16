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
      return "✓";
    case "error":
      return "!";
    case "warning":
      return "•";
    default:
      return "i";
  }
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
          className={`toast-card toast-card--${toast.tone}`}
          role="status"
        >
          <div className="toast-card__icon" aria-hidden="true">
            {getToneIcon(toast)}
          </div>

          <div className="toast-card__content">
            {toast.title ? (
              <strong className="toast-card__title">{toast.title}</strong>
            ) : null}
            <p className="toast-card__message">{toast.message}</p>
          </div>

          <button
            type="button"
            className="toast-card__dismiss"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
          >
            ×
          </button>
        </article>
      ))}
    </div>
  );
}
