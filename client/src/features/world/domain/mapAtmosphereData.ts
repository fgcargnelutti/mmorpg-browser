import type { MapId } from "./mapsData";

export type MapAtmosphereEffectType =
  | "dust"
  | "mist"
  | "smoke"
  | "glow"
  | "water"
  | "ember";

export type MapAtmosphereEffect = {
  id: string;
  type: MapAtmosphereEffectType;
  top: string;
  left: string;
  width: string;
  height: string;
  opacity?: number;
  delayMs?: number;
  durationMs?: number;
};

export type MapAtmosphereProfile = {
  theme: "town" | "sewer" | "north-forest" | "southwest-farm";
  effects: MapAtmosphereEffect[];
};

export const mapAtmosphereData: Record<MapId, MapAtmosphereProfile> = {
  town: {
    theme: "town",
    effects: [
      {
        id: "town-dust-1",
        type: "dust",
        top: "20%",
        left: "24%",
        width: "22%",
        height: "16%",
        opacity: 0.18,
        durationMs: 18000,
      },
      {
        id: "town-dust-2",
        type: "dust",
        top: "64%",
        left: "76%",
        width: "26%",
        height: "18%",
        opacity: 0.14,
        delayMs: 3000,
        durationMs: 22000,
      },
      {
        id: "town-glow-1",
        type: "glow",
        top: "14%",
        left: "26%",
        width: "20%",
        height: "12%",
        opacity: 0.14,
        durationMs: 4600,
      },
    ],
  },
  sewer: {
    theme: "sewer",
    effects: [
      {
        id: "sewer-mist-1",
        type: "mist",
        top: "18%",
        left: "30%",
        width: "34%",
        height: "24%",
        opacity: 0.18,
        durationMs: 20000,
      },
      {
        id: "sewer-mist-2",
        type: "mist",
        top: "62%",
        left: "68%",
        width: "30%",
        height: "22%",
        opacity: 0.16,
        delayMs: 2600,
        durationMs: 22000,
      },
      {
        id: "sewer-water-1",
        type: "water",
        top: "74%",
        left: "50%",
        width: "44%",
        height: "12%",
        opacity: 0.18,
        durationMs: 5200,
      },
      {
        id: "sewer-glow-1",
        type: "glow",
        top: "44%",
        left: "53%",
        width: "18%",
        height: "10%",
        opacity: 0.1,
        delayMs: 1200,
        durationMs: 3800,
      },
    ],
  },
  "north-forest": {
    theme: "north-forest",
    effects: [
      {
        id: "forest-mist-1",
        type: "mist",
        top: "24%",
        left: "18%",
        width: "28%",
        height: "18%",
        opacity: 0.14,
        durationMs: 24000,
      },
      {
        id: "forest-dust-1",
        type: "dust",
        top: "58%",
        left: "76%",
        width: "24%",
        height: "16%",
        opacity: 0.12,
        delayMs: 2000,
        durationMs: 22000,
      },
      {
        id: "forest-glow-1",
        type: "glow",
        top: "16%",
        left: "46%",
        width: "18%",
        height: "11%",
        opacity: 0.1,
        durationMs: 4200,
      },
    ],
  },
  "southwest-farm": {
    theme: "southwest-farm",
    effects: [
      {
        id: "farm-dust-1",
        type: "dust",
        top: "26%",
        left: "66%",
        width: "30%",
        height: "16%",
        opacity: 0.15,
        durationMs: 20000,
      },
      {
        id: "farm-dust-2",
        type: "dust",
        top: "70%",
        left: "34%",
        width: "34%",
        height: "18%",
        opacity: 0.13,
        delayMs: 2600,
        durationMs: 23000,
      },
      {
        id: "farm-smoke-1",
        type: "smoke",
        top: "22%",
        left: "52%",
        width: "16%",
        height: "14%",
        opacity: 0.15,
        durationMs: 9000,
      },
      {
        id: "farm-ember-1",
        type: "ember",
        top: "50%",
        left: "69%",
        width: "10%",
        height: "10%",
        opacity: 0.14,
        delayMs: 800,
        durationMs: 3600,
      },
    ],
  },
};
