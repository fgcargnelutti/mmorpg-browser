import ContextActions from "./ContextActions";
import "./WorldMap.css";

type Player = {
  name: string;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  logs: string[];
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

type WorldMapProps = {
  player: Player;
  currentLocation: LocationKey;
  contextState: "expanded" | "minimized";
  locations: Record<LocationKey, LocationData>;
  onTravel: (location: LocationKey) => void;
  onMinimizeContext: () => void;
  onExpandContext: () => void;
};

export default function WorldMap({
  player,
  currentLocation,
  contextState,
  locations,
  onTravel,
  onMinimizeContext,
  onExpandContext,
}: WorldMapProps) {
  const activeLocation = locations[currentLocation];

  return (
    <div className="world-stage">
      <div className="terrain-overlay" />
      <div className="terrain-noise" />

      <button
        className={`poi poi-village ${
          currentLocation === "broken-hamlet" ? "active-poi" : ""
        }`}
        type="button"
        onClick={() => onTravel("broken-hamlet")}
      >
        Broken Hamlet
      </button>

      <button
        className={`poi poi-river ${
          currentLocation === "dead-river" ? "active-poi" : ""
        }`}
        type="button"
        onClick={() => onTravel("dead-river")}
      >
        Dead River
      </button>

      <button
        className={`poi poi-forest ${
          currentLocation === "blackwood" ? "active-poi" : ""
        }`}
        type="button"
        onClick={() => onTravel("blackwood")}
      >
        Blackwood
      </button>

      <button
        className={`poi poi-ruins ${
          currentLocation === "old-chapel" ? "active-poi" : ""
        }`}
        type="button"
        onClick={() => onTravel("old-chapel")}
      >
        Old Chapel
      </button>

      <div className="player-marker">
        <div className="player-sprite" />
        <span>{player.name}</span>
      </div>

      <ContextActions
        state={contextState}
        locationName={activeLocation.name}
        locationDescription={activeLocation.description}
        actions={activeLocation.actions}
        onMinimize={onMinimizeContext}
        onExpand={onExpandContext}
      />
    </div>
  );
}