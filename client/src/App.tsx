import { useEffect, useState } from "react";
import "./App.css";
import "./components/CharacterPanel.css";
import "./components/EquipmentPanel.css";
import "./components/InventoryPanel.css";
import "./components/EventLogPanel.css";
import "./components/ChatPanel.css";
import "./components/TopPanel.css";
import SkillsPanel from "./components/SkillsPanel";
import WorldMap from "./components/WorldMap";
import InventoryPanel from "./components/InventoryPanel";
import CharacterPanel from "./components/CharacterPanel";
import EquipmentPanel from "./components/EquipmentPanel";
import EventLogPanel from "./components/EventLogPanel";
import ChatPanel from "./components/ChatPanel";
import TopPanel from "./components/TopPanel";

type Player = {
  name: string;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  logs: string[];
};

type Condition = {
  key: string;
  icon: string;
  label: string;
  description: string;
  active?: boolean;
};

type EquipmentSlot = {
  key: string;
  label: string;
  icon: string;
  itemName: string;
  tooltip: string[];
  equipped?: boolean;
};

type Specialization = {
  icon: string;
  title: string;
  description: string;
};

type Skill = {
  key: string;
  name: string;
  level: number;
  progress: number;
  tooltip: string;
  tier30: Specialization[];
  tier60: Specialization[];
  tier100: Specialization[];
};

type LocationKey = "broken-hamlet" | "dead-river" | "blackwood" | "old-chapel";

type LocationData = {
  name: string;
  subtitle: string;
  description: string;
  actions: {
    id: string;
    label: string;
    description: string;
  }[];
};

