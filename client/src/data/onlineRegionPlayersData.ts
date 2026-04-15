import type { MapId } from "../features/world";

export type OnlineRegionPlayer = {
  id: string;
  name: string;
  currentMapId: MapId;
  isOnline: boolean;
  detail?: string;
};

// Local mock presence only for UI prototyping.
// This shape is intentionally close to what a backend presence payload could look like later.
export const onlineRegionPlayersData: OnlineRegionPlayer[] = [
  {
    id: "presence-1",
    name: "Mara",
    currentMapId: "town",
    isOnline: true,
    detail: "Watching the outpost roads",
  },
  {
    id: "presence-2",
    name: "Darius",
    currentMapId: "town",
    isOnline: true,
    detail: "Trading near the square",
  },
  {
    id: "presence-3",
    name: "Selene",
    currentMapId: "sewer",
    isOnline: true,
    detail: "Exploring deeper tunnels",
  },
  {
    id: "presence-4",
    name: "Bram",
    currentMapId: "north-forest",
    isOnline: true,
    detail: "Tracking movement near the ruins",
  },
  {
    id: "presence-5",
    name: "Iris",
    currentMapId: "southwest-farm",
    isOnline: true,
    detail: "Gathering herbs near the fields",
  },
  {
    id: "presence-6",
    name: "Torren",
    currentMapId: "southwest-farm",
    isOnline: true,
    detail: "Resting by the pasture fence",
  },
  {
    id: "presence-7",
    name: "Niko",
    currentMapId: "north-forest",
    isOnline: false,
    detail: "Offline",
  },
];
