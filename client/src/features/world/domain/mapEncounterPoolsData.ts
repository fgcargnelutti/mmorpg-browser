import type { MapEncounterPoolDefinition } from "./mapEncounterPoolTypes";

export const mapEncounterPoolsData: Partial<
  Record<MapEncounterPoolDefinition["mapId"], MapEncounterPoolDefinition | undefined>
> = {
  sewer: {
    mapId: "sewer",
    poolId: "sewer-hunt-pool",
    entries: [
      {
        encounterKey: "north-road-goblin",
        weight: 1,
        conditions: [{ type: "always" }],
      },
    ],
  },
  "north-forest": {
    mapId: "north-forest",
    poolId: "north-forest-hunt-pool",
    entries: [
      {
        encounterKey: "north-forest-goblin-ruins-goblin",
        weight: 1,
        conditions: [{ type: "always" }],
      },
    ],
  },
  "southwest-farm": {
    mapId: "southwest-farm",
    poolId: "southwest-farm-hunt-pool",
    entries: [
      {
        encounterKey: "southwest-farm-goblin-raider",
        weight: 1,
        conditions: [{ type: "always" }],
      },
    ],
  },
};
