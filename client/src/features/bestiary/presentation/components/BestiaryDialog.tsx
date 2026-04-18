import { useMemo, useState } from "react";
import EmptyStateNotice from "../../../../components/EmptyStateNotice";
import GameDialog from "../../../../components/GameDialog";
import SectionHeading from "../../../../components/SectionHeading";
import type {
  CreatureBestiaryKey,
  CreatureDropGroup,
  CreatureDropRateTier,
  VisibleBestiaryEntry,
} from "../../domain/bestiaryTypes";
import "./BestiaryDialog.css";

type BestiaryDialogProps = {
  isOpen: boolean;
  entries: VisibleBestiaryEntry[];
  onClose: () => void;
};

function formatList(values?: string[]) {
  if (!values || values.length === 0) {
    return "Unknown";
  }

  return values.join(", ");
}

function formatDropChance(drop: CreatureDropGroup) {
  if (drop.dropChancePercent === undefined) {
    return null;
  }

  return `${drop.dropChancePercent}%`;
}

function getDropsByRarity(
  drops: CreatureDropGroup[] | undefined,
  rarity: CreatureDropRateTier
) {
  return drops?.filter((drop) => drop.rarity === rarity) ?? [];
}

function formatDrops(values?: CreatureDropGroup[]) {
  if (!values || values.length === 0) {
    return "Unknown";
  }

  return values
    .map((entry) => {
      const chanceLabel = formatDropChance(entry);
      return chanceLabel ? `${entry.label} (${chanceLabel})` : entry.label;
    })
    .join(", ");
}

function formatTitleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BestiaryDialog({
  isOpen,
  entries,
  onClose,
}: BestiaryDialogProps) {
  const [selectedCreatureKey, setSelectedCreatureKey] =
    useState<CreatureBestiaryKey | null>(entries[0]?.creatureKey ?? null);

  const resolvedSelectedCreatureKey = entries.some(
    (entry) => entry.creatureKey === selectedCreatureKey
  )
    ? selectedCreatureKey
    : (entries[0]?.creatureKey ?? null);

  const selectedEntry = useMemo(
    () =>
      entries.find((entry) => entry.creatureKey === resolvedSelectedCreatureKey) ??
      null,
    [entries, resolvedSelectedCreatureKey]
  );
  const commonDrops = selectedEntry
    ? getDropsByRarity(selectedEntry.drops, "common")
    : [];
  const uncommonDrops = selectedEntry
    ? getDropsByRarity(selectedEntry.drops, "uncommon")
    : [];
  const rareDrops = selectedEntry
    ? getDropsByRarity(selectedEntry.drops, "rare")
    : [];
  const ultraRareDrops = selectedEntry
    ? getDropsByRarity(selectedEntry.drops, "ultra-rare")
    : [];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="bestiary-dialog-anchor">
      <GameDialog
        title="Bestiary"
        subtitle="Knowledge grows with each kill. Record the creatures you survive long enough to study."
        onClose={onClose}
      >
        <div className="bestiary-dialog-layout">
          <aside className="bestiary-dialog__list">
            <div className="bestiary-dialog__list-header">
              <strong>Known Creatures</strong>
              <span>{entries.length}</span>
            </div>

            {entries.length > 0 ? (
              <div className="bestiary-dialog__entries">
                {entries.map((entry) => (
                  <button
                    key={entry.creatureKey}
                    type="button"
                    className={`bestiary-entry-card${
                      resolvedSelectedCreatureKey === entry.creatureKey
                        ? " bestiary-entry-card--active"
                        : ""
                    }`}
                    onClick={() => setSelectedCreatureKey(entry.creatureKey)}
                  >
                    <div className="bestiary-entry-card__title-row">
                      <strong>{entry.name}</strong>
                      <span>{entry.killCount}x</span>
                    </div>
                    <span className="bestiary-entry-card__tier">
                      Knowledge: {entry.unlockedTier}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyStateNotice
                className="bestiary-empty-state"
                title="No creatures recorded yet"
                description="Defeat a creature to add its first entry to the Bestiary."
              />
            )}
          </aside>

          <section className="bestiary-dialog__detail">
            {selectedEntry ? (
              <>
                <div className="bestiary-dialog__detail-header">
                  <div>
                    <h4>{selectedEntry.name}</h4>
                    <p>{selectedEntry.killCount} confirmed kills</p>
                  </div>
                  <div className="bestiary-dialog__meta">
                    <span className="bestiary-dialog__tier-badge">
                      {formatTitleCase(selectedEntry.unlockedTier)}
                    </span>
                    <span className="bestiary-dialog__tier-badge">
                      {formatTitleCase(selectedEntry.threatTier)}
                    </span>
                  </div>
                </div>

                <div className="bestiary-detail-scroll">
                  <div className="bestiary-detail-summary">
                    <div className="bestiary-detail-summary__item">
                      <span>Category</span>
                      <strong>{formatTitleCase(selectedEntry.category)}</strong>
                    </div>
                    <div className="bestiary-detail-summary__item">
                      <span>Habitats</span>
                      <strong>
                        {selectedEntry.habitatTags.map(formatTitleCase).join(", ")}
                      </strong>
                    </div>
                    <div className="bestiary-detail-summary__item">
                      <span>Boss Potential</span>
                      <strong>{selectedEntry.isBossCandidate ? "Yes" : "No"}</strong>
                    </div>
                  </div>

                  <div className="bestiary-detail-section">
                    <SectionHeading
                      className="bestiary-detail-section__header"
                      title="Vitals"
                    />
                    <div className="bestiary-detail-line">
                      <span>HP</span>
                      <strong>{selectedEntry.maxHp ?? "Unknown"}</strong>
                    </div>
                    <div className="bestiary-detail-line">
                      <span>SP</span>
                      <strong>{selectedEntry.maxSp ?? "Unknown"}</strong>
                    </div>
                  </div>

                  <div className="bestiary-detail-section">
                    <SectionHeading
                      className="bestiary-detail-section__header"
                      title="Loot"
                    />
                    <div className="bestiary-detail-line">
                      <span>Common Drops</span>
                      <strong>{formatDrops(commonDrops)}</strong>
                    </div>
                    <div className="bestiary-detail-line">
                      <span>Uncommon Drops</span>
                      <strong>{formatDrops(uncommonDrops)}</strong>
                    </div>
                    <div className="bestiary-detail-line">
                      <span>Rare Drops</span>
                      <strong>{formatDrops(rareDrops)}</strong>
                    </div>
                    <div className="bestiary-detail-line">
                      <span>Ultra Rare Drops</span>
                      <strong>{formatDrops(ultraRareDrops)}</strong>
                    </div>
                  </div>

                  <div className="bestiary-detail-section">
                    <SectionHeading
                      className="bestiary-detail-section__header"
                      title="Combat Notes"
                    />
                    <div className="bestiary-detail-line">
                      <span>Weaknesses</span>
                      <strong>{formatList(selectedEntry.weaknesses)}</strong>
                    </div>
                    <div className="bestiary-detail-line">
                      <span>Resistances</span>
                      <strong>{formatList(selectedEntry.resistances)}</strong>
                    </div>
                    <div className="bestiary-detail-line">
                      <span>Strengths</span>
                      <strong>{formatList(selectedEntry.strengths)}</strong>
                    </div>
                    <div className="bestiary-detail-line">
                      <span>Attacks</span>
                      <strong>
                        {selectedEntry.attacks?.length
                          ? selectedEntry.attacks.map((attack) => attack.label).join(", ")
                          : "Unknown"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="bestiary-detail-notes">
                  <strong>Field Notes</strong>
                  {selectedEntry.notes?.length ? (
                    <ul>
                      {selectedEntry.notes.map((note) => (
                        <li key={`${selectedEntry.creatureKey}-${note}`}>{note}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Further study is required before useful notes can be recorded.</p>
                  )}
                </div>
              </>
            ) : (
              <EmptyStateNotice
                className="bestiary-empty-state"
                title="No active entry"
                description="Select a known creature to inspect its unlocked knowledge."
              />
            )}
          </section>
        </div>
      </GameDialog>
    </div>
  );
}
