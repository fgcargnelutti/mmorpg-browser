function normalizeQuestState(quest, progressState) {
    return progressState?.state ?? quest.state ?? "locked";
}
function hasDependencySatisfied(dependency, context) {
    switch (dependency.type) {
        case "quest_completed":
            return context.completedQuestKeys?.includes(dependency.questKey) ?? false;
        case "skill_unlocked":
            return context.unlockedSkillKeys?.includes(dependency.skillKey) ?? false;
        case "poi_revealed":
            return context.revealedPoiKeys?.includes(dependency.poiKey) ?? false;
        case "item_owned":
            return ((context.inventoryItemCounts?.[dependency.itemKey] ?? 0) >=
                (dependency.amount ?? 1));
        default:
            return false;
    }
}
export function isQuestAvailable(quest, progressState, context = {}) {
    const state = normalizeQuestState(quest, progressState);
    if (state === "active" || state === "completed" || state === "failed") {
        return false;
    }
    if (!quest.dependencies?.length) {
        return true;
    }
    return quest.dependencies.every((dependency) => hasDependencySatisfied(dependency, context));
}
export function buildQuestAvailabilityMap(quests, progressStates, context = {}) {
    const progressByKey = new Map(progressStates.map((state) => [state.questKey, state]));
    return new Map(quests.map((quest) => [
        quest.key,
        isQuestAvailable(quest, progressByKey.get(quest.key), context),
    ]));
}
