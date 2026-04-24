import type {
  WorldBossPlayerActionSelection,
  WorldBossRoundResolutionPhase,
  WorldBossRoundState,
} from "../../domain/worldBossTypes";

export function getWorldBossActionsForPhase(
  round: WorldBossRoundState,
  phase: WorldBossRoundResolutionPhase
) {
  return round.submittedPlayerActions.filter((action) => action.phase === phase);
}

export function groupWorldBossActionsByPhase(round: WorldBossRoundState) {
  return round.resolutionPhases.reduce<
    Record<WorldBossRoundResolutionPhase, WorldBossPlayerActionSelection[]>
  >(
    (groupedActions, phase) => ({
      ...groupedActions,
      [phase]: getWorldBossActionsForPhase(round, phase),
    }),
    {
      movement: [],
      defense: [],
      preparation: [],
      support: [],
      offense: [],
      "post-action": [],
    }
  );
}
