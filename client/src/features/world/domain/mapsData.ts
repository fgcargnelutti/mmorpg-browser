import {
  averonContinentArt,
  belagardContinentArt,
  borgeBridgeContinentArt,
  desertOfPagosContinentArt,
  edorasContinentArt,
  fettisStrongholdContinentArt,
  firstWatchContinentArt,
  foulBogContinentArt,
  hellosContinentArt,
  ironCathedralContinentArt,
  oldBasaltMineContinentArt,
  praeriesContinentArt,
  peregrineShipwreckContinentArt,
  resistanceContinentArt,
  sunkenRestContinentArt,
  thousandIslandsContinentArt,
  vaultwaysContinentArt,
} from "../../../assets/world/continent-maps";
import type { EncounterKey } from "../../../data/encountersData";
import {
  northForestMapArt,
  sewerMapArt,
  southwestFarmMapArt,
} from "../../../assets/world/maps";
import type { ContextAction } from "./locations";
import type { LocationKey, PoiVariant } from "./locations";

export type MapId =
  | "town"
  | "sewer"
  | "north-forest"
  | "southwest-farm"
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

export type MapPoi = {
  id: string;
  label: string;
  type: "travel" | "encounter" | "interaction";
  locationKey?: LocationKey;
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

export type MapGlobalActionEffect = "search-for-hunt";

export type MapGlobalAction = {
  id: string;
  label: string;
  description: string;
  effect: MapGlobalActionEffect;
};

export type MapData = {
  id: MapId;
  name: string;
  tier: "primary" | "secondary";
  background: string;
  description?: string;
  actions?: ContextAction[];
  globalActions?: MapGlobalAction[];
  huntingEncounterPool?: EncounterKey[];
  entryLocationKey?: LocationKey;
  defaultPoiVariant?: PoiVariant;
  pois: MapPoi[];
};

function createContinentDestinationMap(
  id: Exclude<MapId, "town" | "sewer" | "north-forest" | "southwest-farm">,
  name: string,
  background: string,
  description: string
): MapData {
  return {
    id,
    name,
    tier: "primary",
    background,
    description,
    pois: [],
  };
}

const belegardHubPois: MapPoi[] = [
  {
    id: "north-road",
    label: "North Road",
    type: "travel",
    locationKey: "north-road",
    position: { top: "15%", left: "70%" },
    poiVariant: "road",
    subtitle: "Exit route",
    description: "A road leading north. The next map is not ready yet.",
    actions: [
      {
        id: "travel-north",
        label: "Travel North",
        description: "Travel into the North Forest.",
        effect: "travel_map",
        destinationMapId: "north-forest",
        targetMapName: "North Forest",
      },
    ],
  },
  {
    id: "old-library",
    label: "Old Library",
    type: "interaction",
    locationKey: "old-library",
    position: { top: "32%", left: "44%" },
    poiVariant: "building",
    subtitle: "Ruined archive",
    description:
      "Broken shelves, dust, and loose pages. You might find scraps worth keeping.",
    actions: [
      {
        id: "library-rubble",
        label: "Search Rubble",
        description: "Search the rubble for paper or wood.",
        staminaCost: 2,
        rewardItem: "paper",
        amount: 1,
      },
      {
        id: "library-wood",
        label: "Pull Broken Shelves",
        description: "Recover wood from damaged bookshelves.",
        staminaCost: 2,
        rewardItem: "wood",
        amount: 1,
      },
    ],
  },
  {
    id: "blacksmith",
    label: "Blacksmith",
    type: "interaction",
    locationKey: "blacksmith",
    position: { top: "37%", left: "58%" },
    poiVariant: "merchant",
    subtitle: "Collapsed forge",
    description:
      "A ruined forge. You can still trade, buy gear, or salvage debris.",
    actions: [
      {
        id: "buy-weapon",
        label: "Buy Short Sword",
        description: "Buy a basic short sword for testing.",
        staminaCost: 0,
        rewardItem: "short-sword",
        amount: 1,
      },
      {
        id: "buy-shield",
        label: "Buy Scrap Shield",
        description: "Buy a basic shield for testing.",
        staminaCost: 0,
        rewardItem: "shield",
        amount: 1,
      },
      {
        id: "blacksmith-rubble",
        label: "Search Rubble",
        description: "Look for stone or wood among the debris.",
        staminaCost: 2,
        rewardItem: "stone",
        amount: 2,
      },
      {
        id: "blacksmith-sell",
        label: "Sell Resources",
        description: "Sell gathered resources for gold.",
        effect: "sell_resources",
      },
    ],
  },
  {
    id: "merchant",
    label: "Merchant",
    type: "interaction",
    locationKey: "merchant",
    position: { top: "25%", left: "35%" },
    poiVariant: "merchant",
    subtitle: "Trading post",
    description:
      "A sheltered stall still in use. You can sell goods or talk to Jane.",
    actions: [
      {
        id: "merchant-sell",
        label: "Sell Resources",
        description: "Sell gathered resources for gold.",
        effect: "sell_resources",
      },
      {
        id: "merchant-talk",
        label: "Talk to NPC Jane",
        description: "Open a dialog with Jane.",
        effect: "npc_dialog",
        npcName: "Jane",
      },
    ],
  },
  {
    id: "sewer",
    label: "Sewer",
    type: "travel",
    locationKey: "sewer",
    discoverablePoiKey: "sewer-hidden-entrance",
    position: { top: "48%", left: "50%" },
    poiVariant: "transition",
    subtitle: "Map transition",
    description: "A hidden sewer entrance descends into the underground tunnels below the city.",
    actions: [
      {
        id: "travel-sewer",
        label: "Enter Sewer",
        description: "Descend into the sewer network beneath Belegard.",
        effect: "travel_map",
        destinationMapId: "sewer",
        targetMapName: "Sewers",
      },
    ],
  },
  {
    id: "temple",
    label: "Temple",
    type: "interaction",
    locationKey: "temple",
    position: { top: "13%", left: "50%" },
    poiVariant: "temple",
    subtitle: "Abandoned sanctuary",
    description:
      "A quiet ruin where you can recover a little strength or search debris.",
    actions: [
      {
        id: "temple-pray",
        label: "Pray",
        description: "Recover 2 stamina.",
        effect: "rest",
        amount: 2,
      },
      {
        id: "temple-stone",
        label: "Search Debris",
        description: "Look for stone among the temple rubble.",
        staminaCost: 2,
        rewardItem: "stone",
        amount: 2,
      },
      {
        id: "temple-wood",
        label: "Lift Broken Beams",
        description: "Recover wood from fallen supports.",
        staminaCost: 2,
        rewardItem: "wood",
        amount: 1,
      },
    ],
  },
  {
    id: "stairs",
    label: "Abandoned Mill",
    type: "travel",
    locationKey: "stairs",
    position: { top: "51%", left: "70%" },
    poiVariant: "transition",
    subtitle: "Map transition",
    description:
      "An abandoned mill with a lower passage that still leads somewhere we need to build.",
    actions: [
      {
        id: "travel-stairs",
        label: "Search Lower Passage",
        description:
          "This would take you through the abandoned house into another future map.",
        effect: "travel_placeholder",
        targetMapName: "Lower District",
      },
    ],
  },
  {
    id: "southwest-road",
    label: "Southwest Road",
    type: "travel",
    locationKey: "southwest-road",
    position: { top: "74%", left: "34%" },
    poiVariant: "road",
    subtitle: "Map transition",
    description: "A road leading toward old farms and fields beyond the outpost.",
    actions: [
      {
        id: "travel-sw",
        label: "Take Southwest Road",
        description: "Travel toward the decayed rural outskirts.",
        effect: "travel_map",
        destinationMapId: "southwest-farm",
        targetMapName: "Southwest Farm",
      },
    ],
  },
  {
    id: "southeast-road",
    label: "Southeast Road",
    type: "travel",
    locationKey: "southeast-road",
    position: { top: "68%", left: "76%" },
    poiVariant: "road",
    subtitle: "Map transition",
    description: "A road leaving the town. The destination is not ready yet.",
    actions: [
      {
        id: "travel-se",
        label: "Take Southeast Road",
        description: "This would take you to another map.",
        effect: "travel_placeholder",
        targetMapName: "Southeast Fields",
      },
    ],
  },
];

const belagardHubMapBase = {
  name: "Belegard",
  tier: "primary" as const,
  background: belagardContinentArt,
  entryLocationKey: "merchant" as const,
  pois: belegardHubPois,
};

export const mapsData: Record<MapId, MapData> = {
  town: {
    id: "town",
    ...belagardHubMapBase,
  },

  belagard: {
    id: "belagard",
    ...belagardHubMapBase,
  },

  sewer: {
    id: "sewer",
    name: "Sewers",
    tier: "secondary",
    background: sewerMapArt,
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
        destinationMapId: "belagard",
        position: { top: "20%", left: "50%" },
        poiVariant: "transition",
        subtitle: "Exit route",
        description:
          "A rusted ladder leading back to the surface. The air above feels cleaner already.",
        actions: [
          {
            id: "climb-out",
            label: "Return to Belegard",
            description: "Climb back to the surface.",
            effect: "travel_map",
            destinationMapId: "belagard",
            targetMapName: "Belegard",
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
    tier: "secondary",
    background: northForestMapArt,
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
            encounterKey: "north-forest-goblin-ruins-goblin",
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
            effect: "start_fishing",
            staminaCost: 1,
            fishingSpotKey: "north-forest-toxic-bog",
          },
        ],
      },
      {
        id: "south-path",
        label: "Return to Town",
        type: "travel",
        destinationMapId: "belagard",
        position: { top: "90%", left: "50%" },
        poiVariant: "transition",
        subtitle: "Southern trail",
        description:
          "A worn trail descends back toward Belegard and the safer roads below.",
        actions: [
          {
            id: "north-forest-return-town",
            label: "Return to Belegard",
            description: "Follow the southern trail back to Belegard.",
            effect: "travel_map",
            destinationMapId: "belagard",
            targetMapName: "Belegard",
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
    tier: "secondary",
    background: southwestFarmMapArt,
    entryLocationKey: "southwest-road",
    defaultPoiVariant: "building",
    description:
      "Faded farmland stretches beyond the outpost walls, where stubborn life still clings to old fences and muddy paths.",
    globalActions: [
      {
        id: "search-for-hunt",
        label: "Search for Hunt",
        description:
          "Roam the outskirts and keep pressing forward as new prey reveals itself.",
        effect: "search-for-hunt",
      },
    ],
    huntingEncounterPool: ["southwest-farm-goblin-raider"],
    pois: [
      {
        id: "return-road",
        label: "Road to Belegard",
        type: "travel",
        destinationMapId: "belagard",
        position: { top: "10%", left: "70%" },
        poiVariant: "transition",
        subtitle: "Road back to town",
        description:
          "The packed dirt road bends back toward Belegard and its safer streets.",
        actions: [
          {
            id: "southwest-farm-return-road",
            label: "Return to Belegard",
            description: "Head back to Belegard.",
            effect: "travel_map",
            destinationMapId: "belagard",
            targetMapName: "Belegard",
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
          {
            id: "southwest-farm-mining",
            label: "Mining",
            description: "Work the exposed seam for usable ore.",
            effect: "start_mining",
            staminaCost: 1,
            miningSpotKey: "southwest-farm-small-hill",
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
            id: "southwest-farm-goblin-hunt",
            label: "Goblin Hunt",
            description: "Ask Maria about the goblin threat near North Forest and collect payment if the hunt is done.",
            effect: "quest_interaction",
            questKey: "maria-goblin-hunt",
          },
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

  "old-basalt-mine": createContinentDestinationMap(
    "old-basalt-mine",
    "Old Basalt Mine",
    oldBasaltMineContinentArt,
    "An ancient basalt excavation ready to receive its own future local interactions, encounters, and underground routes."
  ),

  "foul-bog": createContinentDestinationMap(
    "foul-bog",
    "Foul Bog",
    foulBogContinentArt,
    "A stagnant marsh frontier where future survival routes, hidden paths, and hazards can unfold."
  ),

  averon: createContinentDestinationMap(
    "averon",
    "Averon",
    averonContinentArt,
    "A western ruin-site prepared to become a playable regional destination."
  ),

  "peregrine-shipwreck": createContinentDestinationMap(
    "peregrine-shipwreck",
    "The Peregrine Shipwreck",
    peregrineShipwreckContinentArt,
    "A wrecked coastal landmark prepared for future exploration, salvage, and quest hooks."
  ),

  edoras: createContinentDestinationMap(
    "edoras",
    "Edoras",
    edorasContinentArt,
    "A southern stronghold between forest and water, ready for later local content."
  ),

  "thousand-islands": createContinentDestinationMap(
    "thousand-islands",
    "Thousand Islands",
    thousandIslandsContinentArt,
    "A vast northern archipelago prepared for future exploration and maritime progression."
  ),

  "first-watch": createContinentDestinationMap(
    "first-watch",
    "First Watch",
    firstWatchContinentArt,
    "An old western lookout that will later serve as a checkpoint across the swamp frontier."
  ),

  hellos: createContinentDestinationMap(
    "hellos",
    "Hellos",
    hellosContinentArt,
    "A distant southern landing prepared for future route expansion and regional content."
  ),

  "borge-bridge": createContinentDestinationMap(
    "borge-bridge",
    "Borge Bridge",
    borgeBridgeContinentArt,
    "The great bridge between the western and eastern landmasses, now usable as a destination map."
  ),

  "iron-cathedral": createContinentDestinationMap(
    "iron-cathedral",
    "Iron Cathedral",
    ironCathedralContinentArt,
    "A stark landmark in the eastern heights reserved for future lore and playable content."
  ),

  "desert-of-pagos": createContinentDestinationMap(
    "desert-of-pagos",
    "Desert of Pagos",
    desertOfPagosContinentArt,
    "The southeastern desert frontier, now represented by its own arrival map."
  ),

  "sunken-rest": createContinentDestinationMap(
    "sunken-rest",
    "Sunken Rest",
    sunkenRestContinentArt,
    "A drowned ruin-zone in the southeast prepared for future exploration and navigation hooks."
  ),

  resistance: createContinentDestinationMap(
    "resistance",
    "Resistance",
    resistanceContinentArt,
    "A hardened desert outpost that can later anchor faction and quest progression."
  ),

  praeries: createContinentDestinationMap(
    "praeries",
    "Praeries",
    praeriesContinentArt,
    "The southern plains and farmland belt, now ready as a continent-level destination map."
  ),

  vaultways: createContinentDestinationMap(
    "vaultways",
    "Vaultways",
    vaultwaysContinentArt,
    "A mountain-carved passage system prepared to become a future travel and underground network."
  ),

  "fettis-stronghold": createContinentDestinationMap(
    "fettis-stronghold",
    "Fetti's Stronghold",
    fettisStrongholdContinentArt,
    "A northeastern mountain fortress ready to stand in as its own arrival destination."
  ),
};
