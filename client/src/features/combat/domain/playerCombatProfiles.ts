import type { CharacterClassKey } from "../../../data/characterClassesData";

export type PlayerCombatProfile = {
  baseInitiative: number;
  baseActionsPerTurn: number;
};

export const playerCombatProfiles: Record<CharacterClassKey, PlayerCombatProfile> = {
  "wasteland-warrior": {
    baseInitiative: 6,
    baseActionsPerTurn: 1,
  },
  arcanist: {
    baseInitiative: 5,
    baseActionsPerTurn: 1,
  },
  thief: {
    baseInitiative: 7,
    baseActionsPerTurn: 1,
  },
};
