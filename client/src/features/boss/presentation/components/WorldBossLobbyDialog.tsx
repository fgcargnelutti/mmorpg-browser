import GameDialog from "../../../../components/GameDialog";
import type { WorldBossLaneId } from "../../domain/worldBossTypes";
import "./WorldBossLobbyDialog.css";

type WorldBossLobbyDialogProps = {
  isOpen: boolean;
  bossName: string;
  bossTitle: string;
  totalPlayers: number;
  countdownRemainingSeconds: number;
  currentLaneId: WorldBossLaneId | null;
  laneSummaries: Array<{
    laneId: WorldBossLaneId;
    label: string;
    description: string;
    playerCount: number;
  }>;
  onSelectLane: (laneId: WorldBossLaneId) => void;
  onLeave: () => void;
};

export default function WorldBossLobbyDialog({
  isOpen,
  bossName,
  bossTitle,
  totalPlayers,
  countdownRemainingSeconds,
  currentLaneId,
  laneSummaries,
  onSelectLane,
  onLeave,
}: WorldBossLobbyDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="world-boss-lobby-anchor">
      <GameDialog
        title={`World Boss Lobby - ${bossName}`}
        subtitle={`${bossTitle}. Select your lane before battle starts. Changing lane here has no cost.`}
      >
        <div className="world-boss-lobby">
          <div className="world-boss-lobby__overview">
            <div className="world-boss-lobby__overview-card">
              <span>Countdown</span>
              <strong>{countdownRemainingSeconds}s</strong>
            </div>
            <div className="world-boss-lobby__overview-card">
              <span>Players Joined</span>
              <strong>{totalPlayers}</strong>
            </div>
            <div className="world-boss-lobby__overview-card">
              <span>Your Lane</span>
              <strong>{currentLaneId ? currentLaneId.toUpperCase() : "None"}</strong>
            </div>
          </div>

          <section className="world-boss-lobby__boss-position">
            <strong>Boss Position</strong>
            <p>
              {bossName} is fixed ahead of the formation. Front lane is closest,
              mid lane is flexible, and back lane is safest.
            </p>
          </section>

          <div className="world-boss-lobby__lanes">
            {laneSummaries.map((lane) => {
              const isSelected = currentLaneId === lane.laneId;

              return (
                <button
                  key={lane.laneId}
                  type="button"
                  className={`world-boss-lobby__lane-card ${
                    isSelected ? "is-selected" : ""
                  }`}
                  onClick={() => onSelectLane(lane.laneId)}
                >
                  <div className="world-boss-lobby__lane-topline">
                    <strong>{lane.label}</strong>
                    <span>{lane.playerCount} player(s)</span>
                  </div>
                  <p>{lane.description}</p>
                  <small>{isSelected ? "Current selection" : "Select lane"}</small>
                </button>
              );
            })}
          </div>

          <div className="world-boss-lobby__distribution">
            {laneSummaries.map((lane) => (
              <div key={`summary-${lane.laneId}`} className="world-boss-lobby__distribution-item">
                <span>{lane.label}</span>
                <strong>{lane.playerCount}</strong>
              </div>
            ))}
          </div>

          <div className="world-boss-lobby__actions">
            <button
              type="button"
              className="world-boss-lobby__leave-button"
              onClick={onLeave}
            >
              Leave Battle
            </button>
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
