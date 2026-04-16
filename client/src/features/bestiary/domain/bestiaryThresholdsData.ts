import type { BestiaryThresholdDefinition } from "./bestiaryTypes";

export const bestiaryThresholdsData: BestiaryThresholdDefinition[] = [
  { killCount: 1, tier: "known" },
  { killCount: 10, tier: "vitals" },
  { killCount: 50, tier: "common-drops" },
  { killCount: 100, tier: "complete" },
];
