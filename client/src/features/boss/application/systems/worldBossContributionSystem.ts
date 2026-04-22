import type {
  WorldBossContributionRecord,
  WorldBossParticipant,
} from "../../domain/worldBossTypes";

function createEmptyContributionRecord(
  participantId: string
): WorldBossContributionRecord {
  return {
    participantId,
    damageDealt: 0,
    healingDone: 0,
    damageTaken: 0,
    roundsParticipated: 0,
    roundsAlive: 0,
    actionsCommitted: 0,
  };
}

function upsertContributionRecord(
  records: WorldBossContributionRecord[],
  participantId: string
) {
  const existingRecord = records.find(
    (record) => record.participantId === participantId
  );

  return existingRecord ?? createEmptyContributionRecord(participantId);
}

function replaceContributionRecord(
  records: WorldBossContributionRecord[],
  nextRecord: WorldBossContributionRecord
) {
  const filteredRecords = records.filter(
    (record) => record.participantId !== nextRecord.participantId
  );

  return [...filteredRecords, nextRecord];
}

export function createInitialWorldBossContribution(
  participants: WorldBossParticipant[]
) {
  return participants.map((participant) =>
    createEmptyContributionRecord(participant.id)
  );
}

export function registerWorldBossDamageContribution(
  records: WorldBossContributionRecord[],
  participantId: string,
  damageDealt: number
) {
  const baseRecord = upsertContributionRecord(records, participantId);

  return replaceContributionRecord(records, {
    ...baseRecord,
    damageDealt: baseRecord.damageDealt + Math.max(0, damageDealt),
  });
}

export function registerWorldBossHealingContribution(
  records: WorldBossContributionRecord[],
  participantId: string,
  healingDone: number
) {
  const baseRecord = upsertContributionRecord(records, participantId);

  return replaceContributionRecord(records, {
    ...baseRecord,
    healingDone: baseRecord.healingDone + Math.max(0, healingDone),
  });
}

export function registerWorldBossDamageTakenContribution(
  records: WorldBossContributionRecord[],
  participantId: string,
  damageTaken: number
) {
  const baseRecord = upsertContributionRecord(records, participantId);

  return replaceContributionRecord(records, {
    ...baseRecord,
    damageTaken: baseRecord.damageTaken + Math.max(0, damageTaken),
  });
}

export function registerWorldBossRoundParticipation(
  records: WorldBossContributionRecord[],
  participantId: string,
  params: {
    countedAsAlive?: boolean;
    actionCommitted?: boolean;
  } = {}
) {
  const baseRecord = upsertContributionRecord(records, participantId);

  return replaceContributionRecord(records, {
    ...baseRecord,
    roundsParticipated: baseRecord.roundsParticipated + 1,
    roundsAlive:
      baseRecord.roundsAlive + (params.countedAsAlive === false ? 0 : 1),
    actionsCommitted:
      baseRecord.actionsCommitted + (params.actionCommitted ? 1 : 0),
  });
}
