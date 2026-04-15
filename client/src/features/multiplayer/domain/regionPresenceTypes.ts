import type { MapId } from "../../world";

export type RegionPresenceSource = "mock" | "backend";

export type RegionPresencePlayer = {
  id: string;
  name: string;
  currentMapId: MapId;
  isOnline: boolean;
  detail?: string;
};

export type RegionPresenceSnapshot = {
  currentMapId: MapId;
  players: RegionPresencePlayer[];
  onlineCount: number;
  source: RegionPresenceSource;
};
