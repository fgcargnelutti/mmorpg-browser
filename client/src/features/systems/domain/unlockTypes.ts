export type UnlockTargetType =
  | "skill"
  | "quest"
  | "poi"
  | "item"
  | "hideout_structure"
  | "companion";

export type UnlockState = "locked" | "unlockable" | "unlocked";

export type UnlockDescriptor = {
  key: string;
  type: UnlockTargetType;
  source?: string;
  message?: string;
};
