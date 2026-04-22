export const experienceTable = [
    120, 140, 160, 180, 200,
    240, 280, 320, 380, 450,
    520, 600, 700, 820, 960,
    1100, 1300, 1500, 1750, 2000,
    2300, 2600, 3000, 3400, 3800,
    4300, 4800, 5400, 6000, 6700,
    7500, 8400, 9400, 10500, 11700,
    13000, 14400, 15900, 17500, 19200,
    21000, 22900, 24900, 27000, 29200,
    31500, 33900, 36400, 39000, 41700,
    44500, 47400, 50400, 53500, 56700,
    60000, 63400, 66900, 70500, 74200,
    78000, 82000, 87000, 93000, 100000,
    108000, 117000, 127000, 138000, 150000,
    163000, 177000, 192000, 208000, 225000,
    243000, 262000, 282000, 303000, 325000,
    348000, 372000, 397000, 423000, 450000,
    478000, 507000, 537000, 568000, 600000,
    650000, 710000, 780000, 860000, 950000,
    1050000, 1160000, 1280000, 1410000, 1550000,
];
export const MAX_LEVEL = 100;
export function getXpToNextLevel(level) {
    if (level < 1 || level >= MAX_LEVEL) {
        return 0;
    }
    return experienceTable[level - 1];
}
export function getTotalXpForLevel(level) {
    if (level <= 1) {
        return 0;
    }
    const cappedLevel = Math.min(level, MAX_LEVEL);
    return experienceTable
        .slice(0, cappedLevel - 1)
        .reduce((total, xpRequired) => total + xpRequired, 0);
}
export function getLevelFromTotalXp(totalXp) {
    if (totalXp <= 0) {
        return 1;
    }
    let accumulatedXp = 0;
    for (let level = 1; level < MAX_LEVEL; level += 1) {
        accumulatedXp += experienceTable[level - 1];
        if (totalXp < accumulatedXp) {
            return level;
        }
    }
    return MAX_LEVEL;
}
export function getXpProgressInCurrentLevel(totalXp) {
    const currentLevel = getLevelFromTotalXp(totalXp);
    if (currentLevel >= MAX_LEVEL) {
        return {
            level: MAX_LEVEL,
            currentXp: totalXp,
            xpIntoLevel: 0,
            xpToNextLevel: 0,
            progressPercent: 100,
        };
    }
    const totalXpForCurrentLevel = getTotalXpForLevel(currentLevel);
    const xpToNextLevel = getXpToNextLevel(currentLevel);
    const xpIntoLevel = Math.max(0, totalXp - totalXpForCurrentLevel);
    const progressPercent = xpToNextLevel > 0 ? (xpIntoLevel / xpToNextLevel) * 100 : 0;
    return {
        level: currentLevel,
        currentXp: totalXp,
        xpIntoLevel,
        xpToNextLevel,
        progressPercent,
    };
}
