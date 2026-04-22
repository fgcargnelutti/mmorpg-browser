import { mageAvatarArt, rangerAvatarArt, warriorAvatarArt, } from "../assets/characters/avatars";
export const characterAvatarCatalog = {
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
export function resolveCharacterAvatarByClassKey(classKey) {
    return characterAvatarCatalog[classKey];
}
