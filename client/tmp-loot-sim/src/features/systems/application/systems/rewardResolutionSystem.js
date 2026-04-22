function isItemReward(reward) {
    return reward.type === "item";
}
export function mergeStackableRewards(rewards) {
    const mergedItems = new Map();
    const mergedRewards = [];
    for (const reward of rewards) {
        if (!isItemReward(reward)) {
            mergedRewards.push(reward);
            continue;
        }
        const current = mergedItems.get(reward.itemKey);
        if (!current) {
            mergedItems.set(reward.itemKey, { ...reward });
            continue;
        }
        current.amount += reward.amount;
    }
    return [...mergedRewards, ...mergedItems.values()];
}
export function collectRewardMessages(rewards) {
    return rewards.flatMap((reward) => {
        if (reward.type === "message") {
            return [reward.message];
        }
        if (reward.type === "item") {
            return [`You obtained ${reward.amount}x ${reward.itemKey}.`];
        }
        if (reward.type === "xp") {
            return reward.reason
                ? [`You gained ${reward.amount} XP. (${reward.reason})`]
                : [`You gained ${reward.amount} XP.`];
        }
        if (reward.type === "gold") {
            return [`You received ${reward.amount} gold.`];
        }
        if (reward.type === "stamina") {
            return [`You recovered ${reward.amount} stamina.`];
        }
        if (reward.type === "unlock") {
            return reward.reason
                ? [reward.reason]
                : [`You unlocked ${reward.unlockKey}.`];
        }
        return [];
    });
}
