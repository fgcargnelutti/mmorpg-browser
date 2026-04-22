import tannedLeatherArmorImage from "../assets/items/equipments/armors/tannedleatherarmor.png";
import backpackImage from "../assets/items/equipments/backpacks/backpack.png";
import oldBootsImage from "../assets/items/equipments/boots/oldboots.png";
import crackedHelmetImage from "../assets/items/equipments/helmets/crackedhelmet.png";
import simpleAmuletImage from "../assets/items/equipments/jewels/simpleamulet.png";
import crackedShieldImage from "../assets/items/equipments/shields/crackedshield.png";
import fishingRodImage from "../assets/items/equipments/tools/fishingrod.png";
import pickaxeImage from "../assets/items/equipments/tools/pickaxe.png";
import splitAxeImage from "../assets/items/equipments/tools/splitaxe.png";
import shortSwordImage from "../assets/items/equipments/weapons/shortsword.png";

export type EquipmentSlot = {
  key: string;
  label: string;
  icon: string;
  iconImageSrc?: string;
  itemName: string;
  tooltip: string[];
  equipped?: boolean;
};

export const equipmentRows: EquipmentSlot[][] = [
  [
    {
      key: "jewel",
      label: "Jewel",
      icon: "💍",
      iconImageSrc: simpleAmuletImage,
      itemName: "Simple Amulet",
      tooltip: ["SP +5", "Lore +1", "Curse Resist +1"],
      equipped: true,
    },
    {
      key: "head",
      label: "Head",
      icon: "🪖",
      iconImageSrc: crackedHelmetImage,
      itemName: "Cracked Helmet",
      tooltip: ["Defense +2", "Cold Resist +1", "Survival +1"],
      equipped: true,
    },
    {
      key: "backpack",
      label: "Backpack",
      icon: "🎒",
      iconImageSrc: backpackImage,
      itemName: "Frayed Pack",
      tooltip: ["Capacity +12", "Gathering +1"],
      equipped: true,
    },
  ],
  [
    {
      key: "weapon",
      label: "Weapon",
      icon: "⚔",
      iconImageSrc: shortSwordImage,
      itemName: "Short Sword",
      tooltip: ["Attack +7", "Melee +2", "Durability: Low"],
      equipped: true,
    },
    {
      key: "armor",
      label: "Armor",
      icon: "🛡",
      iconImageSrc: tannedLeatherArmorImage,
      itemName: "Tanned Leather Armor",
      tooltip: ["Defense +6", "Weight +2", "Slash Resist +1"],
      equipped: true,
    },
    {
      key: "offhand",
      label: "Offhand",
      icon: "🪵",
      iconImageSrc: crackedShieldImage,
      itemName: "Cracked Shield",
      tooltip: ["Defense +4", "Block Chance +3%", "Impact Resist +1"],
      equipped: true,
    },
  ],
  [
    {
      key: "boots",
      label: "Boots",
      icon: "🥾",
      iconImageSrc: oldBootsImage,
      itemName: "Old Boots",
      tooltip: ["Defense +2", "Move Speed +1", "Stealth +1"],
      equipped: true,
    },
    {
      key: "arrows",
      label: "Arrows",
      icon: "➶",
      itemName: "Arrow Slot",
      tooltip: ["Reserved slot for arrows and ranged ammunition."],
      equipped: false,
    },
  ],
  [
    {
      key: "fishing-rod",
      label: "Fishing Rod",
      icon: "🎣",
      iconImageSrc: fishingRodImage,
      itemName: "Fishing Rod",
      tooltip: ["Fishing +3", "River Catch Chance +2%"],
      equipped: true,
    },
    {
      key: "pickaxe",
      label: "Pickaxe",
      icon: "⛏",
      iconImageSrc: pickaxeImage,
      itemName: "Pickaxe",
      tooltip: ["Breaking Rocks +2", "Stone Yield +1"],
      equipped: true,
    },
    {
      key: "axe",
      label: "Axe",
      icon: "🪓",
      iconImageSrc: splitAxeImage,
      itemName: "Split Axe",
      tooltip: ["Woodcutting +2", "Attack +2 vs beasts"],
      equipped: true,
    },
    {
      key: "grapple",
      label: "Arpéu",
      icon: "🪝",
      itemName: "Iron Grapple",
      tooltip: ["Allows access to vertical areas", "Traversal Tool"],
      equipped: true,
    },
  ],
];
