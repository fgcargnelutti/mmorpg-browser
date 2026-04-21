import type { EncounterKey } from "./encounterTemplateTypes";

export type CombatTeamId = "players" | "enemies";

export type CombatEntityType = "player" | "enemy";

export type CombatResolutionType = "victory" | "defeat" | "retreat";

export type CombatActionType = "basic-attack" | "use-potion" | "skill" | "dodge";

export type CombatPotionResource = "hp" | "sp" | "hybrid";

export type CombatHotkey =
  | "1"
  | "2"
  | "3"
  | "Q"
  | "W"
  | "E"
  | "A"
  | "S"
  | "D"
  | "Z"
  | "X"
  | "C"
  | "Space"
  | "Ctrl";

export type CombatActionId =
  | "basic-attack"
  | "use-life-potion"
  | "use-mana-potion"
  | "use-variable-potion"
  | "dodge"
  | "skill-slot-1"
  | "skill-slot-2"
  | "skill-slot-3"
  | "skill-slot-4"
  | "skill-slot-5"
  | "skill-slot-6"
  | "skill-slot-7"
  | "skill-slot-8"
  | "skill-slot-9";

export type CombatActionDefinition = {
  id: CombatActionId;
  type: CombatActionType;
  label: string;
  hotkey?: CombatHotkey;
  consumesAction: boolean;
  potionItemKey?: string;
  potionResource?: CombatPotionResource;
  skillSlot?: number;
};

export type CombatInitiativeState = {
  base: number;
  modifier: number;
  computed: number;
};

export type CombatActionEconomy = {
  baseActionsPerTurn: number;
  bonusActions: number;
  actionsRemaining: number;
};

export type CombatantRuntimeState = {
  id: string;
  entityType: CombatEntityType;
  teamId: CombatTeamId;
  name: string;
  title: string;
  currentHp: number;
  maxHp: number;
  currentSp: number;
  maxSp: number;
  attackDamage: number;
  initiative: CombatInitiativeState;
  actionEconomy: CombatActionEconomy;
  isAlive: boolean;
  dodgePrepared: boolean;
};

export type CombatTurnState = {
  round: number;
  activeCombatantId: string;
  turnOrder: string[];
};

export type CombatLogEntry = {
  id: string;
  message: string;
};

export type CombatState = {
  encounterKey: EncounterKey;
  status: "active" | "resolved";
  combatants: Record<string, CombatantRuntimeState>;
  playerCombatantId: string;
  enemyCombatantIds: string[];
  turn: CombatTurnState;
  combatLog: CombatLogEntry[];
  resolution: CombatResolutionType | null;
};

export type CombatActionAvailability = {
  actionId: CombatActionId;
  isEnabled: boolean;
  reason?: string;
};

export type CombatActionExecutionResult = {
  nextState: CombatState;
  playerDelta: {
    hpDelta: number;
    spDelta: number;
    staminaDelta: number;
    consumeItemKey?: string;
  } | null;
  actionMessage: string;
  eventMessages: string[];
  outcome: CombatResolutionType | null;
  didConsumeTurnAction: boolean;
  triggeredTraining:
    | {
        type: "combat.attack" | "combat.victory";
        combatStyle: "melee";
      }
    | null;
};

export type CombatInputBinding = {
  key: string;
  actionId: CombatActionId;
};
