import type { EncounterData } from "../../../../data/encountersData";
import { countInventoryItem } from "../../../systems/application/systems/playerStateMutationSystem";
import type {
  CombatActionExecutionResult,
  CombatActionId,
  CombatActionAvailability,
  CombatPotionResource,
  CombatResolutionType,
  CombatState,
} from "../../domain/combatEngineTypes";
import { combatActionCatalog } from "../../domain/combatActionCatalog";
import { createCombatLogEntry } from "./createCombatEncounterState";

type CombatExecutionPlayerSnapshot = {
  currentHp: number;
  currentSp: number;
  stamina: number;
  maxStamina: number;
  inventory: string[];
};

const potionRecoveryByResource: Record<
  CombatPotionResource,
  { hp: number; sp: number }
> = {
  hp: { hp: 20, sp: 0 },
  sp: { hp: 0, sp: 18 },
  hybrid: { hp: 14, sp: 14 },
};

function cloneCombatants(combatants: CombatState["combatants"]) {
  return Object.fromEntries(
    Object.entries(combatants).map(([key, combatant]) => [
      key,
      {
        ...combatant,
        initiative: { ...combatant.initiative },
        actionEconomy: { ...combatant.actionEconomy },
      },
    ])
  ) as CombatState["combatants"];
}

function resolveEnemyTargetId(state: CombatState) {
  return (
    state.enemyCombatantIds.find((enemyId) => state.combatants[enemyId]?.isAlive) ?? null
  );
}

function resolvePlayerTargetId(state: CombatState) {
  return state.combatants[state.playerCombatantId]?.isAlive
    ? state.playerCombatantId
    : null;
}

function advanceTurn(state: CombatState): CombatState {
  const turnOrder = state.turn.turnOrder.filter(
    (combatantId) => state.combatants[combatantId]?.isAlive
  );
  const currentIndex = turnOrder.findIndex(
    (combatantId) => combatantId === state.turn.activeCombatantId
  );
  const hasRemainingCombatants = turnOrder.length > 0;

  if (!hasRemainingCombatants) {
    return state;
  }

  const nextIndex =
    currentIndex >= 0 && currentIndex < turnOrder.length - 1 ? currentIndex + 1 : 0;
  const nextActiveCombatantId = turnOrder[nextIndex];
  const nextRound = nextIndex === 0 ? state.turn.round + 1 : state.turn.round;
  const nextCombatants = cloneCombatants(state.combatants);
  const nextActiveCombatant = nextCombatants[nextActiveCombatantId];

  nextActiveCombatant.actionEconomy.actionsRemaining =
    nextActiveCombatant.actionEconomy.baseActionsPerTurn +
    nextActiveCombatant.actionEconomy.bonusActions;
  nextActiveCombatant.dodgePrepared = false;

  return {
    ...state,
    combatants: nextCombatants,
    turn: {
      round: nextRound,
      activeCombatantId: nextActiveCombatantId,
      turnOrder,
    },
  };
}

function resolveAvailability(params: {
  state: CombatState;
  player: CombatExecutionPlayerSnapshot;
  actorId: string;
  actionId: CombatActionId;
}): CombatActionAvailability {
  const { state, player, actorId, actionId } = params;
  const action = combatActionCatalog[actionId];
  const actor = state.combatants[actorId];

  if (!actor || !actor.isAlive) {
    return {
      actionId,
      isEnabled: false,
      reason: "Combatant is unavailable.",
    };
  }

  if (state.status !== "active") {
    return {
      actionId,
      isEnabled: false,
      reason: "Combat already resolved.",
    };
  }

  if (state.turn.activeCombatantId !== actorId) {
    return {
      actionId,
      isEnabled: false,
      reason: "It is not your turn.",
    };
  }

  if (action.consumesAction && actor.actionEconomy.actionsRemaining <= 0) {
    return {
      actionId,
      isEnabled: false,
      reason: "No actions remaining.",
    };
  }

  if (action.type === "basic-attack") {
    if (actor.entityType === "player" && player.stamina <= 0) {
      return {
        actionId,
        isEnabled: false,
        reason: "Not enough stamina.",
      };
    }
  }

  if (action.type === "use-potion" && action.potionItemKey) {
    const count = countInventoryItem(player.inventory, action.potionItemKey);

    if (count <= 0) {
      return {
        actionId,
        isEnabled: false,
        reason: "Potion not available.",
      };
    }
  }

  return {
    actionId,
    isEnabled: true,
  };
}

export function resolveCombatActionAvailabilities(params: {
  state: CombatState;
  player: CombatExecutionPlayerSnapshot;
  actorId: string;
  actionIds: CombatActionId[];
}) {
  return params.actionIds.map((actionId) =>
    resolveAvailability({
      state: params.state,
      player: params.player,
      actorId: params.actorId,
      actionId,
    })
  );
}

function resolveResolutionFromState(state: CombatState): CombatResolutionType | null {
  const playerAlive = state.combatants[state.playerCombatantId]?.isAlive ?? false;
  const livingEnemies = state.enemyCombatantIds.filter(
    (enemyId) => state.combatants[enemyId]?.isAlive
  );

  if (!playerAlive) {
    return "defeat";
  }

  if (livingEnemies.length === 0) {
    return "victory";
  }

  return null;
}

