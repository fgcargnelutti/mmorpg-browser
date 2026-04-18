import { getItemDefinition } from "../../../items";
import type { CreatureDropGroup } from "../../../bestiary/domain/bestiaryTypes";
import type { LootEntryRarity } from "../../domain/lootTypes";
import type { CreatureSpeciesId } from "../../../creatures";
import {
  getLootTableMasterData,
  getSpeciesLootTableBinding,
} from "../../infrastructure/combatMasterDataAdapter";

function toBestiaryRarity(rarity: LootEntryRarity): CreatureDropGroup["rarity"] | null {
  if (rarity === "boss") {
    return "rare";
  }

  return rarity;
}

export function getBestiaryDropsForSpecies(
  speciesId: CreatureSpeciesId
): CreatureDropGroup[] | null {
  const lootTableId = getSpeciesLootTableBinding(speciesId);

  if (!lootTableId) {
    return null;
  }

  const lootTable = getLootTableMasterData(lootTableId);

  if (!lootTable) {
    return null;
  }

  return lootTable.itemEntries.flatMap((entry) => {
    const rarity = toBestiaryRarity(entry.rarity);

    if (!rarity) {
      return [];
    }

    return [
      {
        itemKey: entry.itemKey,
        label: getItemDefinition(entry.itemKey)?.name ?? entry.itemKey,
        rarity,
        dropChancePercent: entry.guaranteed
          ? 100
          : entry.dropChance !== undefined
            ? Number((entry.dropChance * 100).toFixed(2))
            : undefined,
      },
    ];
  });
}
