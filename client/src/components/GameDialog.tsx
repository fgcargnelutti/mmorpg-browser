import type { ReactNode } from "react";
import "./GameDialog.css";

type GameDialogProps = {
  title: string;
  subtitle?: string;
  isMinimized?: boolean;
  minimizedIcon?: string;
  onMinimize?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  children?: ReactNode;
};

export default function GameDialog({
  title,
  subtitle,
  isMinimized = false,
  minimizedIcon = "✦",
  onMinimize,
  onExpand,
  onClose,
  children,
}: GameDialogProps) {
  if (isMinimized) {
    return (
      <button
        className="game-dialog-fab"
        type="button"
        onClick={onExpand}
        aria-label={`Expand ${title}`}
        title={`Expand ${title}`}
      >
        {minimizedIcon}
      </button>
    );
  }

  return (
    <section className="game-dialog ornate-dialog ornate-corners">
      <div className="game-dialog__header ornate-header">
        <div className="game-dialog__heading">
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        <div className="game-dialog__header-actions">
          {onMinimize ? (
            <button
              className="game-dialog__minimize"
              type="button"
              onClick={onMinimize}
              aria-label={`Minimize ${title}`}
              title="Minimize"
            >
              _
            </button>
          ) : null}

          {onClose ? (
            <button
              className="game-dialog__close"
              type="button"
              onClick={onClose}
              aria-label={`Close ${title}`}
              title="Close"
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      <div className="game-dialog__body">{children}</div>
    </section>
  );
}
