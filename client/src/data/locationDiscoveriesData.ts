import type { LocationKey } from "./locations";
import { experienceSources } from "./experienceSources";

export type LocationDiscoveryData = {
  locationKey: LocationKey;
  xpReward: number;
  xpReason: string;
};

export const locationDiscoveriesData: Partial<
  Record<LocationKey, LocationDiscoveryData>
> = {
  temple: {
    locationKey: "temple",
    xpReward: experienceSources.discovery.majorLocation,
    xpReason: "Discovered Temple",
  },
  merchant: {
    locationKey: "merchant",
    xpReward: 0,
    xpReason: "Discovered Merchant Outpost",
  },
  blacksmith: {
    locationKey: "blacksmith",
    xpReward: experienceSources.discovery.majorLocation,
    xpReason: "Discovered Blacksmith",
  },
  "old-library": {
    locationKey: "old-library",
    xpReward: experienceSources.discovery.majorLocation,
    xpReason: "Discovered Old Library",
  },
  sewer: {
    locationKey: "sewer",
    xpReward: experienceSources.discovery.secretLocation,
    xpReason: "Discovered Sewer",
  },
};