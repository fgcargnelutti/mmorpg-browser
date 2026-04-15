import GameDialog from "../../../../components/GameDialog";
import { useFishingMinigame } from "../../application/hooks/useFishingMinigame";
import type { FishingSpotConfig } from "../../domain/fishingConfigs";
import "./FishingDialog.css";

type FishingDialogProps = {
  isOpen: boolean;
  config: FishingSpotConfig;
  onClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
};

function formatSeconds(milliseconds: number) {
  return (milliseconds / 1000).toFixed(1);
}

export default function FishingDialog({
  isOpen,
  config,
  onClose,
  onSuccess,
  onFailure,
}: FishingDialogProps) {
  const {
    phase,
    hotspot,
    markerPosition,
    tension,
    timeRemainingMs,
    currentDirection,
    idealZoneCenter,
    idealZoneSize,
    handleHotspotClick,
  } = useFishingMinigame({
    config,
    isOpen,
    onCatch: onSuccess,
    onEscape: onFailure,
  });

  if (!isOpen) {
    return null;
  }

  const idealZoneTop = idealZoneCenter - idealZoneSize / 2;

  return (
    <div className="fishing-dialog-anchor">
      <GameDialog
        title={`Fishing - ${config.name}`}
        subtitle={config.description}
        onClose={onClose}
      >
        <div className="fishing-dialog-layout">
          <section className="fishing-panel fishing-panel--lake">
            <div className="fishing-panel__header">
              <strong>Stage 1 - Hook the fish</strong>
              <span>Click the ripple before it disappears.</span>
            </div>

            <div className="fishing-lake">
              <div className="fishing-lake__water" />
              <div className="fishing-lake__reed fishing-lake__reed--left" />
              <div className="fishing-lake__reed fishing-lake__reed--right" />

              {phase === "hook" && hotspot ? (
                <button
                  type="button"
                  className="fishing-hotspot"
                  style={{
                    left: `${hotspot.leftPercent}%`,
                    top: `${hotspot.topPercent}%`,
                  }}
                  onClick={handleHotspotClick}
                  aria-label="Hook the fish"
                >
                  <span className="fishing-hotspot__ring" />
                  <span className="fishing-hotspot__core" />
                </button>
              ) : null}

              {phase === "struggle" ? (
                <div className="fishing-lake__status fishing-lake__status--hooked">
                  Fish hooked. Hold the line.
                </div>
              ) : null}

              {phase === "success" ? (
                <div className="fishing-lake__status fishing-lake__status--success">
                  Catch secured.
                </div>
              ) : null}

              {phase === "failure" ? (
                <div className="fishing-lake__status fishing-lake__status--failure">
                  The line went slack.
                </div>
              ) : null}
            </div>
          </section>

          <section className="fishing-panel fishing-panel--struggle">
            <div className="fishing-panel__header">
              <strong>Stage 2 - Fight the fish</strong>
              <span>Use W and S to keep the marker centered.</span>
            </div>

            <div className="fishing-struggle">
              <div className="fishing-struggle__hud">
                <div className="fishing-struggle__hud-row">
                  <span>Direction</span>
                  <strong>{currentDirection === "up" ? "Pulling Up" : "Pulling Down"}</strong>
                </div>
                <div className="fishing-struggle__hud-row">
                  <span>Time</span>
                  <strong>{formatSeconds(timeRemainingMs)}s</strong>
                </div>
                <div className="fishing-struggle__hud-row">
                  <span>Line Control</span>
                  <strong>{Math.round(tension)}%</strong>
                </div>
              </div>

              <div className="fishing-struggle__body">
                <div className="fishing-struggle__bar">
                  <div
                    className="fishing-struggle__ideal-zone"
                    style={{
                      top: `${idealZoneTop}%`,
                      height: `${idealZoneSize}%`,
                    }}
                  />

                  <div
                    className="fishing-struggle__marker"
                    style={{ top: `${markerPosition}%` }}
                  />
                </div>

                <div className="fishing-struggle__instructions">
                  <span>W - pull upward</span>
                  <span>S - pull downward</span>
                </div>
              </div>

              {(phase === "success" || phase === "failure") && (
                <div className="fishing-struggle__result">
                  <strong>
                    {phase === "success"
                      ? `You caught ${config.rewardAmount}x ${config.rewardItemKey}.`
                      : "The fish escaped this time."}
                  </strong>

                  <div className="fishing-struggle__result-actions">
                    <button type="button" onClick={onClose}>
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </GameDialog>
    </div>
  );
}
