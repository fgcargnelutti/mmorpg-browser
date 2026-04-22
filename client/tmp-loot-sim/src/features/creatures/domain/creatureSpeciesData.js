export const creatureSpeciesData = {
    goblin: {
        id: "goblin",
        name: "Goblin",
        category: "humanoid",
        threatTier: "common",
        habitatTags: ["road", "ruins", "town"],
        isBossCandidate: false,
        baseStats: {
            maxHp: 40,
            maxSp: 6,
        },
        combatDefaults: {
            enemyMaxHp: 40,
            playerAttackDamage: 6,
            enemyAttackDamage: 3,
            rewardXp: 12,
            enemyBaseInitiative: 5,
        },
        traits: {
            weaknesses: ["Bleed", "Direct melee pressure"],
            resistances: ["Fear", "Harsh terrain"],
            strengths: ["Ambushes", "Quick retaliation"],
        },
        attacks: [
            {
                key: "jagged-slash",
                label: "Jagged Slash",
                description: "A fast cut from a crude blade meant to punish hesitation.",
            },
            {
                key: "roadside-lunge",
                label: "Roadside Lunge",
                description: "A sudden leap meant to overwhelm isolated travelers.",
            },
        ],
        loreNotes: [
            "Often found near roads and broken ruins.",
            "Aggressive when they believe they outnumber a target.",
        ],
    },
};
