import type { LearnByDoingRates } from "../../data/characterClassesData";

export const skillLabels: Record<keyof LearnByDoingRates, string> = {
  survival: "Survival",
  melee: "Melee",
  archery: "Archery",
  stealth: "Stealth",
  arcane: "Arcane",
};

export function formatSkillLevel(rate: number) {
  if (rate >= 100) return "High";
  if (rate >= 80) return "Strong";
  if (rate >= 50) return "Medium";
  if (rate >= 20) return "Low";
  return "Very low";
}

export function buildPrefixedClassName(prefix: string, suffix: string) {
  return `${prefix}-${suffix}`;
}
