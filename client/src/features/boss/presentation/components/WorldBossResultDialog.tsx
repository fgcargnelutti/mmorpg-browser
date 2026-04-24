import GameDialog from "../../../../components/GameDialog";
import type { WorldBossResultSummary } from "../../application/selectors/resolveWorldBossResultSummary";
import "./WorldBossResultDialog.css";

type WorldBossResultDialogProps = {
  isOpen: boolean;
  bossName: string;
  bossTitle: string;
  summary: WorldBossResultSummary;
  onClose: () => void;
};

export default function WorldBossResultDialog({
  isOpen,
  bossName,
  bossTitle,
  summary,
  onClose,
}: WorldBossResultDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="world-boss-result-anchor">
      <GameDialog
        title={`World Boss Result - ${bossName}`}
        subtitle={`${bossTitle}. Review the outcome, your contribution, and the reward cache before closing the session.`}
      >
        <div className="world-boss-result-dialog">
          <div
            className={`world-boss-result-dialog__hero world-boss-result-dialog__hero--${summary.outcome}`}
          >
            <span>Outcome</span>
            <strong>{summary.outcome === "victory" ? "Victory" : "Defeat"}</strong>
            <p>{summary.subtitle}</p>
          </div>

          <div className="world-boss-result-dialog__summary-grid">
            <div className="world-boss-result-dialog__card">
              <span>Battle Duration</span>
              <strong>{summary.durationLabel}</strong>
            </div>
            <div className="world-boss-result-dialog__card">
              <span>Players in Encounter</span>
              <strong>{summary.totalPlayers}</strong>
            </div>
            <div className="world-boss-result-dialog__card">
              <span>Damage Dealt</span>
              <strong>{summary.contribution.damageDealt}</strong>
            </div>
            <div className="world-boss-result-dialog__card">
              <span>Healing Done</span>
              <strong>{summary.contribution.healingDone}</strong>
            </div>
            <div className="world-boss-result-dialog__card">
              <span>Damage Taken</span>
              <strong>{summary.contribution.damageTaken}</strong>
            </div>
            <div className="world-boss-result-dialog__card">
              <span>Rounds Committed</span>
              <strong>
                {summary.contribution.actionsCommitted}/{summary.contribution.roundsParticipated}
              </strong>
            </div>
          </div>

          <section className="world-boss-result-dialog__rewards">
            <div className="world-boss-result-dialog__section-header">
              <strong>Rewards</strong>
              <span>
                {summary.rewardEntries.length > 0
                  ? "Victory rewards ready to claim."
                  : "No rewards were secured in this run."}
              </span>
            </div>

            {summary.rewardEntries.length > 0 ? (
              <div className="world-boss-result-dialog__reward-list">
                {summary.rewardEntries.map((rewardEntry) => (
                  <div
                    key={rewardEntry.key}
                    className={`world-boss-result-dialog__reward-card world-boss-result-dialog__reward-card--${rewardEntry.tone}`}
                  >
                    <div className="world-boss-result-dialog__reward-icon">
                      {rewardEntry.icon}
                    </div>
                    <div className="world-boss-result-dialog__reward-copy">
                      <strong>{rewardEntry.label}</strong>
                      <span>{rewardEntry.description}</span>
                    </div>
                    <div className="world-boss-result-dialog__reward-amount">
                      {rewardEntry.amountLabel}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="world-boss-result-dialog__empty-state">
                This prototype run ended without a reward cache. The contribution
                summary is still preserved for tuning and future backend validation.
              </div>
            )}
          </section>

          <div className="world-boss-result-dialog__actions">
            <button
              type="button"
              className="world-boss-result-dialog__close-button"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
