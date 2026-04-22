import { useEffect, useRef } from "react";
import GameDialog from "./GameDialog";
import "./CombatDialog.css";
import CombatActionBar from "../features/combat/presentation/components/CombatActionBar";
import type {
  CombatActionAvailability,
  CombatActionId,
  CombatState,
} from "../features/combat/domain/combatEngineTypes";

type CombatDialogProps = {
  isOpen: boolean;
  enemyName: string;
  enemyTitle: string;
  enemyHp: number;
  enemyMaxHp: number;
  combatLog: string[];
  combatState: CombatState | null;
  actionAvailabilities: CombatActionAvailability[];
  isResolved: boolean;
  onAction: (actionId: CombatActionId) => void;
  onRetreat: () => void;
  onClose: () => void;
  loopStatusLabel?: string | null;
  onStopLoop?: () => void;
};

export default function CombatDialog({
  isOpen,
  enemyName,
  enemyTitle: _enemyTitle,
  enemyHp,
  enemyMaxHp,
  combatLog,
  combatState,
  actionAvailabilities,
  isResolved,
  onAction,
  onRetreat,
  onClose,
  loopStatusLabel: _loopStatusLabel,
  onStopLoop,
}: CombatDialogProps) {
  const logViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const logViewport = logViewportRef.current;

    if (!logViewport) {
      return;
    }

    logViewport.scrollTop = logViewport.scrollHeight;
  }, [combatLog]);

  if (!isOpen) return null;

  const hpPercent =
    enemyMaxHp > 0 ? Math.max(0, (enemyHp / enemyMaxHp) * 100) : 0;
  const activeCombatantName = combatState
    ? combatState.combatants[combatState.turn.activeCombatantId]?.name ?? "Unknown"
    : "Unknown";
  const hasCombatStarted = combatLog.length > 1;
  const showStopHuntOnly = !hasCombatStarted && Boolean(onStopLoop);
  const showRetreat = !isResolved && hasCombatStarted;
  const leftControls = (
    <>
      {showStopHuntOnly && onStopLoop ? (
        <button
          type="button"
          className="combat-dialog-button combat-dialog-button--secondary"
          onClick={onStopLoop}
        >
          Stop Hunt
        </button>
      ) : null}

      {showRetreat ? (
        <button
          type="button"
          className="combat-dialog-button combat-dialog-button--secondary"
          onClick={onRetreat}
        >
          Retreat
        </button>
      ) : null}
    </>
  );

  return (
    <div className="combat-dialog-anchor">
      <GameDialog title="" onClose={onClose}>
        <div className="combat-dialog-layout">
          <div className="combat-dialog-main">
            <div className="combat-dialog-log-panel">
              <div className="combat-dialog-panel-title">Combat Log</div>

              <div ref={logViewportRef} className="combat-dialog-log">
                {combatLog.map((line, index) => (
                  <p key={`${line}-${index}`}>{line}</p>
                ))}
              </div>
            </div>

            <div className="combat-dialog-creature-panel" aria-label="Creature panel">
              <div className="combat-dialog-creature-stage">
                <div className="combat-dialog-creature-overlay">
                  <strong>{enemyName}</strong>

                  <div className="combat-dialog-creature-hp">
                    <span>Hitpoints</span>
                    <span>
                      {enemyHp} / {enemyMaxHp}
                    </span>
                  </div>

                  <div className="combat-dialog-hp-bar">
                    <div
                      className="combat-dialog-hp-bar-fill"
                      style={{ width: `${hpPercent}%` }}
                    />
                  </div>
                </div>

                <div className="combat-dialog-portrait-frame">
                  <div className="combat-dialog-portrait-glow" />
                </div>
              </div>
            </div>
          </div>

          <div className="combat-dialog-bottom">
            {combatState ? (
              <CombatActionBar
                combatState={combatState}
                activeCombatantName={activeCombatantName}
                actionAvailabilities={actionAvailabilities}
                onAction={onAction}
                leftControls={leftControls}
                disabled={
                  combatState.turn.activeCombatantId !== combatState.playerCombatantId
                }
              />
            ) : null}
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
