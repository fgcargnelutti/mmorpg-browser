import type { EncounterKey } from "../../../data/encountersData";
import type { MapId } from "./mapsData";

export type MapEncounterSpawnCondition =
  | { type: "always" }
  | { type: "quest-active"; questKey: string }
  | { type: "time-window"; window: "day" | "night" };

export type MapEncounterPoolEntry = {
  encounterKey: EncounterKey;
  weight: number;
  conditions?: MapEncounterSpawnCondition[];
};

export type MapEncounterPoolDefinition = {
  mapId: MapId;
  poolId: string;
  entries: MapEncounterPoolEntry[];
};

export type PoiEncounterBinding = {
  mapId: MapId;
  poiId: string;
  actionId: string;
  encounterKey: EncounterKey;
  conditions?: MapEncounterSpawnCondition[];
};
