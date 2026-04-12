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

          <div className="combat-dialog-log">
            {combatLog.map((line, index) => (
              <p key={`${line}-${index}`}>{line}</p>
            ))}
          </div>

          <div className="combat-dialog-actions">
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