export function serializeQuestProgressStates(progressStates) {
    return {
        version: 1,
        entries: progressStates.map((state) => ({
            questKey: state.questKey,
            state: state.state,
            startedAt: state.startedAt,
            completedAt: state.completedAt,
            failedAt: state.failedAt,
            rewardClaimedAt: state.rewardClaimedAt,
            objectiveProgress: state.objectiveProgress,
        })),
    };
}
export function deserializeQuestProgressStates(payload, quests) {
    if (!payload || payload.version !== 1) {
        return [];
    }
    const supportedQuestKeys = new Set(quests.map((quest) => quest.key));
    return payload.entries
        .filter((entry) => supportedQuestKeys.has(entry.questKey))
        .map((entry) => ({
        questKey: entry.questKey,
        state: entry.state,
        startedAt: entry.startedAt,
        completedAt: entry.completedAt,
        failedAt: entry.failedAt,
        rewardClaimedAt: entry.rewardClaimedAt,
        objectiveProgress: entry.objectiveProgress,
    }));
}
export function createQuestRewardClaimRequest(questKey) {
    return {
        questKey,
    };
}
