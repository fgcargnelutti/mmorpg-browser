import type { MapId } from "./mapsData";

export type WorldMapPoiId =
  | "old-basalt-mine"
  | "belagard"
  | "foul-bog"
  | "averon"
  | "peregrine-shipwreck"
  | "edoras"
  | "thousand-islands"
  | "first-watch"
  | "hellos"
  | "borge-bridge"
  | "iron-cathedral"
  | "desert-of-pagos"
  | "sunken-rest"
  | "resistance"
  | "praeries"
  | "vaultways"
  | "fettis-stronghold";

export type WorldMapPoi = {
  id: WorldMapPoiId;
  label: string;
  position: {
    xPercent: number;
    yPercent: number;
  };
  description: string;
  linkedMapIds?: MapId[];
  supportsFastTravel?: boolean;
};

export const worldMapImageDimensions = {
  width: 1536,
  height: 1024,
} as const;

export const worldMapPoisData: WorldMapPoi[] = [
  {
    id: "old-basalt-mine",
    label: "Old Basalt Mine",
    position: { xPercent: 23.2, yPercent: 75.1 },
    description:
      "An ancient excavation tunneled into the eastern mountains, prepared as a future travel and underground interaction point.",
    linkedMapIds: ["sewer"],
    supportsFastTravel: false,
  },
  {
    id: "belagard",
    label: "Belagard",
    position: { xPercent: 13.8, yPercent: 63 },
    description:
      "A central inland settlement route, currently acting as the closest continent-level anchor for Dustveil's local prototype region.",
    linkedMapIds: ["town"],
    supportsFastTravel: false,
  },
  {
    id: "foul-bog",
    label: "Foul Bog",
    position: { xPercent: 27.8, yPercent: 47.1 },
    description:
      "A marsh-heavy frontier known for stagnant water, hidden trails, and future discovery-based travel hooks.",
    linkedMapIds: ["north-forest"],
    supportsFastTravel: false,
  },
  {
    id: "averon",
    label: "Averon",
    position: { xPercent: 16.4, yPercent: 44.7 },
    description:
      "A western ruin-site and regional anchor on the continent map, prepared for future interaction and travel connections.",
    supportsFastTravel: false,
  },
  {
    id: "peregrine-shipwreck",
    label: "The Peregrine Shipwreck",
    position: { xPercent: 21.8, yPercent: 22.4 },
    description:
      "A wreck on the southwestern coast, suitable for future exploration rewards, quests, or transport routes.",
    supportsFastTravel: false,
  },
  {
    id: "edoras",
    label: "Edoras",
    position: { xPercent: 40.4, yPercent: 35.6 },
    description:
      "A southern stronghold nested between forest and water, reserved for future regional routing and discoveries.",
    supportsFastTravel: false,
  },
  {
    id: "thousand-islands",
    label: "Thousand Islands",
    position: { xPercent: 56.7, yPercent: 21.5 },
    description:
      "A wide northern archipelago that can later support sea travel, exploration chains, and distant world progression.",
    supportsFastTravel: false,
  },
  {
    id: "first-watch",
    label: "First Watch",
    position: { xPercent: 44.2, yPercent: 50.1 },
    description:
      "An old western lookout and future macro-route checkpoint across the swamp frontier.",
    supportsFastTravel: false,
  },
  {
    id: "hellos",
    label: "Hellos",
    position: { xPercent: 38.7, yPercent: 66.3 },
    description:
      "A distant southern landing on the continent map, prepared for later route expansion.",
    supportsFastTravel: false,
  },
  {
    id: "borge-bridge",
    label: "Borge Bridge",
    position: { xPercent: 50.1, yPercent: 40.0 },
    description:
      "The great bridge between the western and eastern landmasses, ideal for future travel validation and route gating.",
    supportsFastTravel: false,
  },
  {
    id: "iron-cathedral",
    label: "Iron Cathedral",
    position: { xPercent: 68.6, yPercent: 39.5 },
    description:
      "A landmark embedded in the eastern heights, prepared as a future lore and travel destination.",
    supportsFastTravel: false,
  },
  {
    id: "desert-of-pagos",
    label: "Desert of Pagos",
    position: { xPercent: 73.9, yPercent: 55.1 },
    description:
      "The great southeastern desert, already useful as a continent-level destination and future travel zone.",
    supportsFastTravel: false,
  },
  {
    id: "sunken-rest",
    label: "Sunken Rest",
    position: { xPercent: 74.5, yPercent: 73.8 },
    description:
      "A drowned inlet or ruin-zone in the southeast, reserved for future exploration and navigation hooks.",
    supportsFastTravel: false,
  },
  {
    id: "resistance",
    label: "Resistance",
    position: { xPercent: 80.3, yPercent: 64.2 },
    description:
      "A hardened southern outpost in the desert frontier, suitable for future faction, quest, or travel use.",
    supportsFastTravel: false,
  },
  {
    id: "praeries",
    label: "Praeries",
    position: { xPercent: 84.5, yPercent: 49.7 },
    description:
      "The open southern plains and farmland belt, currently the closest continent-level match for the Southwest Farm region.",
    linkedMapIds: ["southwest-farm"],
    supportsFastTravel: false,
  },
  {
    id: "vaultways",
    label: "Vaultways",
    position: { xPercent: 92.6, yPercent: 35.1 },
    description:
      "A mountain-carved passage system and likely future underground transition network.",
    supportsFastTravel: false,
  },
  {
    id: "fettis-stronghold",
    label: "Fetti's Stronghold",
    position: { xPercent: 88.7, yPercent: 19.9 },
    description:
      "A northern-eastern mountain fortress that can later serve as a high-level regional destination.",
    supportsFastTravel: false,
  },
];
