import { useEffect, useRef, useState } from "react";
import "./WorldMap.css";
import ContextActions from "./ContextActions";
import NpcDialog from "./NpcDialog";
import CombatDialog from "./CombatDialog";
import mapImage from "../assets/map-town.png";
import type {
  LocationData,
  LocationKey,
  ContextAction,
} from "../data/locations";
import type {
  DiscoverablePoiData,
  DiscoverablePoiKey,
} from "../data/discoverablePoisData";
import type { DialogueOption } from "./NpcDialog";

type Player = {
  name: string;
  stamina: number;
  maxStamina: number;
  inventory: string[];
  logs: string[];
  learnedRumors: string[];
  revealedPois: string[];
  discoveredPois: string[];
};

type WorldMapProps = {
  player: Player;
  currentLocation: LocationKey;
  contextState: "hidden" | "expanded" | "minimized";
  locations: Record<LocationKey, LocationData>;
  onTravel: (location: LocationKey) => void;
  onMinimizeContext: () => void;
  onExpandContext: () => void;
  onAction: (action: ContextAction) => void;

  npcDialogOpen: boolean;
  npcName: string;
  npcRole: string;
  npcDialogueLines: string[];
  npcDialogueOptions: DialogueOption[];
  npcLoreNotes: string[];
  onCloseNpcDialog: () => void;
  onNpcOptionSelect: (optionId: string) => void;
  onNpcBuy: () => void;
  onNpcSell: () => void;

  npcNarrativeHint?: string;
  showNpcNarrativeStatus?: boolean;
  npcNarrativeStatusText?: string;

  combatDialogOpen: boolean;
  combatEnemyName: string;
  combatEnemyTitle: string;
  combatEnemyHp: number;
  combatEnemyMaxHp: number;
  combatLog: string[];
  combatResolved: boolean;
  onCombatAttack: () => void;
  onCombatRetreat: () => void;
  onCloseCombatDialog: () => void;

  discoverablePois: Record<DiscoverablePoiKey, DiscoverablePoiData>;
  revealedPois: string[];
  discoveredPois: string[];
  onDiscoverPoi: (poiKey: string) => void;
};

