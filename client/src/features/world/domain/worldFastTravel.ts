import type { Reward } from "../../systems/domain/rewardTypes";
import type { WorldMapPoiId } from "./worldMapPoisData";

export type WorldMapTravelCost = {
  foodCost: number;
  durationMinutes: number;
};

export type WorldFastTravelActivityId =
  | "rest"
  | "fish"
  | "cook"
  | "forage";

export type WorldFastTravelActivity = {
  id: WorldFastTravelActivityId;
  label: string;
  description: string;
};

export type ActiveWorldFastTravel = {
  originPoiId: WorldMapPoiId;
  destinationPoiId: WorldMapPoiId;
  foodCost: number;
  durationMinutes: number;
  startedAt: number;
  completesAt: number;
  progressPercent: number;
  recoveredStaminaMinutes: number;
  activity: WorldFastTravelActivity;
};

export type WorldFastTravelReport = {
  originPoiId: WorldMapPoiId;
  destinationPoiId: WorldMapPoiId;
  originLabel: string;
  destinationLabel: string;
  foodSpent: number;
  staminaRecovered: number;
  activity: WorldFastTravelActivity;
  activitySummary: string;
  travelSummary: string;
  rewardSummaries: string[];
  rewards: Reward[];
  hpLoss: number;
  spLoss: number;
  inflictedConditions: string[];
  encounterSummary: string | null;
  completedAt: number;
};

export const worldFastTravelActivityOptions: WorldFastTravelActivity[] = [
  {
    id: "rest",
    label: "Rest",
    description: "Travel quietly and focus on recovery during the route.",
  },
  {
    id: "fish",
    label: "Fishing",
    description: "Prepare the trip for future fishing actions when routes allow it.",
  },
  {
    id: "cook",
    label: "Cooking",
    description: "Reserve the journey for campfire prep and meal routines later on.",
  },
  {
    id: "forage",
    label: "Foraging",
    description: "Stay alert for herbs, scraps, and survival opportunities in the future.",
  },
];
