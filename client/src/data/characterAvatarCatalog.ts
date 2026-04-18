import type { CharacterClassKey } from "./characterClassesData";
import {
  mageAvatarArt,
  rangerAvatarArt,
  warriorAvatarArt,
} from "../assets/characters/avatars";

export type CharacterAvatarDefinition = {
  classKey: CharacterClassKey;
  imageSrc: string;
  altLabel: string;
};

export const characterAvatarCatalog: Record<
  CharacterClassKey,
  CharacterAvatarDefinition
> = {
  "wasteland-warrior": {
    classKey: "wasteland-warrior",
    imageSrc: warriorAvatarArt,
    altLabel: "Wasteland Warrior avatar",
  },
  arcanist: {
    classKey: "arcanist",
    imageSrc: mageAvatarArt,
    altLabel: "Arcanist avatar",
  },
  thief: {
    classKey: "thief",
    imageSrc: rangerAvatarArt,
    altLabel: "Thief avatar",
  },
};

export function resolveCharacterAvatarByClassKey(classKey: CharacterClassKey) {
  return characterAvatarCatalog[classKey];
}
