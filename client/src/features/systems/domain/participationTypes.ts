export type ParticipantRole =
  | "player"
  | "npc_companion"
  | "boss"
  | "ally"
  | "support";

export type ParticipantRef = {
  id: string;
  name: string;
  role: ParticipantRole;
};

export type ParticipationContribution = {
  participantId: string;
  damageDone?: number;
  healingDone?: number;
  supportScore?: number;
};

export type ParticipationSnapshot = {
  participants: ParticipantRef[];
  contributions: ParticipationContribution[];
};
