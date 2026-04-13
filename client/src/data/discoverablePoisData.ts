import type { LocationKey } from "./locations";

export type DiscoverablePoiKey = "sewer-hidden-entrance";

export type DiscoverablePoiData = {
  key: DiscoverablePoiKey;
  locationKey: LocationKey;
  requiredRumorKey: string;
  hoverDurationMs: number;
  discoveryMessage: string;
  learningMessage: string;
  hintText: string;
};

export const discoverablePoisData: Record<
  DiscoverablePoiKey,
  DiscoverablePoiData
> = {
  "sewer-hidden-entrance": {
    key: "sewer-hidden-entrance",
    locationKey: "sewer",
    requiredRumorKey: "jane-sewer-rumor",
    hoverDurationMs: 3000,
    discoveryMessage:
      "You discovered a hidden sewer entrance beneath the old iron grate.",
    learningMessage: "You learned something.",
    hintText: "A faint draft rises from below.",
  },
};