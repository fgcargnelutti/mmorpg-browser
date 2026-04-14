export type ActiveBuff = {
  key: string;
  icon: string;
  label: string;
  description: string;
  active?: boolean;
};

export const buffsData: ActiveBuff[] = [
  {
    key: "xp-bonus",
    icon: "✦",
    label: "XP Bonus",
    description: "Increases experience gained from combat and discoveries.",
    active: true,
  },
  {
    key: "stamina-boost",
    icon: "🍖",
    label: "Stamina Boost",
    description: "Improves stamina recovery and endurance.",
    active: false,
  },
  {
    key: "damage-boost",
    icon: "🗡",
    label: "Damage Boost",
    description: "Your attacks deal increased damage.",
    active: false,
  },
  {
    key: "damage-reduction",
    icon: "🛡",
    label: "Damage Reduction",
    description: "Reduces incoming damage.",
    active: false,
  },
  {
    key: "skill-focus",
    icon: "📘",
    label: "Skill Bonus",
    description: "Increases skill progression speed.",
    active: false,
  },
];