import { bestiaryThresholdsData } from "../../domain/bestiaryThresholdsData";
import type {
  BestiaryKillRegistrationResult,
  CreatureBestiaryKey,
  CreatureKnowledgeTier,
  PlayerBestiaryEntryState,
  PlayerBestiaryProgressState,
} from "../../domain/bestiaryTypes";

export function createInitialBestiaryProgressState(): PlayerBestiaryProgressState {
  return {};
}

export function getKnowledgeTierForKillCount(
  killCount: number
): CreatureKnowledgeTier {
  if (killCount <= 0) {
    return "unknown";
  }

  return bestiaryThresholdsData.reduce<CreatureKnowledgeTier>(
    (resolvedTier, threshold) =>
      killCount >= threshold.killCount ? threshold.tier : resolvedTier,
    "unknown"
  );
}

export function registerCreatureKill(
  currentState: PlayerBestiaryProgressState,
  creatureKey: CreatureBestiaryKey
): BestiaryKillRegistrationResult {
  const currentEntry = currentState[creatureKey];
  const previousTier = currentEntry?.unlockedTier ?? "unknown";
  const nextKillCount = (currentEntry?.killCount ?? 0) + 1;
  const nextTier = getKnowledgeTierForKillCount(nextKillCount);

  const nextEntry: PlayerBestiaryEntryState = {
    creatureKey,
    killCount: nextKillCount,
    unlockedTier: nextTier,
  };

  return {
    nextState: {
      ...currentState,
      [creatureKey]: nextEntry,
    },
    entry: nextEntry,
    previousTier,
    nextTier,
    isNewEntry: !currentEntry,
  };
}

export function getBestiaryMilestoneMessage(
  creatureName: string,
  previousTier: CreatureKnowledgeTier,
  nextTier: CreatureKnowledgeTier
) {
  if (previousTier === nextTier) {
    return null;
  }

  if (nextTier === "known") {
    return `Bestiary: You identified ${creatureName}.`;
  }

  if (nextTier === "vitals") {
    return `Bestiary: You learned ${creatureName}'s vital stats.`;
  }

  if (nextTier === "common-drops") {
    return `Bestiary: You uncovered ${creatureName}'s common drops.`;
  }

  if (nextTier === "complete") {
    return `Bestiary: ${creatureName}'s full entry is now known.`;
  }

  return null;
}
