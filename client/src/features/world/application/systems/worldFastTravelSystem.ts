import { inventoryCatalog } from "../../../../data/inventoryCatalog";
import type { Reward } from "../../../systems/domain/rewardTypes";
import type {
  ActiveWorldFastTravel,
  WorldFastTravelReport,
} from "../../domain/worldFastTravel";
import type { WorldMapPoi } from "../../domain/worldMapPoisData";

function getItemLabel(itemKey: string) {
  return inventoryCatalog[itemKey]?.name ?? itemKey;
}

function getActivityYieldAmount(durationMinutes: number) {
  return Math.max(1, Math.min(3, Math.ceil(durationMinutes / 20)));
}

function hashTravelSeed(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 2147483647;
  }

  return hash;
}

function resolveActivityRewards(travel: ActiveWorldFastTravel): {
  rewards: Reward[];
  activitySummary: string;
} {
  const amount = getActivityYieldAmount(travel.durationMinutes);
  const seed = hashTravelSeed(
    `${travel.originPoiId}:${travel.destinationPoiId}:${travel.activity.id}:${travel.durationMinutes}`
  );

  switch (travel.activity.id) {
    case "fish":
      return {
        rewards: [
          {
            type: "item",
            itemKey: "fish",
            amount,
            reason: "Fast travel activity reward",
          },
        ],
        activitySummary:
          "You paused along the route's calmer waters and secured a fresh catch.",
      };
    case "cook":
      return {
        rewards: [
          {
            type: "item",
            itemKey: "cookie",
            amount,
            reason: "Fast travel activity reward",
          },
        ],
        activitySummary:
          "You kept the campfire routine efficient and prepared trail rations for the road ahead.",
      };
    case "forage": {
      const itemKey = seed % 2 === 0 ? "herb" : "fruit";

      return {
        rewards: [
          {
            type: "item",
            itemKey,
            amount,
            reason: "Fast travel activity reward",
          },
        ],
        activitySummary:
          itemKey === "herb"
            ? "You searched the roadside carefully and returned with useful herbs."
            : "You kept an eye on the frontier brush and gathered wild fruit on the way.",
      };
    }
    case "rest":
    default:
      return {
        rewards: [],
        activitySummary:
          "You kept a steady pace, conserved your strength, and let the road do the work.",
      };
  }
}

function resolveTravelEncounter(travel: ActiveWorldFastTravel): {
  hpLoss: number;
  spLoss: number;
  inflictedConditions: string[];
  encounterSummary: string | null;
} {
  const seed = hashTravelSeed(
    `${travel.originPoiId}:${travel.destinationPoiId}:${travel.durationMinutes}:${travel.foodCost}:${travel.activity.id}:encounter`
  );
  const encounterRoll = seed % 100;

  if (encounterRoll >= 18) {
    return {
      hpLoss: 0,
      spLoss: 0,
      inflictedConditions: [],
      encounterSummary: null,
    };
  }

  const variantRoll = seed % 3;

  if (variantRoll === 0) {
    return {
      hpLoss: 4,
      spLoss: 2,
      inflictedConditions: ["injury"],
      encounterSummary:
        "A roadside skirmish forced you to disengage quickly. You escaped, but not without an injury.",
    };
  }

  if (variantRoll === 1) {
    return {
      hpLoss: 3,
      spLoss: 3,
      inflictedConditions: ["poison"],
      encounterSummary:
        "A venomous creature struck from the brush before your party drove it off. The route remained survivable, but the poison lingers.",
    };
  }

  return {
    hpLoss: 6,
    spLoss: 4,
    inflictedConditions: [],
    encounterSummary:
      "A dangerous encounter slowed the caravan and drained your reserves, but the route never collapsed into a lethal disaster.",
  };
}

export function resolveWorldFastTravelReport(
  travel: ActiveWorldFastTravel,
  originPoi: WorldMapPoi | null,
  destinationPoi: WorldMapPoi | null,
  staminaRecovered: number
): WorldFastTravelReport {
  const { rewards, activitySummary } = resolveActivityRewards(travel);
  const {
    hpLoss,
    spLoss,
    inflictedConditions,
    encounterSummary,
  } = resolveTravelEncounter(travel);
  const rewardSummaries = rewards.flatMap((reward) => {
    if (reward.type !== "item") {
      return [];
    }

    return [`${reward.amount}x ${getItemLabel(reward.itemKey)}`];
  });

  return {
    originPoiId: travel.originPoiId,
    destinationPoiId: travel.destinationPoiId,
    originLabel: originPoi?.label ?? "Unknown route",
    destinationLabel: destinationPoi?.label ?? "Unknown destination",
    foodSpent: travel.foodCost,
    staminaRecovered,
    activity: travel.activity,
    activitySummary,
    travelSummary:
      destinationPoi?.linkedMapIds?.length
        ? "The route is complete and your party reached a playable destination."
        : "The route is complete and the frontier path remains ready for future destination actions.",
    rewardSummaries,
    rewards,
    hpLoss,
    spLoss,
    inflictedConditions,
    encounterSummary,
    completedAt: Date.now(),
  };
}
