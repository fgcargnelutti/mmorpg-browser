import { worldMapArt } from "../../../assets/world/maps";

export type WorldRegionId =
  | "dustveil-outpost"
  | "north-forest"
  | "southwest-farm"
  | "deep-sewer";

export type WorldMapRegion = {
  id: WorldRegionId;
  label: string;
  linkedMapIds: string[];
  isPlayable: boolean;
  description: string;
};

export type WorldMapData = {
  name: string;
  background: string;
  description: string;
  regions: WorldMapRegion[];
};

export const worldMapData: WorldMapData = {
  name: "World Map",
  background: worldMapArt,
  description:
    "A macro view of the lands surrounding Belegard, prepared as the base art for the future world map / overworld navigation feature.",
  regions: [
    {
      id: "dustveil-outpost",
      label: "Belegard",
      linkedMapIds: ["belagard"],
      isPlayable: true,
      description:
        "The main settlement and current anchor point of the local prototype.",
    },
    {
      id: "north-forest",
      label: "North Forest",
      linkedMapIds: ["north-forest"],
      isPlayable: true,
      description:
        "A colder wilderness route north of the outpost, already represented as a playable local map.",
    },
    {
      id: "southwest-farm",
      label: "Southwest Farm",
      linkedMapIds: ["southwest-farm"],
      isPlayable: true,
      description:
        "The rural outskirts southwest of the outpost, already represented in the current prototype.",
    },
    {
      id: "deep-sewer",
      label: "Sewer Network",
      linkedMapIds: ["sewer"],
      isPlayable: true,
      description:
        "The underground route beneath Belegard, treated as a connected regional layer for future world navigation.",
    },
  ],
};
