function withSystemPrefix(message) {
    return `System: ${message}`;
}
export function createSystemMessage(message) {
    return withSystemPrefix(message);
}
export function createXpGainMessage(amount, reason) {
    return reason
        ? withSystemPrefix(`You gained ${amount} XP. (${reason})`)
        : withSystemPrefix(`You gained ${amount} XP.`);
}
export function createLevelUpMessage(level) {
    return withSystemPrefix(`Level up! You reached level ${level}.`);
}
export function createDamageReceivedMessage(damage, source) {
    return withSystemPrefix(`You received ${damage} damage${source ? ` from ${source}` : ""}.`);
}
export function createTravelMessage(destinationName) {
    return withSystemPrefix(`You travel to ${destinationName}.`);
}
export function createConversationStartedMessage(npcName) {
    return withSystemPrefix(`You started a conversation with ${npcName}.`);
}
export function createEncounterStartedMessage(enemyName) {
    return withSystemPrefix(`Encounter started: ${enemyName}.`);
}
export function createEncounterWonMessage(enemyName) {
    return withSystemPrefix(`You defeated ${enemyName}.`);
}
export function createEncounterLostMessage(enemyName) {
    return withSystemPrefix(`You were defeated by ${enemyName}.`);
}
export function createInsufficientStaminaMessage(actionLabel) {
    return withSystemPrefix(`Not enough stamina to ${actionLabel.toLowerCase()}.`);
}
export function createActionPerformedMessage(actionLabel) {
    return withSystemPrefix(`Action performed: ${actionLabel}.`);
}
export function createItemObtainedMessage(itemKey, amount) {
    return withSystemPrefix(`You obtained ${amount}x ${itemKey}.`);
}
export function createStaminaRecoveredMessage(amount) {
    return withSystemPrefix(`You recovered ${amount} stamina.`);
}
export function createSellResourcesMessage(resourceCount, goldEarned) {
    return withSystemPrefix(`You sold ${resourceCount} resources and received ${goldEarned} gold.`);
}
export function createPurchaseSuccessMessage(itemName, quantity, goldSpent) {
    return withSystemPrefix(`You purchased ${quantity}x ${itemName} for ${goldSpent} gold.`);
}
export function createNoSellableResourcesMessage() {
    return withSystemPrefix("You have no sellable resources.");
}
export function createUnavailableDestinationMessage(targetMapName) {
    return withSystemPrefix(`${targetMapName ?? "This destination"} is not available yet.`);
}
export function createDirectMessagePlaceholder(playerName) {
    return withSystemPrefix(`Direct message to ${playerName} is still a placeholder.`);
}
export function createHuntInvitePlaceholder(playerName) {
    return withSystemPrefix(`Hunt invite sent to ${playerName} (placeholder).`);
}
export function createPanelOpenedMessage(scope, description) {
    return `${scope}: ${description}`;
}
export function createHideoutReasonMessage(reason) {
    return `Hideout: ${reason}`;
}
export function createHideoutUpgradeMessage(structureName, level) {
    return `Hideout: ${structureName} upgraded to level ${level}.`;
}
export function createHideoutStorageMessage(itemLabel, direction) {
    return `Hideout: ${itemLabel} ${direction === "stored" ? "stored in the chest" : "returned to your inventory"}.`;
}
