import { useMemo } from "react";
import type { CharacterTalentProgressState } from "../../domain/talentTreeTypes";
import {
  buildTalentTreeSnapshots,
  getAvailableTalentPoints,
  getEarnedTalentPoints,
} from "../systems/talentTreeSystem";

type UseTalentTreeParams = {
  progress: CharacterTalentProgressState;
  characterLevel: number;
};

export function useTalentTree({ progress, characterLevel }: UseTalentTreeParams) {
  return useMemo(() => {
    const trees = buildTalentTreeSnapshots(progress, characterLevel);

    return {
      trees,
      pointsEarned: getEarnedTalentPoints(characterLevel),
      pointsAvailable: getAvailableTalentPoints(characterLevel, progress),
      pointsSpent: progress.unlockedNodeKeys.length,
    };
  }, [characterLevel, progress]);
}
