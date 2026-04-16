import type { HideoutStructureDefinition } from "./hideoutStructureTypes";

export const hideoutStructuresData: Record<string, HideoutStructureDefinition> = {
  house: {
    key: "house",
    name: "Shelter",
    description:
      "The core shelter of the hideout. Expanding it opens room for the rest of the camp to matter.",
    maxLevel: 2,
    tiers: [
      {
        level: 1,
        label: "Patchwork Shelter",
        description: "A rough but livable structure that marks the hideout as your own.",
        buildCosts: [
          { itemKey: "wood", amount: 2 },
          { itemKey: "stone", amount: 1 },
        ],
        unlockedFunctions: ["Unlocks the basic hideout shell", "Allows future camp expansion"],
      },
      {
        level: 2,
        label: "Reinforced Shelter",
        description: "A steadier hideout that can support better rest and more permanent tools.",
        buildCosts: [
          { itemKey: "wood", amount: 3 },
          { itemKey: "stone", amount: 2 },
          { itemKey: "rope", amount: 1 },
        ],
        requirements: [{ type: "structure_level", structureKey: "bed", level: 1 }],
        unlockedFunctions: ["Improves future hideout bonuses", "Stabilizes the camp for expansion"],
      },
    ],
  },
  bed: {
    key: "bed",
    name: "Bedroll",
    description:
      "A proper resting spot for recovery and future hideout-based healing bonuses.",
    maxLevel: 2,
    tiers: [
      {
        level: 1,
        label: "Field Bedroll",
        description: "A simple resting place made from spare materials and dry padding.",
        buildCosts: [
          { itemKey: "wood", amount: 1 },
          { itemKey: "rope", amount: 1 },
        ],
        requirements: [{ type: "structure_level", structureKey: "house", level: 1 }],
        unlockedFunctions: ["Enables future rest bonuses"],
      },
      {
        level: 2,
        label: "Raised Cot",
        description: "A sturdier sleeping setup that keeps damp ground and cold away.",
        buildCosts: [
          { itemKey: "wood", amount: 2 },
          { itemKey: "rope", amount: 1 },
          { itemKey: "paper", amount: 1 },
        ],
        requirements: [{ type: "structure_level", structureKey: "house", level: 2 }],
        unlockedFunctions: ["Improves future recovery effects"],
      },
    ],
  },
  worktable: {
    key: "worktable",
    name: "Worktable",
    description:
      "A rough station for planning, crafting, and future utility-focused upgrades.",
    maxLevel: 2,
    tiers: [
      {
        level: 1,
        label: "Rough Table",
        description: "A stable surface for organizing tools, notes, and salvaged parts.",
        buildCosts: [
          { itemKey: "wood", amount: 2 },
          { itemKey: "paper", amount: 1 },
        ],
        requirements: [{ type: "structure_level", structureKey: "house", level: 1 }],
        unlockedFunctions: ["Prepares future crafting and quest utility systems"],
      },
      {
        level: 2,
        label: "Organized Bench",
        description: "A better workspace with room for more serious field preparation.",
        buildCosts: [
          { itemKey: "wood", amount: 2 },
          { itemKey: "paper", amount: 2 },
          { itemKey: "stone", amount: 1 },
        ],
        requirements: [{ type: "structure_level", structureKey: "house", level: 2 }],
        unlockedFunctions: ["Improves future utility and crafting interactions"],
      },
    ],
  },
  forge: {
    key: "forge",
    name: "Camp Forge",
    description:
      "A crude forge for future repair, refinement, and equipment-focused systems.",
    maxLevel: 2,
    tiers: [
      {
        level: 1,
        label: "Crude Brazier Forge",
        description: "A small heat source and stone frame enough for primitive metal work.",
        buildCosts: [
          { itemKey: "stone", amount: 2 },
          { itemKey: "wood", amount: 2 },
          { itemKey: "iron-ore", amount: 1 },
        ],
        requirements: [{ type: "structure_level", structureKey: "house", level: 1 }],
        unlockedFunctions: ["Prepares future smithing and repair systems"],
      },
      {
        level: 2,
        label: "Reinforced Field Forge",
        description: "A stronger forge capable of supporting heavier work and better tools.",
        buildCosts: [
          { itemKey: "stone", amount: 3 },
          { itemKey: "wood", amount: 2 },
          { itemKey: "iron-ore", amount: 2 },
        ],
        requirements: [
          { type: "structure_level", structureKey: "house", level: 2 },
          { type: "structure_level", structureKey: "worktable", level: 1 },
        ],
        unlockedFunctions: ["Improves future forging and hideout utility"],
      },
    ],
  },
};
