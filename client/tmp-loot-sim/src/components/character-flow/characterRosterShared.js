export const skillLabels = {
    survival: "Survival",
    melee: "Melee",
    archery: "Archery",
    stealth: "Stealth",
    arcane: "Arcane",
};
export function formatSkillLevel(rate) {
    if (rate >= 100)
        return "High";
    if (rate >= 80)
        return "Strong";
    if (rate >= 50)
        return "Medium";
    if (rate >= 20)
        return "Low";
    return "Very low";
}
export function buildPrefixedClassName(prefix, suffix) {
    return `${prefix}-${suffix}`;
}
