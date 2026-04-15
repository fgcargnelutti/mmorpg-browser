import {
  skillCatalog,
  skillOrder,
  type SkillDefinition,
  type SkillKey,
} from "./skillCatalog";
import {
  resolveSkillTrainingRewards,
  type SkillTrainingEvent,
} from "./skillTrainingRules";

export const SKILL_MAX_LEVEL = 100;

export type SkillProgressState = {
  totalXp: number;
};

export type CharacterSkillProgressionState = Record<SkillKey, SkillProgressState>;

export type CharacterSkillSummary = SkillDefinition & {
  level: number;
  progress: number;
  totalXp: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
};

export type SkillLevelUp = {
  skillKey: SkillKey;
  skillName: string;
  previousLevel: number;
  newLevel: number;
};

export function getSkillXpToNextLevel(level: number) {
  if (level < 1 || level >= SKILL_MAX_LEVEL) {
    return 0;
  }

  return 40 + (level - 1) * 12;
}

export function getSkillTotalXpForLevel(level: number) {
  if (level <= 1) {
    return 0;
  }

  let totalXp = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel += 1) {
    totalXp += getSkillXpToNextLevel(currentLevel);
  }

  return totalXp;
}

export function getSkillLevelFromTotalXp(totalXp: number) {
  if (totalXp <= 0) {
    return 1;
  }

  let accumulatedXp = 0;

  for (let level = 1; level < SKILL_MAX_LEVEL; level += 1) {
    accumulatedXp += getSkillXpToNextLevel(level);

    if (totalXp < accumulatedXp) {
      return level;
    }
  }

  return SKILL_MAX_LEVEL;
}

export function getSkillProgress(totalXp: number) {
  const level = getSkillLevelFromTotalXp(totalXp);

  if (level >= SKILL_MAX_LEVEL) {
    return {
      level,
      totalXp,
      xpIntoLevel: 0,
      xpToNextLevel: 0,
      progressPercent: 100,
    };
  }

  const totalXpForCurrentLevel = getSkillTotalXpForLevel(level);
  const xpToNextLevel = getSkillXpToNextLevel(level);
  const xpIntoLevel = Math.max(0, totalXp - totalXpForCurrentLevel);
  const progressPercent =
    xpToNextLevel > 0 ? Math.min(100, (xpIntoLevel / xpToNextLevel) * 100) : 0;

  return {
    level,
    totalXp,
    xpIntoLevel,
    xpToNextLevel,
    progressPercent,
  };
}

export function createInitialSkillProgressionState(): CharacterSkillProgressionState {
  return {
    survival: { totalXp: 0 },
    melee: { totalXp: 0 },
    archery: { totalXp: 0 },
    stealth: { totalXp: 0 },
    arcane: { totalXp: 0 },
  };
}

export function buildCharacterSkillSummaries(
  progressionState: CharacterSkillProgressionState
): CharacterSkillSummary[] {
  return skillOrder.map((skillKey) => {
    const definition = skillCatalog[skillKey];
    const progress = getSkillProgress(progressionState[skillKey].totalXp);

    return {
      ...definition,
      level: progress.level,
      progress: Math.round(progress.progressPercent),
      totalXp: progress.totalXp,
      xpIntoLevel: progress.xpIntoLevel,
      xpToNextLevel: progress.xpToNextLevel,
    };
  });
}

export function applySkillTrainingEvent(
  progressionState: CharacterSkillProgressionState,
  event: SkillTrainingEvent
) {
  const rewards = resolveSkillTrainingRewards(event);

  if (rewards.length === 0) {
    return {
      nextProgressionState: progressionState,
      rewards,
      levelUps: [] as SkillLevelUp[],
    };
  }

  const nextProgressionState: CharacterSkillProgressionState = {
    ...progressionState,
  };
  const levelUps: SkillLevelUp[] = [];

  for (const reward of rewards) {
    const previousEntry = nextProgressionState[reward.skillKey];
    const previousLevel = getSkillLevelFromTotalXp(previousEntry.totalXp);
    const nextTotalXp = previousEntry.totalXp + reward.xp;
    const nextLevel = getSkillLevelFromTotalXp(nextTotalXp);

    nextProgressionState[reward.skillKey] = {
      totalXp: nextTotalXp,
    };

    if (nextLevel > previousLevel) {
      levelUps.push({
        skillKey: reward.skillKey,
        skillName: skillCatalog[reward.skillKey].name,
        previousLevel,
        newLevel: nextLevel,
      });
    }
  }

  return {
    nextProgressionState,
    rewards,
    levelUps,
  };
}
