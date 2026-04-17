export type ConditionPlayerSnapshot = {
  activeConditions: string[];
  currentHp: number;
  currentSp: number;
};

export function hasActiveCondition(
  snapshot: Pick<ConditionPlayerSnapshot, "activeConditions">,
  conditionKey: string
) {
  return snapshot.activeConditions.includes(conditionKey);
}

export function resolveConditionAdjustedStaminaCost(
  snapshot: Pick<ConditionPlayerSnapshot, "activeConditions">,
  baseCost: number
) {
  const resolvedBaseCost = Math.max(0, baseCost);

  if (resolvedBaseCost <= 0) {
    return 0;
  }

  return hasActiveCondition(snapshot, "injury")
    ? resolvedBaseCost + 1
    : resolvedBaseCost;
}

export function resolveConditionAdjustedAttackDamage(
  snapshot: Pick<ConditionPlayerSnapshot, "activeConditions">,
  baseDamage: number
) {
  const resolvedBaseDamage = Math.max(1, baseDamage);

  if (!hasActiveCondition(snapshot, "injury")) {
    return resolvedBaseDamage;
  }

  return Math.max(1, resolvedBaseDamage - 2);
}

export function applyConditionActionWear<T extends ConditionPlayerSnapshot>(
  snapshot: T
): T {
  if (!hasActiveCondition(snapshot, "poison")) {
    return snapshot;
  }

  return {
    ...snapshot,
    currentHp: Math.max(1, snapshot.currentHp - 1),
    currentSp: Math.max(0, snapshot.currentSp - 1),
  };
}
