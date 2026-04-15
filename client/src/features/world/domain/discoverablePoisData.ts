import { experienceSources } from "../../../data/experienceSources";
import type { MapId } from "./mapsData";
import type { LocationKey } from "./locations";

export type DiscoverablePoiKey =
  | "sewer-hidden-entrance"
  | "north-forest-steep-rock";

export type DiscoverablePoiData = {
  key: DiscoverablePoiKey;
  mapId: MapId;
  locationKey?: LocationKey;
  revealedMapPoiId?: string;
  requiredRumorKey: string;
  hoverDurationMs: number;
  discoveryMessage: string;
  learningMessage: string;
  xpReward?: number;
  xpReason?: string;
  hintText: string;
  discoveryZonePosition: {
    top: string;
    left: string;
  };
};

export const discoverablePoisData: Record<
  DiscoverablePoiKey,
  DiscoverablePoiData
> = {
  "sewer-hidden-entrance": {
    key: "sewer-hidden-entrance",
    mapId: "town",
    locationKey: "sewer",
    requiredRumorKey: "jane-sewer-rumor",
    hoverDurationMs: 3000,
    discoveryMessage:
      "You discovered a hidden sewer entrance beneath the old iron grate.",
    learningMessage: "You learned something.",
    xpReward: experienceSources.lore.minorLore,
    xpReason: "Learned about the hidden sewer entrance",
    hintText: "A faint draft rises from below.",
    discoveryZonePosition: {
      top: "calc(53% - 18px)",
      left: "50%",
    },
  },
  "north-forest-steep-rock": {
    key: "north-forest-steep-rock",
    mapId: "north-forest",
    revealedMapPoiId: "steep-rock",
    requiredRumorKey: "north-forest-steep-rock-rumor",
    hoverDurationMs: 2500,
    discoveryMessage:
      "You spotted a narrow path leading up to a steep rock overlook.",
    learningMessage:
      "You noticed a distant ledge that might hide another route.",
    xpReward: experienceSources.lore.minorLore,
    xpReason: "Learned about the Steep Rock overlook",
    hintText: "A faint trail climbs toward the ridge.",
    discoveryZonePosition: {
      top: "73%",
      left: "67%",
    },
  },
};