function App() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [eventLogs, setEventLogs] = useState<string[]>([
    "System: The wasteland is silent today.",
    "System: You feel the cold wind across the ruins.",
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "NPC Mara: Keep your hood on. The wind cuts deep near the river.",
    "Player Ronan: Anyone heading to Blackwood?",
  ]);

  const [currentLocation, setCurrentLocation] =
    useState<LocationKey>("broken-hamlet");
  const [contextState, setContextState] =
    useState<"expanded" | "minimized">("expanded");

  const locations: Record<LocationKey, LocationData> = {
    "broken-hamlet": {
      name: "Broken Hamlet",
      subtitle: "Ruined settlement",
      description:
        "Collapsed homes, weak fires, and a few survivors trying to endure another night.",
      actions: [
        {
          id: "search-crates",
          label: "Search Crates",
          description: "Look for food scraps, cloth, and old tools.",
        },
        {
          id: "talk-survivor",
          label: "Talk to Survivor",
          description: "Gather rumors and hints about nearby places.",
        },
        {
          id: "cook",
          label: "Cook",
          description: "Prepare basic food and recover condition.",
        },
        {
          id: "rest-camp",
          label: "Rest at Camp",
          description: "Take a short rest under fragile protection.",
        },
      ],
    },
    "dead-river": {
      name: "Dead River",
      subtitle: "Shallow poisoned waters",
      description:
        "A gray stream with slow water, loose stones, reeds, and hidden movement.",
      actions: [
        {
          id: "fish",
          label: "Fish",
          description: "Try to catch something edible from the dark water.",
        },
        {
          id: "gather-reeds",
          label: "Gather Reeds",
          description: "Collect plant fibers and survival materials.",
        },
        {
          id: "search-shore",
          label: "Search Shore",
          description: "Look for bones, stones, and drifted supplies.",
        },
        {
          id: "rest-river",
          label: "Rest",
          description: "Take a brief pause and observe the waters.",
        },
      ],
    },
    "blackwood": {
      name: "Blackwood",
      subtitle: "Dense dead forest",
      description:
        "Dark trunks, cracked bark, scattered prey, and the sound of movement beyond sight.",
      actions: [
        {
          id: "chop-wood",
          label: "Chop Wood",
          description: "Cut hardened timber for fuel and crafting.",
        },
        {
          id: "hunt",
          label: "Hunt",
          description: "Track beasts moving through the underbrush.",
        },
        {
          id: "gather-herbs",
          label: "Gather Herbs",
          description: "Collect roots, fungus, and forest plants.",
        },
        {
          id: "set-trap",
          label: "Set Trap",
          description: "Prepare a simple snare for later return.",
        },
      ],
    },
    "old-chapel": {
      name: "Old Chapel",
      subtitle: "Desecrated stone ruin",
      description:
        "A crumbling sanctuary of ash, shattered icons, and relics hidden under dust.",
      actions: [
        {
          id: "search-relics",
          label: "Search Relics",
          description: "Look for fragments, symbols, and forgotten valuables.",
        },
        {
          id: "cut-roots",
          label: "Cut Roots",
          description: "Clear overgrowth and harvest useful fibers.",
        },
        {
          id: "inspect-altar",
          label: "Inspect Altar",
          description: "Study the broken altar for hidden meanings.",
        },
        {
          id: "rest-chapel",
          label: "Rest",
          description: "Take a careful pause inside the ruin.",
        },
      ],
    },
  };

  const loadPlayer = async () => {
    try {
      const response = await fetch("http://localhost:3000/player");
      const data = await response.json();
      setPlayer(data);
    } catch {
      setEventLogs((prev) => [...prev, "System: Failed to load player."]);
    }
  };

  useEffect(() => {
    loadPlayer();
  }, []);

  const handleSendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    setChatMessages((prev) => [...prev, `You: ${trimmed}`]);
    setChatInput("");
  };

  const handleTravel = (location: LocationKey) => {
    setCurrentLocation(location);
    setContextState("expanded");
    setEventLogs((prev) => [...prev, `System: Arrived at ${locations[location].name}.`]);
  };

  if (!player) {
    return (
      <main className="game-shell loading-state">
        <div className="loading-box">
          <h1>Howl of Collapse</h1>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  const counts = new Map<string, number>();
  for (const item of player.inventory) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  const groupedInventory = Array.from(counts.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  const hp = 72;
  const maxHp = 100;
  const sp = 44;
  const maxSp = 100;
  const level = 4;
  const characterClass = "Wasteland Wanderer";

  const conditions: Condition[] = [
    {
      key: "cold",
      icon: "❄",
      label: "Cold",
      description:
        "You are exposed to low temperatures. Stamina recovery may be slower.",
      active: true,
    },
    {
      key: "poison",
      icon: "☠",
      label: "Poisoned",
      description: "A toxic effect is damaging your health over time.",
    },
    {
      key: "hunger",
      icon: "🍖",
      label: "Hunger",
      description:
        "You need food soon. Prolonged hunger may weaken your stats.",
      active: true,
    },
    {
      key: "injury",
      icon: "🩹",
      label: "Injury",
      description: "An untreated injury reduces your combat efficiency.",
    },
    {
      key: "burn",
      icon: "🔥",
      label: "Burning",
      description: "You are affected by heat or fire damage.",
    },
  ];

  const equipmentRows: EquipmentSlot[][] = [
    [
      {
        key: "jewel",
        label: "Jewel",
        icon: "💍",
        itemName: "Ash Pendant",
        tooltip: ["SP +5", "Lore +1", "Curse Resist +1"],
        equipped: true,
      },
      {
        key: "head",
        label: "Head",
        icon: "🪖",
        itemName: "Torn Hood",
        tooltip: ["Defense +2", "Cold Resist +1", "Survival +1"],
        equipped: true,
      },
      {
        key: "backpack",
        label: "Backpack",
        icon: "🎒",
        itemName: "Frayed Pack",
        tooltip: ["Capacity +12", "Gathering +1"],
        equipped: true,
      },
    ],
    [
      {
        key: "weapon",
        label: "Weapon",
        icon: "⚔",
        itemName: "Cracked Sword",
        tooltip: ["Attack +7", "Melee +2", "Durability: Low"],
        equipped: true,
      },
      {
        key: "armor",
        label: "Armor",
        icon: "🛡",
        itemName: "Rust Mail",
        tooltip: ["Defense +6", "Weight +2", "Slash Resist +1"],
        equipped: true,
      },
      {
        key: "offhand",
        label: "Offhand",
        icon: "🪵",
        itemName: "Bone Shield",
        tooltip: ["Defense +4", "Block Chance +3%", "Impact Resist +1"],
        equipped: true,
      },
    ],
    [
      {
        key: "boots",
        label: "Boots",
        icon: "🥾",
        itemName: "Leather Wraps",
        tooltip: ["Defense +2", "Move Speed +1", "Stealth +1"],
        equipped: true,
      },
      {
        key: "arrows",
        label: "Arrows",
        icon: "🏹",
        itemName: "Bone Arrows",
        tooltip: ["Ranged Ammo", "Piercing +2", "Lightweight"],
        equipped: true,
      },
    ],
    [
      {
        key: "fishing-rod",
        label: "Fishing Rod",
        icon: "🎣",
        itemName: "River Rod",
        tooltip: ["Fishing +3", "River Catch Chance +2%"],
        equipped: true,
      },
      {
        key: "pickaxe",
        label: "Pickaxe",
        icon: "⛏",
        itemName: "Miner's Pick",
        tooltip: ["Breaking Rocks +2", "Stone Yield +1"],
        equipped: true,
      },
      {
        key: "axe",
        label: "Axe",
        icon: "🪓",
        itemName: "Split Axe",
        tooltip: ["Woodcutting +2", "Attack +2 vs beasts"],
        equipped: true,
      },
      {
        key: "grapple",
        label: "Arpéu",
        icon: "🪝",
        itemName: "Iron Grapple",
        tooltip: ["Allows access to vertical areas", "Traversal Tool"],
        equipped: true,
      },
    ],
  ];

  const skills: Skill[] = [
    {
      key: "survival",
      name: "Survival",
      level: 63,
      progress: 24,
      tooltip: "Hunting, fishing, breaking rocks, woodcutting, cooking.",
      tier30: [
        { icon: "🍖", title: "Field Butcher", description: "Placeholder specialization." },
        { icon: "🔥", title: "Camp Cook", description: "Placeholder specialization." },
        { icon: "🪓", title: "Forager", description: "Placeholder specialization." },
      ],
      tier60: [
        { icon: "🪨", title: "Stonehand", description: "Placeholder specialization." },
        { icon: "🌲", title: "Pathfinder", description: "Placeholder specialization." },
        { icon: "🐾", title: "Tracker", description: "Placeholder specialization." },
      ],
      tier100: [
        { icon: "👑", title: "Wasteland Elder", description: "Placeholder specialization." },
        { icon: "🜂", title: "Ash Survivor", description: "Placeholder specialization." },
      ],
    },
    {
      key: "melee",
      name: "Melee",
      level: 41,
      progress: 58,
      tooltip:
        "Close combat efficiency with swords, axes, maces and other melee weapons.",
      tier30: [
        { icon: "⚔", title: "Duelist", description: "Placeholder specialization." },
        { icon: "🪓", title: "Executioner", description: "Placeholder specialization." },
        { icon: "🛡", title: "Defender", description: "Placeholder specialization." },
      ],
      tier60: [
        { icon: "💢", title: "Crusher", description: "Placeholder specialization." },
        { icon: "🩸", title: "Bleeder", description: "Placeholder specialization." },
        { icon: "⛓", title: "Breaker", description: "Placeholder specialization." },
      ],
      tier100: [
        { icon: "👑", title: "Warlord", description: "Placeholder specialization." },
        { icon: "☠", title: "Reaper", description: "Placeholder specialization." },
      ],
    },
    {
      key: "archery",
      name: "Archery",
      level: 18,
      progress: 37,
      tooltip:
        "Accuracy and performance with bows, arrows and long-range shots.",
      tier30: [
        { icon: "🏹", title: "Hunter", description: "Placeholder specialization." },
        { icon: "🎯", title: "Sharpshooter", description: "Placeholder specialization." },
        { icon: "🪶", title: "Skirmisher", description: "Placeholder specialization." },
      ],
      tier60: [
        { icon: "🦅", title: "Falcon Eye", description: "Placeholder specialization." },
        { icon: "🩸", title: "Piercer", description: "Placeholder specialization." },
        { icon: "🌫", title: "Ghost Shot", description: "Placeholder specialization." },
      ],
      tier100: [
        { icon: "👑", title: "Deadeye", description: "Placeholder specialization." },
        { icon: "☄", title: "Storm Archer", description: "Placeholder specialization." },
      ],
    },
    {
      key: "stealth",
      name: "Stealth",
      level: 67,
      progress: 11,
      tooltip:
        "Sneaking, lockpicking, ambushes, escape and hidden movement.",
      tier30: [
        { icon: "🗝", title: "Lockpicking", description: "Open locks and sealed containers." },
        { icon: "🗡", title: "+1 Damage", description: "Deal +1 damage while exploiting weak spots." },
        { icon: "🏃", title: "+5% Escape", description: "Higher success chance when fleeing battles." },
      ],
      tier60: [
        { icon: "🗡", title: "+2 Damage", description: "Your stealth attacks deal +2 damage." },
        { icon: "🪂", title: "Fall Resistance", description: "Reduced damage when falling or dropping from heights." },
        { icon: "🔒", title: "Hard Locks", description: "Can open difficult locks and advanced mechanisms." },
      ],
      tier100: [
        { icon: "💀", title: "+5 Damage", description: "Deadly execution bonus: +5 damage." },
        { icon: "☣", title: "Poison Resist", description: "Gain 50% resistance to poison effects." },
      ],
    },
    {
      key: "arcane",
      name: "Arcane",
      level: 9,
      progress: 13,
      tooltip:
        "Ancient knowledge, magical manipulation, curses, rituals and arcane relics.",
      tier30: [
        { icon: "✨", title: "Invoker", description: "Placeholder specialization." },
        { icon: "📜", title: "Rune Reader", description: "Placeholder specialization." },
        { icon: "🕯", title: "Occultist", description: "Placeholder specialization." },
      ],
      tier60: [
        { icon: "🜄", title: "Hexbinder", description: "Placeholder specialization." },
        { icon: "🔮", title: "Seer", description: "Placeholder specialization." },
        { icon: "⛧", title: "Curser", description: "Placeholder specialization." },
      ],
      tier100: [
        { icon: "👑", title: "Archmage", description: "Placeholder specialization." },
        { icon: "🌑", title: "Voidcaller", description: "Placeholder specialization." },
      ],
    },
  ];

  const stats = [
    { label: "HP", value: hp, max: maxHp, className: "bar-hp" },
    { label: "SP", value: sp, max: maxSp, className: "bar-sp" },
    {
      label: "Stamina",
      value: player.stamina,
      max: player.maxStamina,
      className: "bar-stamina",
    },
  ];

  const activeLocation = locations[currentLocation];

  return (
    <main className="game-shell">
      <section className="game-grid">
        <section className="world-panel">
          <TopPanel
            title="Howl of Collapse"
            locationName={activeLocation.name}
            locationSubtitle={activeLocation.subtitle}
          />

          <WorldMap
            player={player}
            currentLocation={currentLocation}
            contextState={contextState}
            locations={locations}
            onTravel={handleTravel}
            onMinimizeContext={() => setContextState("minimized")}
            onExpandContext={() => setContextState("expanded")}
          />

          <section className="bottom-left-panel">
            <EventLogPanel logs={eventLogs} />

            <ChatPanel
              messages={chatMessages}
              inputValue={chatInput}
              onInputChange={setChatInput}
              onSend={handleSendChat}
            />
          </section>
        </section>

        <aside className="right-sidebar">
          <CharacterPanel
            level={level}
            name={player.name}
            characterClass={characterClass}
            stats={stats}
            conditions={conditions}
          />

          <EquipmentPanel equipmentRows={equipmentRows} />

          <InventoryPanel items={groupedInventory} />

          <SkillsPanel skills={skills} />
        </aside>
      </section>
    </main>
  );
}

export default App;