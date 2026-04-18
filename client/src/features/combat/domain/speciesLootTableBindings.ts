import type { CreatureSpeciesId } from "../../creatures";
import type { LootTableId } from "./lootTypes";

export const speciesLootTableBindings: Partial<
  Record<CreatureSpeciesId, LootTableId | undefined>
> = {
  goblin: "goblin-common",
};
