import { creatureCompendiumData } from "../../domain/creatureCompendiumData";
import type {
  CreatureBestiaryKey,
  PlayerBestiaryEntryState,
  VisibleBestiaryEntry,
} from "../../domain/bestiaryTypes";

export function getVisibleBestiaryEntry(
  entry: PlayerBestiaryEntryState
): VisibleBestiaryEntry | null {
  const creatureData = creatureCompendiumData[entry.creatureKey];

  if (!creatureData) {
    return null;
  }

  const visibleEntry: VisibleBestiaryEntry = {
    creatureKey: entry.creatureKey,
    killCount: entry.killCount,
    unlockedTier: entry.unlockedTier,
    name: creatureData.name,
    category: creatureData.category,
    threatTier: creatureData.threatTier,
    habitatTags: creatureData.habitatTags,
    isBossCandidate: creatureData.isBossCandidate,
  };

  if (
    entry.unlockedTier === "vitals" ||
    entry.unlockedTier === "common-drops" ||
    entry.unlockedTier === "complete"
  ) {
    visibleEntry.maxHp = creatureData.maxHp;
    visibleEntry.maxSp = creatureData.maxSp;
  }

  if (
    entry.unlockedTier === "common-drops" ||
    entry.unlockedTier === "complete"
  ) {
    visibleEntry.commonDrops = creatureData.commonDrops;
  }

  if (entry.unlockedTier === "complete") {
    visibleEntry.rareDrops = creatureData.rareDrops;
    visibleEntry.weaknesses = creatureData.weaknesses;
    visibleEntry.resistances = creatureData.resistances;
    visibleEntry.strengths = creatureData.strengths;
    visibleEntry.attacks = creatureData.attacks;
    visibleEntry.notes = creatureData.notes;
  }

  return visibleEntry;
}

export function getVisibleBestiaryEntries(
  entries: Partial<Record<CreatureBestiaryKey, PlayerBestiaryEntryState | undefined>>
) {
  return Object.values(entries)
    .filter((entry): entry is PlayerBestiaryEntryState => Boolean(entry))
    .map(getVisibleBestiaryEntry)
    .filter((entry): entry is VisibleBestiaryEntry => Boolean(entry))
    .sort((left, right) => left.name.localeCompare(right.name));
}
