import type { EncounterKey } from "../../../data/encountersData";
import type { FishingSpotKey } from "../../fishing";
import type { MiningSpotKey } from "../../mining";
import type { MapId } from "./mapsData";
import type { NpcProfileKey } from "./npcProfilesData";

export type LocationKey =
  | "north-road"
  | "old-library"
  | "blacksmith"
  | "merchant"
  | "sewer"
  | "temple"
  | "stairs"
  | "southwest-road"
  | "southeast-road";

export type PoiVariant =
  | "road"
  | "building"
  | "merchant"
  | "temple"
  | "danger"
  | "transition";

export type ContextAction = {
  id: string;
  label: string;
  description: string;
  rewardItem?: string;
  amount?: number;
  staminaCost?: number;
  effect?:
    | "rest"
    | "sell_resources"
    | "start_fishing"
    | "start_mining"
    | "open_hideout"
    | "quest_interaction"
    | "npc_dialog"
    | "learn_rumor"
    | "log_message"
    | "travel_map"
    | "travel_placeholder"
    | "trigger_encounter";
  targetMapName?: string;
  destinationMapId?: MapId;
  npcName?: string;
  npcProfileId?: NpcProfileKey;
  questKey?: string;
  encounterKey?: EncounterKey;
  rumorKey?: string;
  eventLogMessage?: string;
  sellableItemKeys?: string[];
  goldPerItem?: number;
  fishingSpotKey?: FishingSpotKey;
  miningSpotKey?: MiningSpotKey;
};
