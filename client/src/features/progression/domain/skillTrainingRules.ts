import type { EncounterKey } from "../../../data/encountersData";
import type { LocationKey, ContextAction } from "../../world/domain/locations";
import type { SkillKey } from "./skillCatalog";

export type SkillTrainingReward = {
  skillKey: SkillKey;
  xp: number;
  reason: string;
};

export type SkillTrainingEvent =
  | {
      type: "combat.attack";
      combatStyle: "melee" | "archery" | "arcane";
      encounterKey: EncounterKey;
    }
  | {
      type: "combat.victory";
      combatStyle: "melee" | "archery" | "arcane";
      encounterKey: EncounterKey;
    }
  | {
      type: "world.action.completed";
      action: Pick<ContextAction, "id" | "label" | "rewardItem" | "amount" | "effect">;
    }
  | {
      type: "world.discovery.location";
      locationKey: LocationKey;
    }
  | {
      type: "world.discovery.poi";
      poiKey: string;
    }
  | {
      type: "npc.rumor.learned";
      rumorKey: string;
    };

const gatherableItems = new Set(["stone", "wood", "paper", "herb", "fish", "rope"]);

export function resolveSkillTrainingRewards(
  event: SkillTrainingEvent
): SkillTrainingReward[] {
  if (event.type === "combat.attack") {
    const skillKey =
      event.combatStyle === "archery"
        ? "archery"
        : event.combatStyle === "arcane"
          ? "arcane"
          : "melee";

    return [
      {
        skillKey,
        xp: 8,
        reason: "Combat practice",
      },
    ];
  }

  if (event.type === "combat.victory") {
    const skillKey =
      event.combatStyle === "archery"
        ? "archery"
        : event.combatStyle === "arcane"
          ? "arcane"
          : "melee";

    return [
      {
        skillKey,
        xp: 14,
        reason: "Combat victory",
      },
    ];
  }

  if (event.type === "world.discovery.location") {
    return [
      {
        skillKey: "survival",
        xp: 10,
        reason: "Exploration and navigation",
      },
    ];
  }

  if (event.type === "world.discovery.poi") {
    return [
      {
        skillKey: "survival",
        xp: 14,
        reason: "Discovering a hidden point of interest",
      },
    ];
  }

  if (event.type === "npc.rumor.learned") {
    return [
      {
        skillKey: "arcane",
        xp: 10,
        reason: "Learning from rumors and hidden knowledge",
      },
    ];
  }

  const amount = event.action.amount ?? 1;

  if (event.action.rewardItem && gatherableItems.has(event.action.rewardItem)) {
    return [
      {
        skillKey: "survival",
        xp: amount * 6,
        reason: "Field gathering",
      },
    ];
  }

  return [];
}
