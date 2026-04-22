import { experienceSources } from "../../../data/experienceSources";
export const discoverablePoisData = {
    "sewer-hidden-entrance": {
        key: "sewer-hidden-entrance",
        mapId: "belagard",
        locationKey: "sewer",
        requiredRumorKey: "jane-sewer-rumor",
        hoverDurationMs: 3000,
        discoveryMessage: "You discovered a hidden sewer entrance beneath the old iron grate.",
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
        discoveryMessage: "You spotted a narrow path leading up to a steep rock overlook.",
        learningMessage: "You noticed a distant ledge that might hide another route.",
        xpReward: experienceSources.lore.minorLore,
        xpReason: "Learned about the Steep Rock overlook",
        hintText: "A faint trail climbs toward the ridge.",
        discoveryZonePosition: {
            top: "73%",
            left: "67%",
        },
    },
};