export function executeCombatAction(params: {
  state: CombatState;
  player: CombatExecutionPlayerSnapshot;
  actionId: CombatActionId;
  actorId: string;
  encounter: EncounterData;
}): CombatActionExecutionResult {
  const { state, player, actionId, actorId, encounter } = params;
  const availability = resolveAvailability({
    state,
    player,
    actorId,
    actionId,
  });

  if (!availability.isEnabled) {
    return {
      nextState: {
        ...state,
        combatLog: [
          ...state.combatLog,
          createCombatLogEntry(availability.reason ?? "Action unavailable."),
        ],
      },
      playerDelta: null,
      actionMessage: availability.reason ?? "Action unavailable.",
      eventMessages: availability.reason ? [availability.reason] : [],
      outcome: null,
      didConsumeTurnAction: false,
      triggeredTraining: null,
    };
  }

  const action = combatActionCatalog[actionId];
  const nextCombatants = cloneCombatants(state.combatants);
  const actor = nextCombatants[actorId];
  let nextState: CombatState = {
    ...state,
    combatants: nextCombatants,
    combatLog: [...state.combatLog],
  };
  let playerDelta: CombatActionExecutionResult["playerDelta"] = null;
  let actionMessage = "";
  let eventMessages: string[] = [];
  let triggeredTraining: CombatActionExecutionResult["triggeredTraining"] = null;

  if (action.type === "skill") {
    actionMessage = `No skill is assigned to ${action.label}.`;
    nextState.combatLog.push(createCombatLogEntry(actionMessage));
    return {
      nextState,
      playerDelta: null,
      actionMessage,
      eventMessages: [actionMessage],
      outcome: null,
      didConsumeTurnAction: false,
      triggeredTraining: null,
    };
  }

  if (action.type === "dodge") {
    actor.dodgePrepared = true;
    actionMessage = `${actor.name} prepares to dodge the next incoming strike.`;
    eventMessages = ["Dodge stance prepared."];
  }

  if (action.type === "use-potion" && action.potionResource && action.potionItemKey) {
    const recovery = potionRecoveryByResource[action.potionResource];
    actionMessage = `${actor.name} uses ${action.label}.`;
    eventMessages = [actionMessage];
    playerDelta = {
      hpDelta: recovery.hp,
      spDelta: recovery.sp,
      staminaDelta: 0,
      consumeItemKey: action.potionItemKey,
    };
  }

  if (action.type === "basic-attack") {
    const targetId =
      actor.entityType === "player"
        ? resolveEnemyTargetId(state)
        : resolvePlayerTargetId(state);

    if (!targetId) {
      actionMessage = "No valid target is available.";
      nextState.combatLog.push(createCombatLogEntry(actionMessage));
      return {
        nextState,
        playerDelta: null,
        actionMessage,
        eventMessages: [actionMessage],
        outcome: null,
        didConsumeTurnAction: false,
        triggeredTraining: null,
      };
    }

    const target = nextCombatants[targetId];
    const attackDamage = actor.attackDamage;

    if (actor.entityType === "player") {
      playerDelta = {
        hpDelta: 0,
        spDelta: 0,
        staminaDelta: -1,
      };
      triggeredTraining = {
        type: "combat.attack",
        combatStyle: "melee",
      };
    }

    if (target.dodgePrepared) {
      target.dodgePrepared = false;
      actionMessage = `${target.name} evades ${actor.name}'s attack.`;
      eventMessages = [actionMessage];
    } else {
      target.currentHp = Math.max(0, target.currentHp - attackDamage);
      target.isAlive = target.currentHp > 0;
      actionMessage = `${actor.name} strikes ${target.name} for ${attackDamage} damage.`;
      eventMessages = [actionMessage];

      if (actor.entityType === "enemy" && target.entityType === "player") {
        playerDelta = {
          hpDelta: -attackDamage,
          spDelta: 0,
          staminaDelta: 0,
        };
      }
    }
  }

  if (action.consumesAction) {
    actor.actionEconomy.actionsRemaining = Math.max(
      0,
      actor.actionEconomy.actionsRemaining - 1
    );
  }

  nextState.combatLog.push(createCombatLogEntry(actionMessage));

  const immediateOutcome = resolveResolutionFromState(nextState);

  if (immediateOutcome) {
    nextState = {
      ...nextState,
      status: "resolved",
      resolution: immediateOutcome,
    };

    if (immediateOutcome === "victory") {
      triggeredTraining = {
        type: "combat.victory",
        combatStyle: "melee",
      };
      nextState.combatLog.push(createCombatLogEntry(encounter.victoryText));
    }

    if (immediateOutcome === "defeat") {
      nextState.combatLog.push(
        createCombatLogEntry(
          `You collapse under ${encounter.enemyName}'s assault.`
        )
      );
    }
  } else if (action.consumesAction && actor.actionEconomy.actionsRemaining <= 0) {
    nextState = advanceTurn(nextState);
  }

  return {
    nextState,
    playerDelta,
    actionMessage,
    eventMessages,
    outcome: immediateOutcome,
    didConsumeTurnAction: action.consumesAction,
    triggeredTraining,
  };
}
