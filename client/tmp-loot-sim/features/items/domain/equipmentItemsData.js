import goblinHelmetImage from "../../../assets/items/equipments/helmets/goblinhelmet.png";
import crackedShieldImage from "../../../assets/items/equipments/shields/crackedshield.png";
import shortSwordImage from "../../../assets/items/equipments/weapons/shortsword.png";
export const equipmentItemsData = [
    {
        key: "short-sword",
        name: "Short Sword",
        icon: shortSwordImage,
        iconKey: "sword",
        weight: 3.5,
        description: "A worn but reliable short sword.",
        stats: ["Attack +4"],
        category: "equipment",
        stackable: false,
        baseValue: 18,
        tags: ["weapon", "equipment"],
    },
    {
        key: "shield",
        name: "Cracked Shield",
        icon: crackedShieldImage,
        iconKey: "shield",
        weight: 4.0,
        description: "A basic shield that has seen too many impacts and repairs.",
        stats: ["Defense +3"],
        category: "equipment",
        stackable: false,
        baseValue: 16,
        tags: ["offhand", "equipment"],
    },
    {
        key: "goblin-helmet",
        name: "Goblin Helmet",
        icon: goblinHelmetImage,
        iconKey: "helmet",
        weight: 2.4,
        description: "A crude helm stolen and reforged by goblins over many raids.",
        stats: ["Head equipment", "Defense +2"],
        category: "equipment",
        stackable: false,
        baseValue: 24,
        tags: ["head", "equipment", "goblin"],
    },
];
