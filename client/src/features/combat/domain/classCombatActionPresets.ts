import type { CharacterClassKey } from "../../../data/characterClassesData";
import bleedImage from "../../../assets/sprites/warrior/spells/bleed.png";
import enhanceArmorImage from "../../../assets/sprites/warrior/spells/enhancearmor.png";
import greatLungeImage from "../../../assets/sprites/warrior/spells/greatlunge.png";
import onslaughtImage from "../../../assets/sprites/warrior/spells/onslaught.png";
import plannedAttackImage from "../../../assets/sprites/warrior/spells/plannedattack.png";
import shatterDefenseImage from "../../../assets/sprites/warrior/spells/shatterdefense.png";
import shatterWeaponImage from "../../../assets/sprites/warrior/spells/shatterweapon.png";
import tripleThrustImage from "../../../assets/sprites/warrior/spells/triplethrust.png";
import vitalAttackImage from "../../../assets/sprites/warrior/spells/vitalattack.png";
import type {
  CombatActionDefinition,
  CombatActionId,
} from "./combatEngineTypes";

type CombatActionPresentationOverride = Partial<
  Pick<CombatActionDefinition, "label" | "description" | "iconImageSrc" | "fallbackIcon">
>;

type ClassCombatActionOverrides = Partial<
  Record<CombatActionId, CombatActionPresentationOverride>
>;

const warriorCombatActionOverrides: ClassCombatActionOverrides = {
  "skill-slot-1": {
    label: "Bleed",
    description:
      "Placeholder warrior skill. Meant to open a bleeding wound and apply sustained pressure damage.",
    iconImageSrc: bleedImage,
  },
  "skill-slot-2": {
    label: "Enhance Armor",
    description:
      "Placeholder warrior skill. Intended to reinforce armor and reduce incoming damage for a short window.",
    iconImageSrc: enhanceArmorImage,
  },
  "skill-slot-3": {
    label: "Great Lunge",
    description:
      "Placeholder warrior skill. Designed as a committed forward strike to close distance with heavy impact.",
    iconImageSrc: greatLungeImage,
  },
  "skill-slot-4": {
    label: "Onslaught",
    description:
      "Placeholder warrior skill. Represents a relentless offensive burst with chained pressure.",
    iconImageSrc: onslaughtImage,
  },
  "skill-slot-5": {
    label: "Planned Attack",
    description:
      "Placeholder warrior skill. Built as a measured setup attack that prepares a stronger follow-up.",
    iconImageSrc: plannedAttackImage,
  },
  "skill-slot-6": {
    label: "Shatter Defense",
    description:
      "Placeholder warrior skill. Intended to break guard and expose the target to heavier punishment.",
    iconImageSrc: shatterDefenseImage,
  },
  "skill-slot-7": {
    label: "Shatter Weapon",
    description:
      "Placeholder warrior skill. Focused on disrupting the enemy weapon and weakening their offensive power.",
    iconImageSrc: shatterWeaponImage,
  },
  "skill-slot-8": {
    label: "Triple Thrust",
    description:
      "Placeholder warrior skill. Represents a rapid three-hit sequence aimed at sustained single-target pressure.",
    iconImageSrc: tripleThrustImage,
  },
  "skill-slot-9": {
    label: "Vital Attack",
    description:
      "Placeholder warrior skill. Intended to target a critical opening with high finishing potential.",
    iconImageSrc: vitalAttackImage,
  },
};

const classCombatActionOverrides: Partial<
  Record<CharacterClassKey, ClassCombatActionOverrides>
> = {
  "wasteland-warrior": warriorCombatActionOverrides,
};

export function resolveClassCombatActionDefinition(
  playerClassKey: CharacterClassKey,
  action: CombatActionDefinition
): CombatActionDefinition {
  const actionOverrides = classCombatActionOverrides[playerClassKey]?.[action.id];

  if (!actionOverrides) {
    return action;
  }

  return {
    ...action,
    ...actionOverrides,
  };
}
