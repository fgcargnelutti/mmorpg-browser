import { mapsData } from "../../../world/domain/mapsData";
import {
  getAllMapEncounterPoolMasterData,
  getAllPoiEncounterBindingsMasterData,
} from "../../../world/infrastructure/worldEncounterMasterDataAdapter";
import {
  getAllEncounterTemplateMasterData,
  getAllLootTableMasterData,
} from "../../../combat/infrastructure/combatMasterDataAdapter";
import { getAllCreatureSpeciesMasterData } from "../../../creatures";

export type MasterDataValidationIssue = {
  severity: "error" | "warning";
  scope: "species" | "encounter" | "loot" | "world";
  message: string;
};

export type MasterDataValidationReport = {
  errors: MasterDataValidationIssue[];
  warnings: MasterDataValidationIssue[];
};

function createIssue(
  severity: MasterDataValidationIssue["severity"],
  scope: MasterDataValidationIssue["scope"],
  message: string
): MasterDataValidationIssue {
  return { severity, scope, message };
}

export function validateMasterDataReferences(): MasterDataValidationReport {
  const issues: MasterDataValidationIssue[] = [];
  const speciesData = getAllCreatureSpeciesMasterData();
  const encounterTemplates = getAllEncounterTemplateMasterData();
  const lootTables = getAllLootTableMasterData();
  const mapEncounterPools = getAllMapEncounterPoolMasterData();
  const poiEncounterBindings = getAllPoiEncounterBindingsMasterData();

  Object.values(encounterTemplates).forEach((template) => {
    if (!speciesData[template.speciesId]) {
      issues.push(
        createIssue(
          "error",
          "encounter",
          `Encounter ${template.key} references missing species ${template.speciesId}.`
        )
      );
    }

    if (template.lootTableKey && !lootTables[template.lootTableKey]) {
      issues.push(
        createIssue(
          "error",
          "encounter",
          `Encounter ${template.key} references missing loot table ${template.lootTableKey}.`
        )
      );
    }
  });

  Object.entries(mapEncounterPools).forEach(([mapId, pool]) => {
    if (!pool) {
      return;
    }

    if (!mapsData[pool.mapId]) {
      issues.push(
        createIssue(
          "error",
          "world",
          `Encounter pool ${pool.poolId} references missing map ${pool.mapId}.`
        )
      );
    }

    if (mapId !== pool.mapId) {
      issues.push(
        createIssue(
          "warning",
          "world",
          `Encounter pool record key ${mapId} does not match pool.mapId ${pool.mapId}.`
        )
      );
    }

    if (pool.entries.length === 0) {
      issues.push(
        createIssue(
          "warning",
          "world",
          `Encounter pool ${pool.poolId} has no entries.`
        )
      );
    }

    pool.entries.forEach((entry) => {
      if (!encounterTemplates[entry.encounterKey]) {
        issues.push(
          createIssue(
            "error",
            "world",
            `Encounter pool ${pool.poolId} references missing encounter ${entry.encounterKey}.`
          )
        );
      }

      if (entry.weight <= 0) {
        issues.push(
          createIssue(
            "warning",
            "world",
            `Encounter pool ${pool.poolId} has non-positive weight for encounter ${entry.encounterKey}.`
          )
        );
      }
    });
  });

  poiEncounterBindings.forEach((binding) => {
    const map = mapsData[binding.mapId];

    if (!map) {
      issues.push(
        createIssue(
          "error",
          "world",
          `PoI binding ${binding.mapId}/${binding.poiId}/${binding.actionId} references missing map ${binding.mapId}.`
        )
      );
      return;
    }

    const poi = map.pois.find((candidate) => candidate.id === binding.poiId);

    if (!poi) {
      issues.push(
        createIssue(
          "error",
          "world",
          `PoI binding ${binding.mapId}/${binding.poiId}/${binding.actionId} references missing poi ${binding.poiId}.`
        )
      );
      return;
    }

    const action = poi.actions?.find((candidate) => candidate.id === binding.actionId);

    if (!action) {
      issues.push(
        createIssue(
          "error",
          "world",
          `PoI binding ${binding.mapId}/${binding.poiId}/${binding.actionId} references missing action ${binding.actionId}.`
        )
      );
      return;
    }

    if (action.effect !== "trigger_encounter") {
      issues.push(
        createIssue(
          "warning",
          "world",
          `PoI binding ${binding.mapId}/${binding.poiId}/${binding.actionId} points to an action that is not trigger_encounter.`
        )
      );
    }

    if (!encounterTemplates[binding.encounterKey]) {
      issues.push(
        createIssue(
          "error",
          "world",
          `PoI binding ${binding.mapId}/${binding.poiId}/${binding.actionId} references missing encounter ${binding.encounterKey}.`
        )
      );
    }
  });

  Object.values(mapsData).forEach((map) => {
    map.pois.forEach((poi) => {
      poi.actions
        ?.filter((action) => action.effect === "trigger_encounter")
        .forEach((action) => {
          const hasBinding = poiEncounterBindings.some(
            (binding) =>
              binding.mapId === map.id &&
              binding.poiId === poi.id &&
              binding.actionId === action.id
          );

          if (!action.encounterKey && !hasBinding) {
            issues.push(
              createIssue(
                "warning",
                "world",
                `Trigger encounter action ${map.id}/${poi.id}/${action.id} has no encounterKey and no PoI binding.`
              )
            );
          }
        });
    });
  });

  return {
    errors: issues.filter((issue) => issue.severity === "error"),
    warnings: issues.filter((issue) => issue.severity === "warning"),
  };
}
