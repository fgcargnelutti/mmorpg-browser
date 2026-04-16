export type CompanionRole =
  | "fighter"
  | "healer"
  | "support"
  | "crafting"
  | "scout";

export type CompanionAvailability = "locked" | "available" | "assigned" | "active";
export type CompanionAssignmentType = "hideout" | "combat" | "idle";

export type CompanionAssignment = {
  type: CompanionAssignmentType;
  targetKey?: string;
};

export type CompanionStats = {
  power: number;
  support: number;
  resilience: number;
};

export type CompanionDefinition = {
  key: string;
  name: string;
  role: CompanionRole;
  description: string;
  stats: CompanionStats;
};

export type CompanionState = {
  companionKey: string;
  availability: CompanionAvailability;
  affinity: number;
  assignment: CompanionAssignment;
  unlockedAt?: string;
};

// Source-of-truth note:
// - Local prototype: companion recruitment and assignment may remain client-side.
// - Future backend: unlock state, assignment, progression, and combat contribution
//   should be validated and stored by the server.
