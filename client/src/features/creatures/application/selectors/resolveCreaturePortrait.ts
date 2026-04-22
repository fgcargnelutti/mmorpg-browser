import type { CreatureBestiaryKey } from "../../../bestiary/domain/bestiaryTypes";
import { creatureVisualData } from "../../domain/creatureVisualData";

export function resolveCreaturePortraitByKey(
  creatureKey: CreatureBestiaryKey | null | undefined
) {
  if (!creatureKey) {
    return null;
  }

  return creatureVisualData[creatureKey]?.portraitImageSrc ?? null;
}

export function resolveCreaturePortraitByName(creatureName: string | null | undefined) {
  if (!creatureName) {
    return null;
  }

  const normalizedName = creatureName.trim().toLowerCase();

  if (normalizedName === "goblin") {
    return resolveCreaturePortraitByKey("goblin");
  }

  return null;
}
