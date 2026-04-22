import { useMemo } from "react";
import { buildTalentTreeSnapshots, getAvailableTalentPoints, getEarnedTalentPoints, } from "../systems/talentTreeSystem";
export function useTalentTree({ progress, characterLevel }) {
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
