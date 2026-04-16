import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import "./WorldMap.css";
import ContextActions from "../../../../components/ContextActions";
import NpcDialog from "../../../../components/NpcDialog";
import CombatDialog from "../../../../components/CombatDialog";
import { mapAtmosphereData } from "../../domain/mapAtmosphereData";
import type {
  LocationData,
  LocationKey,
  ContextAction,
} from "../../domain/locations";
import type {
  DiscoverablePoiData,
  DiscoverablePoiKey,
} from "../../domain/discoverablePoisData";
import type { MapData, MapId, MapPoi } from "../../domain/mapsData";
import type { DialogueOption } from "../../../../components/NpcDialog";
import type { NpcShopOffer } from "../../domain/npcProfilesData";

type WorldMapProps = {
  currentLocation: LocationKey;
  contextState: "hidden" | "expanded" | "minimized";
  locations: Record<LocationKey, LocationData>;
  mapData: MapData;
  onTravel: (location: LocationKey) => void;
  onMapTravel: (destinationMapId?: MapId) => void;
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
  onNpcBuyItem: (offer: NpcShopOffer) => void;
  onNpcSell: () => void;
  npcBuyOffers?: NpcShopOffer[];

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
  overlayContent?: ReactNode;
};

export default function WorldMap({
  currentLocation,
  contextState,
  locations,
  mapData,
  onTravel,
  onMapTravel,
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
  onNpcBuyItem,
  onNpcSell,
  npcBuyOffers,
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
  overlayContent,
}: WorldMapProps) {
  const activeLocation = locations[currentLocation];
  const locationEntries = Object.entries(locations) as [
    LocationKey,
    LocationData,
  ][];

  const [hoveredDiscoverablePoi, setHoveredDiscoverablePoi] = useState<
    string | null
  >(null);
  const [hoverProgressPercent, setHoverProgressPercent] = useState(0);
  const [selectedMapPoiId, setSelectedMapPoiId] = useState<string | null>(null);

  const hoverStartTimeRef = useRef<number | null>(null);
  const hoverAnimationFrameRef = useRef<number | null>(null);
  const atmosphereProfile = mapAtmosphereData[mapData.id];

  const interactiveMapPois = useMemo(
    () =>
      mapData.pois
        .filter(
          (poi) =>
            !poi.discoverablePoiKey || discoveredPois.includes(poi.discoverablePoiKey)
        )
        .filter((poi) => poi.type !== "travel"),
    [discoveredPois, mapData.pois]
  );

  const visibleMapPois = useMemo(
    () =>
      mapData.pois.filter(
        (poi) =>
          !poi.discoverablePoiKey || discoveredPois.includes(poi.discoverablePoiKey)
      ),
    [discoveredPois, mapData.pois]
  );

  const activeDiscoverablePois = useMemo(
    () =>
      (Object.values(discoverablePois) as DiscoverablePoiData[]).filter(
        (poi) =>
          poi.mapId === mapData.id &&
          revealedPois.includes(poi.key) &&
          !discoveredPois.includes(poi.key)
      ),
    [discoverablePois, discoveredPois, mapData.id, revealedPois]
  );

  const selectedMapPoi: MapPoi | null = useMemo(() => {
    const selected = selectedMapPoiId
      ? visibleMapPois.find((poi) => poi.id === selectedMapPoiId) ?? null
      : null;

    if (selected) return selected;

    return interactiveMapPois[0] ?? null;
  }, [interactiveMapPois, selectedMapPoiId, visibleMapPois]);

  const shouldRenderLocationPoi = (locationKey: LocationKey) => {
    if (mapData.id !== "town") {
      return false;
    }

    const requiredDiscovery = (
      Object.values(discoverablePois) as DiscoverablePoiData[]
    ).find((poi) => poi.locationKey === locationKey && poi.mapId === "town");

    if (!requiredDiscovery) {
      return true;
    }

    return discoveredPois.includes(requiredDiscovery.key);
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

    if (hoverAnimationFrameRef.current !== null) {
      cancelAnimationFrame(hoverAnimationFrameRef.current);
      hoverAnimationFrameRef.current = null;
    }

    setHoveredDiscoverablePoi(poiKey);
    setHoverProgressPercent(0);
    hoverStartTimeRef.current = null;

    const tick = (timestamp: number) => {
      if (hoverStartTimeRef.current === null) {
        hoverStartTimeRef.current = timestamp;
      }

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

  const handleMapPoiClick = (poi: MapPoi) => {
    if (poi.type === "travel") {
      onMapTravel(poi.destinationMapId);
      return;
    }

    setSelectedMapPoiId(poi.id);
    onExpandContext();
  };

  const contextLocationName =
    mapData.id === "town"
      ? activeLocation.name
      : selectedMapPoi?.label ?? mapData.name;

  const contextLocationDescription =
    mapData.id === "town"
      ? activeLocation.description
      : selectedMapPoi?.description ?? mapData.description ?? "";

  const contextActions =
    mapData.id === "town"
      ? activeLocation.actions
      : selectedMapPoi?.actions ?? mapData.actions ?? [];
  const hasForegroundDialog =
    npcDialogOpen || combatDialogOpen || Boolean(overlayContent);

  return (
    <div className="world-stage world-map-shell">
      <div className={`world-map-frame world-map-frame--${mapData.id}`}>
        <img
          src={mapData.background}
          alt={mapData.name}
          className="world-map-image"
          draggable={false}
        />

        <div className="world-map-overlay">
          {hasForegroundDialog ? (
            <div className="world-map-backdrop" aria-hidden="true" />
          ) : null}

          <div
            className={`world-map-atmosphere world-map-atmosphere--${atmosphereProfile.theme}`}
            aria-hidden="true"
          >
            <div className="world-map-atmosphere__veil world-map-atmosphere__veil--a" />
            <div className="world-map-atmosphere__veil world-map-atmosphere__veil--b" />
            <div className="world-map-atmosphere__grain" />
            <div className="world-map-atmosphere__vignette" />
            {atmosphereProfile.effects.map((effect) => (
              <div
                key={effect.id}
                className={`world-map-effect world-map-effect--${effect.type}`}
                style={{
                  top: effect.top,
                  left: effect.left,
                  width: effect.width,
                  height: effect.height,
                  opacity: effect.opacity,
                  animationDelay: effect.delayMs
                    ? `${effect.delayMs}ms`
                    : undefined,
                  animationDuration: effect.durationMs
                    ? `${effect.durationMs}ms`
                    : undefined,
                }}
              />
            ))}
          </div>

          {mapData.id === "town" &&
            locationEntries
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

          {mapData.id !== "town" &&
            visibleMapPois.map((poi) => {
              const isSelected = selectedMapPoi?.id === poi.id;
              const poiVariant = poi.poiVariant ?? mapData.defaultPoiVariant ?? "danger";
              const isTravelPoi = poi.type === "travel";

              return (
                <button
                  key={poi.id}
                  className={`poi poi-${poiVariant} ${isSelected ? "is-active" : ""} ${
                    isTravelPoi ? "poi--travel" : "poi--interactive"
                  }`}
                  type="button"
                  style={{
                    top: poi.position.top,
                    left: poi.position.left,
                  }}
                  onClick={() => handleMapPoiClick(poi)}
                >
                  <span className="poi-dot" aria-hidden="true" />
                  <span className="poi-label-group">
                    <span className="poi-name">{poi.label}</span>
                    <span className="poi-subtitle">
                      {poi.subtitle ??
                        (poi.type === "travel"
                          ? "Map transition"
                          : "Point of interest")}
                    </span>
                  </span>
                </button>
                );
              })}

          {activeDiscoverablePois.map((discoverablePoi) => (
            <div
              key={discoverablePoi.key}
              className={`poi-discovery-zone ${
                hoveredDiscoverablePoi === discoverablePoi.key
                  ? "is-hovering"
                  : ""
              }`}
              style={{
                top: discoverablePoi.discoveryZonePosition.top,
                left: discoverablePoi.discoveryZonePosition.left,
              }}
              onMouseEnter={() => startPoiDiscoveryHover(discoverablePoi.key)}
              onMouseLeave={stopPoiDiscoveryHover}
            >
              <div className="poi-discovery-zone__inner">
                <div className="poi-discovery-zone__hint">
                  {discoverablePoi.hintText}
                </div>

                <div className="poi-discovery-zone__progress">
                  <div
                    className="poi-discovery-zone__progress-fill"
                    style={{ width: `${hoverProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          <ContextActions
            state={contextState}
            locationName={contextLocationName}
            locationDescription={contextLocationDescription}
            actions={contextActions}
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
            onBuyItem={onNpcBuyItem}
            onSell={onNpcSell}
            buyOffers={npcBuyOffers}
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

          {overlayContent}
        </div>
      </div>
    </div>
  );
}
