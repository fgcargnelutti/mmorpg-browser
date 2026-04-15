import mapTown from "../../../assets/maps/map-town.png";
import mapNorthForest from "../../../assets/maps/north-forest.png";
import mapSewer from "../../../assets/maps/sewer.png";
import mapSouthwestFarm from "../../../assets/maps/southwest-farm.png";
import type { ContextAction } from "./locations";
import type { LocationKey, PoiVariant } from "./locations";

export type MapId = "town" | "sewer" | "north-forest" | "southwest-farm";

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
  poiVariant?: PoiVariant;
  discoverablePoiKey?: string;
};

export type MapData = {
  id: MapId;
  name: string;
  background: string;
  description?: string;
  actions?: ContextAction[];
  entryLocationKey?: LocationKey;
  defaultPoiVariant?: PoiVariant;
  pois: MapPoi[];
};

export const mapsData: Record<MapId, MapData> = {
  town: {
    id: "town",
    name: "Dustveil Outpost",
    background: mapTown,
    entryLocationKey: "merchant",
    pois: [],
  },

  sewer: {
    id: "sewer",
    name: "Sewers",
    background: mapSewer,
    entryLocationKey: "sewer",
    defaultPoiVariant: "danger",
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
        poiVariant: "transition",
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
        poiVariant: "danger",
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
        poiVariant: "danger",
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

  "north-forest": {
    id: "north-forest",
    name: "North Forest",
    background: mapNorthForest,
    entryLocationKey: "north-road",
    defaultPoiVariant: "building",
    description:
      "Cold wind pushes through the trees, and every trail feels older than the outpost below.",
    pois: [
      {
        id: "outpost",
        label: "Outpost",
        type: "interaction",
        position: { top: "12%", left: "32%" },
        poiVariant: "merchant",
        subtitle: "Weathered lookout",
        description:
          "A battered forward post with a few intact crates and a clear view over the forest.",
        actions: [
          {
            id: "north-forest-supplies",
            label: "Search for Supplies",
            description: "Rummage through the outpost for anything edible.",
            rewardItem: "cookie",
            amount: 1,
            staminaCost: 1,
          },
          {
            id: "north-forest-distant-view",
            label: "Distant View",
            description: "Scan the ridge line for hidden paths.",
            effect: "learn_rumor",
            rumorKey: "north-forest-steep-rock-rumor",
          },
        ],
      },
      {
        id: "goblin-ruins",
        label: "Goblin Ruins",
        type: "interaction",
        position: { top: "38%", left: "65%" },
        poiVariant: "danger",
        subtitle: "Broken camp",
        description:
          "Collapsed barricades and ash pits suggest the goblins only recently abandoned this place.",
        actions: [
          {
            id: "north-forest-goblin-battle",
            label: "Goblin Battle",
            description: "Challenge the goblins hiding in the ruins.",
            effect: "trigger_encounter",
            encounterKey: "north-road-goblin",
          },
          {
            id: "north-forest-retreat",
            label: "Retreat",
            description: "Back away before the goblins surround you.",
            effect: "log_message",
            eventLogMessage:
              "System: You fall back from the Goblin Ruins and regroup.",
          },
        ],
      },
      {
        id: "deep-forest",
        label: "Deep Forest",
        type: "interaction",
        position: { top: "20%", left: "42%" },
        poiVariant: "road",
        subtitle: "Dark trail",
        description:
          "The trees close together ahead. Whatever lies deeper in the forest belongs to a future map.",
        actions: [
          {
            id: "north-forest-travel-deep",
            label: "Travel",
            description: "Push deeper into the forest.",
            effect: "travel_placeholder",
            targetMapName: "Far North Forest",
          },
        ],
      },
      {
        id: "shack",
        label: "Shack",
        type: "interaction",
        position: { top: "43%", left: "50%" },
        poiVariant: "building",
        subtitle: "Leaning shelter",
        description:
          "An old hunting shack offers a dry place to breathe and steady yourself.",
        actions: [
          {
            id: "north-forest-rest",
            label: "Rest",
            description: "Recover 1 stamina.",
            effect: "rest",
            amount: 1,
          },
        ],
      },
      {
        id: "toxic-bog",
        label: "Toxic Bog",
        type: "interaction",
        position: { top: "69%", left: "29%" },
        poiVariant: "danger",
        subtitle: "Foul waters",
        description:
          "The water here is murky and foul, but there are still fish moving beneath the surface.",
        actions: [
          {
            id: "north-forest-fishing",
            label: "Fishing",
            description: "Try your luck in the bog.",
            rewardItem: "fish",
            amount: 1,
            staminaCost: 1,
          },
        ],
      },
      {
        id: "south-path",
        label: "Return to Town",
        type: "travel",
        destinationMapId: "town",
        position: { top: "90%", left: "50%" },
        poiVariant: "transition",
        subtitle: "Southern trail",
        description:
          "A worn trail descends back toward Dustveil Outpost and the safer roads below.",
        actions: [
          {
            id: "north-forest-return-town",
            label: "Return to Town",
            description: "Follow the southern trail back to Dustveil Outpost.",
            effect: "travel_map",
            destinationMapId: "town",
            targetMapName: "Dustveil Outpost",
          },
        ],
      },
      {
        id: "steep-rock",
        label: "Steep Rock",
        type: "interaction",
        position: { top: "73%", left: "67%" },
        poiVariant: "transition",
        discoverablePoiKey: "north-forest-steep-rock",
        subtitle: "Hidden overlook",
        description:
          "A narrow ridge path climbs to a steep rock with a view toward lands we have not built yet.",
        actions: [
          {
            id: "north-forest-steep-rock-travel",
            label: "Travel",
            description: "Follow the ridge beyond the forest.",
            effect: "travel_placeholder",
            targetMapName: "Northern Ridge",
          },
        ],
      },
    ],
  },

  "southwest-farm": {
    id: "southwest-farm",
    name: "Southwest Farm",
    background: mapSouthwestFarm,
    entryLocationKey: "southwest-road",
    defaultPoiVariant: "building",
    description:
      "Faded farmland stretches beyond the outpost walls, where stubborn life still clings to old fences and muddy paths.",
    pois: [
      {
        id: "return-road",
        label: "Return Road",
        type: "travel",
        destinationMapId: "town",
        position: { top: "10%", left: "70%" },
        poiVariant: "transition",
        subtitle: "Road back to town",
        description:
          "The packed dirt road bends back toward Dustveil Outpost and its safer streets.",
        actions: [
          {
            id: "southwest-farm-return-road",
            label: "Return to Town",
            description: "Head back to Dustveil Outpost.",
            effect: "travel_map",
            destinationMapId: "town",
            targetMapName: "Dustveil Outpost",
          },
        ],
      },
      {
        id: "decayed-farm",
        label: "Decayed Farm",
        type: "interaction",
        position: { top: "24%", left: "51%" },
        poiVariant: "building",
        subtitle: "Ruined homestead",
        description:
          "Sagging fences, empty troughs, and a few stubborn sheep mark what remains of the old farmstead.",
        actions: [
          {
            id: "southwest-farm-search-supplies",
            label: "Search Supplies",
            description: "Search the abandoned sheds for food or salvage.",
            rewardItem: "fruit",
            amount: 1,
            staminaCost: 1,
          },
          {
            id: "southwest-farm-talk-shepherd",
            label: "Talk to Shepherd",
            description: "Speak with the shepherd watching over the pasture.",
            effect: "log_message",
            eventLogMessage:
              "System: The shepherd nods politely, but that conversation is still a placeholder.",
          },
        ],
      },
      {
        id: "small-hill",
        label: "Small Hill",
        type: "interaction",
        position: { top: "24%", left: "66%" },
        poiVariant: "road",
        subtitle: "Windy rise",
        description:
          "A grassy hill gives you a better view of the nearby fields and the movement of small animals.",
        actions: [
          {
            id: "southwest-farm-hunt-rabbits",
            label: "Hunt Rabbits",
            description: "Track and hunt small game near the brush.",
            rewardItem: "rabbit-meat",
            amount: 1,
            staminaCost: 1,
          },
          {
            id: "southwest-farm-observe-area",
            label: "Observe Area",
            description: "Take a moment to study the roads and fields around you.",
            effect: "log_message",
            eventLogMessage:
              "System: From the hill, you trace faint paths through the rural outskirts.",
          },
        ],
      },
      {
        id: "west-road",
        label: "West Road",
        type: "interaction",
        position: { top: "14%", left: "31%" },
        poiVariant: "road",
        subtitle: "Western route",
        description:
          "A weathered road continues west toward another abandoned edge of the city.",
        actions: [
          {
            id: "southwest-farm-travel-west",
            label: "Travel West",
            description: "Follow the road toward the western outskirts.",
            effect: "travel_placeholder",
            targetMapName: "West City",
          },
        ],
      },
      {
        id: "maria-shop",
        label: "Maria",
        type: "interaction",
        position: { top: "50%", left: "69%" },
        poiVariant: "merchant",
        subtitle: "Field apothecary",
        description:
          "Maria keeps a small apothecary beneath patched canvas, trading in potions, herbs, and strange rural remedies.",
        actions: [
          {
            id: "southwest-farm-talk-maria",
            label: "Talk to Maria",
            description: "Open a conversation with Maria.",
            effect: "npc_dialog",
            npcName: "Maria",
            npcProfileId: "maria",
          },
          {
            id: "southwest-farm-buy-potions",
            label: "Buy Potions",
            description: "Ask Maria about her potion stock.",
            effect: "log_message",
            eventLogMessage:
              "System: Maria's potion stock is not fully implemented yet.",
          },
          {
            id: "southwest-farm-sell-fruits",
            label: "Sell Fruits",
            description: "Sell fruit and other natural goods to Maria.",
            effect: "sell_resources",
            sellableItemKeys: ["fruit", "herb", "fish", "rabbit-meat"],
            goldPerItem: 3,
          },
        ],
      },
      {
        id: "artesian-well",
        label: "Artesian Well",
        type: "interaction",
        position: { top: "80%", left: "61%" },
        poiVariant: "danger",
        subtitle: "Subterranean shaft",
        description:
          "An old artesian well descends farther than it should, hinting at buried passages under the rural ground.",
        actions: [
          {
            id: "southwest-farm-descend-well",
            label: "Descend",
            description: "Climb down toward a future underground route.",
            effect: "travel_placeholder",
            targetMapName: "Rural Underworks",
          },
        ],
      },
      {
        id: "pasture",
        label: "Pasture",
        type: "interaction",
        position: { top: "59%", left: "41%" },
        poiVariant: "temple",
        subtitle: "Open grazing field",
        description:
          "Sheep graze across the open pasture while the wind carries the smell of wet earth and cut grass.",
        actions: [
          {
            id: "southwest-farm-look-around",
            label: "Look Around",
            description: "Take in the rural surroundings and the state of the field.",
            effect: "log_message",
            eventLogMessage:
              "System: The pasture feels calmer than the city, but not truly safe.",
          },
        ],
      },
    ],
  },
};
