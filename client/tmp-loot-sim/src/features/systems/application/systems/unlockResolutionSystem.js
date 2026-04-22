export function dedupeUnlocks(unlocks) {
    const byKey = new Map();
    for (const unlock of unlocks) {
        byKey.set(`${unlock.type}:${unlock.key}`, unlock);
    }
    return Array.from(byKey.values());
}
export function collectUnlockMessages(unlocks) {
    return unlocks.flatMap((unlock) => {
        if (unlock.message) {
            return [unlock.message];
        }
        return [`Unlocked ${unlock.type.replaceAll("_", " ")}: ${unlock.key}.`];
    });
}
