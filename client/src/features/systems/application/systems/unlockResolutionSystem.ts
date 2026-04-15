import type { UnlockDescriptor } from "../../domain/unlockTypes";

export function dedupeUnlocks(unlocks: UnlockDescriptor[]): UnlockDescriptor[] {
  const byKey = new Map<string, UnlockDescriptor>();

  for (const unlock of unlocks) {
    byKey.set(`${unlock.type}:${unlock.key}`, unlock);
  }

  return Array.from(byKey.values());
}

export function collectUnlockMessages(unlocks: UnlockDescriptor[]): string[] {
  return unlocks.flatMap((unlock) => {
    if (unlock.message) {
      return [unlock.message];
    }

    return [`Unlocked ${unlock.type.replaceAll("_", " ")}: ${unlock.key}.`];
  });
}
