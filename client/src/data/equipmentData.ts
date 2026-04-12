export type EquipmentSlot = {
  key: string;
  label: string;
  icon: string;
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
      itemName: "Ash Pendant",
      tooltip: ["SP +5", "Lore +1", "Curse Resist +1"],
      equipped: true,
    },
    {
      key: "head",
      label: "Head",
      icon: "🪖",
      itemName: "Torn Hood",
      tooltip: ["Defense +2", "Cold Resist +1", "Survival +1"],
      equipped: true,
    },
    {
      key: "backpack",
      label: "Backpack",
      icon: "🎒",
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
      itemName: "Cracked Sword",
      tooltip: ["Attack +7", "Melee +2", "Durability: Low"],
      equipped: true,
    },
    {
      key: "armor",
      label: "Armor",
      icon: "🛡",
      itemName: "Rust Mail",
      tooltip: ["Defense +6", "Weight +2", "Slash Resist +1"],
      equipped: true,
    },
    {
      key: "offhand",
      label: "Offhand",
      icon: "🪵",
      itemName: "Bone Shield",
      tooltip: ["Defense +4", "Block Chance +3%", "Impact Resist +1"],
      equipped: true,
    },
  ],
  [
    {
      key: "boots",
      label: "Boots",
      icon: "🥾",
      itemName: "Leather Wraps",
      tooltip: ["Defense +2", "Move Speed +1", "Stealth +1"],
      equipped: true,
    },
    {
      key: "arrows",
      label: "Arrows",
      icon: "🏹",
      itemName: "Bone Arrows",
      tooltip: ["Ranged Ammo", "Piercing +2", "Lightweight"],
      equipped: true,
    },
  ],
  [
    {
      key: "fishing-rod",
      label: "Fishing Rod",
      icon: "🎣",
      itemName: "River Rod",
      tooltip: ["Fishing +3", "River Catch Chance +2%"],
      equipped: true,
    },
    {
      key: "pickaxe",
      label: "Pickaxe",
      icon: "⛏",
      itemName: "Miner's Pick",
      tooltip: ["Breaking Rocks +2", "Stone Yield +1"],
      equipped: true,
    },
    {
      key: "axe",
      label: "Axe",
      icon: "🪓",
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