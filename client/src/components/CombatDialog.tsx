import GameDialog from "./GameDialog";
import "./CombatDialog.css";

type CombatDialogProps = {
  isOpen: boolean;
  enemyName: string;
  enemyTitle: string;
  enemyHp: number;
  enemyMaxHp: number;
  combatLog: string[];
  isResolved: boolean;
  onAttack: () => void;
  onRetreat: () => void;
  onClose: () => void;
  loopStatusLabel?: string | null;
  onStopLoop?: () => void;
};

export default function CombatDialog({
  isOpen,
  enemyName,
  enemyTitle,
  enemyHp,
  enemyMaxHp,
  combatLog,
  isResolved,
  onAttack,
  onRetreat,
  onClose,
  loopStatusLabel,
  onStopLoop,
}: CombatDialogProps) {
  if (!isOpen) return null;

  const hpPercent =
    enemyMaxHp > 0 ? Math.max(0, (enemyHp / enemyMaxHp) * 100) : 0;

  return (
    <div className="combat-dialog-anchor">
      <GameDialog title={enemyName} subtitle={enemyTitle} onClose={onClose}>
        <div className="combat-dialog-layout">
          <div className="combat-dialog-enemy-card">
            <div className="combat-dialog-enemy-header">
              <strong>{enemyName}</strong>
              <span>
                HP {enemyHp} / {enemyMaxHp}
              </span>
            </div>

            <div className="combat-dialog-hp-bar">
              <div
                className="combat-dialog-hp-bar-fill"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          <div className="combat-dialog-portrait-panel" aria-hidden="true">
            <div className="combat-dialog-portrait-frame">
              <div className="combat-dialog-portrait-badge">Creature</div>
              <div className="combat-dialog-portrait-glow" />
              <div className="combat-dialog-portrait-copy">
                <strong>{enemyName}</strong>
                <span>{enemyTitle}</span>
              </div>
            </div>
          </div>

          <div className="combat-dialog-log">
            {combatLog.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>

          <div className="combat-dialog-actions">
            {loopStatusLabel ? (
              <div className="combat-dialog-loop-status">
                <span>{loopStatusLabel}</span>
                {onStopLoop ? (
                  <button
                    type="button"
                    className="combat-dialog-button"
                    onClick={onStopLoop}
                  >
                    Stop Hunt
                  </button>
                ) : null}
              </div>
            ) : null}
            {isResolved ? (
              <button
                type="button"
                className="combat-dialog-button combat-dialog-button--primary"
                onClick={onClose}
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="combat-dialog-button combat-dialog-button--primary"
                  onClick={onAttack}
                >
                  Attack
                </button>

                <button
                  type="button"
                  className="combat-dialog-button"
                  onClick={onRetreat}
                >
                  Retreat
                </button>
              </>
            )}
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
