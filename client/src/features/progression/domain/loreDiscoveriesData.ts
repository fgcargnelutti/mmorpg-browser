import type { LocationKey } from "../../world/domain/locations";

export type LoreDiscoveryKey = "old-library-ancient-book";

export type LoreDiscoveryData = {
  key: LoreDiscoveryKey;
  locationKey: LocationKey;
  actionMatch: string;
  xpReward: number;
  xpReason: string;
  discoveryMessage: string;
};

export const loreDiscoveriesData: Record<LoreDiscoveryKey, LoreDiscoveryData> = {
  "old-library-ancient-book": {
    key: "old-library-ancient-book",
    locationKey: "old-library",
    actionMatch: "search",
    xpReward: 25,
    xpReason: "Discovered ancient lore in the Old Library",
    discoveryMessage:
      "You uncovered an ancient book buried beneath the library debris.",
  },
};
