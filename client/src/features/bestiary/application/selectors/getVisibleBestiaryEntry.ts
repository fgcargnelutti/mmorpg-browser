import { creatureCompendiumData } from "../../domain/creatureCompendiumData";
import { getCreatureSpeciesSnapshot } from "../../../creatures";
import type {
  CreatureBestiaryKey,
  PlayerBestiaryEntryState,
  VisibleBestiaryEntry,
} from "../../domain/bestiaryTypes";

export function getVisibleBestiaryEntry(
  entry: PlayerBestiaryEntryState
): VisibleBestiaryEntry | null {
  const creatureData = creatureCompendiumData[entry.creatureKey];
  const speciesSnapshot = getCreatureSpeciesSnapshot(entry.creatureKey);

  if (!creatureData && !speciesSnapshot) {
    return null;
  }

  const resolvedBaseData = speciesSnapshot ?? creatureData;

  if (!resolvedBaseData) {
    return null;
  }

  const visibleEntry: VisibleBestiaryEntry = {
    creatureKey: entry.creatureKey,
    killCount: entry.killCount,
    unlockedTier: entry.unlockedTier,
    name: resolvedBaseData.name,
    category: resolvedBaseData.category,
    threatTier: resolvedBaseData.threatTier,
    habitatTags: resolvedBaseData.habitatTags,
    isBossCandidate: resolvedBaseData.isBossCandidate,
  };

  if (
    entry.unlockedTier === "vitals" ||
    entry.unlockedTier === "common-drops" ||
    entry.unlockedTier === "complete"
  ) {
    visibleEntry.maxHp = resolvedBaseData.maxHp;
    visibleEntry.maxSp = resolvedBaseData.maxSp;
  }

  if (
    creatureData &&
    (entry.unlockedTier === "common-drops" || entry.unlockedTier === "complete")
  ) {
    visibleEntry.drops = creatureData.drops.filter(
      (drop) => drop.rarity === "common" || drop.rarity === "uncommon"
    );
  }

  if (creatureData && entry.unlockedTier === "complete") {
    visibleEntry.drops = creatureData.drops;
    visibleEntry.weaknesses = resolvedBaseData.weaknesses;
    visibleEntry.resistances = resolvedBaseData.resistances;
    visibleEntry.strengths = resolvedBaseData.strengths;
    visibleEntry.attacks = resolvedBaseData.attacks;
    visibleEntry.notes = resolvedBaseData.notes;
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