export default function WorldMap({
  player,
  currentLocation,
  contextState,
  locations,
  onTravel,
  onMinimizeContext,
  onExpandContext,
  onAction,
  npcDialogOpen,
  npcName,
  npcRole,
  npcDialogueLines,
  npcDialogueOptions,
  npcLoreNotes,
  onCloseNpcDialog,
  onNpcOptionSelect,
  onNpcBuy,
  onNpcSell,
  npcNarrativeHint,
  showNpcNarrativeStatus,
  npcNarrativeStatusText,
  combatDialogOpen,
  combatEnemyName,
  combatEnemyTitle,
  combatEnemyHp,
  combatEnemyMaxHp,
  combatLog,
  combatResolved,
  onCombatAttack,
  onCombatRetreat,
  onCloseCombatDialog,
  discoverablePois,
  revealedPois,
  discoveredPois,
  onDiscoverPoi,
}: WorldMapProps) {
  const activeLocation = locations[currentLocation];
  const locationEntries = Object.entries(locations) as [
    LocationKey,
    LocationData,
  ][];

  const [hoveredDiscoverablePoi, setHoveredDiscoverablePoi] = useState<string | null>(
    null
  );
  const [hoverProgressPercent, setHoverProgressPercent] = useState(0);

  const hoverStartTimeRef = useRef<number | null>(null);
  const hoverAnimationFrameRef = useRef<number | null>(null);

  const sewerDiscoverablePoi = discoverablePois["sewer-hidden-entrance"];

  const isSewerRevealEnabled = revealedPois.includes(sewerDiscoverablePoi.key);
  const isSewerAlreadyDiscovered = discoveredPois.includes(
    sewerDiscoverablePoi.key
  );

  const shouldRenderLocationPoi = (locationKey: LocationKey) => {
    if (locationKey !== "sewer") {
      return true;
    }

    return isSewerAlreadyDiscovered;
  };

  const clearHoverTracking = () => {
    hoverStartTimeRef.current = null;

    if (hoverAnimationFrameRef.current !== null) {
      cancelAnimationFrame(hoverAnimationFrameRef.current);
      hoverAnimationFrameRef.current = null;
    }

    setHoveredDiscoverablePoi(null);
    setHoverProgressPercent(0);
  };

  useEffect(() => {
    return () => {
      if (hoverAnimationFrameRef.current !== null) {
        cancelAnimationFrame(hoverAnimationFrameRef.current);
      }
    };
  }, []);

  const startPoiDiscoveryHover = (poiKey: DiscoverablePoiKey) => {
    if (discoveredPois.includes(poiKey)) return;

    const poiData = discoverablePois[poiKey];

    setHoveredDiscoverablePoi(poiKey);
    setHoverProgressPercent(0);
    hoverStartTimeRef.current = performance.now();

    const tick = (timestamp: number) => {
      if (!hoverStartTimeRef.current) return;

      const elapsed = timestamp - hoverStartTimeRef.current;
      const nextProgress = Math.min(
        100,
        (elapsed / poiData.hoverDurationMs) * 100
      );

      setHoverProgressPercent(nextProgress);

      if (elapsed >= poiData.hoverDurationMs) {
        onDiscoverPoi(poiKey);
        clearHoverTracking();
        return;
      }

      hoverAnimationFrameRef.current = requestAnimationFrame(tick);
    };

    hoverAnimationFrameRef.current = requestAnimationFrame(tick);
  };

  const stopPoiDiscoveryHover = () => {
    clearHoverTracking();
  };

  return (
    <div className="world-stage world-map-shell">
      <div className="world-map" style={{ backgroundImage: `url(${mapImage})` }}>
        {locationEntries
          .filter(([locationKey]) => shouldRenderLocationPoi(locationKey))
          .map(([locationKey, location]) => {
            const isActive = currentLocation === locationKey;

            return (
              <button
                key={locationKey}
                className={`poi poi-${location.poiVariant} ${
                  isActive ? "is-active" : ""
                }`}
                type="button"
                style={{
                  top: location.mapPosition.top,
                  left: location.mapPosition.left,
                }}
                onClick={() => onTravel(locationKey)}
              >
                <span className="poi-dot" aria-hidden="true" />
                <span className="poi-label-group">
                  <span className="poi-name">{location.name}</span>
                  <span className="poi-subtitle">{location.subtitle}</span>
                </span>
              </button>
            );
          })}

        {!isSewerAlreadyDiscovered && isSewerRevealEnabled ? (
          <div
            className={`poi-discovery-zone ${
              hoveredDiscoverablePoi === sewerDiscoverablePoi.key
                ? "is-hovering"
                : ""
            }`}
            style={{
              top: `calc(${locations.sewer.mapPosition.top} - 18px)`,
              left: locations.sewer.mapPosition.left,
            }}
            onMouseEnter={() => startPoiDiscoveryHover(sewerDiscoverablePoi.key)}
            onMouseLeave={stopPoiDiscoveryHover}
          >
            <div className="poi-discovery-zone__inner">
              <div className="poi-discovery-zone__hint">
                {sewerDiscoverablePoi.hintText}
              </div>

              <div className="poi-discovery-zone__progress">
                <div
                  className="poi-discovery-zone__progress-fill"
                  style={{ width: `${hoverProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}

        <ContextActions
          state={contextState}
          locationName={activeLocation.name}
          locationDescription={activeLocation.description}
          actions={activeLocation.actions}
          onMinimize={onMinimizeContext}
          onExpand={onExpandContext}
          onAction={onAction}
        />

        <NpcDialog
          isOpen={npcDialogOpen}
          npcName={npcName}
          npcRole={npcRole}
          dialogueLines={npcDialogueLines}
          dialogueOptions={npcDialogueOptions}
          loreNotes={npcLoreNotes}
          onClose={onCloseNpcDialog}
          onOptionSelect={onNpcOptionSelect}
          onBuy={onNpcBuy}
          onSell={onNpcSell}
          narrativeHint={npcNarrativeHint}
          showNarrativeStatus={showNpcNarrativeStatus}
          narrativeStatusText={npcNarrativeStatusText}
        />

        <CombatDialog
          isOpen={combatDialogOpen}
          enemyName={combatEnemyName}
          enemyTitle={combatEnemyTitle}
          enemyHp={combatEnemyHp}
          enemyMaxHp={combatEnemyMaxHp}
          combatLog={combatLog}
          isResolved={combatResolved}
          onAttack={onCombatAttack}
          onRetreat={onCombatRetreat}
          onClose={onCloseCombatDialog}
        />
      </div>
    </div>
  );
}