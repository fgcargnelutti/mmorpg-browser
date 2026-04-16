function withSystemPrefix(message: string) {
  return `System: ${message}`;
}

export function createSystemMessage(message: string) {
  return withSystemPrefix(message);
}

export function createXpGainMessage(amount: number, reason?: string) {
  return reason
    ? withSystemPrefix(`You gained ${amount} XP. (${reason})`)
    : withSystemPrefix(`You gained ${amount} XP.`);
}

export function createLevelUpMessage(level: number) {
  return withSystemPrefix(`Level up! You reached level ${level}.`);
}

export function createDamageReceivedMessage(damage: number, source?: string) {
  return withSystemPrefix(
    `You received ${damage} damage${source ? ` from ${source}` : ""}.`
  );
}

export function createTravelMessage(destinationName: string) {
  return withSystemPrefix(`You travel to ${destinationName}.`);
}

export function createConversationStartedMessage(npcName: string) {
  return withSystemPrefix(`You started a conversation with ${npcName}.`);
}

export function createEncounterStartedMessage(enemyName: string) {
  return withSystemPrefix(`Encounter started: ${enemyName}.`);
}

export function createEncounterWonMessage(enemyName: string) {
  return withSystemPrefix(`You defeated ${enemyName}.`);
}

export function createEncounterLostMessage(enemyName: string) {
  return withSystemPrefix(`You were defeated by ${enemyName}.`);
}

export function createInsufficientStaminaMessage(actionLabel: string) {
  return withSystemPrefix(`Not enough stamina to ${actionLabel.toLowerCase()}.`);
}

export function createActionPerformedMessage(actionLabel: string) {
  return withSystemPrefix(`Action performed: ${actionLabel}.`);
}

export function createItemObtainedMessage(itemKey: string, amount: number) {
  return withSystemPrefix(`You obtained ${amount}x ${itemKey}.`);
}

export function createStaminaRecoveredMessage(amount: number) {
  return withSystemPrefix(`You recovered ${amount} stamina.`);
}

export function createSellResourcesMessage(resourceCount: number, goldEarned: number) {
  return withSystemPrefix(
    `You sold ${resourceCount} resources and received ${goldEarned} gold.`
  );
}

export function createPurchaseSuccessMessage(
  itemName: string,
  quantity: number,
  goldSpent: number
) {
  return withSystemPrefix(
    `You purchased ${quantity}x ${itemName} for ${goldSpent} gold.`
  );
}

export function createNoSellableResourcesMessage() {
  return withSystemPrefix("You have no sellable resources.");
}

export function createUnavailableDestinationMessage(targetMapName?: string) {
  return withSystemPrefix(
    `${targetMapName ?? "This destination"} is not available yet.`
  );
}

export function createDirectMessagePlaceholder(playerName: string) {
  return withSystemPrefix(`Direct message to ${playerName} is still a placeholder.`);
}

export function createHuntInvitePlaceholder(playerName: string) {
  return withSystemPrefix(`Hunt invite sent to ${playerName} (placeholder).`);
}

export function createPanelOpenedMessage(scope: string, description: string) {
  return `${scope}: ${description}`;
}

export function createHideoutReasonMessage(reason: string) {
  return `Hideout: ${reason}`;
}

export function createHideoutUpgradeMessage(structureName: string, level?: number) {
  return `Hideout: ${structureName} upgraded to level ${level}.`;
}

export function createHideoutStorageMessage(itemLabel: string, direction: "stored" | "returned") {
  return `Hideout: ${itemLabel} ${direction === "stored" ? "stored in the chest" : "returned to your inventory"}.`;
}
