import GameDialog from "../../../../components/GameDialog";
import CharacterAvatar from "../../../../components/CharacterAvatar";
import { resolveCharacterAvatarByClassKey } from "../../../../data/characterAvatarCatalog";
import type {
  WorldBossLaneId,
  WorldBossParticipantSummary,
  WorldBossPlayerActionSelection,
} from "../../domain/worldBossTypes";
import "./WorldBossActionDialog.css";

type WorldBossActionDialogProps = {
  isOpen: boolean;
  bossName: string;
  bossTitle: string;
  bossCurrentHp: number;
  bossMaxHp: number;
  round: number;
  currentLaneId: WorldBossLaneId | null;
  countdownRemainingSeconds: number;
  telegraphs: Array<{
    id: string;
    message: string;
    resolvesAtRound: number;
  }>;
  participants: WorldBossParticipantSummary[];
  currentSelection: WorldBossPlayerActionSelection | null;
  latestCommittedAction: WorldBossPlayerActionSelection | null;
  combatLog: string[];
  actionOptions: Array<{
    key: string;
    label: string;
    description: string;
    type: string;
    targetLaneId?: WorldBossLaneId;
    isDisabled: boolean;
    disabledReason?: string;
  }>;
  onSelectAction: (params: {
    type: WorldBossPlayerActionSelection["type"];
    targetLaneId?: WorldBossLaneId;
  }) => void;
  onLeaveBattle: () => void;
};

function formatSelectionLabel(selection: WorldBossPlayerActionSelection | null) {
  if (!selection) {
    return "No action selected yet.";
  }

  return selection.targetLaneId
    ? `${selection.type} -> ${selection.targetLaneId}`
    : selection.type;
}

export default function WorldBossActionDialog({
  isOpen,
  bossName,
  bossTitle,
  bossCurrentHp,
  bossMaxHp,
  round,
  currentLaneId,
  countdownRemainingSeconds,
  telegraphs,
  participants,
  currentSelection,
  latestCommittedAction,
  combatLog,
  actionOptions,
  onSelectAction,
  onLeaveBattle,
}: WorldBossActionDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="world-boss-action-anchor">
      <GameDialog
        title={`World Boss Round - ${bossName}`}
        subtitle={`${bossTitle}. Combat shell for synchronized rounds, telegraphs, and battlefield status.`}
      >
        <div className="world-boss-action-dialog">
          <div className="world-boss-action-dialog__overview">
            <div className="world-boss-action-dialog__overview-card">
              <span>Round</span>
              <strong>{round}</strong>
            </div>
            <div className="world-boss-action-dialog__overview-card">
              <span>Decision Window</span>
              <strong>{countdownRemainingSeconds}s</strong>
            </div>
            <div className="world-boss-action-dialog__overview-card">
              <span>Current Lane</span>
              <strong>{currentLaneId ? currentLaneId.toUpperCase() : "None"}</strong>
            </div>
            <div className="world-boss-action-dialog__overview-card">
              <span>Boss HP</span>
              <strong>
                {bossCurrentHp}/{bossMaxHp}
              </strong>
            </div>
          </div>

          <div className="world-boss-action-dialog__layout">
            <div className="world-boss-action-dialog__main-column">
              <div className="world-boss-action-dialog__status">
                <div>
                  <strong>Current Selection</strong>
                  <p>{formatSelectionLabel(currentSelection)}</p>
                </div>
                <div>
                  <strong>Last Locked Action</strong>
                  <p>{formatSelectionLabel(latestCommittedAction)}</p>
                </div>
              </div>

              {telegraphs.length > 0 ? (
                <div className="world-boss-action-dialog__telegraphs">
                  <strong>Boss Telegraphs</strong>
                  <div className="world-boss-action-dialog__telegraph-list">
                    {telegraphs.map((telegraph) => (
                      <div
                        key={telegraph.id}
                        className="world-boss-action-dialog__telegraph-item"
                      >
                        <span>{telegraph.message}</span>
                        <small>Resolves on round {telegraph.resolvesAtRound}</small>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="world-boss-action-dialog__grid">
                {actionOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className="world-boss-action-dialog__button"
                    disabled={option.isDisabled}
                    onClick={() =>
                      onSelectAction({
                        type: option.type as WorldBossPlayerActionSelection["type"],
                        targetLaneId: option.targetLaneId,
                      })
                    }
                    title={option.isDisabled ? option.disabledReason : option.description}
                  >
                    <strong>{option.label}</strong>
                    <span>
                      {option.isDisabled && option.disabledReason
                        ? option.disabledReason
                        : option.description}
                    </span>
                  </button>
                ))}
              </div>

              <div className="world-boss-action-dialog__combat-log">
                <strong>Combat Log</strong>
                <div className="world-boss-action-dialog__combat-log-list">
                  {combatLog.length > 0 ? (
                    combatLog.slice().reverse().map((entry, index) => (
                      <div
                        key={`${entry}:${index}`}
                        className="world-boss-action-dialog__combat-log-item"
                      >
                        {entry}
                      </div>
                    ))
                  ) : (
                    <div className="world-boss-action-dialog__combat-log-item">
                      No combat events yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="world-boss-action-dialog__actions">
                <button
                  type="button"
                  className="world-boss-action-dialog__leave-button"
                  onClick={onLeaveBattle}
                >
                  Leave Battle
                </button>
              </div>
            </div>

            <aside className="world-boss-action-dialog__status-panel">
              <strong className="world-boss-action-dialog__status-panel-title">
                Participants
              </strong>
              <div className="world-boss-action-dialog__participant-list">
                {participants.map((participant) => {
                  const avatar = resolveCharacterAvatarByClassKey(
                    participant.classKey
                  );
                  const hpPercent =
                    participant.maxHp > 0
                      ? Math.max(
                          0,
                          Math.min(
                            100,
                            (participant.currentHp / participant.maxHp) * 100
                          )
                        )
                      : 0;
                  const spPercent =
                    participant.maxSp > 0
                      ? Math.max(
                          0,
                          Math.min(
                            100,
                            (participant.currentSp / participant.maxSp) * 100
                          )
                        )
                      : 0;

                  return (
                    <div
                      key={participant.id}
                      className="world-boss-action-dialog__participant-card"
                    >
                      <CharacterAvatar
                        src={avatar.imageSrc}
                        alt={avatar.altLabel}
                        size="sm"
                      />
                      <div className="world-boss-action-dialog__participant-info">
                        <div className="world-boss-action-dialog__participant-topline">
                          <strong>{participant.name}</strong>
                          <span>{participant.laneId.toUpperCase()}</span>
                        </div>
                        <div className="world-boss-action-dialog__resource">
                          <span>HP</span>
                          <div className="world-boss-action-dialog__resource-bar">
                            <div
                              className="world-boss-action-dialog__resource-fill world-boss-action-dialog__resource-fill--hp"
                              style={{ width: `${hpPercent}%` }}
                            />
                          </div>
                        </div>
                        <div className="world-boss-action-dialog__resource">
                          <span>SP</span>
                          <div className="world-boss-action-dialog__resource-bar">
                            <div
                              className="world-boss-action-dialog__resource-fill world-boss-action-dialog__resource-fill--sp"
                              style={{ width: `${spPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
