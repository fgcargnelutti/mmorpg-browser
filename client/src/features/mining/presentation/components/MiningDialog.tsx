import GameDialog from "../../../../components/GameDialog";
import { useMiningMinigame } from "../../application/hooks/useMiningMinigame";
import type { MiningSpotConfig } from "../../domain/miningConfigs";
import "./MiningDialog.css";

type MiningDialogProps = {
  isOpen: boolean;
  config: MiningSpotConfig;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
};

function formatSeconds(milliseconds: number) {
  return (milliseconds / 1000).toFixed(1);
}

export default function MiningDialog({
  isOpen,
  config,
  onClose,
  onSuccess,
  onFailure,
}: MiningDialogProps) {
  const {
    phase,
    weakPoint,
    progress,
    timeRemainingMs,
    hits,
    misses,
    combo,
    impactState,
    handleWeakPointClick,
    handleRockMissClick,
  } = useMiningMinigame({
    config,
    isOpen,
    onSuccess,
    onFailure,
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="mining-dialog-anchor">
      <GameDialog
        title={`Mining - ${config.name}`}
        subtitle={config.description}
        onClose={onClose}
      >
        <div className="mining-dialog-layout">
          <section className="mining-panel mining-panel--core">
            <div className="mining-panel__header">
              <strong>Break the seam</strong>
              <span>Strike the weak points before the opening closes.</span>
            </div>

            <div
              className={`mining-rock mining-rock--${impactState}`}
              onClick={handleRockMissClick}
              role="presentation"
            >
              <div className="mining-rock__surface" />
              <div className="mining-rock__vein mining-rock__vein--one" />
              <div className="mining-rock__vein mining-rock__vein--two" />
              <div className="mining-rock__dust" />

              {phase === "active" && weakPoint ? (
                <button
                  type="button"
                  className="mining-weak-point"
                  style={{
                    left: `${weakPoint.leftPercent}%`,
                    top: `${weakPoint.topPercent}%`,
                    width: `${weakPoint.sizePx}px`,
                    height: `${weakPoint.sizePx}px`,
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleWeakPointClick();
                  }}
                  aria-label="Strike weak point"
                >
                  <span className="mining-weak-point__outer" />
                  <span className="mining-weak-point__inner" />
                  <span className="mining-weak-point__spark" />
                </button>
              ) : null}

              <div className="mining-rock__status">
                {phase === "active"
                  ? "Keep landing clean strikes."
                  : phase === "success"
                    ? "Seam broken."
                    : "The seam holds."}
              </div>
            </div>
          </section>

          <section className="mining-panel mining-panel--hud">
            <div className="mining-panel__header">
              <strong>Extraction status</strong>
              <span>Precision matters more than brute force.</span>
            </div>

            <div className="mining-hud">
              <div className="mining-hud__row">
                <span>Time</span>
                <strong>{formatSeconds(timeRemainingMs)}s</strong>
              </div>
              <div className="mining-hud__row">
                <span>Progress</span>
                <strong>{Math.round(progress)}%</strong>
              </div>
              <div className="mining-hud__row">
                <span>Hits</span>
                <strong>{hits}</strong>
              </div>
              <div className="mining-hud__row">
                <span>Misses</span>
                <strong>{misses}</strong>
              </div>
              <div className="mining-hud__row">
                <span>Combo</span>
                <strong>x{combo}</strong>
              </div>
            </div>

            <div className="mining-progress">
              <div className="mining-progress__label-row">
                <span>Ore extraction</span>
                <strong>{Math.round(progress)}%</strong>
              </div>
              <div className="mining-progress__track">
                <div
                  className="mining-progress__fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mining-instructions">
              <span>Click each weak point before it fades.</span>
              <span>Missing the mark reduces progress slightly.</span>
              <span>Fill the bar before time runs out.</span>
            </div>

            {(phase === "success" || phase === "failure") ? (
              <div className="mining-result">
                <strong>
                  {phase === "success"
                    ? `You extracted ${config.rewardAmount}x ${config.rewardItemKey}.`
                    : "The seam closes before you can break it open."}
                </strong>

                <div className="mining-result__actions">
                  <button type="button" onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </GameDialog>
    </div>
  );
}
