const gatherableItems = new Set(["stone", "wood", "paper", "herb", "fish", "rope"]);
export function resolveSkillTrainingRewards(event) {
    if (event.type === "combat.attack") {
        const skillKey = event.combatStyle === "archery"
            ? "archery"
            : event.combatStyle === "arcane"
                ? "arcane"
                : "melee";
        return [
            {
                skillKey,
                xp: 8,
                reason: "Combat practice",
            },
        ];
    }
    if (event.type === "combat.victory") {
        const skillKey = event.combatStyle === "archery"
            ? "archery"
            : event.combatStyle === "arcane"
                ? "arcane"
                : "melee";
        return [
            {
                skillKey,
                xp: 14,
                reason: "Combat victory",
            },
        ];
    }
    if (event.type === "world.discovery.location") {
        return [
            {
                skillKey: "survival",
                xp: 10,
                reason: "Exploration and navigation",
            },
        ];
    }
    if (event.type === "world.discovery.poi") {
        return [
            {
                skillKey: "survival",
                xp: 14,
                reason: "Discovering a hidden point of interest",
            },
        ];
    }
    if (event.type === "npc.rumor.learned") {
        return [
            {
                skillKey: "arcane",
                xp: 10,
                reason: "Learning from rumors and hidden knowledge",
            },
        ];
    }
    const amount = event.action.amount ?? 1;
    if (event.action.rewardItem && gatherableItems.has(event.action.rewardItem)) {
        return [
            {
                skillKey: "survival",
                xp: amount * 6,
                reason: "Field gathering",
            },
        ];
    }
    return [];
}
