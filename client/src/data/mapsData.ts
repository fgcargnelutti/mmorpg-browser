import mapTown from "../assets/maps/map-town.png";
import mapSewer from "../assets/maps/sewer.png";
import type { ContextAction } from "./locations";

export type MapId = "town" | "sewer";

export type MapPoi = {
  id: string;
  label: string;
  type: "travel" | "encounter" | "interaction";
  position: {
    top: string;
    left: string;
  };
  destinationMapId?: MapId;
  subtitle?: string;
  description?: string;
  actions?: ContextAction[];
};

export type MapData = {
  id: MapId;
  name: string;
  background: string;
  description?: string;
  actions?: ContextAction[];
  pois: MapPoi[];
};

export const mapsData: Record<MapId, MapData> = {
  town: {
    id: "town",
    name: "Dustveil Outpost",
    background: mapTown,
    pois: [],
  },

  sewer: {
    id: "sewer",
    name: "Sewers",
    background: mapSewer,
    description:
      "A damp and suffocating tunnel beneath the town. The smell alone warns you this place is not abandoned.",
    actions: [
      {
        id: "sewer-overview",
        label: "Listen Carefully",
        description: "The tunnels echo with distant movement.",
        staminaCost: 0,
      },
    ],
    pois: [
      {
        id: "exit",
        label: "Climb Out",
        type: "travel",
        destinationMapId: "town",
        position: { top: "20%", left: "50%" },
        subtitle: "Exit route",
        description:
          "A rusted ladder leading back to the surface. The air above feels cleaner already.",
        actions: [
          {
            id: "climb-out",
            label: "Return to Town",
            description: "Climb back to the surface.",
            effect: "travel_placeholder",
            targetMapName: "Dustveil Outpost",
          },
        ],
      },
      {
        id: "central-chamber",
        label: "Central Chamber",
        type: "interaction",
        position: { top: "50%", left: "50%" },
        subtitle: "Main chamber",
        description:
          "The circular stone platform looks like the heart of the sewer network. Water flows around it in all directions.",
        actions: [
          {
            id: "fight-goblins",
            label: "Explore deeper",
            description: "You hear movement in the darkness.",
            effect: "trigger_encounter",
            encounterKey: "north-road-goblin",
          },
          {
            id: "search-scrap-central",
            label: "Search debris",
            description: "Maybe something useful was left behind.",
            rewardItem: "stone",
            amount: 1,
            staminaCost: 1,
          },
          {
            id: "rest-central",
            label: "Catch your breath",
            description: "You pause for a moment.",
            effect: "rest",
            amount: 2,
          },
        ],
      },
      {
        id: "deep-tunnel",
        label: "Deep Tunnel",
        type: "interaction",
        position: { top: "80%", left: "50%" },
        subtitle: "Lower passage",
        description:
          "A darker tunnel stretches deeper below the city. The walls are slick, and the water sounds heavier here.",
        actions: [
          {
            id: "advance-deep-tunnel",
            label: "Advance carefully",
            description: "Step deeper into the dark passage.",
            effect: "trigger_encounter",
            encounterKey: "north-road-goblin",
          },
          {
            id: "search-scrap-deep",
            label: "Inspect the walls",
            description: "Check the cracks and debris for anything useful.",
            rewardItem: "paper",
            amount: 1,
            staminaCost: 1,
          },
          {
            id: "rest-deep-tunnel",
            label: "Steady yourself",
            description: "Take a brief pause before moving on.",
            effect: "rest",
            amount: 1,
          },
        ],
      },
    ],
  },
};