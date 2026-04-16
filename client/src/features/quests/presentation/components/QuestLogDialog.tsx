import type {
  QuestDefinition,
  QuestLogSectionKey,
  QuestProgressState,
  QuestState,
} from "../../domain/questTypes";
import GameDialog from "../../../../components/GameDialog";
import "./QuestLogDialog.css";

type QuestLogEntryView = {
  quest: QuestDefinition;
  progressState?: QuestProgressState;
  state: QuestState;
  isRewardClaimed: boolean;
  canClaimRewards: boolean;
};

type QuestLogDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  entries: QuestLogEntryView[];
};

type QuestLogSection = {
  id: QuestLogSectionKey;
  label: string;
  summary: string;
  entries: QuestLogEntryView[];
  emptyState: string;
};

function formatStateLabel(state: QuestState) {
  return state.replace("-", " ");
}

function getProgressSummary(entry: QuestLogEntryView) {
  const objectives = entry.quest.objectives;
  const objectiveProgress = entry.progressState?.objectiveProgress ?? {};
  const completedObjectives = objectives.filter((objective) => {
    const progress = objectiveProgress[objective.key];
    return progress?.state === "completed";
  }).length;

  if (entry.state === "available") {
    return "Ready to accept";
  }

  if (entry.state === "completed") {
    return entry.isRewardClaimed ? "Reward claimed" : "Return for reward";
  }

  return `${completedObjectives}/${objectives.length} objectives completed`;
}

function getCurrentObjectiveText(entry: QuestLogEntryView) {
  if (entry.state === "completed") {
    return entry.isRewardClaimed
      ? "This contract has already been settled."
      : "Return to the source NPC to collect the reward.";
  }

  const objectiveProgress = entry.progressState?.objectiveProgress ?? {};
  const nextObjective = entry.quest.objectives.find((objective) => {
    const progress = objectiveProgress[objective.key];
    return !progress || progress.state !== "completed";
  });

  return nextObjective?.description ?? entry.quest.description;
}

function getStatusClassName(state: QuestState) {
  switch (state) {
    case "available":
      return "quest-log-status quest-log-status--available";
    case "active":
      return "quest-log-status quest-log-status--active";
    case "completed":
      return "quest-log-status quest-log-status--completed";
    default:
      return "quest-log-status";
  }
}

function resolveQuestSection(quest: QuestDefinition): QuestLogSectionKey {
  return quest.logSection ?? "lore";
}

export default function QuestLogDialog({
  isOpen,
  onClose,
  entries,
}: QuestLogDialogProps) {
  if (!isOpen) {
    return null;
  }

  const dailyEntries = entries.filter(
    (entry) => resolveQuestSection(entry.quest) === "daily"
  );
  const loreEntries = entries.filter(
    (entry) => resolveQuestSection(entry.quest) === "lore"
  );
  const huntEntries = entries.filter(
    (entry) => resolveQuestSection(entry.quest) === "hunt"
  );

  const sections: QuestLogSection[] = [
    {
      id: "daily",
      label: "Daily Tasks",
      summary:
        "Repeatable work, routine requests, and future rotating objectives.",
      entries: dailyEntries,
      emptyState:
        "No daily tasks are available yet in this prototype slice.",
    },
    {
      id: "lore",
      label: "Lore Quests",
      summary:
        "Longer story-driven leads tied to discoveries, NPCs, and the world's broader progression.",
      entries: loreEntries,
      emptyState: "No lore quests are currently visible here.",
    },
    {
      id: "hunt",
      label: "Hunt Contracts",
      summary:
        "Targeted contracts focused on hostile creatures, field threats, and regional pressure.",
      entries: huntEntries,
      emptyState: "No hunt contracts are currently available.",
    },
  ];

  return (
    <div className="quest-log-dialog-anchor">
      <GameDialog
        title="Quest Log"
        subtitle="Track available work, active objectives, and completed contracts without tying quest rules to the panel itself."
        onClose={onClose}
      >
        <div className="quest-log-dialog">
          <div className="quest-log-dialog__overview">
            <div className="quest-log-dialog__overview-item">
              <span>Available</span>
              <strong>{entries.filter((entry) => entry.state === "available").length}</strong>
            </div>
            <div className="quest-log-dialog__overview-item">
              <span>In Progress</span>
              <strong>{entries.filter((entry) => entry.state === "active").length}</strong>
            </div>
            <div className="quest-log-dialog__overview-item">
              <span>Completed</span>
              <strong>{entries.filter((entry) => entry.state === "completed").length}</strong>
            </div>
          </div>

          <div className="quest-log-dialog__sections">
            {sections.map((section) => (
              <section key={section.id} className="quest-log-section">
                <div className="quest-log-section__header">
                  <div>
                    <h4>{section.label}</h4>
                    <p>{section.summary}</p>
                  </div>
                </div>

                <div className="quest-log-section__entries">
                  {section.entries.length > 0 ? (
                    section.entries.map((entry) => (
                      <article key={entry.quest.key} className="quest-log-entry">
                        <div className="quest-log-entry__topline">
                          <strong>{entry.quest.title}</strong>
                          <span className={getStatusClassName(entry.state)}>
                            {formatStateLabel(entry.state)}
                          </span>
                        </div>

                        <div className="quest-log-entry__meta">
                          <span>{getProgressSummary(entry)}</span>
                        </div>

                        <p>{entry.quest.description}</p>
                        <div className="quest-log-entry__divider" />
                        <small>{getCurrentObjectiveText(entry)}</small>
                      </article>
                    ))
                  ) : (
                    <div className="quest-log-section__empty">
                      <strong>Nothing here yet</strong>
                      <p>{section.emptyState}</p>
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </GameDialog>
    </div>
  );
}
