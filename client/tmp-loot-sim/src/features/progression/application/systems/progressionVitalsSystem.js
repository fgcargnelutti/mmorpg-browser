import { collectRewardMessages } from "../../../systems/application/systems/rewardResolutionSystem";
import { createDamageReceivedMessage, createLevelUpMessage, createSystemMessage, createXpGainMessage, } from "../../../systems/application/systems/eventLogMessageSystem";
import { getLevelFromTotalXp } from "../../../../data/experienceTable";
export function applyPlayerDamageState(playerState, damage) {
    if (damage <= 0) {
        return playerState;
    }
    return {
        ...playerState,
        currentHp: Math.max(0, playerState.currentHp - damage),
    };
}
export function createDamageTakenMessages(damage, reason) {
    if (damage <= 0) {
        return [];
    }
    return [createDamageReceivedMessage(damage, reason)];
}
export function createRewardApplicationMessages(previousTotalXp, rewards, leadingMessages = []) {
    const xpReward = rewards.reduce((total, reward) => {
        return reward.type === "xp" ? total + reward.amount : total;
    }, 0);
    const previousLevel = getLevelFromTotalXp(previousTotalXp);
    const nextLevel = getLevelFromTotalXp(previousTotalXp + xpReward);
    const rewardMessages = collectRewardMessages(rewards);
    const messages = [...leadingMessages, ...rewardMessages];
    if (xpReward > 0 && nextLevel > previousLevel) {
        messages.push(createLevelUpMessage(nextLevel));
    }
    return messages;
}
export function createXpGainMessages(previousTotalXp, amount, reason) {
    if (amount <= 0) {
        return [];
    }
    return createRewardApplicationMessages(previousTotalXp, [
        {
            type: "xp",
            amount,
            reason,
        },
    ], [createXpGainMessage(amount, reason)]);
}
export function createLoreDiscoveryMessages(previousTotalXp, discoveryMessage, xpReward, xpReason) {
    return createRewardApplicationMessages(previousTotalXp, [
        {
            type: "xp",
            amount: xpReward,
            reason: xpReason,
        },
    ], [createSystemMessage(discoveryMessage), createXpGainMessage(xpReward, xpReason)]);
}
