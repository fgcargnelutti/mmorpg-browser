import type { CreatureBestiaryData } from "./bestiaryTypes";
import { getCreatureSpeciesSnapshot } from "../../creatures";
import { getBestiaryDropsForSpecies } from "../../combat/application/selectors/getBestiaryDropsForSpecies";

const goblinSpecies = getCreatureSpeciesSnapshot("goblin");
const goblinBestiaryDrops = getBestiaryDropsForSpecies("goblin");

if (!goblinSpecies) {
  throw new Error("Missing canonical species data for goblin.");
}

if (!goblinBestiaryDrops) {
  throw new Error("Missing canonical loot data for goblin.");
}

export const creatureCompendiumData: Record<string, CreatureBestiaryData> = {
  goblin: {
    key: goblinSpecies.id,
    name: goblinSpecies.name,
    category: goblinSpecies.category,
    threatTier: goblinSpecies.threatTier,
    habitatTags: goblinSpecies.habitatTags,
    isBossCandidate: goblinSpecies.isBossCandidate,
    maxHp: goblinSpecies.maxHp,
    maxSp: goblinSpecies.maxSp,
    drops: goblinBestiaryDrops,
    weaknesses: goblinSpecies.weaknesses,
    resistances: goblinSpecies.resistances,
    strengths: goblinSpecies.strengths,
    attacks: goblinSpecies.attacks,
    notes: goblinSpecies.notes,
  },
  orc: {
    key: "orc",
    name: "Orc",
    category: "humanoid",
    threatTier: "dangerous",
    habitatTags: ["forest", "road", "ruins"],
    isBossCandidate: false,
    maxHp: 42,
    maxSp: 14,
    drops: [
      { itemKey: "stone", label: "Stone", rarity: "common" },
      { itemKey: "wood", label: "Wood", rarity: "common" },
      { itemKey: "iron-ore", label: "Iron Ore", rarity: "rare" },
    ],
    weaknesses: ["Bleed", "Coordinated pressure"],
    resistances: ["Pain", "Intimidation"],
    strengths: ["Heavy blows", "Close-quarters aggression"],
    attacks: [
      {
        key: "cleaver-swing",
        label: "Cleaver Swing",
        description: "A brutal, wide swing meant to break a defender's footing.",
      },
    ],
    notes: ["Orcs favor direct confrontation and rough battlefield dominance."],
  },
  minotaur: {
    key: "minotaur",
    name: "Minotaur",
    category: "boss",
    threatTier: "elite",
    habitatTags: ["underground", "ruins"],
    isBossCandidate: true,
    maxHp: 96,
    maxSp: 20,
    drops: [
      { itemKey: "stone", label: "Stone", rarity: "common" },
      { itemKey: "rope", label: "Rope", rarity: "common" },
      { itemKey: "gold", label: "Ancient Gold", rarity: "rare" },
    ],
    weaknesses: ["Flanking", "Tight maneuvering traps"],
    resistances: ["Charge interruption", "Fear"],
    strengths: ["Rushdown", "Massive impact damage"],
    attacks: [
      {
        key: "labyrinth-charge",
        label: "Labyrinth Charge",
        description: "A devastating rush that overwhelms anything directly ahead.",
      },
    ],
    notes: ["Minotaurs are relentless once they commit to a pursuit line."],
  },
  dragon: {
    key: "dragon",
    name: "Dragon",
    category: "draconic",
    threatTier: "boss",
    habitatTags: ["ruins", "road"],
    isBossCandidate: true,
    maxHp: 260,
    maxSp: 80,
    drops: [
      { itemKey: "gold", label: "Gold", rarity: "common" },
      { itemKey: "stone", label: "Burnt Scale Fragment", rarity: "common" },
      { itemKey: "iron-ore", label: "Tempered Dragon Ore", rarity: "rare" },
    ],
    weaknesses: ["Prepared siege tactics", "Prolonged attrition"],
    resistances: ["Fire", "Fear", "Direct frontal assaults"],
    strengths: ["Area devastation", "Flight pressure", "Overwhelming durability"],
    attacks: [
      {
        key: "ember-breath",
        label: "Ember Breath",
        description: "A wave of searing flame that scorches everything in front of it.",
      },
      {
        key: "wing-shock",
        label: "Wing Shock",
        description: "A heavy wingbeat that throws enemies off balance.",
      },
    ],
    notes: ["Dragons should eventually be represented as boss-grade encounters."],
  },
  thief: {
    key: "thief",
    name: "Thief",
    category: "humanoid",
    threatTier: "common",
    habitatTags: ["town", "road", "ruins"],
    isBossCandidate: false,
    maxHp: 24,
    maxSp: 18,
    drops: [
      { itemKey: "rope", label: "Rope", rarity: "common" },
      { itemKey: "paper", label: "Stolen Note", rarity: "common" },
      { itemKey: "gold", label: "Hidden Coin Purse", rarity: "rare" },
    ],
    weaknesses: ["Vision control", "Direct pressure"],
    resistances: ["Ambush punishment", "Retreat routes"],
    strengths: ["Evasion", "Cheap strikes", "Loot theft"],
    attacks: [
      {
        key: "shiv-cut",
        label: "Shiv Cut",
        description: "A fast hit aimed at exposed gaps in a target's guard.",
      },
    ],
    notes: ["Thieves rely on positioning and opportunistic damage."],
  },
  yienkh: {
    key: "yienkh",
    name: "Yienkh",
    category: "aberration",
    threatTier: "dangerous",
    habitatTags: ["sewer", "swamp", "underground"],
    isBossCandidate: false,
    maxHp: 58,
    maxSp: 12,
    drops: [
      { itemKey: "rope", label: "Silk Thread", rarity: "common" },
      { itemKey: "herb", label: "Bog Herb", rarity: "common" },
      { itemKey: "paper", label: "Venom Notes", rarity: "rare" },
    ],
    weaknesses: ["Fire", "Sustained melee pressure"],
    resistances: ["Entrapment", "Poisoned terrain"],
    strengths: ["Web control", "Venom", "Ambush from above"],
    attacks: [
      {
        key: "web-snare",
        label: "Web Snare",
        description: "A sticky web cast that slows movement and creates openings.",
      },
      {
        key: "venom-bite",
        label: "Venom Bite",
        description: "A brutal bite that delivers lingering poison.",
      },
    ],
    notes: ["Yienkh is a giant spider species feared in swamps and ruined tunnels."],
  },
  ogre: {
    key: "ogre",
    name: "Ogre",
    category: "giant",
    threatTier: "elite",
    habitatTags: ["rural", "road", "ruins"],
    isBossCandidate: false,
    maxHp: 118,
    maxSp: 10,
    drops: [
      { itemKey: "wood", label: "Club Splinter", rarity: "common" },
      { itemKey: "stone", label: "Crushed Stone", rarity: "common" },
      { itemKey: "gold", label: "Smashed Tribute", rarity: "rare" },
    ],
    weaknesses: ["Mobility", "Repeated interrupts"],
    resistances: ["Stagger", "Minor wounds"],
    strengths: ["Raw impact", "Area knockback"],
    attacks: [
      {
        key: "maul-smash",
        label: "Maul Smash",
        description: "A crushing downward strike with terrible force.",
      },
    ],
    notes: ["Ogres are dangerous primarily because they endure and overpower."],
  },
  troll: {
    key: "troll",
    name: "Troll",
    category: "giant",
    threatTier: "elite",
    habitatTags: ["swamp", "forest", "underground"],
    isBossCandidate: false,
    maxHp: 134,
    maxSp: 16,
    drops: [
      { itemKey: "herb", label: "Bog Herb", rarity: "common" },
      { itemKey: "stone", label: "Swamp Stone", rarity: "common" },
      { itemKey: "rope", label: "Tough Tendon", rarity: "rare" },
    ],
    weaknesses: ["Fire", "Focused finishing pressure"],
    resistances: ["Attrition", "Minor cuts"],
    strengths: ["Regeneration", "Endurance", "Swamp fighting"],
    attacks: [
      {
        key: "rending-claw",
        label: "Rending Claw",
        description: "A tearing swipe meant to wear an enemy down over time.",
      },
    ],
    notes: ["Trolls should later support regeneration-specific combat logic."],
  },
};
