export type RewardType =
  | "xp"
  | "gold"
  | "item"
  | "stamina"
  | "unlock"
  | "message";

export type XpReward = {
  type: "xp";
  amount: number;
  reason?: string;
};

export type GoldReward = {
  type: "gold";
  amount: number;
  reason?: string;
};

export type ItemReward = {
  type: "item";
  itemKey: string;
  amount: number;
  reason?: string;
};

export type StaminaReward = {
  type: "stamina";
  amount: number;
  reason?: string;
};

export type UnlockReward = {
  type: "unlock";
  unlockKey: string;
  reason?: string;
};

export type MessageReward = {
  type: "message";
  message: string;
};

export type Reward =
  | XpReward
  | GoldReward
  | ItemReward
  | StaminaReward
  | UnlockReward
  | MessageReward;
